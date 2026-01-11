import { useState, useEffect, useRef } from 'react';

type TimerState = 'idle' | 'countdown' | 'interval';

export default function App() {
  const [countdownSeconds, setCountdownSeconds] = useState(10);
  const [intervalSeconds, setIntervalSeconds] = useState(10);
  const [currentTime, setCurrentTime] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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
  const playBeep = (frequency: number = 800, duration: number = 200) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  };

  // URLクエリパラメータから初期値を読み込む
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const countdown = params.get('countdown');
    const interval = params.get('interval');
    const sound = params.get('sound');
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
  }, []);

  // URLクエリパラメータを更新
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('countdown', countdownSeconds.toString());
    params.set('interval', intervalSeconds.toString());
    params.set('sound', soundEnabled.toString());
    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [countdownSeconds, intervalSeconds, soundEnabled]);

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
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        if (prev <= 1) {
          // カウントダウン終了
          if (state === 'countdown') {
            playBeep(800, 300); // 高い音
            setState('interval');
            setCurrentTime(intervalSeconds);
            return intervalSeconds;
          }
          // インターバル終了
          if (state === 'interval') {
            playBeep(600, 300); // 少し低い音
            setState('countdown');
            setCurrentTime(countdownSeconds);
            return countdownSeconds;
          }
          return 0;
        }
        return prev - 1;
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
    setState('countdown');
    setCurrentTime(countdownSeconds);
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

        {/* 音の設定 */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">
              音を鳴らす
            </span>
          </label>
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
