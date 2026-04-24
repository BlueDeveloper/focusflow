import { create } from 'zustand';
import { Vibration } from 'react-native';
import {
  type TimerPhase,
  type TimerStatus,
  type TimerSettings,
  type FocusSession,
  DEFAULT_TIMER_SETTINGS,
} from '@/types/timer';
import { StorageKeys, getJSON, setJSON } from '@/services/storage';

interface TimerState {
  // Timer state
  phase: TimerPhase;
  status: TimerStatus;
  remainingSeconds: number;
  currentRound: number;
  settings: TimerSettings;

  // Session tracking
  sessionStartedAt: number | null;
  todayFocusSeconds: number;
  todayDate: string;

  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  loadFromStorage: () => void;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getPhaseSeconds(phase: TimerPhase, settings: TimerSettings): number {
  switch (phase) {
    case 'focus':
      return settings.focusMinutes * 60;
    case 'shortBreak':
      return settings.shortBreakMinutes * 60;
    case 'longBreak':
      return settings.longBreakMinutes * 60;
  }
}

export const useTimerStore = create<TimerState>((set, get) => ({
  phase: 'focus',
  status: 'idle',
  remainingSeconds: DEFAULT_TIMER_SETTINGS.focusMinutes * 60,
  currentRound: 1,
  settings: DEFAULT_TIMER_SETTINGS,
  sessionStartedAt: null,
  todayFocusSeconds: 0,
  todayDate: getTodayDate(),

  start: () => {
    const { phase, settings } = get();
    set({
      status: 'running',
      remainingSeconds: getPhaseSeconds(phase, settings),
      sessionStartedAt: phase === 'focus' ? Date.now() : null,
    });
  },

  pause: () => {
    set({ status: 'paused' });
  },

  resume: () => {
    set({ status: 'running' });
  },

  reset: () => {
    const { settings } = get();
    set({
      phase: 'focus',
      status: 'idle',
      remainingSeconds: settings.focusMinutes * 60,
      currentRound: 1,
      sessionStartedAt: null,
    });
  },

  skip: () => {
    const state = get();
    const nextState = getNextPhase(state);
    set(nextState);
  },

  tick: () => {
    const state = get();
    if (state.status !== 'running') return;

    // Check if date changed
    const today = getTodayDate();
    if (today !== state.todayDate) {
      set({ todayDate: today, todayFocusSeconds: 0 });
    }

    // Track focus time
    if (state.phase === 'focus') {
      const newTodaySeconds = state.todayFocusSeconds + 1;
      set({ todayFocusSeconds: newTodaySeconds });
      // Save periodically (every 30 seconds)
      if (newTodaySeconds % 30 === 0) {
        setJSON(StorageKeys.TODAY_FOCUS, { date: today, seconds: newTodaySeconds });
      }
    }

    if (state.remainingSeconds <= 1) {
      // Phase complete
      Vibration.vibrate([0, 500, 200, 500]);
      onPhaseComplete(state, set);
      return;
    }

    set({ remainingSeconds: state.remainingSeconds - 1 });
  },

  updateSettings: (partial) => {
    const { settings, status } = get();
    const newSettings = { ...settings, ...partial };
    setJSON(StorageKeys.TIMER_SETTINGS, newSettings);

    const updates: Partial<TimerState> = { settings: newSettings };
    if (status === 'idle') {
      updates.remainingSeconds = newSettings.focusMinutes * 60;
    }
    set(updates);
  },

  loadFromStorage: () => {
    const settings = getJSON<TimerSettings>(StorageKeys.TIMER_SETTINGS, DEFAULT_TIMER_SETTINGS);
    const today = getTodayDate();
    const todayData = getJSON<{ date: string; seconds: number }>(StorageKeys.TODAY_FOCUS, {
      date: today,
      seconds: 0,
    });

    set({
      settings,
      remainingSeconds: settings.focusMinutes * 60,
      todayDate: today,
      todayFocusSeconds: todayData.date === today ? todayData.seconds : 0,
    });
  },
}));

function getNextPhase(state: TimerState): Partial<TimerState> {
  const { phase, currentRound, settings } = state;

  if (phase === 'focus') {
    // Focus complete → break
    const isLongBreak = currentRound >= settings.totalRounds;
    const nextPhase: TimerPhase = isLongBreak ? 'longBreak' : 'shortBreak';
    return {
      phase: nextPhase,
      status: settings.autoStartBreak ? 'running' : 'idle',
      remainingSeconds: getPhaseSeconds(nextPhase, settings),
      sessionStartedAt: null,
    };
  }

  // Break complete → next focus or done
  if (phase === 'longBreak') {
    // Full cycle complete, reset
    return {
      phase: 'focus',
      status: settings.autoStartFocus ? 'running' : 'idle',
      remainingSeconds: getPhaseSeconds('focus', settings),
      currentRound: 1,
      sessionStartedAt: settings.autoStartFocus ? Date.now() : null,
    };
  }

  // Short break → next round
  return {
    phase: 'focus',
    status: settings.autoStartFocus ? 'running' : 'idle',
    remainingSeconds: getPhaseSeconds('focus', settings),
    currentRound: currentRound + 1,
    sessionStartedAt: settings.autoStartFocus ? Date.now() : null,
  };
}

function onPhaseComplete(
  state: TimerState,
  set: (partial: Partial<TimerState>) => void,
): void {
  const { phase, sessionStartedAt } = state;

  // Save focus session
  if (phase === 'focus' && sessionStartedAt) {
    const now = Date.now();
    const session: FocusSession = {
      id: `${now}`,
      startedAt: new Date(sessionStartedAt).toISOString(),
      endedAt: new Date(now).toISOString(),
      durationSeconds: Math.round((now - sessionStartedAt) / 1000),
      completedRounds: state.currentRound,
      date: state.todayDate,
    };
    saveFocusSession(session);

    // Save today's total
    setJSON(StorageKeys.TODAY_FOCUS, {
      date: state.todayDate,
      seconds: state.todayFocusSeconds,
    });
  }

  const nextState = getNextPhase(state);
  set(nextState);
}

function saveFocusSession(session: FocusSession): void {
  const sessions = getJSON<FocusSession[]>(StorageKeys.SESSIONS, []);
  sessions.push(session);
  // Keep last 1000 sessions
  if (sessions.length > 1000) {
    sessions.splice(0, sessions.length - 1000);
  }
  setJSON(StorageKeys.SESSIONS, sessions);
}
