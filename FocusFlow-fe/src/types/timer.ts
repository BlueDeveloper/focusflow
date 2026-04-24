export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  totalRounds: number;
  autoStartBreak: boolean;
  autoStartFocus: boolean;
}

export interface FocusSession {
  id: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  completedRounds: number;
  date: string; // YYYY-MM-DD
}

export interface DailyFocus {
  date: string; // YYYY-MM-DD
  totalSeconds: number;
  sessions: number;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastFocusDate: string | null; // YYYY-MM-DD
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  totalRounds: 4,
  autoStartBreak: true,
  autoStartFocus: false,
};
