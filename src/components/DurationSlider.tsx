import { MAX_SECONDS } from '../hooks/useSettings';

type Props = {
  label: string;
  value: number;
  color: string;
  disabled: boolean;
  onChange: (value: number) => void;
};

export function DurationSlider({
  label,
  value,
  color,
  disabled,
  onChange,
}: Props) {
  const percent = (value / MAX_SECONDS) * 100;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: {value}秒
      </label>
      <input
        type="range"
        min="0"
        max={MAX_SECONDS}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}
