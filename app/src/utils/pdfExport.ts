import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async () => {
  // Hide fixed elements that might interfere with the screenshot
  const nav = document.querySelector('nav');
  if (nav) nav.style.position = 'absolute'; // Temporarily unstick
  
  const element = document.querySelector('main');
  if (!element) return;

  try {
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 1280,
      backgroundColor: '#0F172A', // Match background color
      ignoreElements: (element) => {
        // Ignore elements with class 'no-print'
        return element.classList.contains('no-print');
      },
      onclone: (clonedDoc) => {
        // Fix gradient text for PDF generation by removing background-clip
        // and setting a solid color fallback
        const gradientTexts = clonedDoc.querySelectorAll('.text-transparent.bg-clip-text');
        gradientTexts.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.background = 'none';
          htmlEl.style.webkitTextFillColor = '#3b82f6'; // Primary blue
          htmlEl.style.color = '#3b82f6';
        });
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Calculate PDF dimensions (A4 reference)
    const imgWidth = 210; // mm (A4 width)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // We'll create a PDF with the height matching the content for a "long scroll" digital PDF
    // which is often better for digital reading of web content than splitting tables/charts
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [imgWidth, imgHeight],
      compress: true
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save('shopify-business-case.pdf');

  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Restore elements
    if (nav) nav.style.position = '';
  }
};

export const printView = () => {
  window.print();
};
