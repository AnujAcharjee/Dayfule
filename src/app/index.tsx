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
import { DayProgress, YearStats, TaskPriority } from '@/types';
import {
  generateYearDays,
  calculateYearStats,
  getTodayKey,
} from '@/utils/dateUtils';
import { YearHeader } from '@/components/YearHeader';
import { YearGrid } from '@/components/YearGrid';
import { DayDetailModal } from '@/components/DayDetailModal';
import { StretchTaskModal } from '@/components/StretchTaskModal';
import { syncTodayWidget } from '@/widgets/widgetManager';

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
  const [breakDays, setBreakDays] = useState<Set<string>>(new Set());
  const [examDays, setExamDays] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  // Selected day for modal
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null);
  const [isDayModalVisible, setIsDayModalVisible] = useState<boolean>(false);
  const [isStretchModalVisible, setIsStretchModalVisible] = useState<boolean>(false);

  // Sync Today's tasks to the home screen widget
  const refreshTodayWidget = useCallback(async () => {
    try {
      const todayKey = getTodayKey();
      const [todayTasks, isBreak, isExam] = await Promise.all([
        repo.getTasksByDate(todayKey),
        repo.isBreakDay(todayKey),
        repo.isExamDay(todayKey),
      ]);
      await syncTodayWidget(todayTasks, isBreak, isExam);
    } catch (err) {
      console.warn('Widget update error', err);
    }
  }, [repo]);

  // Load data for the selected year
  const loadYearData = useCallback(async () => {
    setLoading(true);
    try {
      const [aggs, breaks, exams] = await Promise.all([
        repo.getYearAggregations(selectedYear),
        repo.getYearBreakDays(selectedYear),
        repo.getYearExamDays(selectedYear),
      ]);
      setAggregations(aggs);
      setBreakDays(breaks);
      setExamDays(exams);
      await refreshTodayWidget();
      await refreshTodayWidget();
    } catch (err) {
      console.error('Failed to load year data', err);
    } finally {
      setLoading(false);
    }
  }, [repo, selectedYear, refreshTodayWidget]);

  useEffect(() => {
    loadYearData();
  }, [loadYearData]);

  // Generate 365/366 day progress items - auto-freezes past days at end of day
  const days = useMemo(() => {
    return generateYearDays(selectedYear, aggregations, breakDays, examDays);
  }, [selectedYear, aggregations, breakDays, examDays]);

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
      const [aggs, breaks, exams] = await Promise.all([
        repo.getYearAggregations(selectedYear),
        repo.getYearBreakDays(selectedYear),
        repo.getYearExamDays(selectedYear),
      ]);
      setAggregations(aggs);
      setBreakDays(breaks);
      setExamDays(exams);
      await refreshTodayWidget();

      // Also update selectedDay reference
      if (selectedDay) {
        const todayAgg = aggs[selectedDay.date_str] || { total: 0, completed: 0 };
        const totalTasks = todayAgg.total;
        const completedTasks = todayAgg.completed;
        const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;
        const isBreak = breaks.has(selectedDay.date_str);
        const isExam = exams.has(selectedDay.date_str);
        setSelectedDay((prev) =>
          prev
            ? {
                ...prev,
                totalTasks,
                completedTasks,
                progress,
                isBreakDay: isBreak,
                isExamDay: isExam,
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

  // Save stretch / batch task across a range of days
  const handleSaveStretchTask = async (data: {
    date_strings: string[];
    title: string;
    notes?: string;
    priority: TaskPriority;
  }) => {
    try {
      await repo.createTasksForDateRange(data);
      await loadYearData();
    } catch (err) {
      console.error('Failed to create stretch task:', err);
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

      {/* Floating Action Buttons: Stretch & Today */}
      <View style={styles.floatingActionsRow}>
        <TouchableOpacity
          style={[styles.floatingStretchBtn, { backgroundColor: '#FF6D00' }]}
          activeOpacity={0.85}
          onPress={() => setIsStretchModalVisible(true)}
        >
          <MaterialCommunityIcons name="calendar-range" size={17} color="#FFFFFF" />
          <Text style={styles.floatingBtnText}>Stretch</Text>
        </TouchableOpacity>

        {selectedYear === currentActualYear && (
          <TouchableOpacity
            style={[styles.floatingTodayBtn, { backgroundColor: '#0A84FF' }]}
            activeOpacity={0.85}
            onPress={handleJumpToToday}
          >
            <MaterialCommunityIcons name="target" size={17} color="#FFFFFF" />
            <Text style={styles.floatingBtnText}>Today</Text>
          </TouchableOpacity>
        )}
      </View>

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

      {/* Stretch / Multi-Day Task Modal */}
      <StretchTaskModal
        visible={isStretchModalVisible}
        onSave={handleSaveStretchTask}
        onClose={() => setIsStretchModalVisible(false)}
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
  floatingActionsRow: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingStretchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingTodayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
