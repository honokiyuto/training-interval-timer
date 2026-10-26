import type { TimerState } from '../hooks/useIntervalTimer';

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STROKE: Record<TimerState, string> = {
  countdown: '#3b82f6',
  interval: '#10b981',
  idle: '#9ca3af',
};

const LABEL: Record<TimerState, string> = {
  countdown: 'カウントダウン',
  interval: 'インターバル',
  idle: '準備中',
};

type Props = {
  state: TimerState;
  seconds: number;
  progress: number;
};

export function TimerRing({ state, seconds, progress }: Props) {
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="relative flex items-center justify-center mb-12">
      <svg className="transform -rotate-90 w-64 h-64">
        <circle
          cx="128"
          cy="128"
          r={RADIUS}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="128"
          cy="128"
          r={RADIUS}
          stroke={STROKE[state]}
          strokeWidth="8"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-light text-gray-900 mb-2">{seconds}</div>
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          {LABEL[state]}
        </div>
      </div>
    </div>
  );
}
