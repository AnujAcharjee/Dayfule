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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useSQLiteContext } from 'expo-sqlite';
import { DayProgress, Task, TaskPriority } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { TasksRepository } from '@/database/tasksRepository';
import { TaskItem } from './TaskItem';
import { TaskEditorModal } from './TaskEditorModal';
import { RainbowCelebration } from './RainbowCelebration';
import { formatFullDate } from '@/utils/dateUtils';
import { RAINBOW_STOPS } from '@/utils/colors';

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

  // Big Loader Ring metrics
  const loaderSize = 64;
  const strokeWidth = 6;
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

            {/* Header with full date & close button */}
            <View style={styles.headerRow}>
              <View style={styles.dateInfo}>
                <Text style={[styles.fullDate, { color: colors.text }]}>
                  {formatFullDate(day.date_str)}
                </Text>

                {/* Day status tag */}
                <View style={styles.tagRow}>
                  {day.isToday && (
                    <View style={[styles.statusTag, { backgroundColor: '#FF2D55' }]}>
                      <Text style={styles.todayTagText}>TODAY</Text>
                    </View>
                  )}

                  {day.isFrozen && (
                    <View
                      style={[
                        styles.frozenTag,
                        { backgroundColor: mode === 'dark' ? '#202026' : '#E2E8F0' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="lock"
                        size={12}
                        color={colors.textMuted}
                      />
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
                      <MaterialCommunityIcons
                        name="calendar-clock"
                        size={12}
                        color="#38BDF8"
                      />
                      <Text style={styles.futureTagText}>UPCOMING</Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
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
                <MaterialCommunityIcons
                  name="shield-lock-outline"
                  size={20}
                  color={colors.textMuted}
                />
                <Text style={[styles.frozenBannerText, { color: colors.textSecondary }]}>
                  This day has ended and is frozen. Completed and uncompleted tasks can no longer be updated.
                </Text>
              </View>
            )}

            {/* Day Progress Ring Card */}
            <View
              style={[
                styles.progressCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isPerfect ? '#2ECC71' : colors.cardBorder,
                },
              ]}
            >
              <View style={styles.loaderWrapper}>
                <Svg width={loaderSize} height={loaderSize}>
                  <Defs>
                    <SvgLinearGradient id="modalDayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#FF2D55" />
                      <Stop offset="30%" stopColor="#FF9500" />
                      <Stop offset="60%" stopColor="#2ECC71" />
                      <Stop offset="100%" stopColor="#00C9FF" />
                    </SvgLinearGradient>
                  </Defs>
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
                </Svg>
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  <View style={styles.loaderCenter}>
                    {isPerfect ? (
                      <MaterialCommunityIcons name="trophy" size={20} color="#FFD700" />
                    ) : (
                      <Text style={[styles.loaderPctText, { color: colors.text }]}>
                        {totalCount > 0 ? `${progressPct}%` : '0%'}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.progressDetails}>
                <Text style={[styles.progressTitle, { color: colors.text }]}>
                  {totalCount === 0
                    ? 'No Tasks Planned'
                    : isPerfect
                    ? 'All Tasks Finished!'
                    : `${completedCount} of ${totalCount} Tasks Done`}
                </Text>
                <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                  {totalCount === 0
                    ? 'Plan your day to build your productivity ring.'
                    : `${progressPct}% daily completion`}
                </Text>
              </View>
            </View>

            {/* Tasks section header & Add button */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                TASKS ({completedCount}/{totalCount})
              </Text>
              {!day.isFrozen && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.addButton}
                  onPress={() => {
                    setEditingTask(null);
                    setShowEditor(true);
                  }}
                >
                  <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
                  <Text style={styles.addBtnText}>Add Task</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Tasks list */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : tasks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="calendar-check-outline"
                  size={42}
                  color={colors.textMuted}
                />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No tasks recorded for this day.
                </Text>
                {!day.isFrozen && (
                  <TouchableOpacity
                    style={styles.emptyAddBtn}
                    onPress={() => {
                      setEditingTask(null);
                      setShowEditor(true);
                    }}
                  >
                    <Text style={styles.emptyAddBtnText}>
                      + Add Task
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <ScrollView
                style={styles.tasksList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
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
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
    minHeight: 460,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 8,
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
    marginBottom: 12,
  },
  dateInfo: {
    flex: 1,
  },
  fullDate: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  frozenTagText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  futureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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
  frozenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  frozenBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 14,
  },
  loaderWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderPctText: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressDetails: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0A84FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 4,
  },
  emptyAddBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#0A84FF',
  },
  emptyAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tasksList: {
    flex: 1,
  },
});
