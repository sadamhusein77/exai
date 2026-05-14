// Products Page
// Displays all products with Generate Promotion functionality

import { useState } from 'react';
import { Package } from 'lucide-react';
import type { Product } from '../../domain/entities';
import { useProducts, useAIGeneration, useSettings } from '../hooks';
import { ProductCard } from '../components/product/ProductCard';
import { GeneratorModal } from '../components/generator/GeneratorModal';

export function ProductsPage() {
  const { products, isLoading } = useProducts();
  const { generate, isGenerating, result, error, clearResult } = useAIGeneration();
  const { hasApiKey } = useSettings();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const handleGenerateClick = (product: Product) => {
    setSelectedProduct(product);
    clearResult();
    setIsGeneratorOpen(true);
  };

  const handleGeneratorClose = () => {
    setIsGeneratorOpen(false);
    setSelectedProduct(null);
    clearResult();
  };

  return (
    <div className="min-h-[calc(100vh-72px)] py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Products
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Select a product to generate AIDA marketing content
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-slate-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
              </svg>
              <span>Loading products...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Package size={32} className="text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No products yet
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Go to CMS page to create your first product
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onGenerateClick={handleGenerateClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Generator Modal */}
      {selectedProduct && (
        <GeneratorModal
          isOpen={isGeneratorOpen}
          onClose={handleGeneratorClose}
          product={selectedProduct}
          onGenerate={generate}
          isGenerating={isGenerating}
          error={error}
          result={result}
          hasApiKey={hasApiKey}
          onSettingsClick={() => {}}
        />
      )}
    </div>
  );
}