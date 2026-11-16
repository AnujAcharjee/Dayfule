import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
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
import { ArchivesModal } from '@/components/ArchivesModal';

export default function IndexScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const db = useSQLiteContext();
  const repo = useMemo(() => new TasksRepository(db), [db]);

  const currentActualYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentActualYear);
  const [viewMode, setViewMode] = useState<'months' | 'dense'>('months');
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [aggregations, setAggregations] = useState<
    Record<string, { total: number; completed: number }>
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  // Selected day for modal
  const [selectedDay, setSelectedDay] = useState<DayProgress | null>(null);
  const [isDayModalVisible, setIsDayModalVisible] = useState<boolean>(false);

  // Archives modal
  const [isArchivesVisible, setIsArchivesVisible] = useState<boolean>(false);

  // Load data for the selected year
  const loadYearData = useCallback(async () => {
    setLoading(true);
    try {
      const [aggs, archived] = await Promise.all([
        repo.getYearAggregations(selectedYear),
        repo.isYearArchived(selectedYear),
      ]);
      setAggregations(aggs);
      setIsArchived(archived);
    } catch (err) {
      console.error('Failed to load year data', err);
    } finally {
      setLoading(false);
    }
  }, [repo, selectedYear]);

  useEffect(() => {
    loadYearData();
  }, [loadYearData]);

  // Generate 365/366 day progress items
  const days = useMemo(() => {
    return generateYearDays(selectedYear, aggregations, isArchived);
  }, [selectedYear, aggregations, isArchived]);

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

  // Archive / unarchive year
  const handleArchiveToggle = async () => {
    if (!isArchived) {
      Alert.alert(
        'Archive Year',
        `Are you sure you want to archive ${selectedYear}? All days and tasks in this year will freeze and become read-only.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Archive',
            style: 'destructive',
            onPress: async () => {
              await repo.archiveYear(selectedYear);
              await loadYearData();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Unarchive Year',
        `Do you want to reopen ${selectedYear}? Past days will remain frozen, but you can plan or adjust tasks.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reopen',
            onPress: async () => {
              await repo.unarchiveYear(selectedYear);
              await loadYearData();
            },
          },
        ]
      );
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
        isArchived={isArchived}
        onPrevYear={() => setSelectedYear((y) => y - 1)}
        onNextYear={() => setSelectedYear((y) => y + 1)}
        onArchiveToggle={handleArchiveToggle}
        onOpenArchives={() => setIsArchivesVisible(true)}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((m) => (m === 'months' ? 'dense' : 'months'))
        }
      />

      {/* Grid or Loader */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF2D55" />
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

      {/* Archives Modal */}
      <ArchivesModal
        visible={isArchivesVisible}
        currentSelectedYear={selectedYear}
        onSelectYear={(yr) => setSelectedYear(yr)}
        onClose={() => setIsArchivesVisible(false)}
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
    backgroundColor: '#FF2D55',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingTodayText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
