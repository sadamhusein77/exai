// Promotion Output Component
// Displays the generated AIDA format promotion content

import type { PromotionContent } from '../../../domain/entities';
import { CheckCircle, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface PromotionOutputProps {
  content: PromotionContent;
  productName?: string;
  language?: string;
  tone?: string;
}

export function PromotionOutput({ content, productName, language, tone }: PromotionOutputProps) {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = 20;

    // Helper to add section (commented as unused)
    doc.setFillColor('#0f172a');
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#ffffff');
    doc.text('EXPORT PROMOTION CONTENT', margin, 8);

    yPos = 25;

    // Title section
    doc.setFillColor('#f1f5f9');
    doc.roundedRect(margin, yPos, contentWidth, 20, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1e293b');
    const titleLines = doc.splitTextToSize(content.title, contentWidth - 10);
    doc.text(titleLines, pageWidth / 2, yPos + 10, { align: 'center' });
    yPos += 28;

    // Meta info (if provided)
    if (productName || language || tone) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#64748b');
      const metaParts = [productName && `Product: ${productName}`, language && `Language: ${language}`, tone && `Tone: ${tone}`].filter(Boolean);
      doc.text(metaParts.join(' | '), pageWidth / 2, yPos, { align: 'center' });
      yPos += 12;
    }

    // Attention
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#b45309');
    doc.text('ATTENTION', margin, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    const attentionLines = doc.splitTextToSize(content.attention, contentWidth);
    doc.text(attentionLines, margin, yPos);
    yPos += attentionLines.length * 5 + 10;

    // Interest
    if (yPos > 240) { doc.addPage(); yPos = 20; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2563eb');
    doc.text('INTEREST', margin, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    const interestLines = doc.splitTextToSize(content.interest, contentWidth);
    doc.text(interestLines, margin, yPos);
    yPos += interestLines.length * 5 + 10;

    // Desire
    if (yPos > 240) { doc.addPage(); yPos = 20; }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#16a34a');
    doc.text('WHY CHOOSE THIS', margin, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151');
    content.desire.forEach((point) => {
      if (yPos > 260) { doc.addPage(); yPos = 20; }
      doc.setTextColor('#16a34a');
      doc.text('✓', margin, yPos);
      doc.setTextColor('#374151');
      const pointLines = doc.splitTextToSize(point, contentWidth - 8);
      doc.text(pointLines, margin + 6, yPos);
      yPos += pointLines.length * 5 + 3;
    });
    yPos += 8;

    // Action
    if (yPos > 240) { doc.addPage(); yPos = 20; }
    doc.setFillColor('#dbeafe');
    doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2563eb');
    doc.text('CALL TO ACTION', margin + 5, yPos + 8);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1e293b');
    const actionLines = doc.splitTextToSize(content.action, contentWidth - 10);
    doc.text(actionLines, margin + 5, yPos + 18);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#94a3b8');
    doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Export Promotion Generator`, pageWidth / 2, footerY, { align: 'center' });

    doc.save(`promotion-${productName?.replace(/\s+/g, '-') || 'export'}-${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>

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