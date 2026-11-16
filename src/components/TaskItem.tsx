import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import * as Haptics from 'expo-haptics';

interface TaskItemProps {
  task: Task;
  isFrozen: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = React.memo(({
  task,
  isFrozen,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const { colors, mode } = useTheme();
  const isCompleted = task.completed === 1;

  const handleToggle = () => {
    if (isFrozen) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
    onToggle(task.id);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#FF3B30';
      case 'low':
        return '#00C7BE';
      default:
        return '#FF9500';
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isCompleted
            ? mode === 'dark' ? '#131318' : '#F8FAFC'
            : colors.surface,
          borderColor: isCompleted
            ? mode === 'dark' ? '#2A2A38' : '#E2E8F0'
            : colors.surfaceBorder,
        },
      ]}
    >
      {/* Checkbox button */}
      <TouchableOpacity
        activeOpacity={isFrozen ? 1 : 0.7}
        onPress={handleToggle}
        disabled={isFrozen}
        style={[
          styles.checkbox,
          {
            borderColor: isCompleted
              ? '#2ECC71'
              : isFrozen
              ? colors.textMuted
              : colors.textSecondary,
            backgroundColor: isCompleted
              ? '#2ECC71'
              : 'transparent',
            opacity: isFrozen && !isCompleted ? 0.6 : 1,
          },
        ]}
      >
        {isCompleted && (
          <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
        )}
      </TouchableOpacity>

      {/* Task Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              {
                color: isCompleted ? colors.textMuted : colors.text,
                textDecorationLine: isCompleted ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.priority !== 'normal' && (
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: `${getPriorityColor()}20` },
              ]}
            >
              <Text style={[styles.priorityText, { color: getPriorityColor() }]}>
                {task.priority.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {task.notes && task.notes.trim().length > 0 && (
          <Text
            style={[styles.notes, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {task.notes}
          </Text>
        )}
      </View>

      {/* Action buttons (Edit & Delete) - only visible if not frozen */}
      {!isFrozen ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onEdit(task)}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onDelete(task.id)}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={18}
              color="#FF453A"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={16}
            color={colors.textMuted}
          />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  notes: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
});
