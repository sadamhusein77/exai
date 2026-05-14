// Presentation Layer - Custom Hooks
// Connect presentation to domain layer use cases

import { useState, useEffect, useCallback } from 'react';
import type { Product, PromotionContent, Language } from '../../domain/entities';
import { GetAllProductsUseCase, GetProductByIdUseCase, SaveProductUseCase, DeleteProductUseCase, GeneratePromotionUseCase } from '../../domain/usecases';
import { ProductRepository } from '../../data/repositories';
import { v4 as uuidv4 } from 'uuid';

// Initialize repository
const productRepo = new ProductRepository();

// Initialize use cases
const getAllProductsUseCase = new GetAllProductsUseCase(productRepo);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepo);
const saveProductUseCase = new SaveProductUseCase(productRepo);
const deleteProductUseCase = new DeleteProductUseCase(productRepo);
const generatePromotionUseCase = new GeneratePromotionUseCase(productRepo);

// Products Hook
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllProductsUseCase.execute();
      setProducts(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...productData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const saved = await saveProductUseCase.execute(product);
    setProducts(prev => [...prev, saved]);
    return saved;
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    const updated = await saveProductUseCase.execute(product);
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const success = await deleteProductUseCase.execute(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    return success;
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts, createProduct, updateProduct, deleteProduct };
}

// Single Product Hook
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const data = await getProductByIdUseCase.execute(id);
        setProduct(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { product, isLoading, error };
}

// AI Generation Hook
export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PromotionContent | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(async (productId: string, language: Language) => {
    try {
      setIsGenerating(true);
      setError(null);
      const content = await generatePromotionUseCase.execute(productId, language);
      setResult(content);
      return content;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { generate, isGenerating, result, error, clearResult };
}

// Settings Hook (API Key management)
export function useSettings() {
  const [apiKey, setApiKeyState] = useState<string>('');

  useEffect(() => {
    // Load from .env first, then check localStorage for user override
    const envKey = import.meta.env.VITE_OPENROUTER_API_KEY as string || '';
    const storedKey = localStorage.getItem('openrouter_api_key') || localStorage.getItem('openai_api_key') || '';
    // localStorage takes precedence if user has set a custom key
    setApiKeyState(storedKey || envKey);
  }, []);

  const setApiKey = useCallback((key: string) => {
    localStorage.setItem('openrouter_api_key', key);
    setApiKeyState(key);
  }, []);

  const hasApiKey = apiKey.length > 0;

  return { apiKey, setApiKey, hasApiKey };
}