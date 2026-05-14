// Product Card Component
// Displays a product with image, name, description and generate button

import { Package, Sparkles } from 'lucide-react';
import type { Product } from '../../../domain/entities';
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product;
  onGenerateClick: (product: Product) => void;
}

export function ProductCard({ product, onGenerateClick }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
        {product.basic.image_url ? (
          <img
            src={product.basic.image_url}
            alt={product.basic.product_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"%3E%3Cpath d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/%3E%3C/svg%3E';
            }}
          />
        ) : (
          <Package size={48} className="text-slate-400" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-1">
              {product.basic.product_name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {product.basic.origin_country} • {product.basic.category}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
          {product.basic.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.basic.features.slice(0, 3).map((feature: string, index: number) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
            >
              {feature}
            </span>
          ))}
          {product.basic.features.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">
              +{product.basic.features.length - 3}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onGenerateClick(product)}
        >
          <Sparkles size={16} className="mr-2" />
          Generate Promotion
        </Button>
      </div>
    </div>
  );
}