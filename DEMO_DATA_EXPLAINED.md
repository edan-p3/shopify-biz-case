# Demo Data vs User Data - How It Works

## Current Behavior (LIVE NOW)

The site now shows **realistic demo data** by default, which provides a professional example of a typical $5M revenue company considering Shopify migration.

### Demo Data Profile (Default Values):

**Company Profile:**
- Annual Revenue: **$5M** (all from online B2C)
- Gross Margin: **35%**
- Growth Rate: **5%** (baseline)
- Employees: 50 total (5 ecommerce, 3 CS, 2 IT)

**Current Platform Costs:**
- License: **$35,000/year**
- Hosting: **$8,000/year**
- Maintenance: **$25,000/year**
- Integrations: **$15,000/year**
- Downtime Loss: **$2,000/year**
- **Total Current TCO: $85,000/year**

**Operational Inefficiencies:**
- Manual processes: ~18 hours/week total
- Hourly rate: $50
- **Annual labor cost: ~$46,800**

**Migration Investment:**
- Implementation: **$100,000** (one-time)
- Shopify Plus: **$36,000/year**
- Apps & Tools: **$12,000/year**
- Timeline: 16 weeks

### Calculated Results (Moderate Scenario):

**3-Year Projections:**
- ROI: **~400%+**
- NPV: **~$950K**
- Payback: **~9 months**
- Revenue Growth: 25%/20%/15% (Year 1/2/3)
- Total Revenue Gain: **$3.63M**
- Gross Profit Gain: **$1.27M**

## How User Data Works

### Step 1: Initial View
- User visits site
- Sees all sections with **demo data**
- Can explore the full analysis
- Toggle between scenarios (Conservative/Moderate/Aggressive)

### Step 2: Click "Get Started"
- Opens 5-step input modal
- User enters their actual business data:
  1. Business Profile (revenue, margins, employees)
  2. Current State (platform costs, pain points)
  3. Migration Planning (budget, Shopify plan, timeline)
  4. B2B/Retail Details (if applicable)
  5. Strategic Goals

### Step 3: Data Submission
- All inputs saved to ScenarioContext
- **Automatic recalculation** of all metrics:
  - Revenue projections based on actual revenue
  - ROI calculated from actual costs and margins
  - Cash flow based on actual investment amounts
  - Payback period from real implementation timeline
  - NPV with proper discounting

### Step 4: Personalized Results
- All sections update with user's data
- Charts reflect actual numbers
- Scenarios recalculate (Conservative/Moderate/Aggressive)
- Company name appears in Hero
- Download PDF includes personalized analysis

## Key Differences

| Aspect | Demo Data | User Data |
|--------|-----------|-----------|
| **Company Name** | "Your Company" | [User's Company] |
| **Revenue** | $5M | [User Input] |
| **Costs** | $85K platform + $47K labor | [User Input] |
| **Investment** | $100K + $48K/year | [User Input] |
| **ROI** | Calculated from demo values | Calculated from user values |
| **Scenarios** | Based on $5M baseline | Based on user's baseline |

## Why Demo Data?

1. **Professional Presentation**: Shows a complete, working example
2. **Credible Numbers**: All calculations based on industry benchmarks
3. **Immediate Value**: Users see the tool's capabilities right away
4. **No Empty States**: Site looks polished and complete
5. **Clear Template**: Provides guidance on what data to enter

## Data Persistence

- Demo data is stored in `ScenarioContext.tsx` as `defaultInputs`
- User data is stored in React state (session-based)
- When user refreshes page, returns to demo data
- No data is saved to database unless user submits lead form

## Future Enhancement Ideas

1. **Save to localStorage**: Remember user inputs between sessions
2. **Export inputs**: Let users download/share their configuration
3. **Custom scenarios**: Allow users to create their own growth rate assumptions
4. **Sensitivity analysis**: Show range of outcomes (best/worst case)
5. **Industry templates**: Pre-fill demo data based on selected industry

---

**Status**: ✅ Live and Deployed
**Last Updated**: January 24, 2026
**URL**: https://shopify-biz-case.vercel.app/
