import { useRef } from 'react';
import bg from './assets/bg.webp';
import { ControlButtons } from './components/ControlButtons';
import { DurationSlider } from './components/DurationSlider';
import { SoundToggle } from './components/SoundToggle';
import { StartOrderSelector } from './components/StartOrderSelector';
import { TimerRing } from './components/TimerRing';
import { useBeep } from './hooks/useBeep';
import { useIntervalTimer } from './hooks/useIntervalTimer';
import { glass, useLiquidGlass } from './hooks/useLiquidGlass';
import { useSettings } from './hooks/useSettings';
import { useWakeLock } from './hooks/useWakeLock';

// ガラス要素はrootの直接の子である必要があるため、全要素をrootのグリッドに直接並べる。
// 列: 余白 | 左 | すき間 | 右 | 余白（カード内の左右2ボタンと下部2ボタンで共有）
// 行: 1タイマー / 2 Soundカード / 3開始順序トグル（カードなし） / 4スライダーカード / 5操作ボタン
// カード間は mt-2 で行間（gap-y-2）を広げる。同じカードの板とUIには同じマージンを付けて位置を揃える
// ガラス板は中身を持たない（中身が変わると再キャプチャが走り重くなるため）。
// 板の上のUIは同じグリッドセルに重ねて載せる。
const plate = 'isolate bg-white/10';
const layer = 'relative z-10';

export default function App() {
  const settings = useSettings();
  const beep = useBeep(settings.soundEnabled);
  const timer = useIntervalTimer(settings, beep);
  useWakeLock(timer.isRunning);
  const rootRef = useRef<HTMLDivElement>(null);
  useLiquidGlass(rootRef);

  return (
    <div
      ref={rootRef}
      className="relative grid min-h-dvh grid-cols-[1.5rem_minmax(0,12.5rem)_0.5rem_minmax(0,12.5rem)_1.5rem] place-content-center gap-y-2 p-4 text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.2)]"
    >
      <img
        src={bg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        {...glass({ cornerRadius: 144 })}
        className={`${plate} col-span-full row-start-1 mb-4 size-72 justify-self-center rounded-full`}
      />
      <div
        className={`${layer} col-span-full row-start-1 mb-4 place-self-center`}
      >
        <TimerRing
          state={timer.state}
          seconds={
            timer.state === 'idle'
              ? settings.countdownSeconds
              : timer.currentTime
          }
          progress={timer.progress}
        />
      </div>

      <div
        {...glass({ cornerRadius: 28 })}
        className={`${plate} col-span-full row-start-2 rounded-[28px]`}
      />
      <div className={`${layer} col-[2/5] row-start-2 py-4`}>
        <SoundToggle
          enabled={settings.soundEnabled}
          onChange={settings.setSoundEnabled}
        />
      </div>

      <StartOrderSelector
        startWithInterval={settings.startWithInterval}
        onChange={settings.setStartWithInterval}
        disabled={timer.isRunning}
      />

      <div
        {...glass({ cornerRadius: 28 })}
        className={`${plate} col-span-full row-start-4 mt-2 rounded-[28px]`}
      />
      <div className={`${layer} col-[2/5] row-start-4 mt-2 space-y-5 py-5`}>
        <DurationSlider
          label="Countdown"
          value={settings.countdownSeconds}
          color="#60a5fa"
          disabled={timer.isRunning}
          onChange={timer.changeCountdown}
        />
        <DurationSlider
          label="Interval"
          value={settings.intervalSeconds}
          color="#34d399"
          disabled={timer.isRunning}
          onChange={timer.changeInterval}
        />
      </div>

      <ControlButtons
        isIdle={timer.state === 'idle'}
        isRunning={timer.isRunning}
        onStart={timer.start}
        onStop={timer.stop}
        onResume={timer.resume}
        onReset={timer.reset}
      />
    </div>
  );
}
