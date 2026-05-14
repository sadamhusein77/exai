// Domain Layer - Use Cases
// Business logic for products and AI generation

import type { Product, PromotionContent, Language, Tone } from '../entities';
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

  async execute(productId: string, language: Language, tone: Tone): Promise<PromotionContent> {
    const product = await this.productRepository.getById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const apiKey = localStorage.getItem('openrouter_api_key') || localStorage.getItem('openai_api_key');

    if (!apiKey) {
      throw new Error('API key not configured. Please add your API key in Settings.');
    }

    const prompt = this.buildPrompt(product, language, tone);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Export Promotion Generator',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a senior export marketing strategist specialized in global B2B conversion optimization. Always follow AIDA structure strictly.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1500,
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

  private buildPrompt(product: Product, language: Language, tone: Tone): string {
    const languageLabels: Record<Language, string> = {
      english: 'English',
      indonesian: 'Indonesian',
      spanish: 'Spanish',
      arabic: 'Arabic',
      japanese: 'Japanese',
      french: 'French',
    };

    const toneLabels: Record<Tone, string> = {
      professional: 'Professional business tone - formal, credible, export-oriented',
      luxury: 'Luxury export tone - premium, exclusive, sophisticated',
      marketplace: 'Marketplace casual tone - friendly, conversational, accessible',
      technical: 'Technical B2B tone - detailed specs, data-driven, engineering focused',
    };

    const productData = JSON.stringify(product, null, 2);

    return `Generate high-conversion export marketing content following AIDA structure.

You must use ALL provided structured data - do not ignore any field.

Product Data:
${productData}

Language: ${languageLabels[language]}

Tone: ${toneLabels[tone]}

Output format MUST be exactly:
1. TITLE (max 60 characters, compelling headline)
2. ATTENTION (strong hook to grab buyer attention, 1-2 sentences)
3. INTEREST (explain product value proposition, 2-3 sentences)
4. DESIRE (bullet points highlighting business value, emotional appeal, export advantages, trust signals - 4-6 items)
5. ACTION (strong call-to-action, 1-2 sentences)

Do NOT include any other text or explanations. Only output the formatted AIDA content.`;
  }

  private parseAIResponse(content: string): PromotionContent {
    const lines = content.trim().split('\n').map(l => l.trim()).filter(Boolean);

    let title = '';
    let attention = '';
    let interest = '';
    const desire: string[] = [];
    let action = '';

    let currentSection = '';

    for (const line of lines) {
      const lowerLine = line.toLowerCase();

      if (lowerLine.startsWith('1.') || lowerLine.startsWith('title') || (lowerLine.match(/^1[\.\)]?\s*/) && title === '')) {
        currentSection = 'title';
        title = line.replace(/^1[\.\)]?\s*/i, '').replace(/^title:\s*/i, '').replace(/^title\s*/i, '').trim();
      } else if (lowerLine.startsWith('2.') || lowerLine.startsWith('attention') || (lowerLine.match(/^2[\.\)]?\s*/) && attention === '')) {
        currentSection = 'attention';
        attention = line.replace(/^2[\.\)]?\s*/i, '').replace(/^attention:\s*/i, '').trim();
      } else if (lowerLine.startsWith('3.') || lowerLine.startsWith('interest') || (lowerLine.match(/^3[\.\)]?\s*/) && interest === '')) {
        currentSection = 'interest';
        interest = line.replace(/^3[\.\)]?\s*/i, '').replace(/^interest:\s*/i, '').trim();
      } else if (lowerLine.startsWith('4.') || lowerLine.startsWith('desire') || lowerLine.match(/^4[\.\)]?\s*/)) {
        currentSection = 'desire';
        const bullet = line.replace(/^4[\.\)]?\s*/i, '').replace(/^desire:\s*/i, '').replace(/^[-•*]\s*/, '').trim();
        if (bullet) desire.push(bullet);
      } else if (lowerLine.startsWith('5.') || lowerLine.startsWith('action') || (lowerLine.match(/^5[\.\)]?\s*/) && action === '')) {
        currentSection = 'action';
        action = line.replace(/^5[\.\)]?\s*/i, '').replace(/^action:\s*/i, '').trim();
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        const bullet = line.replace(/^[-•*]\s*/, '').trim();
        if (bullet && currentSection === 'desire') {
          desire.push(bullet);
        }
      } else if (currentSection === 'title' && title) {
        title += ' ' + line;
      } else if (currentSection === 'attention' && attention) {
        attention += ' ' + line;
      } else if (currentSection === 'interest' && interest) {
        interest += ' ' + line;
      } else if (currentSection === 'action' && action) {
        action += ' ' + line;
      }
    }

    // Fallback parsing - treat entire content as attention if nothing parsed
    if (!title && !attention && lines.length > 0) {
      attention = lines.join(' ');
    }

    return {
      title: title || 'Export Promotion',
      attention: attention || 'Discover exceptional products from trusted exporters worldwide.',
      interest: interest || 'Our products meet international quality standards and are backed by years of export experience.',
      desire: desire.length > 0 ? desire : [
        'Premium quality products meeting international standards',
        'Competitive pricing for bulk orders',
        'Reliable supply chain and logistics support',
        'Experienced exporter with proven track record',
      ],
      action: action || 'Contact us today to start your order. We look forward to serving you.',
    };
  }
}