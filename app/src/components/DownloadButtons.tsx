import { useState } from 'react';
import { FileDown } from 'lucide-react';
import LeadCaptureModal, { type LeadFormData } from './LeadCaptureModal';
import { generatePDF } from '../utils/pdfExport';

export default function DownloadButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadType, setDownloadType] = useState<'pdf' | 'project-plan'>('pdf');

  const handleDownloadClick = (type: 'pdf' | 'project-plan') => {
    setDownloadType(type);
    setIsModalOpen(true);
  };

  const handleLeadSubmit = async (data: LeadFormData) => {
    console.log('Lead captured:', data);

    // Send lead data to backend API
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          downloadType,
          timestamp: new Date().toISOString(),
          source: 'business-case-calculator',
        }),
      }).catch((error) => {
        // If API fails, still allow download but log to console
        console.log('Lead capture API unavailable:', error);
        console.log('Lead data (logged locally):', data);
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
    }

    // Close modal
    setIsModalOpen(false);

    // Show success message
    const successMessage = downloadType === 'pdf' 
      ? 'Thank you! Generating your Business Case PDF...' 
      : 'Thank you! Your Detailed Project Plan is ready...';
    
    // Trigger the actual download
    if (downloadType === 'pdf') {
      // Use existing PDF generation
      await generatePDF();
      alert(successMessage);
    } else {
      // For project plan, create a detailed document
      downloadProjectPlan();
      alert(successMessage);
    }
  };

  const downloadProjectPlan = () => {
    // For now, also generate PDF (in future, this could be a different document)
    // You can customize this to generate a different type of document
    generatePDF();
    
    // Alternative: Download a pre-made template
    // const link = document.createElement('a');
    // link.href = '/downloads/shopify-project-plan-template.pdf';
    // link.download = `shopify-project-plan-${Date.now()}.pdf`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex justify-center">
        {/* Download PDF Button - Single Centered Button */}
        <button
          onClick={() => handleDownloadClick('pdf')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          <FileDown size={24} />
          Download Business Case PDF
        </button>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLeadSubmit}
        downloadType={downloadType}
      />
    </>
  );
}
