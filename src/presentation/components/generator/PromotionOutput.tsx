// Promotion Output Component
// Displays the generated promotion content

import { CheckCircle } from 'lucide-react';
import type { PromotionContent } from '../../../domain/entities';

interface PromotionOutputProps {
  content: PromotionContent;
}

export function PromotionOutput({ content }: PromotionOutputProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
          Title
        </h4>
        <p className="text-lg font-semibold text-slate-800 dark:text-white">
          {content.title}
        </p>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
          Description
        </h4>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {content.description}
        </p>
      </div>

      {/* Bullet Points */}
      <div>
        <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
          Key Features
        </h4>
        <ul className="space-y-1">
          {content.bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
          Call to Action
        </h4>
        <p className="text-slate-800 dark:text-white font-medium">
          {content.callToAction}
        </p>
      </div>
    </div>
  );
}