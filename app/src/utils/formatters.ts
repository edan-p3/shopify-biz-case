export const formatCurrency = (value: number, compact = false) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    notation: compact ? 'compact' : 'standard',
  }).format(value);
};

export const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value / 100); // Input is 4815 for 4815%
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};
