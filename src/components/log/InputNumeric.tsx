'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

interface InputNumericProps {
  value: number;
  onValidChange: (value: number) => void;
  className?: string;
  placeholder?: string;
  allowDecimals?: boolean;
}

export default function InputNumeric({
  value,
  onValidChange,
  className,
  placeholder = '',
  allowDecimals = false,
}: Readonly<InputNumericProps>) {
  const [inputValue, setInputValue] = useState<string>(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const isValidNumeric = (val: string) => {
    const regex = allowDecimals ? /^\d+(\.\d{0,2})?$/ : /^\d+$/;
    return regex.test(val);
  };

  const parse = (val: string) =>
    allowDecimals ? parseFloat(val) : parseInt(val, 10);

  return (
    <Input
      type="text"
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      value={inputValue}
      placeholder={placeholder}
      className={className}
      onChange={(e) => {
        const val = e.target.value;
        setInputValue(val);

        if (isValidNumeric(val)) {
          const parsed = parse(val);
          if (parsed >= 0) {
            onValidChange(parsed);
          }
        }
      }}
      onBlur={() => {
        const parsed = parse(inputValue);
        if (!isValidNumeric(inputValue) || Number.isNaN(parsed) || parsed < 0) {
          setInputValue('0');
          onValidChange(0);
        }
      }}
    />
  );
}
