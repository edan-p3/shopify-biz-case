import React from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowRight, Calendar, MessageSquare } from 'lucide-react';
import DownloadButtons from '../DownloadButtons';

export const NextSteps: React.FC = () => {
  return (
    <Section id="nextsteps" className="mb-20">
      <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-primary/20 p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 p-32 bg-accent/20 blur-[100px] rounded-full -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Commerce?</h2>
          <p className="text-lg text-slate-300 mb-10">
            The data is clear. Migrating to Shopify offers a compelling ROI, reduces operational risk, and unlocks future growth. 
            Let's move to the next phase.
          </p>

          {/* Download Buttons with Lead Capture */}
          <div className="mb-10 no-print">
            <DownloadButtons />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 no-print">
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2 bg-slate-800/80 hover:bg-slate-700"
              onClick={() => window.location.href = 'mailto:strategy@p3media.com?subject=Shopify%20Migration%20Workshop'}
            >
              <Calendar size={24} className="text-primary" />
              <span>Schedule Workshop</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-auto py-4 flex-col gap-2 bg-slate-800/80 hover:bg-slate-700"
              onClick={() => window.location.href = 'mailto:hello@p3media.com?subject=Shopify%20Business%20Case%20Inquiry'}
            >
              <MessageSquare size={24} className="text-primary" />
              <span>Contact Team</span>
            </Button>
          </div>

          <Button size="lg" className="w-full sm:w-auto px-12 animate-pulse no-print">
            Approve Project <ArrowRight size={20} />
          </Button>
        </div>
      </Card>
    </Section>
  );
};
