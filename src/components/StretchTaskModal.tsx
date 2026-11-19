import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TaskPriority } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import {
  formatDateKey,
  parseDateKey,
  getTodayKey,
  getDateRangeArray,
  formatDateShort,
  addDaysToDateKey,
  MONTH_NAMES,
  WEEKDAY_NAMES_SHORT,
} from '@/utils/dateUtils';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface StretchTaskModalProps {
  visible: boolean;
  onSave: (data: {
    date_strings: string[];
    title: string;
    notes?: string;
    priority: TaskPriority;
  }) => Promise<void>;
  onClose: () => void;
}

export const StretchTaskModal: React.FC<StretchTaskModalProps> = ({
  visible,
  onSave,
  onClose,
}) => {
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();

  const todayKey = useMemo(() => getTodayKey(), []);
  const [startDate, setStartDate] = useState<string>(todayKey);
  const [endDate, setEndDate] = useState<string>(() => addDaysToDateKey(todayKey, 6));

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Dynamic maximum sheet height that adapts to software keyboard
  const maxSheetHeight =
    keyboardHeight > 0
      ? Math.max(280, windowHeight - keyboardHeight - (Platform.OS === 'android' ? 24 : 44))
      : windowHeight * 0.90;

  // Month currently viewed in the mini calendar map
  const [viewYearMonth, setViewYearMonth] = useState<{ year: number; month: number }>(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const [selectionTarget, setSelectionTarget] = useState<'start' | 'end'>('start');

  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const notesInputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  // Keyboard avoidance listeners for Android & iOS
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

  // Reset state on open
  useEffect(() => {
    if (visible) {
      const currentToday = getTodayKey();
      setStartDate(currentToday);
      setEndDate(addDaysToDateKey(currentToday, 6));
      setTitle('');
      setNotes('');
      setPriority('normal');
      setError('');
      setSaving(false);
      setSelectionTarget('start');

      const d = new Date();
      setViewYearMonth({ year: d.getFullYear(), month: d.getMonth() });
    } else {
      setKeyboardHeight(0);
    }
  }, [visible]);

  // Selected date strings array
  const selectedDates = useMemo(() => {
    return getDateRangeArray(startDate, endDate);
  }, [startDate, endDate]);

  const selectedDatesSet = useMemo(() => {
    return new Set(selectedDates);
  }, [selectedDates]);

  // Quick preset helper
  const applyPreset = (daysCount: number, startOffset: number = 0) => {
    const s = addDaysToDateKey(todayKey, startOffset);
    const e = addDaysToDateKey(s, daysCount - 1);
    setStartDate(s);
    setEndDate(e);

    const startDateObj = parseDateKey(s);
    setViewYearMonth({
      year: startDateObj.getFullYear(),
      month: startDateObj.getMonth(),
    });
    setSelectionTarget('start');
  };

  // Month navigation for map
  const handlePrevMonth = () => {
    setViewYearMonth((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setViewYearMonth((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  // Tapping a date in the calendar map
  const handleDayTap = (dateStr: string) => {
    if (selectionTarget === 'start') {
      setStartDate(dateStr);
      // If end date is now before start, push end date to same day
      if (dateStr > endDate) {
        setEndDate(dateStr);
      }
      setSelectionTarget('end');
    } else {
      // selecting end
      if (dateStr < startDate) {
        // Tapped before start -> make it the new start
        setStartDate(dateStr);
        setSelectionTarget('end');
      } else {
        setEndDate(dateStr);
        setSelectionTarget('start');
      }
    }
  };

  // Generate calendar days for the currently viewed month
  const calendarCells = useMemo(() => {
    const { year, month } = viewYearMonth;
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startWeekday = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

    const cells: { dateStr?: string; dayNum?: number }[] = [];

    // Leading padding cells
    for (let i = 0; i < startWeekday; i++) {
      cells.push({});
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({
        dateStr: formatDateKey(date),
        dayNum: d,
      });
    }

    return cells;
  }, [viewYearMonth]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (selectedDates.length === 0) {
      setError('Please select at least 1 day');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        date_strings: selectedDates,
        title: title.trim(),
        notes: notes.trim() || undefined,
        priority,
      });
      onClose();
    } catch (err) {
      setError('Failed to save stretch tasks');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

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
              <View style={styles.headerBadgeRow}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Stretch Task</Text>
                <View style={styles.stretchTag}>
                  <MaterialCommunityIcons name="calendar-range" size={13} color="#FF6D00" />
                  <Text style={styles.stretchTagText}>Multi-Day</Text>
                </View>
              </View>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Add the same task across a stretch of days
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
            {/* Quick Presets */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Quick Range Presets</Text>
            <View style={styles.presetRow}>
              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  selectedDates.length === 7 && startDate === todayKey
                    ? styles.presetBtnActive
                    : { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
                onPress={() => applyPreset(7)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    selectedDates.length === 7 && startDate === todayKey
                      ? styles.presetBtnTextActive
                      : { color: colors.textSecondary },
                  ]}
                >
                  Next 7 Days
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  selectedDates.length === 14 && startDate === todayKey
                    ? styles.presetBtnActive
                    : { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
                onPress={() => applyPreset(14)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    selectedDates.length === 14 && startDate === todayKey
                      ? styles.presetBtnTextActive
                      : { color: colors.textSecondary },
                  ]}
                >
                  Next 14 Days
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.presetBtn,
                  selectedDates.length === 30 && startDate === todayKey
                    ? styles.presetBtnActive
                    : { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
                onPress={() => applyPreset(30)}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    selectedDates.length === 30 && startDate === todayKey
                      ? styles.presetBtnTextActive
                      : { color: colors.textSecondary },
                  ]}
                >
                  Next 30 Days
                </Text>
              </TouchableOpacity>
            </View>

            {/* Range Map / Calendar Grid */}
            <View style={[styles.calendarMapCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              {/* Calendar Month Header */}
              <View style={styles.calendarHeaderRow}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.monthNavBtn}>
                  <MaterialCommunityIcons name="chevron-left" size={20} color={colors.text} />
                </TouchableOpacity>

                <Text style={[styles.calendarMonthText, { color: colors.text }]}>
                  {MONTH_NAMES[viewYearMonth.month]} {viewYearMonth.year}
                </Text>

                <TouchableOpacity onPress={handleNextMonth} style={styles.monthNavBtn}>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Weekday headers */}
              <View style={styles.weekdayRow}>
                {WEEKDAY_NAMES_SHORT.map((w, idx) => (
                  <Text key={idx} style={[styles.weekdayText, { color: colors.textMuted }]}>
                    {w}
                  </Text>
                ))}
              </View>

              {/* Month Days Map */}
              <View style={styles.daysGrid}>
                {calendarCells.map((cell, idx) => {
                  if (!cell.dateStr) {
                    return <View key={`pad-${idx}`} style={styles.dayCellContainer} />;
                  }

                  const dateStr = cell.dateStr;
                  const isSelected = selectedDatesSet.has(dateStr);
                  const isStart = dateStr === startDate;
                  const isEnd = dateStr === endDate;
                  const isCurrentDay = dateStr === todayKey;

                  return (
                    <TouchableOpacity
                      key={dateStr}
                      activeOpacity={0.7}
                      onPress={() => handleDayTap(dateStr)}
                      style={[
                        styles.dayCellContainer,
                        isSelected && styles.dayCellSelectedTrack,
                        isStart && styles.dayCellStartTrack,
                        isEnd && styles.dayCellEndTrack,
                      ]}
                    >
                      <View
                        style={[
                          styles.dayCellCircle,
                          isSelected && styles.dayCellCircleHighlighted,
                          (isStart || isEnd) && styles.dayCellCircleEndpoint,
                          isCurrentDay && !isSelected && styles.dayCellCurrentDay,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayCellNum,
                            { color: colors.text },
                            isSelected && styles.dayCellNumSelected,
                            (isStart || isEnd) && styles.dayCellNumEndpoint,
                          ]}
                        >
                          {cell.dayNum}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Range Feedback Bar */}
              <View style={styles.rangeSummaryBar}>
                <View style={styles.rangeDatesBadge}>
                  <Text style={styles.rangeDatesText}>
                    {formatDateShort(startDate, true)}  ➔  {formatDateShort(endDate, true)}
                  </Text>
                </View>
                <View style={styles.rangeCountPill}>
                  <MaterialCommunityIcons name="fire" size={13} color="#FF6D00" />
                  <Text style={styles.rangeCountText}>
                    {selectedDates.length} {selectedDates.length === 1 ? 'Day' : 'Days'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Title Input */}
            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 14 }]}>Task Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: error ? '#FF9500' : colors.cardBorder,
                  color: colors.text,
                },
              ]}
              placeholder="e.g. Daily Workout, Study Calculus, 30m Reading"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (error) setError('');
              }}
              returnKeyType="next"
              onSubmitEditing={() => notesInputRef.current?.focus()}
              onFocus={() => {
                scrollRef.current?.scrollTo({ y: 150, animated: true });
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
              placeholder="Add details, routine steps, or goals..."
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

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={saving}
              style={[styles.saveButton, { backgroundColor: '#FF6D00' }]}
              onPress={handleSave}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.saveBtnContent}>
                  <MaterialCommunityIcons name="calendar-check" size={18} color="#FFFFFF" />
                  <Text style={styles.saveText}>
                    Add Task to {selectedDates.length} {selectedDates.length === 1 ? 'Day' : 'Days'}
                  </Text>
                </View>
              )}
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
    marginBottom: 12,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  stretchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 109, 0, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 109, 0, 0.3)',
  },
  stretchTagText: {
    color: '#FF6D00',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 12,
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
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  presetBtnActive: {
    backgroundColor: '#FF6D00',
    borderColor: '#FF6D00',
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  presetBtnTextActive: {
    color: '#FFFFFF',
  },
  calendarMapCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 6,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarMonthText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  monthNavBtn: {
    padding: 4,
    borderRadius: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellContainer: {
    width: `${100 / 7}%`,
    aspectRatio: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  dayCellSelectedTrack: {
    backgroundColor: 'rgba(255, 109, 0, 0.16)',
  },
  dayCellStartTrack: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: 'rgba(255, 109, 0, 0.25)',
  },
  dayCellEndTrack: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: 'rgba(255, 109, 0, 0.25)',
  },
  dayCellCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellCircleHighlighted: {
    backgroundColor: 'rgba(255, 109, 0, 0.3)',
  },
  dayCellCircleEndpoint: {
    backgroundColor: '#FF6D00',
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  dayCellCurrentDay: {
    borderWidth: 1,
    borderColor: '#0A84FF',
  },
  dayCellNum: {
    fontSize: 11,
    fontWeight: '600',
  },
  dayCellNumSelected: {
    color: '#FFA800',
    fontWeight: '700',
  },
  dayCellNumEndpoint: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  rangeSummaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  rangeDatesBadge: {
    flex: 1,
  },
  rangeDatesText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E4E4E7',
  },
  rangeCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 109, 0, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 109, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  rangeCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFA800',
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
    minHeight: 70,
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
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
