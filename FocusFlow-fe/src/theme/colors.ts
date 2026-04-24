export const palette = {
  deepNavy: '#1A1A2E',
  darkNavy: '#16213E',
  midNavy: '#0F3460',
  softBlue: '#4ECDC4',
  warmAmber: '#FFD93D',
  offWhite: '#E8E8E8',
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#E0E0E0',
  gray300: '#BDBDBD',
  gray400: '#9E9E9E',
  gray500: '#757575',
  gray600: '#616161',
  gray700: '#424242',
  gray800: '#2C2C3A',
  gray900: '#1E1E2A',
  red: '#FF6B6B',
  green: '#51CF66',
};

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  accent: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  timerTrack: string;
  timerProgress: string;
  tabBar: string;
  tabBarBorder: string;
  statusBar: 'light' | 'dark';
}

export const darkTheme: ThemeColors = {
  background: palette.deepNavy,
  surface: palette.gray800,
  surfaceElevated: palette.darkNavy,
  primary: palette.softBlue,
  accent: palette.warmAmber,
  text: palette.offWhite,
  textSecondary: palette.gray400,
  textMuted: palette.gray500,
  border: palette.gray700,
  error: palette.red,
  success: palette.green,
  timerTrack: palette.gray700,
  timerProgress: palette.softBlue,
  tabBar: palette.gray900,
  tabBarBorder: palette.gray700,
  statusBar: 'light',
};

export const lightTheme: ThemeColors = {
  background: palette.gray100,
  surface: palette.white,
  surfaceElevated: palette.white,
  primary: '#3AAFA9',
  accent: '#E6B800',
  text: '#1A1A2E',
  textSecondary: palette.gray600,
  textMuted: palette.gray400,
  border: palette.gray200,
  error: palette.red,
  success: palette.green,
  timerTrack: palette.gray200,
  timerProgress: '#3AAFA9',
  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  statusBar: 'dark',
};
