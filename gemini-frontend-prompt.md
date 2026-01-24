# Gemini Frontend Development Prompt
## Shopify Business Case Interactive Dashboard

### Project Overview
Create a modern, professional, interactive web application that presents a comprehensive Shopify Commerce Platform Migration business case. This should be a single-page application (SPA) with smooth scrolling navigation and interactive data visualizations.

---

## Design System & Color Palette

### Colors
```css
Primary:        #2563EB (Blue 600)
Accent:         #7C3AED (Purple 600)
Background:     #0F172A (Slate 900)
Surface:        #1E293B (Slate 800)
Text Primary:   #F8FAFC (Slate 50)
Text Secondary: #94A3B8 (Slate 400)
Success:        #10B981 (Green 500)
Warning:        #F59E0B (Amber 500)
Error:          #EF4444 (Red 500)
```

### Visual Style
- **Dark theme** with glassmorphism effects
- **Modern, clean UI** with ample whitespace
- **Data-driven design** emphasizing metrics and ROI
- **Professional B2B aesthetic** suitable for executive presentations
- **Responsive design** that works on desktop, tablet, and mobile
- **Smooth animations** and transitions throughout

---

## Technical Stack Recommendations

### Core Technologies
- **React 18+** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** or **Chart.js** for data visualizations
- **React Router** for navigation (if multi-page)
- **Lucide React** for icons

### Additional Libraries
- **react-scroll** for smooth scrolling navigation
- **react-intersection-observer** for scroll-triggered animations
- **number-counter-animation** for animated metrics
- **react-table** for data tables (if needed)

---

## Application Structure

### Main Sections (Navigation)

1. **Hero / Executive Summary**
   - Compelling headline and value proposition
   - Key metrics cards (ROI, Payback Period, NPV)
   - CTA button to explore details
   - Animated number counters

2. **Financial Snapshot**
   - Interactive scenario comparison (Conservative/Moderate/Aggressive)
   - Toggle between scenarios with smooth transitions
   - Data visualization: 3-year revenue projection chart
   - Investment breakdown pie chart
   - ROI timeline visualization

3. **Current State vs. Future State**
   - Split-screen comparison layout
   - Pain points with cost indicators
   - Capabilities unlocked with Shopify
   - Visual before/after metrics

4. **Growth Projections**
   - Interactive scenario selector
   - Revenue growth chart (line/area chart)
   - Year-over-year comparison bars
   - Gross profit impact visualization
   - Payback period timeline

5. **Total Cost of Ownership (TCO)**
   - Comparative cost breakdown tables
   - 3-year cost projection
   - Operational savings visualization
   - Interactive cost calculator

6. **Cash Flow Analysis**
   - Monthly cash flow chart for Year 1
   - Breakeven point indicator
   - Cumulative cash flow over 3 years
   - Visual breakeven milestone

7. **Risk Assessment**
   - Risk matrix heatmap
   - Expandable risk cards with mitigation strategies
   - Risk-adjusted financial model
   - Sensitivity analysis slider

8. **Implementation Roadmap**
   - Interactive timeline/Gantt chart
   - Phase cards with deliverables
   - Progress indicators
   - Milestone markers

9. **Strategic Value**
   - Icon-based benefit cards
   - Competitive positioning
   - Future capabilities grid
   - Value beyond ROI highlights

10. **Case Studies** (Appendix A)
    - Card-based layout
    - Key metrics for each case study
    - Industry tags
    - Results highlights

11. **Next Steps / CTA**
    - Clear action items
    - Contact form or scheduling integration
    - Decision timeline
    - Executive questions checklist

---

## Key Features & Interactions

### Interactive Elements
1. **Scenario Toggle**: Switch between Conservative/Moderate/Aggressive scenarios with live data updates
2. **Interactive Charts**: Hover tooltips, zoom capabilities, responsive legends
3. **Metric Calculators**: Allow users to adjust assumptions and see impact
4. **Expandable Sections**: Accordion-style for detailed information
5. **Scroll Progress Indicator**: Show progress through the business case
6. **Table of Contents Sidebar**: Sticky navigation with active section highlighting
7. **Print/Export View**: Generate PDF-friendly version
8. **Metric Comparisons**: Side-by-side scenario comparisons with visual indicators

### Data Visualizations Required

#### Charts & Graphs
- **Revenue Growth Line Chart**: 3-year projections with multiple scenarios
- **ROI Comparison Bar Chart**: Side-by-side scenario comparison
- **Cash Flow Waterfall Chart**: Monthly Year 1 cash flow
- **TCO Breakdown Pie/Donut Charts**: Cost category visualization
- **Payback Period Timeline**: Visual timeline showing breakeven points
- **Risk Matrix Heatmap**: Probability vs Impact visualization
- **Implementation Gantt Chart**: Phase timeline with milestones

#### Metric Cards
- Animated counters for key numbers
- Trend indicators (up/down arrows)
- Percentage changes with color coding
- Comparison to baseline/benchmarks

---

## Content Structure (From Business Case)

### Executive Summary Metrics (REALISTIC DEMO DATA)
**IMPORTANT**: These are **defensible, conservative** numbers suitable for CFO/CEO review. 
All calculations use proper financial formulas (NPV with 10% discount rate, IRR, realistic payback).

**Demo Company Profile**:
- Current Revenue: $5M/year
- Gross Margin: 35%
- Implementation Cost: $100K
- 3-Year Platform Costs: $144K
- Total 3-Year Investment: $244K

```javascript
{
  conservative: {
    name: "Conservative",
    paybackPeriod: "14 months",
    roi3Year: "163%",
    year1Revenue: "+$750K (+15%)",
    year1RevenuePercent: "+15%",
    tcoSavings: "$50K/year",
    npv: "$480K",
    growthRates: [15%, 12%, 10%],
    netBenefit: "$643K",
    description: "Incremental improvements with cautious execution"
  },
  moderate: {
    name: "Moderate", 
    paybackPeriod: "9 months",
    roi3Year: "405%",
    year1Revenue: "+$1.25M (+25%)",
    year1RevenuePercent: "+25%",
    tcoSavings: "$65K/year",
    npv: "$950K",
    growthRates: [25%, 20%, 15%],
    netBenefit: "$1.23M",
    description: "Industry-standard improvements with good execution"
  },
  aggressive: {
    name: "Aggressive",
    paybackPeriod: "7 months",
    roi3Year: "625%",
    year1Revenue: "+$1.75M (+35%)",
    year1RevenuePercent: "+35%",
    tcoSavings: "$75K/year",
    npv: "$1.38M",
    growthRates: [35%, 28%, 20%],
    netBenefit: "$1.77M",
    description: "Best-in-class execution with strong market conditions"
  }
}
```

**Key Principles for Credibility**:
1. All assumptions must be sourced (industry benchmarks, Shopify data)
2. Growth rates are realistic and taper over time
3. Cost savings are conservative (60-90% of identified waste)
4. NPV uses standard 10% discount rate
5. Calculations are transparent and customizable
```

### Current State Pain Points (Quantified - Demo Data)
- **Revenue Leakage** (cart abandonment, errors): $45,000 annually
- **Operational Inefficiency** (manual processes): $20,000 annually
- **Integration & Maintenance Tax**: $12,000 annually
- **Opportunity Cost** (slow development): $8,000 annually
- **Total Current State Waste**: $85,000 annually
- **Current Platform Cost**: $60,000 annually
- **Total Current State Cost**: $145,000 annually

### Investment Summary (Shopify Migration)
- **Implementation Cost**: $100,000 (one-time)
  - Discovery & Planning: $10K
  - Setup & Configuration: $15K
  - Data Migration: $25K
  - Integration Development: $30K
  - Testing & Training: $12K
  - Launch & Optimization: $8K

- **Shopify Platform Costs** (Annual):
  - Shopify Plus: $36,000/year
  - Apps & Tools: $12,000/year
  - **Total Platform**: $48,000/year

- **3-Year Investment Summary**:
  - Year 1 Total: $148,000 (implementation + platform)
  - Year 2 Total: $48,000 (platform only)
  - Year 3 Total: $48,000 (platform only)
  - **3-Year Total**: $244,000

- **Operational Costs Post-Migration**:
  - 60-90% reduction in current waste
  - Conservative: $35K/year remaining (save $50K)
  - Moderate: $20K/year remaining (save $65K)
  - Aggressive: $10K/year remaining (save $75K)

### Revenue Projections (3 Scenarios - REALISTIC)
**Demo Company Baseline**: $5M current annual revenue

**Conservative (15%/12%/10% growth)**
- Year 0: $5.0M (baseline)
- Year 1: $5.75M (+$750K, +15%)
- Year 2: $6.44M (+$690K, +12%)
- Year 3: $7.09M (+$650K, +10%)
- **3-Year Total Growth**: $2.09M (+42%)
- **Gross Profit Gain** (35% margin): $731K

**Moderate (25%/20%/15% growth)**
- Year 0: $5.0M (baseline)
- Year 1: $6.25M (+$1.25M, +25%)
- Year 2: $7.50M (+$1.25M, +20%)
- Year 3: $8.63M (+$1.13M, +15%)
- **3-Year Total Growth**: $3.63M (+73%)
- **Gross Profit Gain** (35% margin): $1.27M

**Aggressive (35%/28%/20% growth)**
- Year 0: $5.0M (baseline)
- Year 1: $6.75M (+$1.75M, +35%)
- Year 2: $8.64M (+$1.89M, +28%)
- Year 3: $10.37M (+$1.73M, +20%)
- **3-Year Total Growth**: $5.37M (+107%)
- **Gross Profit Gain** (35% margin): $1.88M

**Why These Growth Rates Are Realistic**:
- Shopify Plus merchants average 126% YoY growth (source: Shopify)
- Platform migration typically delivers 20-35% uplift (source: Forrester)
- Growth naturally moderates over time (market saturation)
- Conservative scenario uses lower end of industry benchmarks

### Cash Flow (Moderate Scenario - Year 1)
**Assumptions**:
- Implementation costs spread over first 6 months
- Platform costs: $4K/month starting Month 1
- GP returns: Start Month 4 (after launch), ramp to full by Month 6
- Operational savings: $5.4K/month ($65K/year)
- Year 1 GP gain: $437.5K ($1.25M revenue × 35% margin)

**Monthly Breakdown**:
- **Months 1-3**: Heavy investment phase
  - Monthly investment: -$16.7K
  - Platform costs: -$4K
  - Returns: $0
  - Net: -$20.7K/month
  
- **Month 4**: Soft launch
  - Investment: -$16.7K
  - Platform: -$4K
  - Returns: +$15K (ramping up)
  - Net: -$5.7K

- **Months 5-6**: Ramp-up
  - Investment: -$16.7K
  - Platform: -$4K  
  - Returns: +$30K (approaching full)
  - Net: +$9.3K

- **Months 7-12**: Full operation
  - Investment: $0
  - Platform: -$4K
  - GP Returns: +$36.5K/month
  - Operational savings: +$5.4K/month
  - Net: +$37.9K/month

**Key Milestones**:
- **Breakeven**: Month 9 (cumulative positive)
- **Total Year 1 Net Cash Flow**: +$289.5K
- **Cumulative by Month 12**: +$289.5K

This is realistic for platform migrations - negative first 6-8 months, then strongly positive.

---

## UI/UX Requirements

### Navigation
- Sticky header with transparent background that becomes solid on scroll
- Smooth scroll to section on navigation click
- Mobile-responsive hamburger menu
- Active section indicator in navigation
- Progress bar at top showing scroll position

### Typography
- **Headlines**: Inter, SF Pro Display, or Poppins (bold, 700+)
- **Body**: Inter or SF Pro Text (regular 400, medium 500)
- **Data/Numbers**: JetBrains Mono or SF Mono (monospace for alignment)
- Clear hierarchy: H1 (48px), H2 (36px), H3 (24px), Body (16px)

### Spacing & Layout
- Maximum content width: 1280px (centered)
- Generous padding: 80px vertical section spacing
- Grid system: 12-column for complex layouts
- Card-based components with consistent border-radius (12px)
- Use of negative space to separate content sections

### Animations & Micro-interactions
- **Scroll-triggered animations**: Fade in + slide up on section entry
- **Hover states**: Subtle scale (1.02x) and shadow elevation
- **Number counters**: Animate from 0 to target value on first view
- **Chart animations**: Staggered entry for bars/lines
- **Loading states**: Skeleton screens or subtle pulse animations
- **Transitions**: 200-300ms ease-in-out for most interactions

### Accessibility
- WCAG 2.1 AA compliance
- Proper heading hierarchy
- Alt text for all images/icons
- Keyboard navigation support
- Focus indicators for interactive elements
- Sufficient color contrast (especially with dark theme)

---

## Component Breakdown

### Hero Section
```
- Full viewport height
- Gradient overlay on background
- Centered content with CTA
- 3 key metrics in prominent cards
- Subtle particle/gradient animation
- Scroll indicator arrow
```

### Metric Card Component
```
- Surface background with subtle border
- Icon (top left, accent color)
- Large number (primary text, animated counter)
- Label (secondary text, smaller)
- Comparison indicator (+/- with trend arrow)
- Hover effect: slight elevation
```

### Scenario Comparison Component
```
- Tab/toggle selector (Conservative/Moderate/Aggressive)
- Active state with primary color
- Smooth transition when switching
- Data updates with fade transition
- Visual diff indicators
```

### Data Table Component
```
- Dark surface background
- Alternating row shading
- Header row with accent color
- Right-aligned numbers with monospace font
- Highlight row on hover
- Mobile: Convert to cards on small screens
```

### Chart Container Component
```
- Card wrapper with title
- Chart legend (interactive, toggle series)
- Tooltip on hover with detailed data
- Responsive sizing
- Loading state skeleton
```

### Implementation Phase Card
```
- Timeline indicator (vertical line connecting cards)
- Phase number badge (accent color)
- Duration label
- Collapsible details
- Deliverables checklist
- Status indicator (if showing progress)
```

### Risk Matrix Card
```
- Risk title and category
- Probability badge (Low/Medium/High)
- Impact badge (Low/Medium/High)
- Expandable mitigation strategy
- Visual risk score indicator
```

---

## Data Structure Example

```typescript
interface Scenario {
  name: 'conservative' | 'moderate' | 'aggressive';
  paybackPeriod: string;
  roi3Year: string;
  year1Revenue: string;
  year1RevenuePercent: string;
  tcoSavings: string;
  npv: string;
  revenueProjection: {
    year0: number;
    year1: number;
    year2: number;
    year3: number;
  };
  grossProfitImpact: {
    year1: number;
    year2: number;
    year3: number;
    total: number;
  };
  netBenefit: string;
  roiPercent: string;
}

interface CostBreakdown {
  category: string;
  year1: number;
  year2: number;
  year3: number;
  total: number;
}

interface CashFlow {
  month: number;
  investment: number;
  platformCosts: number;
  returns: number;
  netCashFlow: number;
  cumulative: number;
}
```

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  - Single column layout
  - Stacked cards
  - Simplified charts
  - Hamburger navigation
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  - 2-column grid for cards
  - Simplified data tables
  - Collapsible sidebar navigation
}

/* Desktop */
@media (min-width: 1025px) {
  - Full multi-column layouts
  - Sticky sidebar navigation
  - Complex data visualizations
  - Side-by-side comparisons
}
```

---

## Performance Considerations

- **Lazy load** charts and heavy components
- **Code splitting** by route/section
- **Optimize images**: WebP format, responsive sizes
- **Minimize bundle size**: Tree-shaking, dynamic imports
- **Cache data**: Local storage for scenario selections
- **Smooth scrolling**: Use CSS `scroll-behavior: smooth` with JS fallback
- **Virtualize long lists**: For large data tables

---

## Special Features to Implement

### 1. Scenario Comparator Tool
Allow users to toggle between all three scenarios simultaneously with:
- Side-by-side comparison view
- Highlight differences with color coding
- Interactive sliders to create custom scenarios (bonus feature)

### 2. ROI Calculator
Interactive calculator where users can:
- Adjust input assumptions (growth rates, costs)
- See real-time impact on ROI, payback, NPV
- Save custom scenarios

### 3. Export Functionality
- **Print-friendly view**: Clean, paginated layout
- **PDF export**: Generate downloadable business case
- **Share link**: URL with selected scenario parameters

### 4. Executive Summary Generator
- Dynamic summary based on selected scenario
- Key talking points
- One-page snapshot view

---

## CRITICAL: Financial Credibility Requirements

### This Must Be a Calculator Tool, Not Just a Presentation

**Primary Purpose**: Allow customers to input THEIR OWN numbers and see customized results.

**Demo Data Standards**:
- ✅ Use conservative, defensible assumptions
- ✅ Show methodology and sources
- ✅ Allow full customization of all inputs
- ✅ Include proper disclaimers
- ❌ Never use inflated marketing numbers
- ❌ Never hide calculations
- ❌ Never guarantee specific results

### Required Features for Credibility:

1. **Interactive Input Fields**
   - Current annual revenue
   - Gross margin percentage
   - Current platform costs
   - Implementation budget
   - Target growth rates (per year)
   - Operational inefficiency costs

2. **Calculation Transparency**
   - "Show Calculations" button/modal
   - Display formulas used
   - Link to methodology documentation
   - Show all assumptions clearly

3. **Proper Disclaimers**
   - Financial projections disclaimer
   - "Results may vary" language
   - "Consult your financial advisor"
   - Industry benchmark sources

4. **Benchmarking Context**
   - "Your growth rate vs. industry average"
   - "Typical payback period: 6-18 months"
   - "Your margin vs. sector median"

5. **Sensitivity Analysis**
   - "What if growth is lower?"
   - "What if costs are higher?"
   - Range of outcomes (best/worst case)

### Sample Disclaimer (Include on Every Page)

```
FINANCIAL PROJECTIONS DISCLAIMER

These projections are estimates based on industry benchmarks and stated 
assumptions. Actual results may vary significantly. All assumptions are 
disclosed for transparency and should be reviewed by your financial advisors.

Past performance of other merchants does not guarantee future results.
```

---

## Content Tone & Messaging

- **Professional and data-driven**: Let numbers speak, back everything with sources
- **Confident but not aggressive**: Present facts, not hype. Acknowledge uncertainty.
- **Executive-focused**: CFO/CEO language - they will scrutinize every number
- **Action-oriented**: Clear next steps and CTAs
- **Risk-aware**: Acknowledge challenges with mitigation plans
- **Transparent**: Show your work, admit limitations, provide context

---

## Sample Micro-copy

### Hero Headlines
- Primary: "Transform Your Commerce Platform"
- Secondary: "Strategic Investment with 107% ROI in 3 Years"
- CTA: "Explore the Business Case"

### Section Headers
- "The Financial Case for Change"
- "From Constraints to Capabilities"
- "Predictable Returns, Strategic Value"
- "Your Path to Modern Commerce"

### Data Labels
- Use clear, non-technical language
- Include context in tooltips
- Provide benchmark comparisons where relevant

---

## Testing Checklist

- [ ] All scenarios display correct data
- [ ] Charts render properly across breakpoints
- [ ] Smooth scroll navigation works
- [ ] Animations don't cause layout shift
- [ ] Print view is clean and readable
- [ ] Mobile experience is optimized
- [ ] Dark theme contrast meets WCAG standards
- [ ] Interactive elements have hover/focus states
- [ ] Data updates smoothly on scenario change
- [ ] Loading states are implemented
- [ ] Error boundaries catch rendering issues

---

## Deliverables Expected

1. **Fully functional React application** with all sections
2. **Responsive design** that works on all devices
3. **Interactive data visualizations** with smooth animations
4. **Clean, maintainable code** with TypeScript
5. **Component documentation** (brief comments)
6. **README** with setup instructions
7. **Deployed version** (Vercel/Netlify) with live URL

---

## Additional Context

This business case is for **P3 Media** (Shopify Platinum Partner) presenting to a mid-market B2B/B2C company considering Shopify migration. The audience is:
- C-level executives (CEO, CFO, CMO)
- Board members
- IT/Operations leadership

The presentation should inspire confidence, demonstrate thorough analysis, and make the decision easy by clearly showing financial benefits, risk mitigation, and strategic value.

**Key message to convey**: This is not just a technology upgrade—it's a strategic investment that pays for itself in 6-8 months and unlocks years of growth potential.

---

## Getting Started

Please create a modern, professional, and highly interactive web application following this specification. Focus on:

1. **Visual impact**: Make the data compelling and easy to understand
2. **User experience**: Smooth, intuitive navigation through the business case
3. **Interactivity**: Let users explore scenarios and see the impact
4. **Professional polish**: This needs to impress executives and win approvals

Use best practices for React development, ensure type safety with TypeScript, and create a memorable experience that makes the business case impossible to ignore.

---

**Note**: Feel free to suggest improvements or additions that would enhance the presentation. The goal is to create the most compelling digital business case possible.
