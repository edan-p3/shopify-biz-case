import {
  calculateRevenueProjection,
  calculateROI,
  calculateCashFlow,
  calculateTCO,
  calculateConversionImpact,
  calculateAbandonedCartRecovery,
} from '../../utils/calculations';

describe('Financial Calculations', () => {
  describe('calculateRevenueProjection', () => {
    it('should calculate revenue projections correctly', () => {
      const projections = calculateRevenueProjection(
        1500000,
        [0.20, 0.20, 0.20],
        3
      );

      expect(projections).toHaveLength(4); // Year 0 + 3 years
      expect(projections[0].revenue).toBe(1500000);
      expect(projections[1].revenue).toBe(1800000);
      expect(projections[2].revenue).toBe(2160000);
      expect(projections[3].revenue).toBe(2592000);
    });

    it('should handle negative growth rates', () => {
      const projections = calculateRevenueProjection(
        1500000,
        [-0.1, -0.05, 0],
        3
      );

      expect(projections[1].revenue).toBe(1350000);
      expect(projections[2].revenue).toBe(1282500);
      expect(projections[3].revenue).toBe(1282500);
    });
  });

  describe('calculateROI', () => {
    it('should calculate ROI metrics correctly', () => {
      const result = calculateROI([90000, 108000, 129600], 117200, 0.10);

      expect(result.roi3Year).toBeGreaterThan(0);
      expect(result.paybackPeriod).toBeGreaterThan(0);
      expect(result.npv).toBeDefined();
      expect(result.irr).toBeDefined();
    });

    it('should calculate payback period within reasonable range', () => {
      const result = calculateROI([90000, 108000, 129600], 50000, 0.10);

      expect(result.paybackPeriod).toBeGreaterThan(0);
      expect(result.paybackPeriod).toBeLessThan(36); // Less than 3 years
    });
  });

  describe('calculateCashFlow', () => {
    it('should generate monthly cash flow for 36 months', () => {
      const cashFlow = calculateCashFlow(
        [50000],
        [18000, 18000, 18000],
        [90000, 108000, 129600],
        36
      );

      expect(cashFlow).toHaveLength(36);
      expect(cashFlow[0].month).toBe(1);
      expect(cashFlow[35].month).toBe(36);
    });

    it('should have cumulative cash flow increasing over time', () => {
      const cashFlow = calculateCashFlow(
        [50000],
        [18000, 18000, 18000],
        [90000, 108000, 129600],
        36
      );

      // Later months should have higher cumulative than earlier months
      expect(cashFlow[35].cumulative).toBeGreaterThan(cashFlow[0].cumulative);
    });
  });

  describe('calculateTCO', () => {
    it('should calculate TCO comparison correctly', () => {
      const result = calculateTCO(
        30000,
        {
          revenueLeakage: 45000,
          operationalInefficiency: 60000,
          integrationMaintenance: 24000,
          manualProcessing: 36000,
        },
        18000,
        50000,
        3
      );

      expect(result.currentState.total).toBeGreaterThan(0);
      expect(result.shopifyState.total).toBeGreaterThan(0);
      expect(result.savings.total).toBeDefined();
    });
  });

  describe('calculateConversionImpact', () => {
    it('should calculate conversion impact correctly', () => {
      const result = calculateConversionImpact(0.02, 0.03, 100000, 85);

      expect(result.additionalOrders).toBeGreaterThan(0);
      expect(result.revenueImpact).toBeGreaterThan(0);
      expect(result.improvementPercent).toBe(50); // 50% improvement
    });
  });

  describe('calculateAbandonedCartRecovery', () => {
    it('should calculate abandoned cart recovery opportunity', () => {
      const result = calculateAbandonedCartRecovery(1500000, 0.70, 0.15);

      expect(result.potentialRevenue).toBeGreaterThan(0);
      expect(result.recoveredRevenue).toBeGreaterThan(0);
      expect(result.lostRevenue).toBeGreaterThan(0);
      expect(result.recoveredRevenue + result.lostRevenue).toBeCloseTo(
        result.potentialRevenue,
        0
      );
    });
  });
});
