# Calculation Fix Summary

## Problem Identified
The business case calculations were producing unrealistic, inflated numbers by incorrectly attributing revenue growth to the platform migration, resulting in:
- **5,264% ROI** (should be ~9%)
- **5-month payback** (should be ~11 months)
- **$31.9M NPV** (should be -$71K)
- **$4.2M Year 1 ending position** (should be $45K)

## Root Cause
The system was:
1. Attributing ALL revenue growth to the platform migration
2. Using gross profit from revenue growth as "returns" instead of actual cost savings
3. Multiplying revenue by growth rates to calculate ROI

## Solution Implemented
Changed to a **cost-savings approach** that calculates ROI based on:
- **Actual operational cost savings** (Current platform costs - New platform costs)
- **Conservative NPV** using proper discount rates
- **Realistic payback period** based on monthly cash flow

## Correct Calculations (Using Example Data)

### Input Data:
- Total Revenue: $200M
- Current Platform Costs: $450K/year
  - License: $300K
  - Hosting: $50K
  - Maintenance: $50K
  - 3rd Party Apps: $50K
- Implementation Cost: $230K
- Shopify Platform Costs: $175K/year
  - Shopify Plus: $150K
  - Apps: $25K

### Output (ACCURATE):
- **Annual Savings**: $275,000
- **Payback Period**: 11 months
- **3-Year ROI**: 9.27%
- **3-Year NPV**: -$71,116 (at 10% discount rate)
- **Total 3-Year Investment**: $755,000
- **Total 3-Year Savings**: $825,000
- **Net Benefit**: $70,000

## Files Modified

### 1. `/backend/src/utils/calculations.ts`
- Updated `calculateROI()` to use annual savings instead of gross profit
- Updated `calculateCashFlow()` to use actual cost structure
- Updated `calculateTCO()` to properly compare current vs new costs

### 2. `/backend/src/services/calculationService.ts`
- Updated `calculateScenarioMetrics()` to accept current and new platform costs
- Changed from revenue attribution to cost-savings model
- Returns realistic metrics based on operational savings

### 3. `/backend/src/controllers/businessCaseController.ts`
- Updated `create()` method to properly map platform cost inputs
- Now accepts `currentPlatformCosts` and `shopifyPlatformCosts` objects

### 4. `/app/src/data/businessCase.ts`
- Fixed demo data to show realistic numbers
- Updated all ROI, NPV, and cash flow projections
- Changed from 5,264% ROI to 9.27% ROI
- Updated payback from 5 months to 11 months

## Key Principles Applied

### 1. Conservative Approach
- Only count ACTUAL cost savings (current costs - new costs)
- Do NOT attribute revenue growth to platform migration
- Use proper discount rates for NPV calculations

### 2. Realistic Metrics
- **ROI = (Net Benefit / Total Investment) × 100**
  - Net Benefit = 3-Year Savings - 3-Year Investment
  - Example: ($825K - $755K) / $755K = 9.27%

- **Payback Period = Months until cumulative cash flow > 0**
  - Accounts for implementation costs spread over 4 months
  - Accounts for ongoing platform costs
  - Example: 11 months (not 5)

- **NPV = Sum of discounted future cash flows - Initial investment**
  - Uses 10% discount rate (standard)
  - Negative NPV indicates marginal investment from pure cost perspective
  - Example: -$71K (realistic for cost-only analysis)

### 3. Accurate Cash Flow
- Implementation: $230K spread over 4 months ($57.5K/month)
- Current costs: $450K/year ($37.5K/month) - these are "saved"
- New costs: $175K/year ($14.6K/month) - ongoing expense
- Net monthly savings after implementation: $22.9K/month

## Month-by-Month Breakdown

| Month | Implementation | Platform Cost | Savings | Net | Cumulative |
|-------|---------------|---------------|---------|-----|------------|
| 1-4   | -$57.5K       | -$14.6K      | +$37.5K | -$34.6K | Accumulating |
| 5+    | $0            | -$14.6K      | +$37.5K | +$22.9K | Recovering |
| 11    | $0            | -$14.6K      | +$37.5K | +$22.9K | **Breakeven** |
| 12    | $0            | -$14.6K      | +$37.5K | +$22.9K | +$45K total |

## Testing
Created and ran test script (`test-calculations.js`) to verify all calculations match the user's example data exactly.

## Result
All calculations now produce **accurate, realistic, and defensible** business case numbers that represent true operational cost savings rather than speculative revenue attribution.
