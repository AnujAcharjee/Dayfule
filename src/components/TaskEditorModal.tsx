import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  LayoutAnimation,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task, TaskPriority } from '@/types';
import { useTheme } from '@/context/ThemeContext';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TaskEditorModalProps {
  visible: boolean;
  dateStr: string;
  initialTask?: Task | null;
  onSave: (data: { title: string; notes?: string; priority: TaskPriority }) => void;
  onClose: () => void;
}

export const TaskEditorModal: React.FC<TaskEditorModalProps> = ({
  visible,
  dateStr,
  initialTask,
  onSave,
  onClose,
}) => {
  const { colors, mode } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [error, setError] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Dynamic maximum sheet height that adapts to software keyboard on both Android & iOS
  const maxSheetHeight =
    keyboardHeight > 0
      ? Math.max(260, windowHeight - keyboardHeight - (Platform.OS === 'android' ? 24 : 44))
      : windowHeight * 0.88;

  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const notesInputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        if (Platform.OS === 'android') {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        if (Platform.OS === 'android') {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      if (initialTask) {
        setTitle(initialTask.title);
        setNotes(initialTask.notes || '');
        setPriority(initialTask.priority);
      } else {
        setTitle('');
        setNotes('');
        setPriority('normal');
      }
      setError('');
    } else {
      setKeyboardHeight(0);
    }
  }, [visible, initialTask]);

  const handleSave = () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    onSave({
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
    });
  };

  if (!visible) return null;

  const isEditing = !!initialTask;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          styles.overlay,
          Platform.OS === 'android' && { paddingBottom: keyboardHeight },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.sheetContainer,
            { backgroundColor: colors.surface, maxHeight: maxSheetHeight },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {isEditing ? 'Edit Task' : 'New Task'}
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                For {dateStr}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.formScroll}
            contentContainerStyle={styles.formScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {/* Title Input */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: error ? '#FF9500' : colors.cardBorder,
                  color: colors.text,
                },
              ]}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (error) setError('');
              }}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => notesInputRef.current?.focus()}
              onFocus={() => {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Priority Selector */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>
              Priority
            </Text>
            <View style={styles.priorityRow}>
              {(['low', 'normal', 'high'] as TaskPriority[]).map((p) => {
                const isSelected = priority === p;
                const pColor = p === 'high' ? '#AF52DE' : p === 'low' ? '#00C7BE' : '#FF9500';

                return (
                  <TouchableOpacity
                    key={p}
                    activeOpacity={0.8}
                    onPress={() => setPriority(p)}
                    style={[
                      styles.priorityOption,
                      {
                        backgroundColor: isSelected ? `${pColor}25` : colors.card,
                        borderColor: isSelected ? pColor : colors.cardBorder,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: pColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.priorityLabel,
                        {
                          color: isSelected ? colors.text : colors.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {p.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Notes Input */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>
              Notes (Optional)
            </Text>
            <TextInput
              ref={notesInputRef}
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  color: colors.text,
                },
              ]}
              placeholder="Add details, steps, or links..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              onFocus={() => {
                setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.saveButton, { backgroundColor: '#0A84FF' }]}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>
                {isEditing ? 'Update Task' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  formScroll: {
    marginBottom: 0,
  },
  formScrollContent: {
    paddingBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 80,
  },
  errorText: {
    color: '#FF9500',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  saveButton: {
    marginTop: 22,
    borderRadius: 14,
    backgroundColor: '#0A84FF',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
