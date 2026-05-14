// Generator Modal Component
// Modal for selecting language and generating AI content

import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import type { Product, Language, PromotionContent } from '../../../domain/entities';
import { SUPPORTED_LANGUAGES } from '../../../domain/entities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PromotionOutput } from './PromotionOutput';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onGenerate: (productId: string, language: Language) => Promise<PromotionContent>;
  isGenerating: boolean;
  error: Error | null;
  result: PromotionContent | null;
  hasApiKey: boolean;
  onSettingsClick: () => void;
}

export function GeneratorModal({
  isOpen,
  onClose,
  product,
  onGenerate,
  isGenerating,
  error,
  result,
  hasApiKey,
  onSettingsClick,
}: GeneratorModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');

  const handleGenerate = async () => {
    if (!hasApiKey) return;
    await onGenerate(product.id, selectedLanguage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Promotion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-medium text-slate-800 dark:text-white">{product.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {product.origin} • {product.material}
            </p>
          </div>

          {/* Language Selector */}
          {!result && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Select Language
              </label>
              <Select
                value={selectedLanguage}
                onValueChange={(val) => setSelectedLanguage(val as Language)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Generation Failed
                  </p>
                  <p className="text-sm text-red-500 dark:text-red-300 mt-1">
                    {error.message}
                  </p>
                  {error.message.includes('API key') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-blue-600"
                      onClick={onSettingsClick}
                    >
                      Add API Key
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Sparkles size={20} className="animate-pulse" />
                <span>Generating promotion content...</span>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Generated successfully!
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGenerate(product.id, selectedLanguage)}
                >
                  Regenerate
                </Button>
              </div>
              <PromotionOutput content={result} />
            </div>
          )}
        </div>

        {!result && (
          <DialogFooter className="flex justify-between items-center">
            {!hasApiKey ? (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle size={16} />
                <span className="text-sm">API key required</span>
              </div>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleGenerate}
                disabled={!hasApiKey}
              >
                <Sparkles size={16} className="mr-2" />
                Generate
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}