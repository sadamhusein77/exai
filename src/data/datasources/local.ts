// Data Layer - Product Storage (localStorage)
// Handles persistence of products using browser localStorage

import type { Product } from '../../domain/entities';

const STORAGE_KEY = 'products';

export function getProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getProductById(id: string): Product | null {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
}

export function saveProduct(product: Product): Product {
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);

  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }

  saveProducts(products);
  return product;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);

  if (filtered.length === products.length) {
    return false; // No deletion occurred
  }

  saveProducts(filtered);
  return true;
}

export function clearAllProducts(): void {
  localStorage.removeItem(STORAGE_KEY);
}