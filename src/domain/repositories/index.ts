// Domain Layer - Repository Interface
// Contract for product data access

import type { Product } from '../entities';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  delete(id: string): Promise<boolean>;
}