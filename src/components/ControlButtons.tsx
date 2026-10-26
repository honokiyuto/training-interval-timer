import { Pause, Play, RotateCcw } from 'lucide-react';
import { clearGlass } from '../hooks/useLiquidGlass';

type Props = {
  isIdle: boolean;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onResume: () => void;
  onReset: () => void;
};

// ガラスはinit時に登録した要素にしか効かないので、ボタンは常に2つ置き
// 状態によってラベルと動作だけを切り替える
const glassButton = (disabled: boolean) =>
  clearGlass(56, { button: !disabled });

const base =
  'isolate mt-4 flex h-14 items-center justify-center gap-2 rounded-full font-semibold text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.4)] [&>svg]:drop-shadow-[0_1px_2px_rgb(0_0_0/0.4)] disabled:opacity-40 disabled:cursor-not-allowed';

export function ControlButtons({
  isIdle,
  isRunning,
  onStart,
  onStop,
  onResume,
  onReset,
}: Props) {
  const [label, Icon, onClick] = isIdle
    ? (['Start', Play, onStart] as const)
    : isRunning
      ? (['Pause', Pause, onStop] as const)
      : (['Resume', Play, onResume] as const);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        {...glassButton(false)}
        className={`${base} col-[1/3] row-start-5`}
      >
        <Icon className="size-5 fill-current" />
        {label}
      </button>
      <button
        type="button"
        onClick={onReset}
        disabled={isIdle}
        {...glassButton(isIdle)}
        className={`${base} col-[4/6] row-start-5`}
      >
        <RotateCcw className="size-5" />
        Reset
      </button>
    </>
  );
}
