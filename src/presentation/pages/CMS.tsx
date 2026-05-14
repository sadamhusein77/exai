// CMS Page
// Multi-step wizard for creating export products

import { useState } from 'react';
import { Package, Trash2, Edit2, Plus, Check } from 'lucide-react';
import type { Product } from '../../domain/entities';
import { createEmptyProduct } from '../../domain/entities';
import { useProducts } from '../hooks';
import { BasicInfoStep } from '../components/cms/BasicInfoStep';
import { MarketingStep } from '../components/cms/MarketingStep';
import { ExporterStep } from '../components/cms/ExporterStep';
import { ContextStep } from '../components/cms/ContextStep';
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Product details' },
  { id: 2, title: 'Marketing', description: 'USP & targeting' },
  { id: 3, title: 'Exporter', description: 'Company profile' },
  { id: 4, title: 'Context', description: 'Sales context' },
];

export function CMSPage() {
  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardData, setWizardData] = useState(createEmptyProduct());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const openWizard = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setWizardData(product);
    } else {
      setEditingProduct(null);
      setWizardData(createEmptyProduct());
    }
    setCurrentStep(1);
    setIsWizardOpen(true);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
    setCurrentStep(1);
    setEditingProduct(null);
    setWizardData(createEmptyProduct());
  };

  const handleCreateProduct = async () => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct({ ...editingProduct, ...wizardData });
      } else {
        await createProduct(wizardData);
      }
      closeWizard();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWizardSubmitting = isSubmitting;

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    await deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
  };

  const updateWizardData = (updates: { basic?: Partial<typeof wizardData.basic>; marketing?: Partial<typeof wizardData.marketing>; exporter?: Partial<typeof wizardData.exporter>; context?: Partial<typeof wizardData.context> }) => {
    setWizardData(prev => {
      if ('basic' in updates && updates.basic) {
        return { ...prev, basic: { ...prev.basic, ...updates.basic } };
      }
      if ('marketing' in updates && updates.marketing) {
        return { ...prev, marketing: { ...prev.marketing, ...updates.marketing } };
      }
      if ('exporter' in updates && updates.exporter) {
        return { ...prev, exporter: { ...prev.exporter, ...updates.exporter } };
      }
      if ('context' in updates && updates.context) {
        return { ...prev, context: { ...prev.context, ...updates.context } };
      }
      return prev;
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-[calc(100vh-72px)] py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Product Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Create structured product data for AI-powered marketing
            </p>
          </div>
          <Button onClick={() => openWizard()}>
            <Plus size={18} className="mr-2" />
            Add Product
          </Button>
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
              Create your first product to start generating promotions
            </p>
            <Button onClick={() => openWizard()}>
              <Plus size={18} className="mr-2" />
              Add Product
            </Button>
          </div>
        )}

        {/* Product Table */}
        {!isLoading && products.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Category / Origin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    USP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Target Market
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.basic.image_url ? (
                            <img
                              src={product.basic.image_url}
                              alt={product.basic.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">
                            {product.basic.product_name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                            {product.basic.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {product.basic.category}<br />
                      <span className="text-slate-400">{product.basic.origin_country}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      <span className="line-clamp-2">{product.marketing.usp || '-'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 capitalize">
                      {product.marketing.target_market || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openWizard(product)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingProduct(product)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wizard Dialog */}
      <Dialog open={isWizardOpen} onOpenChange={(open) => !open && closeWizard()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6 px-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {currentStep > step.id ? <Check size={16} /> : step.id}
                  </div>
                  <span className="text-xs mt-1 text-slate-500 dark:text-slate-400 hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {currentStep === 1 && (
              <BasicInfoStep
                data={wizardData.basic}
                onUpdate={(data) => updateWizardData({ basic: data })}
                onNext={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <MarketingStep
                data={wizardData.marketing}
                onUpdate={(data) => updateWizardData({ marketing: data })}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <ExporterStep
                data={wizardData.exporter}
                onUpdate={(data) => updateWizardData({ exporter: data })}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <ContextStep
                data={wizardData.context}
                onUpdate={(data) => updateWizardData({ context: data })}
                onSubmit={handleCreateProduct}
                onBack={() => setCurrentStep(3)}
                isSubmitting={isWizardSubmitting}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          {deletingProduct && (
            <div className="py-4">
              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to delete <strong>{deletingProduct.basic.product_name}</strong>?
                This action cannot be undone.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}