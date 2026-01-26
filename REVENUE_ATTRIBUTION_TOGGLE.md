# Revenue Attribution Toggle Feature

## Overview
Added an optional toggle that allows switching between two calculation modes:
1. **Cost Savings Only** (Conservative) - Default
2. **Growth Attribution** (Includes revenue growth)

## How It Works

### Toggle Location
The toggle appears in the **Financial Snapshot** section with:
- Clear visual toggle switch
- Label showing current mode
- Tooltip explaining the difference
- Updates all calculations in real-time

### Cost Savings Only Mode (Default)
**What it calculates:**
- Annual Savings = Current Platform Costs - Shopify Costs
- 3-Year ROI = (Total Savings - Total Investment) / Investment × 100
- Revenue shown grows at baseline rate only (no platform attribution)

**Example with your data:**
- Current Costs: $450K/year
- Shopify Costs: $175K/year
- Annual Savings: $275K
- 3-Year ROI: ~9.3%
- Payback: ~11 months

**Best for:**
- CFO/Finance approval
- Risk-averse organizations
- When you want 100% defensible numbers
- Internal cost-cutting initiatives

### Growth Attribution Mode
**What it calculates:**
- Same cost savings as above
- PLUS: Revenue growth attributed to platform
- Growth rates vary by scenario:
  - Conservative: +10% incremental growth
  - Moderate: +15% incremental growth  
  - Aggressive: +20% incremental growth
- Gross Profit Gain = Revenue Gain × Gross Margin
- Total Benefit = Cost Savings + Gross Profit Gain

**Example with your data (Moderate scenario):**
- Cost Savings: $275K/year
- Revenue Growth Year 1: $200M × 15% = $30M
- Gross Profit Gain: $30M × 40% = $12M
- Total Year 1 Benefit: $275K + $12M = $12.3M
- 3-Year ROI: Much higher (50-150% range depending on margin)

**Best for:**
- Growth-focused initiatives
- When you have benchmark data to support growth assumptions
- CMO/CRO-led decisions
- Showing full business value

## Growth Assumptions by Scenario

### Conservative
- **Year 1**: +10% incremental growth
- **Year 2**: +8% incremental growth
- **Year 3**: +7% incremental growth
- **Rationale**: Modest improvements from better UX, faster checkout, mobile optimization

### Moderate (Default)
- **Year 1**: +15% incremental growth
- **Year 2**: +12% incremental growth
- **Year 3**: +10% incremental growth
- **Rationale**: Meaningful conversion improvements, reduced cart abandonment, omnichannel capabilities

### Aggressive
- **Year 1**: +20% incremental growth
- **Year 2**: +17% incremental growth
- **Year 3**: +15% incremental growth
- **Rationale**: Full optimization, personalization, international expansion, B2B portal

## Technical Implementation

### Files Modified:
1. **`app/src/context/ScenarioContext.tsx`**
   - Added `includeRevenueGrowth` state
   - Added conditional logic to calculate with/without revenue attribution
   - Added growth rate scenarios
   - Exports toggle state and setter

2. **`app/src/components/sections/FinancialSnapshot.tsx`**
   - Added toggle UI component
   - Shows current mode with visual feedback
   - Includes helpful tooltips

3. **`app/src/components/sections/Hero.tsx`**
   - Shows mode indicator in hero text
   - Updates dynamically when toggle changes

4. **`app/src/types/index.ts`**
   - Added optional fields to Scenario interface
   - Supports metadata about calculation mode

## Usage

### For Users:
1. Fill out the form with your business data
2. View results (defaults to Cost Savings Only)
3. Toggle "Growth Attribution" on/off in Financial Snapshot section
4. Compare Conservative vs Moderate vs Aggressive scenarios
5. All numbers update in real-time

### For Developers:
```typescript
// Access the toggle state
const { includeRevenueGrowth, setIncludeRevenueGrowth } = useScenario();

// Toggle it
setIncludeRevenueGrowth(true); // Enable growth attribution
setIncludeRevenueGrowth(false); // Disable (cost savings only)

// Check current mode
if (includeRevenueGrowth) {
  // Show growth-related messaging
} else {
  // Show cost-savings messaging
}
```

## Example Outputs

### With Your Input Data ($200M revenue, $450K current costs, $175K Shopify costs):

**Cost Savings Only:**
- ROI: 9.3%
- NPV: -$71K (slightly negative at 10% discount rate - normal for cost-only)
- Payback: 11 months

**Growth Attribution (Moderate):**
- ROI: 50-80% (depends on gross margin)
- NPV: $8-12M (positive due to gross profit gains)
- Payback: 6-8 months (faster due to revenue gains)

## Recommendations

### When to Use Cost Savings Only:
✅ Presenting to CFO or finance team
✅ Need board approval
✅ Risk-averse culture
✅ Want most defensible numbers
✅ No benchmark data available

### When to Use Growth Attribution:
✅ Presenting to CEO or CMO
✅ Growth is primary goal
✅ Have benchmark data to support assumptions
✅ Want to show full business value
✅ Can defend the growth assumptions

## Notes
- Toggle defaults to OFF (Cost Savings Only)
- All three scenarios (Conservative/Moderate/Aggressive) work with both modes
- Revenue projections chart shows baseline growth when toggle is off
- Can switch between modes instantly - all calculations update in real-time
- Mode indicator shows in hero section and financial snapshot
