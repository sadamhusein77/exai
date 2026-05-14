// Domain Layer - Product Entity
// Core business object for export products - Enhanced structured data

export interface ProductBasic {
  product_name: string;
  category: string;
  description: string;
  origin_country: string;
  material: string[];
  features: string[];
}

export interface ProductMarketing {
  usp: string;
  problem_solved: string;
  target_market: string;
  price_range: string;
  competition_advantage: string;
}

export interface ProductExporter {
  exporter_name: string;
  company_name: string;
  country: string;
  experience_years: string;
  production_capacity: string;
  certifications: string[];
}

export interface ProductContext {
  intended_platform: string;
  buyer_type: string;
  goal: string;
}

export interface Product {
  id: string;
  basic: ProductBasic;
  marketing: ProductMarketing;
  exporter: ProductExporter;
  context: ProductContext;
  image?: string;
  createdAt: string;
}

// AIDA Format Promotion Content
export interface PromotionContent {
  title: string;
  attention: string;
  interest: string;
  desire: string[];
  action: string;
}

export type Language = 'english' | 'indonesian' | 'spanish' | 'arabic' | 'japanese' | 'french';

export const SUPPORTED_LANGUAGES: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'indonesian', label: 'Indonesian' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'french', label: 'French' },
];

export type Tone = 'professional' | 'luxury' | 'marketplace' | 'technical';

export const SUPPORTED_TONES: { value: Tone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'luxury', label: 'Luxury Export' },
  { value: 'marketplace', label: 'Marketplace Casual' },
  { value: 'technical', label: 'Technical B2B' },
];

// Helper to create empty product
export function createEmptyProduct(): Omit<Product, 'id' | 'createdAt'> {
  return {
    basic: {
      product_name: '',
      category: '',
      description: '',
      origin_country: '',
      material: [],
      features: [],
    },
    marketing: {
      usp: '',
      problem_solved: '',
      target_market: '',
      price_range: '',
      competition_advantage: '',
    },
    exporter: {
      exporter_name: '',
      company_name: '',
      country: '',
      experience_years: '',
      production_capacity: '',
      certifications: [],
    },
    context: {
      intended_platform: '',
      buyer_type: '',
      goal: '',
    },
  };
}