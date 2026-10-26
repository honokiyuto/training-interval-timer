import type { TimerState } from '../hooks/useIntervalTimer';

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STROKE: Record<TimerState, string> = {
  countdown: '#60a5fa',
  interval: '#34d399',
  idle: 'rgba(255,255,255,0.6)',
};

const LABEL: Record<TimerState, string> = {
  countdown: 'Countdown',
  interval: 'Interval',
  idle: 'Ready',
};

type Props = {
  state: TimerState;
  seconds: number;
  progress: number;
};

export function TimerRing({ state, seconds, progress }: Props) {
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-64 h-64">
        <circle
          cx="128"
          cy="128"
          r={RADIUS}
          stroke="rgba(255,255,255,0.2)"
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
        <div className="text-7xl font-extralight tabular-nums mb-1">{seconds}</div>
        <div className="text-sm font-medium text-white/85 tracking-widest">
          {LABEL[state]}
        </div>
      </div>
    </div>
  );
}
