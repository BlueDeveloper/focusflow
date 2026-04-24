import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTimerStore } from '@/stores/timerStore';
import { useTheme, fontSize, spacing } from '@/theme';
import { useInterval } from '@/hooks/useInterval';
import { CircularProgress } from './CircularProgress';

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatFocusTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function TimerDisplay() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const phase = useTimerStore((s) => s.phase);
  const status = useTimerStore((s) => s.status);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const currentRound = useTimerStore((s) => s.currentRound);
  const settings = useTimerStore((s) => s.settings);
  const todayFocusSeconds = useTimerStore((s) => s.todayFocusSeconds);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const reset = useTimerStore((s) => s.reset);
  const skip = useTimerStore((s) => s.skip);
  const tick = useTimerStore((s) => s.tick);

  useInterval(tick, status === 'running' ? 1000 : null);

  const totalSeconds =
    phase === 'focus'
      ? settings.focusMinutes * 60
      : phase === 'shortBreak'
        ? settings.shortBreakMinutes * 60
        : settings.longBreakMinutes * 60;

  const progress = 1 - remainingSeconds / totalSeconds;

  const phaseLabel =
    phase === 'focus'
      ? t('timer.focus')
      : phase === 'shortBreak'
        ? t('timer.shortBreak')
        : t('timer.longBreak');

  const phaseColor = phase === 'focus' ? colors.primary : colors.accent;

  return (
    <View style={styles.container}>
      {/* Phase label */}
      <Text style={[styles.phaseLabel, { color: phaseColor }]}>{phaseLabel}</Text>

      {/* Round indicator */}
      <Text style={[styles.round, { color: colors.textSecondary }]}>
        {t('timer.round', { current: currentRound, total: settings.totalRounds })}
      </Text>

      {/* Timer circle */}
      <CircularProgress progress={progress} size={280} strokeWidth={8}>
        <Text style={[styles.time, { color: colors.text }]}>{formatTime(remainingSeconds)}</Text>
      </CircularProgress>

      {/* Controls */}
      <View style={styles.controls}>
        {status === 'idle' && (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: phaseColor }]}
            onPress={start}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>{t('common.start')}</Text>
          </TouchableOpacity>
        )}

        {status === 'running' && (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.surface }]}
            onPress={pause}
            activeOpacity={0.7}
          >
            <Text style={[styles.primaryButtonText, { color: colors.text }]}>
              {t('common.pause')}
            </Text>
          </TouchableOpacity>
        )}

        {status === 'paused' && (
          <View style={styles.pausedControls}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={reset}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                {t('common.reset')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={resume}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>{t('common.resume')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Skip button */}
      {status !== 'idle' && (
        <TouchableOpacity onPress={skip} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>{t('common.skip')}</Text>
        </TouchableOpacity>
      )}

      {/* Today's focus */}
      <View style={[styles.todayContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.todayLabel, { color: colors.textSecondary }]}>
          {t('timer.todayFocus')}
        </Text>
        <Text style={[styles.todayValue, { color: colors.primary }]}>
          {formatFocusTime(todayFocusSeconds)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  phaseLabel: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  round: {
    fontSize: fontSize.sm,
    marginBottom: spacing.lg,
  },
  time: {
    fontSize: fontSize.timer,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  controls: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  primaryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 50,
    minWidth: 160,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  pausedControls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 50,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '500',
  },
  skipButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.sm,
  },
  todayContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  todayLabel: {
    fontSize: fontSize.sm,
  },
  todayValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
