type Props = {
  isIdle: boolean;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onResume: () => void;
  onReset: () => void;
};

const base =
  'flex-1 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm';
const blue = `${base} bg-blue-600 hover:bg-blue-700`;
const red = `${base} bg-red-600 hover:bg-red-700`;
const gray = `${base} bg-gray-600 hover:bg-gray-700`;

export function ControlButtons({
  isIdle,
  isRunning,
  onStart,
  onStop,
  onResume,
  onReset,
}: Props) {
  return (
    <div className="flex gap-3">
      {isIdle ? (
        <button onClick={onStart} className={blue}>
          開始
        </button>
      ) : (
        <>
          {isRunning ? (
            <button onClick={onStop} className={red}>
              停止
            </button>
          ) : (
            <button onClick={onResume} className={blue}>
              再開
            </button>
          )}
          <button onClick={onReset} className={gray}>
            リセット
          </button>
        </>
      )}
    </div>
  );
}
