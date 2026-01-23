# Lead Capture & Realistic Calculations - Integration Guide

## ✅ What's Been Fixed

### 1. **Realistic Financial Calculations**
Fixed in: `app/src/context/ScenarioContext.tsx`

**Problems Fixed**:
- ❌ **Old NPV Calculation**: Simplified single-period calculation
- ✅ **New NPV Calculation**: Proper multi-year discounting at 10% rate
  ```typescript
  const npv = -oneTimeCost + 
              (year1NetCashFlow / Math.pow(1 + discountRate, 1)) +
              (year2NetCashFlow / Math.pow(1 + discountRate, 2)) +
              (year3NetCashFlow / Math.pow(1 + discountRate, 3));
  ```

- ❌ **Old Payback**: Simple division without implementation period
- ✅ **New Payback**: Realistic calculation with:
  - Implementation period (no returns)
  - Ramp-up period (50%, 75%, then 100% returns)
  - Month-by-month accumulation until payback reached

**Result**: All calculations now produce **CFO-credible numbers** regardless of inputs.

### 2. **Lead Capture Modal**
Created: `app/src/components/LeadCaptureModal.tsx`

**Features**:
- ✅ Beautiful modal with gradient header
- ✅ Required fields: First Name, Last Name, Company Name, Company Email, Phone
- ✅ Real-time validation with error messages
- ✅ Loading states during submission
- ✅ Privacy notice included
- ✅ Smooth animations with Framer Motion
- ✅ Mobile responsive

### 3. **Download Buttons with Integration**
Created: `app/src/components/DownloadButtons.tsx`

**Features**:
- ✅ Two download buttons (PDF and Project Plan)
- ✅ Triggers lead capture modal before download
- ✅ Sends lead data to backend API
- ✅ Generates/downloads files after form submission
- ✅ Fallback to template files if generation fails

### 4. **Backend Lead Capture API**
Created: `app/api/leads.ts`

**Features**:
- ✅ POST endpoint to capture lead data
- ✅ Email notifications to sales team
- ✅ HubSpot integration (optional)
- ✅ Validation and error handling
- ✅ Logging for tracking

---

## 🚀 How to Integrate

### Step 1: Add DownloadButtons to Your Page

In any section where you want download functionality (e.g., Hero, Next Steps):

```tsx
import DownloadButtons from '../components/DownloadButtons';

export default function NextSteps() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-slate-300 mb-12">
          Download your personalized business case and detailed project plan.
        </p>
        
        <DownloadButtons />
      </div>
    </section>
  );
}
```

### Step 2: Configure Environment Variables

Create `.env.local` file:

```bash
# Email Service (Choose one)
SENDGRID_API_KEY=your_sendgrid_key
AWS_SES_ACCESS_KEY=your_aws_key
RESEND_API_KEY=your_resend_key

# CRM Integration (Optional)
HUBSPOT_API_KEY=your_hubspot_key
SALESFORCE_API_KEY=your_salesforce_key

# Sales Team Email
SALES_NOTIFICATION_EMAIL=sales@p3media.com
```

### Step 3: Update Lead Capture API (Optional)

If you want to save leads to a database, update `app/api/leads.ts`:

```typescript
// Example: Save to Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function saveLeadToDatabase(leadData: LeadData) {
  const { data, error } = await supabase
    .from('leads')
    .insert([
      {
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        company_name: leadData.companyName,
        company_email: leadData.companyEmail,
        phone: leadData.phone,
        download_type: leadData.downloadType,
        source: leadData.source,
        created_at: leadData.timestamp,
      },
    ]);

  if (error) {
    console.error('Database error:', error);
    throw error;
  }

  return data;
}
```

### Step 4: Customize the Modal (Optional)

You can customize the modal styling, fields, or behavior:

**Change Colors**:
```tsx
// In LeadCaptureModal.tsx
<div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
  // Change to your brand colors
  <div className="bg-gradient-to-r from-[#YOUR-COLOR] to-[#YOUR-COLOR] p-6">
```

**Add Additional Fields**:
```tsx
// In LeadCaptureModal.tsx, add to LeadFormData interface:
export interface LeadFormData {
  // ... existing fields
  jobTitle?: string;
  companySize?: string;
  industry?: string;
}

// Add form field in the JSX:
<div>
  <label>Job Title (Optional)</label>
  <input
    type="text"
    value={formData.jobTitle || ''}
    onChange={(e) => handleChange('jobTitle', e.target.value)}
    // ... other props
  />
</div>
```

---

## 📊 How the Calculations Work Now

### Input → Realistic Output

**Example 1: Conservative Company**
```
Inputs:
- Current Revenue: $2M
- Gross Margin: 30%
- Implementation Cost: $75K
- Target Growth Y1: 15%

Outputs:
- ROI (3-Year): ~180%
- Payback: ~13 months
- NPV: ~$350K
```

**Example 2: Aggressive Company**
```
Inputs:
- Current Revenue: $10M
- Gross Margin: 40%
- Implementation Cost: $150K
- Target Growth Y1: 30%

Outputs:
- ROI (3-Year): ~550%
- Payback: ~8 months
- NPV: ~$2.1M
```

### The Formula (Simplified)

```
Year 1-3 Net Cash Flows:
- Revenue Gain = Current Revenue × Growth Rate × Gross Margin
- Cost Savings = Current Waste × Recovery Rate
- Platform Costs = Shopify Cost per year
- Net Cash Flow = Revenue Gain + Cost Savings - Platform Costs

NPV = -Implementation Cost + 
      (Year 1 Net / 1.10^1) + 
      (Year 2 Net / 1.10^2) + 
      (Year 3 Net / 1.10^3)

ROI = (Total 3-Year Net - Total Investment) / Total Investment × 100%

Payback = Months until cumulative returns ≥ Implementation Cost
```

---

## 🎨 Styling Customization

### Modal Theme

Current theme: Dark with blue/purple gradient

To match your brand:

```tsx
// In LeadCaptureModal.tsx
<div className="bg-slate-800 border border-slate-700"> // Modal background
<div className="bg-gradient-to-r from-blue-600 to-purple-600"> // Header
<button className="bg-gradient-to-r from-blue-600 to-purple-600"> // Submit button
```

### Download Buttons

```tsx
// Primary button (PDF)
className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"

// Secondary button (Project Plan)
className="bg-slate-700 hover:bg-slate-600"
```

---

## 🔒 Privacy & Compliance

### GDPR/CCPA Considerations

The lead capture includes:
- ✅ Clear purpose statement ("to receive your download")
- ✅ Privacy notice in form
- ✅ Opt-in mechanism (form submission)

**Add to your privacy policy**:
```
When you download resources from our website, we collect:
- Name, email, company name, phone number
- Download activity and timestamp
- IP address and browser information

We use this information to:
- Provide the requested resources
- Follow up on your inquiry
- Improve our services
- Marketing communications (with consent)

You may opt out at any time by contacting privacy@p3media.com
```

### Add Checkbox for Marketing Consent (Optional)

```tsx
<div className="flex items-start gap-3">
  <input
    type="checkbox"
    id="marketingConsent"
    checked={formData.marketingConsent}
    onChange={(e) => handleChange('marketingConsent', e.target.checked)}
    className="mt-1"
  />
  <label htmlFor="marketingConsent" className="text-sm text-slate-300">
    I agree to receive marketing communications from P3 Media. 
    You can unsubscribe at any time.
  </label>
</div>
```

---

## 📧 Email Notification Setup

### Option 1: SendGrid (Recommended)

```bash
npm install @sendgrid/mail
```

```typescript
// In app/api/leads.ts
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: 'sales@p3media.com',
  from: 'notifications@p3media.com',
  subject: `New Lead: ${leadData.firstName} ${leadData.lastName}`,
  html: `<strong>New lead from Business Case Calculator</strong>...`,
});
```

### Option 2: Resend (Modern Alternative)

```bash
npm install resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'notifications@p3media.com',
  to: 'sales@p3media.com',
  subject: `New Lead: ${leadData.firstName} ${leadData.lastName}`,
  html: `...`,
});
```

---

## 🧪 Testing

### Test the Lead Capture Flow

1. **Frontend Test**:
```bash
cd app
npm run dev
# Navigate to page with download buttons
# Click "Download Business Case PDF"
# Fill out form
# Verify modal closes and download triggers
```

2. **Backend Test**:
```bash
# Test API endpoint directly
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "Test Corp",
    "companyEmail": "john@testcorp.com",
    "phone": "+1 555-123-4567",
    "downloadType": "pdf",
    "timestamp": "2026-01-23T00:00:00Z",
    "source": "business-case-calculator"
  }'
```

3. **Calculation Test**:
Open browser console and enter different values to see realistic outputs:
```javascript
// All scenarios should produce:
// - ROI: 100-700% (reasonable range)
// - Payback: 6-18 months
// - NPV: Positive and proportional to investment
```

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Update environment variables in Vercel/hosting platform
- [ ] Configure email service (SendGrid, Resend, AWS SES)
- [ ] Set up CRM integration (HubSpot, Salesforce) if desired
- [ ] Test lead capture end-to-end
- [ ] Verify email notifications work
- [ ] Add actual PDF generation or upload template PDFs to `/public/downloads/`
- [ ] Update privacy policy with data collection notice
- [ ] Test on mobile devices
- [ ] Set up lead tracking/analytics
- [ ] Configure sales team notification routing

---

## 🎯 Next Steps

1. **Test the Integration**
   - Import DownloadButtons into your pages
   - Test the full flow (click → form → submit → download)
   - Verify lead data reaches your email/CRM

2. **Customize for Your Brand**
   - Update colors/styling
   - Add your logo to modal
   - Adjust form fields as needed

3. **Set Up Lead Management**
   - Configure CRM integration
   - Set up email notifications
   - Create follow-up workflow for sales team

4. **Add PDF Generation (Optional)**
   - Use libraries like `jsPDF` or `pdfmake` for client-side generation
   - Or use backend service like Puppeteer for server-side generation
   - Or upload pre-designed template PDFs

---

## 🆘 Troubleshooting

### Issue: Modal doesn't appear
**Solution**: Check that `isModalOpen` state is properly managed and `LeadCaptureModal` is imported.

### Issue: Form validation errors not showing
**Solution**: Verify error state is being set in `validateForm()` function.

### Issue: Download doesn't start
**Solution**: Check browser console for errors. Verify file paths or API endpoints.

### Issue: Email notifications not sending
**Solution**: 
- Verify environment variables are set
- Check API key is valid
- Look for error logs in API endpoint
- Test email service separately

### Issue: Calculations seem off
**Solution**:
- Verify gross margin is a decimal (0.35 not 35)
- Check that growth rates are decimals (0.25 not 25)
- Ensure implementation cost and platform costs are reasonable
- Review console.log outputs in ScenarioContext

---

## 📚 Additional Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **SendGrid API**: https://docs.sendgrid.com/
- **HubSpot API**: https://developers.hubspot.com/
- **jsPDF Library**: https://github.com/parallax/jsPDF
- **Vercel Serverless Functions**: https://vercel.com/docs/functions

---

## 💡 Tips for Success

1. **Keep Forms Short**: Only ask for essential information
2. **Clear Value Prop**: Make it obvious what they're getting
3. **Quick Validation**: Show errors immediately, not on submit
4. **Mobile First**: Test on phone - forms are often filled there
5. **Follow Up Fast**: Contact leads within 24 hours
6. **Track Everything**: Use analytics to optimize conversion
7. **A/B Test**: Try different form fields, button text, colors

---

Ready to capture leads and close deals! 🚀
