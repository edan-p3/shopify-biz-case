import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Loader2 } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  downloadType: 'pdf' | 'project-plan';
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyEmail: string;
  phone: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  downloadType,
}: LeadCaptureModalProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    companyEmail: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required';
    } else if (!validateEmail(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send lead data to backend or analytics
      await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          downloadType,
          timestamp: new Date().toISOString(),
          source: 'business-case-calculator',
        }),
      }).catch(() => {
        // If API fails, still allow download but log to console
        console.log('Lead capture:', formData);
      });

      // Call parent's onSubmit to trigger download
      onSubmit(formData);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        companyEmail: '',
        phone: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const downloadTitle = downloadType === 'pdf' 
    ? 'Download Business Case PDF' 
    : 'Download Detailed Project Plan';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <Download className="text-white" size={28} />
                  <h2 className="text-2xl font-bold text-white">{downloadTitle}</h2>
                </div>
                <p className="text-blue-100 text-sm">
                  Please provide your information to receive your download
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1.5">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-900/50 border ${
                      errors.firstName ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-900/50 border ${
                      errors.lastName ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-900/50 border ${
                      errors.companyName ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="Acme Corp"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>
                  )}
                </div>

                {/* Company Email */}
                <div>
                  <label htmlFor="companyEmail" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Company Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="companyEmail"
                    value={formData.companyEmail}
                    onChange={(e) => handleChange('companyEmail', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-900/50 border ${
                      errors.companyEmail ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="john.doe@company.com"
                  />
                  {errors.companyEmail && (
                    <p className="mt-1 text-sm text-red-400">{errors.companyEmail}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-slate-900/50 border ${
                      errors.phone ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Privacy Notice */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  By submitting this form, you agree to receive communications from P3 Media. 
                  We respect your privacy and will never share your information with third parties.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Download Now
                    </>
                  )}
                </button>
              </form>
            </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
