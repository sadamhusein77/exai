// Promotion Output Component
// Displays the generated AIDA format promotion content

import type { PromotionContent } from '../../../domain/entities';
import { CheckCircle } from 'lucide-react';

interface PromotionOutputProps {
  content: PromotionContent;
}

export function PromotionOutput({ content }: PromotionOutputProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          {content.title}
        </h3>
      </div>

      {/* Attention */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
          Attention
        </h4>
        <p className="text-slate-700 dark:text-slate-200">
          {content.attention}
        </p>
      </div>

      {/* Interest */}
      <div>
        <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
          Interest
        </h4>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {content.interest}
        </p>
      </div>

      {/* Desire */}
      <div>
        <h4 className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2">
          Why Choose This
        </h4>
        <ul className="space-y-2">
          {content.desire.map((point: string, index: number) => (
            <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
          Call to Action
        </h4>
        <p className="text-slate-800 dark:text-white font-medium">
          {content.action}
        </p>
      </div>
    </div>
  );
}