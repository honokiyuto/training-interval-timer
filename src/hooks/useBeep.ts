import { useCallback, useEffect, useRef } from 'react';

const createAudioContext = () =>
  new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)();

export function useBeep(soundEnabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  // setInterval内から呼ばれても最新の値を参照できるようにrefで保持
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // AudioContextの初期化
  useEffect(() => {
    audioContextRef.current = createAudioContext();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // AudioContextを有効化する関数（モバイル対応）
  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  // 音を鳴らす関数
  const playBeep = useCallback(
    async (
      frequency: number = 800,
      duration: number = 200,
      delay: number = 0
    ) => {
      if (!soundEnabledRef.current || !audioContextRef.current) return;

      // モバイル対応: AudioContextがsuspendedの場合はresume
      await ensureAudioContext();

      const audioContext = audioContextRef.current;
      const startTime = audioContext.currentTime + delay / 1000;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        startTime + duration / 1000
      );

      oscillator.start(startTime);
      oscillator.stop(startTime + duration / 1000);
    },
    [ensureAudioContext]
  );

  // 連続で音を鳴らす関数
  const playBeeps = useCallback(
    async (
      count: number,
      frequency: number = 800,
      duration: number = 200,
      interval: number = 150
    ) => {
      // 最初の音を鳴らす前にAudioContextを有効化
      await ensureAudioContext();
      for (let i = 0; i < count; i++) {
        playBeep(frequency, duration, i * interval);
      }
    },
    [ensureAudioContext, playBeep]
  );

  return { ensureAudioContext, playBeep, playBeeps };
}

export type Beep = ReturnType<typeof useBeep>;
