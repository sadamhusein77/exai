// Data Layer - Product Repository Implementation
// Concrete implementation of product repository using localStorage

import type { IProductRepository } from '../../domain/repositories';
import type { Product } from '../../domain/entities';
import { getProducts, saveProduct, deleteProduct, getProductById } from '../datasources/local';

// Simulate async operations for consistency with other repositories
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    await delay(50);
    return getProducts();
  }

  async getById(id: string): Promise<Product | null> {
    await delay(50);
    return getProductById(id);
  }

  async save(product: Product): Promise<Product> {
    await delay(50);
    return saveProduct(product);
  }

  async delete(id: string): Promise<boolean> {
    await delay(50);
    return deleteProduct(id);
  }
}