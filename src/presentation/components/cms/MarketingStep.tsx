// Marketing Intelligence Step
// Step 2 of CMS wizard

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MarketingStepProps {
  data: {
    usp: string;
    problem_solved: string;
    target_market: string;
    price_range: string;
    competition_advantage: string;
  };
  onUpdate: (data: Partial<MarketingStepProps['data']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function MarketingStep({ data, onUpdate, onNext, onBack }: MarketingStepProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="usp">Unique Selling Proposition (USP) *</Label>
        <Textarea
          id="usp"
          value={data.usp}
          onChange={(e) => onUpdate({ usp: e.target.value })}
          placeholder="What makes your product unique? What value do you provide that competitors don't?"
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem_solved">Problem Solved *</Label>
        <Textarea
          id="problem_solved"
          value={data.problem_solved}
          onChange={(e) => onUpdate({ problem_solved: e.target.value })}
          placeholder="What problem does your product solve for buyers?"
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_market">Target Market *</Label>
        <Select
          value={data.target_market}
          onValueChange={(val) => onUpdate({ target_market: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select target market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wholesaler">Wholesaler</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
            <SelectItem value="retailer">Retailer</SelectItem>
            <SelectItem value="consumer">Consumer</SelectItem>
            <SelectItem value="b2b">B2B (Business to Business)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price_range">Price Range *</Label>
        <Select
          value={data.price_range}
          onValueChange={(val) => onUpdate({ price_range: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget - Affordable pricing</SelectItem>
            <SelectItem value="mid">Mid-range - Good value</SelectItem>
            <SelectItem value="premium">Premium - High quality/exclusive</SelectItem>
            <SelectItem value="luxury">Luxury - Top tier positioning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="competition_advantage">Competitive Advantage *</Label>
        <Textarea
          id="competition_advantage"
          value={data.competition_advantage}
          onChange={(e) => onUpdate({ competition_advantage: e.target.value })}
          placeholder="What advantages do you have over competitors?"
          rows={2}
          required
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Next: Exporter Profile
        </Button>
      </div>
    </form>
  );
}