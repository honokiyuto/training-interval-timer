import { glass } from '../hooks/useLiquidGlass';

type Props = {
  startWithInterval: boolean;
  onChange: (startWithInterval: boolean) => void;
  disabled: boolean;
};

// liquid-glass.ybouane.com の背景切替タブと同じ構成:
// 暗い半透明の帯の上を、ガラスのインジケーターが選択位置へスライドする。
// ガラスのカードの中に置くとガラスが二重になって見にくいので、カードには入れず背景の上に直接置く。
// 帯・ガラス・ラベルはroot直下に置く必要があるのでフラグメントで返し、同じグリッドセルに重ねる。
// ラベルはガラスより上（z-10）に置く。ガラスの下だと屈折で歪んで読めず、ライブラリが一度だけ
// 撮影して使い回すため選択状態に応じた見た目の変更も反映されない
const indicatorGlass = (disabled: boolean) =>
  glass({
    cornerRadius: 14,
    zRadius: 14,
    // 選択中が目立つよう他のガラスより明るくする。無効時は暗く沈める
    // （opacityを下げると透明なガラスごと消えてしまうため）
    brightness: disabled ? -0.3 : 0.15,
  });

// 狭い画面（〜360px）では文字を小さくして1行に収める
const labelClass = (selected: boolean) =>
  `whitespace-nowrap text-sm max-[360px]:text-xs transition-colors disabled:cursor-not-allowed ${
    selected ? 'font-semibold text-white' : 'font-medium text-white/75'
  }`;

export function StartOrderSelector({
  startWithInterval,
  onChange,
  disabled,
}: Props) {
  return (
    <>
      <div className="relative col-span-full row-start-3 mt-2 h-12 rounded-2xl bg-black/35" />
      <div
        {...indicatorGlass(disabled)}
        className={`pointer-events-none isolate col-span-full row-start-3 mt-2 h-12 w-1/2 transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          startWithInterval ? 'translate-x-full' : ''
        }`}
      />
      <div
        className={`relative z-10 col-span-full row-start-3 mt-2 grid h-12 grid-cols-2 [text-shadow:0_1px_3px_rgb(0_0_0/0.4)] ${
          disabled ? 'opacity-50' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => onChange(false)}
          disabled={disabled}
          aria-pressed={!startWithInterval}
          className={labelClass(!startWithInterval)}
        >
          Start with Countdown
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          disabled={disabled}
          aria-pressed={startWithInterval}
          className={labelClass(startWithInterval)}
        >
          Start with Interval
        </button>
      </div>
    </>
  );
}
