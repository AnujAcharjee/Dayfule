import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DayProgress } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { DayLoader } from './DayLoader';
import {
  MONTH_NAMES,
  WEEKDAY_NAMES_SHORT,
  groupDaysByMonth,
} from '@/utils/dateUtils';

interface YearGridProps {
  days: DayProgress[];
  viewMode: 'months' | 'dense';
  onDayPress: (day: DayProgress) => void;
}

export const YearGrid: React.FC<YearGridProps> = ({
  days,
  viewMode,
  onDayPress,
}) => {
  const { colors } = useTheme();
  const months = groupDaysByMonth(days);

  return (
    <View style={styles.container}>
      {/* Main Grid View */}
      {viewMode === 'months' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.monthsContent}
          showsVerticalScrollIndicator={false}
        >
          {months.map((monthDays, monthIndex) => {
            if (monthDays.length === 0) return null;
            const firstDayOfWeek = monthDays[0].dayOfWeek; // 0 (Sun) to 6 (Sat)
            const emptyPads = Array.from({ length: firstDayOfWeek });

            // Month completion
            const mTotal = monthDays.reduce((acc, d) => acc + d.totalTasks, 0);
            const mCompleted = monthDays.reduce((acc, d) => acc + d.completedTasks, 0);
            const mPct = mTotal > 0 ? Math.round((mCompleted / mTotal) * 100) : 0;

            return (
              <View
                key={monthIndex}
                style={[
                  styles.monthCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
              >
                {/* Month title row */}
                <View style={styles.monthHeader}>
                  <Text style={[styles.monthTitle, { color: colors.text }]}>
                    {MONTH_NAMES[monthIndex]}
                  </Text>
                  {mTotal > 0 && (
                    <Text style={[styles.monthStats, { color: colors.textSecondary }]}>
                      {mPct}% ({mCompleted}/{mTotal})
                    </Text>
                  )}
                </View>

                {/* Weekday headers */}
                <View style={styles.weekdaysRow}>
                  {WEEKDAY_NAMES_SHORT.map((w, idx) => (
                    <Text
                      key={idx}
                      style={[styles.weekdayText, { color: colors.textMuted }]}
                    >
                      {w}
                    </Text>
                  ))}
                </View>

                {/* Days matrix */}
                <View style={styles.daysMatrix}>
                  {emptyPads.map((_, pIdx) => (
                    <View key={`pad-${pIdx}`} style={styles.daySlot} />
                  ))}

                  {monthDays.map((day) => (
                    <View key={day.date_str} style={styles.daySlot}>
                      <DayLoader
                        day={day}
                        size={28}
                        strokeWidth={2.8}
                        showDayNumber={true}
                        onPress={onDayPress}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        /* Dense 52-Week Year Matrix: Shows all 365 days on a single page! */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.denseHorizontalScroll}
          contentContainerStyle={styles.denseScrollContent}
        >
          <View style={styles.denseMatrixContainer}>
            {/* 7 rows for Sun through Sat */}
            <View style={styles.denseWeekdaysCol}>
              {WEEKDAY_NAMES_SHORT.map((w, i) => (
                <Text key={i} style={[styles.denseWeekdayLabel, { color: colors.textMuted }]}>
                  {w}
                </Text>
              ))}
            </View>

            {/* Matrix columns */}
            <View style={styles.denseWeeksStream}>
              {renderDenseWeeks(days, onDayPress)}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

/**
 * Organizes 365 days into 53 week columns
 */
function renderDenseWeeks(days: DayProgress[], onDayPress: (d: DayProgress) => void) {
  if (days.length === 0) return null;

  // Group by week columns
  const weeks: (DayProgress | null)[][] = [];
  let currentWeek: (DayProgress | null)[] = [];

  // Pad the first week if Jan 1 is not Sunday
  const firstDay = days[0];
  for (let i = 0; i < firstDay.dayOfWeek; i++) {
    currentWeek.push(null);
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <View style={styles.denseWeeksRow}>
      {weeks.map((week, wIndex) => (
        <View key={wIndex} style={styles.denseWeekCol}>
          {week.map((day, dIndex) => (
            <View key={dIndex} style={styles.denseSlot}>
              {day ? (
                <DayLoader
                  day={day}
                  size={18}
                  strokeWidth={2.2}
                  showDayNumber={false}
                  onPress={onDayPress}
                />
              ) : (
                <View style={styles.denseEmptyDot} />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  monthsContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  monthCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  monthStats: {
    fontSize: 11,
    fontWeight: '600',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: '700',
    width: 32,
    textAlign: 'center',
  },
  daysMatrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  daySlot: {
    width: `${100 / 7}%`,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denseHorizontalScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  denseScrollContent: {
    paddingVertical: 16,
    paddingRight: 24,
  },
  denseMatrixContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  denseWeekdaysCol: {
    gap: 8,
    paddingTop: 2,
  },
  denseWeekdayLabel: {
    fontSize: 9,
    fontWeight: '700',
    height: 20,
    lineHeight: 20,
  },
  denseWeeksStream: {
    flexDirection: 'row',
  },
  denseWeeksRow: {
    flexDirection: 'row',
    gap: 5,
  },
  denseWeekCol: {
    flexDirection: 'column',
    gap: 8,
  },
  denseSlot: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denseEmptyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
});
