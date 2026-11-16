import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useSQLiteContext } from 'expo-sqlite';
import { DayProgress, Task, TaskPriority } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { TasksRepository } from '@/database/tasksRepository';
import { TaskItem } from './TaskItem';
import { TaskEditorModal } from './TaskEditorModal';
import { RainbowCelebration } from './RainbowCelebration';
import { formatFullDate } from '@/utils/dateUtils';

interface DayDetailModalProps {
  day: DayProgress | null;
  visible: boolean;
  onClose: () => void;
  onDayUpdated: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  visible,
  onClose,
  onDayUpdated,
}) => {
  const { colors, mode } = useTheme();
  const db = useSQLiteContext();
  const repo = new TasksRepository(db);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isBreakDay, setIsBreakDay] = useState(day?.isBreakDay || false);

  // Sync break day state when day changes
  useEffect(() => {
    if (day) {
      setIsBreakDay(day.isBreakDay);
    }
  }, [day?.isBreakDay]);

  // Load tasks for this day
  const loadTasks = useCallback(async () => {
    if (!day) return;
    setLoading(true);
    try {
      const list = await repo.getTasksByDate(day.date_str);
      setTasks(list);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  }, [day?.date_str]);

  useEffect(() => {
    if (visible && day) {
      loadTasks();
    }
  }, [visible, day, loadTasks]);

  if (!day || !visible) return null;

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed === 1).length;
  const progressRatio = totalCount > 0 ? completedCount / totalCount : 0;
  const progressPct = Math.round(progressRatio * 100);
  const isPerfect = totalCount > 0 && completedCount === totalCount;

  // Toggle completion
  const handleToggleTask = async (id: string) => {
    if (day.isFrozen) return;
    try {
      const newCompleted = await repo.toggleTask(id);
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, completed: newCompleted } : t
      );
      setTasks(updated);
      onDayUpdated();

      // Check if this action made the day 100% complete
      const newCompletedCount = updated.filter((t) => t.completed === 1).length;
      if (newCompletedCount === updated.length && updated.length > 0 && newCompleted === 1) {
        setShowCelebration(true);
      }
    } catch (err) {
      console.error('Toggle error', err);
    }
  };

  // Toggle break day status
  const handleToggleBreakDay = async () => {
    if (day.isFrozen) return;
    try {
      const nowBreak = await repo.toggleBreakDay(day.date_str);
      setIsBreakDay(nowBreak);
      onDayUpdated();
    } catch (err) {
      console.error('Toggle break day error', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    if (day.isFrozen) return;
    try {
      await repo.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      onDayUpdated();
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  // Add / update task
  const handleSaveTask = async (data: {
    title: string;
    notes?: string;
    priority: TaskPriority;
  }) => {
    try {
      if (editingTask) {
        await repo.updateTask(editingTask.id, {
          title: data.title,
          notes: data.notes,
          priority: data.priority,
        });
      } else {
        await repo.createTask({
          date_str: day.date_str,
          title: data.title,
          notes: data.notes,
          priority: data.priority,
        });
      }
      setShowEditor(false);
      setEditingTask(null);
      await loadTasks();
      onDayUpdated();
    } catch (err) {
      console.error('Save error', err);
    }
  };

  // Compact Header Loader Ring metrics
  const loaderSize = 42;
  const strokeWidth = 4;
  const radius = (loaderSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />

          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            {/* Grab handle indicator */}
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: colors.surfaceBorder }]} />
            </View>

            {/* Header: Date & Close Button */}
            <View style={styles.headerRow}>
              <View style={styles.dateInfo}>
                <Text style={[styles.fullDate, { color: colors.text }]}>
                  {formatFullDate(day.date_str)}
                </Text>

                {/* Status tags */}
                <View style={styles.tagRow}>
                  {day.isToday && (
                    <View style={[styles.statusTag, { backgroundColor: '#0A84FF' }]}>
                      <Text style={styles.todayTagText}>TODAY</Text>
                    </View>
                  )}

                  {isBreakDay && (
                    <View style={[styles.statusTag, { backgroundColor: '#C2185B' }]}>
                      <MaterialCommunityIcons name="coffee" size={10} color="#FFFFFF" style={{ marginRight: 2 }} />
                      <Text style={styles.todayTagText}>BREAK DAY</Text>
                    </View>
                  )}

                  {day.isFrozen && (
                    <View
                      style={[
                        styles.frozenTag,
                        { backgroundColor: mode === 'dark' ? '#202026' : '#E2E8F0' },
                      ]}
                    >
                      <MaterialCommunityIcons name="lock" size={11} color={colors.textMuted} />
                      <Text style={[styles.frozenTagText, { color: colors.textMuted }]}>
                        FROZEN
                      </Text>
                    </View>
                  )}

                  {day.isFuture && (
                    <View
                      style={[
                        styles.futureTag,
                        { backgroundColor: mode === 'dark' ? '#181E29' : '#EEF2FF' },
                      ]}
                    >
                      <MaterialCommunityIcons name="calendar-clock" size={11} color="#38BDF8" />
                      <Text style={styles.futureTagText}>UPCOMING</Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Compact Progress & Action Bar */}
            <View
              style={[
                styles.compactActionBar,
                {
                  backgroundColor: colors.card,
                  borderColor: isBreakDay
                    ? '#C2185B'
                    : isPerfect
                    ? '#2ECC71'
                    : colors.cardBorder,
                },
              ]}
            >
              {/* Day Loader Ring: Full round dark pink if break day, or rainbow arc */}
              <View style={styles.loaderWrapper}>
                <Svg width={loaderSize} height={loaderSize}>
                  <Defs>
                    <SvgLinearGradient id="modalDayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#FF2D55" />
                      <Stop offset="25%" stopColor="#FFA500" />
                      <Stop offset="50%" stopColor="#2ECC71" />
                      <Stop offset="75%" stopColor="#00C9FF" />
                      <Stop offset="100%" stopColor="#AF52DE" />
                    </SvgLinearGradient>
                  </Defs>

                  {isBreakDay ? (
                    <Circle
                      cx={loaderSize / 2}
                      cy={loaderSize / 2}
                      r={radius}
                      stroke="#880E4F"
                      strokeWidth={strokeWidth}
                      fill="#C2185B"
                    />
                  ) : (
                    <>
                      <Circle
                        cx={loaderSize / 2}
                        cy={loaderSize / 2}
                        r={radius}
                        stroke={mode === 'dark' ? '#2A2A38' : '#E2E8F0'}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      {totalCount > 0 && progressRatio > 0 && (
                        <Circle
                          cx={loaderSize / 2}
                          cy={loaderSize / 2}
                          r={radius}
                          stroke="url(#modalDayGrad)"
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          transform={`rotate(-90 ${loaderSize / 2} ${loaderSize / 2})`}
                        />
                      )}
                    </>
                  )}
                </Svg>
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  <View style={styles.loaderCenter}>
                    {isBreakDay ? (
                      <MaterialCommunityIcons name="coffee" size={17} color="#FFFFFF" />
                    ) : isPerfect ? (
                      <MaterialCommunityIcons name="check-bold" size={15} color="#2ECC71" />
                    ) : (
                      <Text style={[styles.loaderPctText, { color: colors.text }]}>
                        {totalCount > 0 ? `${progressPct}%` : '0%'}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Progress Summary Text */}
              <View style={styles.progressSummary}>
                <Text style={[styles.progressTitle, { color: colors.text }]}>
                  {isBreakDay
                    ? 'Break Day Active'
                    : totalCount === 0
                    ? 'No tasks yet'
                    : isPerfect
                    ? 'All completed!'
                    : `${completedCount} of ${totalCount} done`}
                </Text>
                <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                  {isBreakDay
                    ? 'Resting today · Streaks kept'
                    : totalCount === 0
                    ? 'Plan your day or take a break'
                    : `${progressPct}% daily progress`}
                </Text>
              </View>

              {/* Action Buttons: Mark Break Day & Add Task */}
              {!day.isFrozen && (
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.breakButton,
                      isBreakDay
                        ? { backgroundColor: '#C2185B', borderColor: '#880E4F' }
                        : { backgroundColor: colors.surfaceHover, borderColor: colors.surfaceBorder },
                    ]}
                    onPress={handleToggleBreakDay}
                  >
                    <MaterialCommunityIcons
                      name={isBreakDay ? 'coffee' : 'coffee-outline'}
                      size={15}
                      color={isBreakDay ? '#FFFFFF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.breakButtonText,
                        { color: isBreakDay ? '#FFFFFF' : colors.textSecondary },
                      ]}
                    >
                      {isBreakDay ? 'Break' : 'Break'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.blueAddButton}
                    onPress={() => {
                      setEditingTask(null);
                      setShowEditor(true);
                    }}
                  >
                    <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
                    <Text style={styles.blueAddButtonText}>Add Task</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Frozen Notice Banner if day is frozen */}
            {day.isFrozen && (
              <View
                style={[
                  styles.frozenBanner,
                  {
                    backgroundColor: colors.frozenBg,
                    borderColor: colors.frozenBorder,
                  },
                ]}
              >
                <MaterialCommunityIcons name="lock" size={15} color={colors.textMuted} />
                <Text style={[styles.frozenBannerText, { color: colors.textSecondary }]}>
                  Day ended and frozen. Historical tasks cannot be modified.
                </Text>
              </View>
            )}

            {/* Tasks section title */}
            <View style={styles.tasksHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                TASKS ({completedCount}/{totalCount})
              </Text>
            </View>

            {/* Tasks list - maximized height to fit 5+ tasks easily */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0A84FF" />
              </View>
            ) : tasks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="calendar-check-outline"
                  size={46}
                  color={colors.textMuted}
                />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {isBreakDay ? 'No tasks needed for today. Enjoy your break!' : 'No tasks recorded for this day.'}
                </Text>
                {!day.isFrozen && (
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <TouchableOpacity
                      style={[
                        styles.emptyBreakBtn,
                        isBreakDay
                          ? { backgroundColor: '#C2185B' }
                          : { backgroundColor: colors.surfaceHover, borderColor: colors.surfaceBorder, borderWidth: 1 },
                      ]}
                      activeOpacity={0.8}
                      onPress={handleToggleBreakDay}
                    >
                      <MaterialCommunityIcons
                        name={isBreakDay ? 'check' : 'coffee'}
                        size={17}
                        color={isBreakDay ? '#FFFFFF' : colors.text}
                      />
                      <Text style={[styles.emptyBreakBtnText, { color: isBreakDay ? '#FFFFFF' : colors.text }]}>
                        {isBreakDay ? 'Break Day Active' : 'Take a Break'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.emptyBlueAddBtn}
                      activeOpacity={0.8}
                      onPress={() => {
                        setEditingTask(null);
                        setShowEditor(true);
                      }}
                    >
                      <MaterialCommunityIcons name="plus" size={17} color="#FFFFFF" />
                      <Text style={styles.emptyBlueAddBtnText}>Add Task</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <ScrollView
                style={styles.tasksList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.tasksScrollContent}
              >
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isFrozen={day.isFrozen}
                    onToggle={handleToggleTask}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setShowEditor(true);
                    }}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Task Editor Modal */}
      <TaskEditorModal
        visible={showEditor}
        dateStr={day.date_str}
        initialTask={editingTask}
        onSave={handleSaveTask}
        onClose={() => {
          setShowEditor(false);
          setEditingTask(null);
        }}
      />

      {/* Celebration Popup */}
      <RainbowCelebration
        visible={showCelebration}
        title="Day Complete!"
        subtitle={`Fantastic job! You completed all ${totalCount} tasks planned for this day.`}
        dateStr={day.date_str}
        onClose={() => setShowCelebration(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'ios' ? 36 : 18,
    height: '88%',
    maxHeight: '92%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 6,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dateInfo: {
    flex: 1,
  },
  fullDate: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  todayTagText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  frozenTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  frozenTagText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  futureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  futureTagText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
  },
  compactActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 10,
  },
  loaderWrapper: {
    position: 'relative',
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderPctText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  progressSummary: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  breakButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  blueAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0A84FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  blueAddButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  frozenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  frozenBannerText: {
    flex: 1,
    fontSize: 11,
  },
  tasksHeaderRow: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  emptyBreakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 11,
  },
  emptyBreakBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyBlueAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: '#0A84FF',
  },
  emptyBlueAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tasksList: {
    flex: 1,
  },
  tasksScrollContent: {
    paddingBottom: 28,
  },
});
