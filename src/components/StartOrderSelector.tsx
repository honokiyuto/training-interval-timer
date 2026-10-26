type Props = {
  startWithInterval: boolean;
  onChange: (startWithInterval: boolean) => void;
  disabled: boolean;
};

const buttonClass = (selected: boolean, selectedClass: string) =>
  `flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
    selected ? selectedClass : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  } disabled:opacity-50 disabled:cursor-not-allowed`;

export function StartOrderSelector({
  startWithInterval,
  onChange,
  disabled,
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        開始順序
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(false)}
          disabled={disabled}
          className={buttonClass(!startWithInterval, 'bg-blue-600 text-white')}
        >
          カウントダウンから
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          disabled={disabled}
          className={buttonClass(startWithInterval, 'bg-green-600 text-white')}
        >
          インターバルから
        </button>
      </div>
    </div>
  );
}
