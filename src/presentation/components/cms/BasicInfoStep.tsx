// Basic Product Info Step
// Step 1 of CMS wizard

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface BasicInfoStepProps {
  data: {
    product_name: string;
    category: string;
    description: string;
    origin_country: string;
    material: string[];
    features: string[];
    image_url?: string;
  };
  onUpdate: (data: Partial<BasicInfoStepProps['data']>) => void;
  onNext: () => void;
}

export function BasicInfoStep({ data, onUpdate, onNext }: BasicInfoStepProps) {
  const [materialInput, setMaterialInput] = useState(data.material.join(', '));
  const [featuresInput, setFeaturesInput] = useState(data.features.join(', '));

  useEffect(() => {
    setMaterialInput(data.material.join(', '));
    setFeaturesInput(data.features.join(', '));
  }, [data]);

  const handleMaterialBlur = () => {
    const materials = materialInput.split(',').map(m => m.trim()).filter(Boolean);
    onUpdate({ material: materials });
  };

  const handleFeaturesBlur = () => {
    const features = featuresInput.split(',').map(f => f.trim()).filter(Boolean);
    onUpdate({ features: features });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleMaterialBlur();
    handleFeaturesBlur();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product_name">Product Name *</Label>
        <Input
          id="product_name"
          value={data.product_name}
          onChange={(e) => onUpdate({ product_name: e.target.value })}
          placeholder="e.g. Handcrafted Bamboo Basket"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={data.category}
          onChange={(e) => onUpdate({ category: e.target.value })}
          placeholder="e.g. Home Decor, Kitchenware, Fashion"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe your product in detail..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="origin_country">Origin Country *</Label>
        <Input
          id="origin_country"
          value={data.origin_country}
          onChange={(e) => onUpdate({ origin_country: e.target.value })}
          placeholder="e.g. Indonesia"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL (optional)</Label>
        <Input
          id="image"
          type="url"
          value={data.image_url || ''}
          onChange={(e) => onUpdate({ image_url: e.target.value })}
          placeholder="https://example.com/product-image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="material">Material (comma separated)</Label>
        <Input
          id="material"
          value={materialInput}
          onChange={(e) => setMaterialInput(e.target.value)}
          onBlur={handleMaterialBlur}
          placeholder="e.g. Bamboo, Rattan, Wood"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma separated)</Label>
        <Input
          id="features"
          value={featuresInput}
          onChange={(e) => setFeaturesInput(e.target.value)}
          onBlur={handleFeaturesBlur}
          placeholder="e.g. Eco-friendly, Handmade, Durable"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Next: Marketing Info
        </Button>
      </div>
    </form>
  );
}