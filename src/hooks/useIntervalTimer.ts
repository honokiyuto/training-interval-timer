import { useEffect, useRef, useState } from 'react';
import type { Beep } from './useBeep';
import type { Settings } from './useSettings';

export type TimerState = 'idle' | 'countdown' | 'interval';

export function useIntervalTimer(settings: Settings, beep: Beep) {
  const {
    countdownSeconds,
    setCountdownSeconds,
    intervalSeconds,
    setIntervalSeconds,
    startWithInterval,
  } = settings;
  const { ensureAudioContext, playBeep, playBeeps } = beep;

  const [currentTime, setCurrentTime] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const lastPlayedSecondRef = useRef<number | null>(null);

  // タイマーのロジック
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      lastPlayedSecondRef.current = null;
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev - 1;

        // 3秒前からカウントダウンの音を鳴らす
        if (
          newTime >= 1 &&
          newTime <= 3 &&
          lastPlayedSecondRef.current !== newTime
        ) {
          playBeep(1000, 100);
          lastPlayedSecondRef.current = newTime;
        }

        if (newTime <= 0) {
          // カウントダウン終了（インターバル開始）- 1回の音
          if (state === 'countdown') {
            playBeep(800, 300);
            setState('interval');
            lastPlayedSecondRef.current = null;
            return intervalSeconds;
          }
          // インターバル終了（カウントダウン開始）- 連続2回の音
          if (state === 'interval') {
            playBeeps(2, 600, 300, 200);
            setState('countdown');
            lastPlayedSecondRef.current = null;
            return countdownSeconds;
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isRunning,
    state,
    countdownSeconds,
    intervalSeconds,
    playBeep,
    playBeeps,
  ]);

  const start = async () => {
    // モバイル対応: タイマー開始時にAudioContextを有効化
    await ensureAudioContext();
    setIsRunning(true);
    if (startWithInterval) {
      setState('interval');
      setCurrentTime(intervalSeconds);
    } else {
      setState('countdown');
      setCurrentTime(countdownSeconds);
    }
    lastPlayedSecondRef.current = null;
  };

  // 一時停止: 状態と残り時間は保持する
  const stop = () => {
    setIsRunning(false);
  };

  const resume = async () => {
    await ensureAudioContext();
    setIsRunning(true);
  };

  const reset = () => {
    setIsRunning(false);
    setState('idle');
    setCurrentTime(0);
  };

  // 停止中に同じフェーズの秒数を変えたら残り時間にも反映する
  const changeCountdown = (val: number) => {
    setCountdownSeconds(val);
    if (state === 'countdown' && !isRunning) setCurrentTime(val);
  };

  const changeInterval = (val: number) => {
    setIntervalSeconds(val);
    if (state === 'interval' && !isRunning) setCurrentTime(val);
  };

  const total =
    state === 'countdown'
      ? countdownSeconds
      : state === 'interval'
        ? intervalSeconds
        : 0;
  const progress = total > 0 ? (currentTime / total) * 100 : 100;

  return {
    state,
    currentTime,
    isRunning,
    progress,
    start,
    stop,
    resume,
    reset,
    changeCountdown,
    changeInterval,
  };
}
