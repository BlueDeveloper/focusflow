import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme, fontSize, spacing, borderRadius } from '@/theme';
import { useTimerStore } from '@/stores/timerStore';

function SettingRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{value}</Text>
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const { colors, mode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const settings = useTimerStore((s) => s.settings);
  const updateSettings = useTimerStore((s) => s.updateSettings);

  const themeLabel =
    mode === 'dark' ? t('settings.themeDark') : mode === 'light' ? t('settings.themeLight') : t('settings.themeSystem');

  const langLabel = i18n.language === 'ko' ? '한국어' : 'English';

  const toggleLanguage = () => {
    const next = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(next);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 100 }}
    >
      <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>

      {/* Timer Settings */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('timer.focusTime')}</Text>
      <SettingRow label={t('timer.focusTime')} value={`${settings.focusMinutes} ${t('timer.minutes')}`} />
      <SettingRow label={t('timer.breakTime')} value={`${settings.shortBreakMinutes} ${t('timer.minutes')}`} />
      <SettingRow label={t('timer.longBreakTime')} value={`${settings.longBreakMinutes} ${t('timer.minutes')}`} />
      <SettingRow label={t('timer.rounds')} value={`${settings.totalRounds}`} />

      {/* App Settings */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.title')}</Text>
      <SettingRow label={t('settings.theme')} value={themeLabel} onPress={toggleTheme} />
      <SettingRow label={t('settings.language')} value={langLabel} onPress={toggleLanguage} />

      {/* About */}
      <SettingRow label={t('settings.version')} value="1.0.0" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  rowLabel: {
    fontSize: fontSize.md,
  },
  rowValue: {
    fontSize: fontSize.md,
  },
});
