type Props = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function SoundToggle({ enabled, onChange }: Props) {
  return (
    <div>
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium text-gray-700">音を鳴らす</span>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(!enabled);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer active:scale-95 ${
            enabled ? 'bg-blue-600' : 'bg-gray-300'
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
