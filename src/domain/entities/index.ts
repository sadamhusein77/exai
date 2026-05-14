// Domain Layer - Product Entity
// Core business object for export products

export interface Product {
  id: string;
  name: string;
  description: string;
  origin: string;
  material: string;
  features: string[];
  image?: string;
  createdAt: string;
}

export interface PromotionContent {
  title: string;
  description: string;
  bulletPoints: string[];
  callToAction: string;
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