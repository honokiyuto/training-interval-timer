import { ControlButtons } from './components/ControlButtons';
import { DurationSlider } from './components/DurationSlider';
import { SoundToggle } from './components/SoundToggle';
import { StartOrderSelector } from './components/StartOrderSelector';
import { TimerRing } from './components/TimerRing';
import { useBeep } from './hooks/useBeep';
import { useIntervalTimer } from './hooks/useIntervalTimer';
import { useSettings } from './hooks/useSettings';
import { useWakeLock } from './hooks/useWakeLock';

export default function App() {
  const settings = useSettings();
  const beep = useBeep(settings.soundEnabled);
  const timer = useIntervalTimer(settings, beep);
  useWakeLock(timer.isRunning);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <TimerRing
          state={timer.state}
          seconds={
            timer.state === 'idle'
              ? settings.countdownSeconds
              : timer.currentTime
          }
          progress={timer.progress}
        />

        <div className="space-y-4 mb-6">
          <SoundToggle
            enabled={settings.soundEnabled}
            onChange={settings.setSoundEnabled}
          />
          <StartOrderSelector
            startWithInterval={settings.startWithInterval}
            onChange={settings.setStartWithInterval}
            disabled={timer.isRunning}
          />
        </div>

        <div className="space-y-6 mb-8">
          <DurationSlider
            label="カウントダウン"
            value={settings.countdownSeconds}
            color="#3b82f6"
            disabled={timer.isRunning}
            onChange={timer.changeCountdown}
          />
          <DurationSlider
            label="インターバル"
            value={settings.intervalSeconds}
            color="#10b981"
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
    </div>
  );
}
