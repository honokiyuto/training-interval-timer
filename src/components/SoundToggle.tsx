type Props = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function SoundToggle({ enabled, onChange }: Props) {
  return (
    <div>
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium text-white">Sound</span>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(!enabled);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer active:scale-95 ${
            enabled ? 'bg-emerald-400' : 'bg-black/25'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
              enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </label>
    </div>
  );
}
