import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { TasksRepository } from '@/database/tasksRepository';
import { DayProgress, YearStats } from '@/types';
import {
  generateYearDays,
  calculateYearStats,
  getTodayKey,
} from '@/utils/dateUtils';
import { YearHeader } from '@/components/YearHeader';
import { YearGrid } from '@/components/YearGrid';
import { DayDetailModal } from '@/components/DayDetailModal';

export default function IndexScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const db = useSQLiteContext();
  const repo = useMemo(() => new TasksRepository(db), [db]);

  const currentActualYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentActualYear);
  const [viewMode, setViewMode] = useState<'months' | 'dense'>('months');
  const [aggregations, setAggregations] = useState<
    Record<string, { total: number; completed: number }>
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  // Selected day for modal
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null);
  const [isDayModalVisible, setIsDayModalVisible] = useState<boolean>(false);

  // Load data for the selected year
  const loadYearData = useCallback(async () => {
    setLoading(true);
    try {
      const aggs = await repo.getYearAggregations(selectedYear);
      setAggregations(aggs);
    } catch (err) {
      console.error('Failed to load year data', err);
    } finally {
      setLoading(false);
    }
  }, [repo, selectedYear]);

  useEffect(() => {
    loadYearData();
  }, [loadYearData]);

  // Generate 365/366 day progress items - auto-freezes past days at end of day
  const days = useMemo(() => {
    return generateYearDays(selectedYear, aggregations);
  }, [selectedYear, aggregations]);

  // Compute Year stats
  const stats: YearStats = useMemo(() => {
    return calculateYearStats(selectedYear, days);
  }, [selectedYear, days]);

  // Handle Day tap
  const handleDayPress = (day: DayProgress) => {
    setSelectedDay(day);
    setIsDayModalVisible(true);
  };

  // Re-fetch when day is updated in modal
  const handleDayUpdated = async () => {
    try {
      const aggs = await repo.getYearAggregations(selectedYear);
      setAggregations(aggs);

      // Also update selectedDay reference
      if (selectedDay) {
        const todayAgg = aggs[selectedDay.date_str] || { total: 0, completed: 0 };
        const totalTasks = todayAgg.total;
        const completedTasks = todayAgg.completed;
        const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
        setSelectedDay((prev) =>
          prev
            ? {
                ...prev,
                totalTasks,
                completedTasks,
                progress,
              }
            : null
        );
      }
    } catch (err) {
      console.error('Update day error', err);
    }
  };

  // Jump to today
  const handleJumpToToday = () => {
    if (selectedYear !== currentActualYear) {
      setSelectedYear(currentActualYear);
    }
    const todayKey = getTodayKey();
    const todayDay = days.find((d) => d.date_str === todayKey);
    if (todayDay) {
      handleDayPress(todayDay);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Year Header & Stats */}
      <YearHeader
        year={selectedYear}
        stats={stats}
        onPrevYear={() => setSelectedYear((y) => y - 1)}
        onNextYear={() => setSelectedYear((y) => y + 1)}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((m) => (m === 'months' ? 'dense' : 'months'))
        }
      />

      {/* Grid or Loader */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
        </View>
      ) : (
        <YearGrid
          days={days}
          viewMode={viewMode}
          onDayPress={handleDayPress}
        />
      )}

      {/* Quick floating "Today" button if in current year */}
      {selectedYear === currentActualYear && (
        <TouchableOpacity
          style={styles.floatingTodayBtn}
          activeOpacity={0.85}
          onPress={handleJumpToToday}
        >
          <MaterialCommunityIcons name="target" size={18} color="#FFFFFF" />
          <Text style={styles.floatingTodayText}>Today</Text>
        </TouchableOpacity>
      )}

      {/* Day Dropdown / Sheet Modal */}
      <DayDetailModal
        day={selectedDay}
        visible={isDayModalVisible}
        onClose={() => {
          setIsDayModalVisible(false);
          setSelectedDay(null);
        }}
        onDayUpdated={handleDayUpdated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTodayBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A84FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingTodayText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
