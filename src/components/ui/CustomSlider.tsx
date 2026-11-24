import React from 'react';

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  valueSuffix?: string;
  disabled?: boolean;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  valueSuffix = '',
  disabled = false,
}) => {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${disabled ? 'opacity-50' : ''}`}>
      {label && (
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-[#475569] font-medium">{label}</span>
          <span className="font-mono tabular-nums text-[#2563EB] font-semibold">
            {value}
            {valueSuffix}
          </span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full"
            style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#2563EB] shadow-sm pointer-events-none"
          style={{ left: `${Math.max(0, Math.min(100, pct))}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label ?? 'Slider'}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};
