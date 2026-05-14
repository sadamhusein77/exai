// Sales Context Step
// Step 4 of CMS wizard

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ContextStepProps {
  data: {
    intended_platform: string;
    buyer_type: string;
    goal: string;
  };
  onUpdate: (data: Partial<ContextStepProps['data']>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function ContextStep({ data, onUpdate, onSubmit, onBack, isSubmitting }: ContextStepProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="intended_platform">Intended Platform *</Label>
        <Select
          value={data.intended_platform}
          onValueChange={(val) => onUpdate({ intended_platform: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Where will this content be used?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alibaba">Alibaba / B2B Marketplace</SelectItem>
            <SelectItem value="website">Company Website</SelectItem>
            <SelectItem value="email">Email Marketing</SelectItem>
            <SelectItem value="marketplace">Amazon / Etsy / Shopee</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="brochure">Brochure / Catalog</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="buyer_type">Target Buyer Type *</Label>
        <Select
          value={data.buyer_type}
          onValueChange={(val) => onUpdate({ buyer_type: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Who are you selling to?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="importer">Importer</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
            <SelectItem value="retailer">Retailer</SelectItem>
            <SelectItem value="wholesaler">Wholesaler</SelectItem>
            <SelectItem value="dropshipper">Dropshipper</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal">Primary Goal *</Label>
        <Select
          value={data.goal}
          onValueChange={(val) => onUpdate({ goal: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="What do you want to achieve?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wholesale_inquiry">Wholesale Inquiry</SelectItem>
            <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
            <SelectItem value="direct_sales">Direct Sales</SelectItem>
            <SelectItem value="partnership">Business Partnership</SelectItem>
            <SelectItem value="export_expansion">Export Market Expansion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}