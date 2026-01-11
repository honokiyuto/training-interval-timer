import { useState, useEffect, useRef } from 'react';

type TimerState = 'idle' | 'countdown' | 'interval';

export default function App() {
  const [countdownSeconds, setCountdownSeconds] = useState(10);
  const [intervalSeconds, setIntervalSeconds] = useState(10);
  const [currentTime, setCurrentTime] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startWithInterval, setStartWithInterval] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayedSecondRef = useRef<number | null>(null);

  // AudioContextの初期化
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // 音を鳴らす関数
  const playBeep = (
    frequency: number = 800,
    duration: number = 200,
    delay: number = 0
  ) => {
    if (!soundEnabled || !audioContextRef.current) return;

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
  };

  // 連続で音を鳴らす関数
  const playBeeps = (
    count: number,
    frequency: number = 800,
    duration: number = 200,
    interval: number = 150
  ) => {
    for (let i = 0; i < count; i++) {
      playBeep(frequency, duration, i * interval);
    }
  };

  // URLクエリパラメータから初期値を読み込む
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const countdown = params.get('countdown');
    const interval = params.get('interval');
    const sound = params.get('sound');
    const startWith = params.get('startWith');
    if (countdown) {
      const val = parseInt(countdown, 10);
      if (!isNaN(val) && val >= 0 && val <= 120) {
        setCountdownSeconds(val);
      }
    }
    if (interval) {
      const val = parseInt(interval, 10);
      if (!isNaN(val) && val >= 0 && val <= 120) {
        setIntervalSeconds(val);
      }
    }
    if (sound !== null) {
      setSoundEnabled(sound === 'true');
    }
    if (startWith !== null) {
      setStartWithInterval(startWith === 'interval');
    }
  }, []);

  // URLクエリパラメータを更新
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('countdown', countdownSeconds.toString());
    params.set('interval', intervalSeconds.toString());
    params.set('sound', soundEnabled.toString());
    params.set('startWith', startWithInterval ? 'interval' : 'countdown');
    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [countdownSeconds, intervalSeconds, soundEnabled, startWithInterval]);

  // Wake Lock APIで画面を常にONに保つ
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isRunning) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          wakeLockRef.current.addEventListener('release', () => {
            console.log('Wake Lock released');
          });
        } catch (err) {
          console.error('Wake Lock request failed:', err);
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch (err) {
          console.error('Wake Lock release failed:', err);
        }
      }
    };

    if (isRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isRunning]);

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

        // 3秒前になったらカウントダウンの音を鳴らす
        if (newTime === 3 && lastPlayedSecondRef.current !== 3) {
          playBeep(1000, 100); // カウントダウン音
          lastPlayedSecondRef.current = 3;
        } else if (newTime === 2 && lastPlayedSecondRef.current !== 2) {
          playBeep(1000, 100);
          lastPlayedSecondRef.current = 2;
        } else if (newTime === 1 && lastPlayedSecondRef.current !== 1) {
          playBeep(1000, 100);
          lastPlayedSecondRef.current = 1;
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
  }, [isRunning, state, countdownSeconds, intervalSeconds]);

  const handleStart = () => {
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

  const handleStop = () => {
    setIsRunning(false);
    setState('idle');
    setCurrentTime(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setState('idle');
    setCurrentTime(0);
  };

  const getProgress = () => {
    if (state === 'idle') {
      return 100;
    }
    if (state === 'countdown' && countdownSeconds > 0) {
      return (currentTime / countdownSeconds) * 100;
    }
    if (state === 'interval' && intervalSeconds > 0) {
      return (currentTime / intervalSeconds) * 100;
    }
    return 100;
  };

  const progress = getProgress();
  const circumference = 2 * Math.PI * 90; // 半径90の円周
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* メインタイマー表示 */}
        <div className="relative flex items-center justify-center mb-12">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="90"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="90"
              stroke={
                state === 'countdown'
                  ? '#3b82f6'
                  : state === 'interval'
                    ? '#10b981'
                    : '#9ca3af'
              }
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-light text-gray-900 mb-2">
              {state === 'idle' ? countdownSeconds : currentTime}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              {state === 'countdown'
                ? 'カウントダウン'
                : state === 'interval'
                  ? 'インターバル'
                  : '準備中'}
            </div>
          </div>
        </div>

        {/* 設定 */}
        <div className="space-y-4 mb-6">
          {/* 音の設定 - トグルスイッチ */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">
                音を鳴らす
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={soundEnabled}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSoundEnabled(!soundEnabled);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer active:scale-95 ${
                  soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* 開始順序の選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              開始順序
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStartWithInterval(false)}
                disabled={isRunning}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  !startWithInterval
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                カウントダウンから
              </button>
              <button
                type="button"
                onClick={() => setStartWithInterval(true)}
                disabled={isRunning}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  startWithInterval
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                インターバルから
              </button>
            </div>
          </div>
        </div>

        {/* スライダーコントロール */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カウントダウン: {countdownSeconds}秒
            </label>
            <input
              type="range"
              min="0"
              max="120"
              value={countdownSeconds}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setCountdownSeconds(val);
                if (state === 'countdown' && !isRunning) {
                  setCurrentTime(val);
                }
              }}
              disabled={isRunning}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(countdownSeconds / 120) * 100}%, #e5e7eb ${(countdownSeconds / 120) * 100}%, #e5e7eb 100%)`,
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              インターバル: {intervalSeconds}秒
            </label>
            <input
              type="range"
              min="0"
              max="120"
              value={intervalSeconds}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setIntervalSeconds(val);
                if (state === 'interval' && !isRunning) {
                  setCurrentTime(val);
                }
              }}
              disabled={isRunning}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(intervalSeconds / 120) * 100}%, #e5e7eb ${(intervalSeconds / 120) * 100}%, #e5e7eb 100%)`,
              }}
            />
          </div>
        </div>

        {/* コントロールボタン */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              開始
            </button>
          ) : (
            <>
              <button
                onClick={handleStop}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                停止
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                リセット
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
