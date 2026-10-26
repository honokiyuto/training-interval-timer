import { useEffect, useState } from 'react';

export const MAX_SECONDS = 120;

const params = () => new URLSearchParams(window.location.search);

const readSeconds = (key: string, fallback: number) => {
  const val = parseInt(params().get(key) ?? '', 10);
  return !isNaN(val) && val >= 0 && val <= MAX_SECONDS ? val : fallback;
};

export function useSettings() {
  // URLクエリパラメータから初期値を読み込む
  const [countdownSeconds, setCountdownSeconds] = useState(() =>
    readSeconds('countdown', 10)
  );
  const [intervalSeconds, setIntervalSeconds] = useState(() =>
    readSeconds('interval', 10)
  );
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const sound = params().get('sound');
    return sound === null ? true : sound === 'true';
  });
  const [startWithInterval, setStartWithInterval] = useState(
    () => params().get('startWith') === 'interval'
  );

  // URLクエリパラメータを更新
  useEffect(() => {
    const p = params();
    p.set('countdown', countdownSeconds.toString());
    p.set('interval', intervalSeconds.toString());
    p.set('sound', soundEnabled.toString());
    p.set('startWith', startWithInterval ? 'interval' : 'countdown');
    window.history.replaceState({}, '', `?${p.toString()}`);
  }, [countdownSeconds, intervalSeconds, soundEnabled, startWithInterval]);

  return {
    countdownSeconds,
    setCountdownSeconds,
    intervalSeconds,
    setIntervalSeconds,
    soundEnabled,
    setSoundEnabled,
    startWithInterval,
    setStartWithInterval,
  };
}

export type Settings = ReturnType<typeof useSettings>;
