import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { YearStats } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { isLeapYear } from '@/utils/dateUtils';

interface YearHeaderProps {
  year: number;
  stats: YearStats;
  onPrevYear: () => void;
  onNextYear: () => void;
  viewMode: 'months' | 'dense';
  onToggleViewMode: () => void;
}

export const YearHeader: React.FC<YearHeaderProps> = ({
  year,
  stats,
  onPrevYear,
  onNextYear,
  viewMode,
  onToggleViewMode,
}) => {
  const { colors, mode, toggleTheme } = useTheme();

  const currentActualYear = new Date().getFullYear();
  const totalDaysInYear = stats.totalDays || (isLeapYear(year) ? 366 : 365);

  let daysElapsed = 0;
  let yearProgressPct = 0;

  if (year < currentActualYear) {
    // Past years are 100% completed
    daysElapsed = totalDaysInYear;
    yearProgressPct = 100;
  } else if (year > currentActualYear) {
    // Future years haven't elapsed
    daysElapsed = 0;
    yearProgressPct = 0;
  } else {
    // Current year
    daysElapsed = Math.min(stats.daysPassed, totalDaysInYear);
    yearProgressPct = Math.round((daysElapsed / totalDaysInYear) * 100);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top brand & controls row */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <Text style={[styles.brandTitle, { color: '#FF5E3A' }]}>TASKFULE</Text>
          <View style={[styles.brandDot, { backgroundColor: '#FF5E3A' }]} />
        </View>

        <View style={styles.topActions}>
          {/* View mode toggle */}
          <TouchableOpacity
            style={[styles.iconPill, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
            onPress={onToggleViewMode}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={viewMode === 'months' ? 'view-grid-outline' : 'calendar-month-outline'}
              size={18}
              color={colors.text}
            />
            <Text style={[styles.pillText, { color: colors.text }]}>
              {viewMode === 'months' ? 'Compact' : 'Months'}
            </Text>
          </TouchableOpacity>

          {/* Theme toggle */}
          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={mode === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
              size={18}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Year Selector row */}
      <View style={styles.yearRow}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.surface }]}
          onPress={onPrevYear}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.yearDisplay}>
          <Text style={[styles.yearNumber, { color: colors.text }]}>{year}</Text>
        </View>

        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.surface }]}
          onPress={onNextYear}
        >
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Year Elapsed Progress Bar & Percentage */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            Year Elapsed
          </Text>
          <Text style={[styles.progressPct, { color: colors.text }]}>
            {yearProgressPct}% ({daysElapsed}/{totalDaysInYear} days)
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.max(yearProgressPct, year === currentActualYear && daysElapsed > 0 ? 2 : 0)}%`,
                backgroundColor: '#0A84FF',
              },
            ]}
          />
        </View>
      </View>

      {/* Stats summary cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {stats.completionRate}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Task Success</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <View style={styles.statWithIcon}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.currentStreak}
            </Text>
            <MaterialCommunityIcons name="fire" size={18} color="#FF5E3A" />
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {stats.perfectDays}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Perfect Days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5E3A',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearDisplay: {
    alignItems: 'center',
  },
  yearNumber: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  progressSection: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  progressBarBg: {
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
