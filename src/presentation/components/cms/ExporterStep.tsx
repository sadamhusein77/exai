// Exporter Profile Step
// Step 3 of CMS wizard

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ExporterStepProps {
  data: {
    exporter_name: string;
    company_name: string;
    country: string;
    experience_years: string;
    production_capacity: string;
    certifications: string[];
  };
  onUpdate: (data: Partial<ExporterStepProps['data']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ExporterStep({ data, onUpdate, onBack, onNext }: ExporterStepProps) {
  const [certInput, setCertInput] = useState(data.certifications.join(', '));

  useEffect(() => {
    setCertInput(data.certifications.join(', '));
  }, [data]);

  const handleCertBlur = () => {
    const certs = certInput.split(',').map(c => c.trim()).filter(Boolean);
    onUpdate({ certifications: certs });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleCertBlur(); onNext(); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exporter_name">Contact Person Name *</Label>
        <Input
          id="exporter_name"
          value={data.exporter_name}
          onChange={(e) => onUpdate({ exporter_name: e.target.value })}
          placeholder="Your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name *</Label>
        <Input
          id="company_name"
          value={data.company_name}
          onChange={(e) => onUpdate({ company_name: e.target.value })}
          placeholder="Your company name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country *</Label>
        <Input
          id="country"
          value={data.country}
          onChange={(e) => onUpdate({ country: e.target.value })}
          placeholder="Where is your company located?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience_years">Years of Experience *</Label>
        <Input
          id="experience_years"
          value={data.experience_years}
          onChange={(e) => onUpdate({ experience_years: e.target.value })}
          placeholder="e.g. 5+ years"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="production_capacity">Production Capacity</Label>
        <Input
          id="production_capacity"
          value={data.production_capacity}
          onChange={(e) => onUpdate({ production_capacity: e.target.value })}
          placeholder="e.g. 10,000 units/month"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications (comma separated)</Label>
        <Input
          id="certifications"
          value={certInput}
          onChange={(e) => setCertInput(e.target.value)}
          onBlur={handleCertBlur}
          placeholder="e.g. ISO 9001, Fair Trade, Organic"
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Next: Sales Context
        </Button>
      </div>
    </form>
  );
}