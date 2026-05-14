// Domain Layer - Use Cases
// Business logic for products and AI generation

import type { Product, PromotionContent, Language } from '../entities';
import type { IProductRepository } from '../repositories';

// Product Use Cases
export class GetAllProductsUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<Product[]> {
    return this.productRepository.getAll();
  }
}

export class GetProductByIdUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.getById(id);
  }
}

export class SaveProductUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }
}

export class DeleteProductUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}

// AI Generation Use Cases
export class GeneratePromotionUseCase {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: string, language: Language): Promise<PromotionContent> {
    const product = await this.productRepository.getById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // Support both OpenRouter and OpenAI compatible API keys
    const apiKey = localStorage.getItem('openrouter_api_key') || localStorage.getItem('openai_api_key');

    if (!apiKey) {
      throw new Error('API key not configured. Please add your API key in Settings.');
    }

    const prompt = this.buildPrompt(product, language);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Export Promotion Generator',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct', // Free model on OpenRouter
        messages: [
          {
            role: 'system',
            content: 'You are a professional export marketing copywriter. Always respond with structured content in the exact format requested.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return this.parseAIResponse(content);
  }

  private buildPrompt(product: Product, language: Language): string {
    const languageLabels: Record<Language, string> = {
      english: 'English',
      indonesian: 'Indonesian',
      spanish: 'Spanish',
      arabic: 'Arabic',
      japanese: 'Japanese',
      french: 'French',
    };

    return `Generate a persuasive product promotion in ${languageLabels[language]} language.

Product Information:
- Name: ${product.name}
- Description: ${product.description}
- Origin: ${product.origin}
- Material: ${product.material}
- Features: ${product.features.join(', ')}

Requirements:
- Language: ${languageLabels[language]}
- Tone: professional, persuasive, export-oriented
- Output format MUST be exactly:
1. Title (max 60 characters)
2. Short Description (2-3 sentences)
3. Bullet Points (3-5 items, each on a new line starting with "- ")
4. Call to Action (one sentence)

Do NOT include any other text or explanations. Only output the formatted promotion content.`;
  }

  private parseAIResponse(content: string): PromotionContent {
    const lines = content.trim().split('\n').map(l => l.trim()).filter(Boolean);

    let title = '';
    let description = '';
    const bulletPoints: string[] = [];
    let callToAction = '';

    let currentSection = '';

    for (const line of lines) {
      if (line.match(/^1[\.\)]\s*/) || line.match(/^title/i)) {
        currentSection = 'title';
        title = line.replace(/^1[\.\)]\s*/, '').replace(/^title:\s*/i, '').trim();
      } else if (line.match(/^2[\.\)]\s*/) || line.match(/^description/i)) {
        currentSection = 'description';
        description = line.replace(/^2[\.\)]\s*/, '').replace(/^description:\s*/i, '').trim();
      } else if (line.match(/^3[\.\)]\s*/) || line.match(/^bullet/i)) {
        currentSection = 'bullets';
        const bullet = line.replace(/^3[\.\)]\s*/, '').replace(/^bullet\s*points?:\s*/i, '').trim();
        if (bullet) bulletPoints.push(bullet);
      } else if (line.match(/^4[\.\)]\s*/) || line.match(/^call to action/i)) {
        currentSection = 'cta';
        callToAction = line.replace(/^4[\.\)]\s*/, '').replace(/^call to action:\s*/i, '').trim();
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        const bullet = line.replace(/^[-•]\s*/, '').trim();
        if (bullet) bulletPoints.push(bullet);
      } else if (currentSection === 'title' && title) {
        title += ' ' + line;
      } else if (currentSection === 'description' && description) {
        description += ' ' + line;
      } else if (currentSection === 'bullets') {
        bulletPoints.push(line);
      } else if (currentSection === 'cta' && callToAction) {
        callToAction += ' ' + line;
      }
    }

    // Fallback parsing - treat entire content as description if nothing parsed
    if (!title && !description && lines.length > 0) {
      description = lines.join(' ');
    }

    return {
      title: title || 'Promotion Generated',
      description: description || 'Your promotion content will appear here.',
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : ['Premium quality', 'Export-ready', 'Competitive pricing'],
      callToAction: callToAction || 'Contact us to learn more about this product.',
    };
  }
}