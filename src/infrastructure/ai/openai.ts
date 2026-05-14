// Infrastructure Layer - OpenAI Service
// Content generation via OpenAI API

import type { Product, PromotionContent, Language } from '../../domain/entities';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-3.5-turbo';

export async function generatePromotion(
  product: Product,
  language: Language,
  apiKey: string
): Promise<PromotionContent> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional export marketing copywriter. Always respond with structured content in the exact format requested.',
        },
        {
          role: 'user',
          content: buildPrompt(product, language),
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
  const content = data.choices[0]?.message?.content || '';

  return parseResponse(content);
}

const LANGUAGE_LABELS: Record<Language, string> = {
  english: 'English',
  indonesian: 'Indonesian',
  spanish: 'Spanish',
  arabic: 'Arabic',
  japanese: 'Japanese',
  french: 'French',
};

function buildPrompt(product: Product, language: Language): string {
  return `Generate a persuasive product promotion in ${LANGUAGE_LABELS[language]} language.

Product Information:
- Name: ${product.name}
- Description: ${product.description}
- Origin: ${product.origin}
- Material: ${product.material}
- Features: ${product.features.join(', ')}

Requirements:
- Language: ${LANGUAGE_LABELS[language]}
- Tone: professional, persuasive, export-oriented
- Output format MUST be exactly:
1. Title (max 60 characters)
2. Short Description (2-3 sentences)
3. Bullet Points (3-5 items, each on a new line starting with "- ")
4. Call to Action (one sentence)

Do NOT include any other text or explanations. Only output the formatted promotion content.`;
}

function parseResponse(content: string): PromotionContent {
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