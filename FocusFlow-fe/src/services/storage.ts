import { createMMKV, type MMKV } from 'react-native-mmkv';

let _storage: MMKV | null = null;

function getStorage(): MMKV {
  if (!_storage) {
    _storage = createMMKV({ id: 'focusflow' });
  }
  return _storage;
}

export const StorageKeys = {
  TIMER_SETTINGS: 'timer_settings',
  SESSIONS: 'sessions',
  TODAY_FOCUS: 'today_focus',
  STREAK: 'streak',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  SOUND_SETTINGS: 'sound_settings',
} as const;

export function getJSON<T>(key: string, fallback: T): T {
  const raw = getStorage().getString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON(key: string, value: unknown): void {
  getStorage().set(key, JSON.stringify(value));
}

export function getString(key: string): string | undefined {
  return getStorage().getString(key);
}

export function setString(key: string, value: string): void {
  getStorage().set(key, value);
}
