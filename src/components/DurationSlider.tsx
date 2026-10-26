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
      <label className="flex justify-between text-sm font-medium text-white mb-3">
        <span className="flex items-center gap-2">
          <i className="size-2 rounded-full" style={{ background: color }} />
          {label}
        </span>
        <span className="tabular-nums">{value}s</span>
      </label>
      <input
        type="range"
        min="0"
        max={MAX_SECONDS}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(to right, #fff 0%, #fff ${percent}%, rgba(0,0,0,0.25) ${percent}%, rgba(0,0,0,0.25) 100%)`,
        }}
      />
    </div>
  );
}
