import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

// Format number with commas
function formatNumberWithCommas(value: number | string): string {
  if (value === '' || value === null || value === undefined) return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US', { maximumFractionDigits: 10 });
}

// Parse formatted number back to raw number
function parseFormattedNumber(value: string): number {
  if (!value) return 0;
  // Remove commas and parse
  const cleanedValue = value.replace(/,/g, '');
  const parsed = parseFloat(cleanedValue);
  return isNaN(parsed) ? 0 : parsed;
}

interface FormattedNumberInputProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  step?: string;
  decimals?: number;
}

export const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '0',
  prefix = '',
  suffix = '',
  step = '1',
  decimals,
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Update display value when prop value changes (but only when not focused)
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value === 0 ? '' : formatNumberWithCommas(value));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string
    if (inputValue === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Remove commas for validation
    const rawValue = inputValue.replace(/,/g, '');

    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(rawValue)) {
      return;
    }

    // Update display with commas as user types
    const parts = rawValue.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;

    setDisplayValue(formatted);
    const parsed = parseFormattedNumber(formatted);
    onChange(parsed);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Re-format on blur to ensure consistent formatting
    if (value > 0) {
      setDisplayValue(formatNumberWithCommas(value));
    } else {
      setDisplayValue('');
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Select all on focus for easy replacement
    setTimeout(() => e.target.select(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
  };

  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10">{prefix}</span>}
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={clsx(className, prefix && 'pl-7', suffix && 'pr-8')}
        placeholder={placeholder}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10">{suffix}</span>}
    </div>
  );
};

export { formatNumberWithCommas, parseFormattedNumber };
