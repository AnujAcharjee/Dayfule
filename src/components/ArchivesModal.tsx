import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite';
import { useTheme } from '@/context/ThemeContext';
import { TasksRepository } from '@/database/tasksRepository';
import { YearArchive } from '@/types';
import { RAINBOW_STOPS } from '@/utils/colors';

interface ArchivesModalProps {
  visible: boolean;
  currentSelectedYear: number;
  onSelectYear: (year: number) => void;
  onClose: () => void;
}

export const ArchivesModal: React.FC<ArchivesModalProps> = ({
  visible,
  currentSelectedYear,
  onSelectYear,
  onClose,
}) => {
  const { colors, mode } = useTheme();
  const db = useSQLiteContext();
  const repo = new TasksRepository(db);

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [archivedYears, setArchivedYears] = useState<YearArchive[]>([]);
  const currentActualYear = new Date().getFullYear();

  useEffect(() => {
    if (visible) {
      loadYears();
    }
  }, [visible]);

  const loadYears = async () => {
    try {
      const yearsWithData = await repo.getYearsWithData();
      // Ensure current year and surrounding years exist in the list
      const yearsSet = new Set(yearsWithData);
      yearsSet.add(currentActualYear);
      yearsSet.add(currentActualYear - 1);
      yearsSet.add(currentActualYear + 1);

      const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
      setAvailableYears(sortedYears);

      const archives = await repo.getArchivedYears();
      setArchivedYears(archives);
    } catch (err) {
      console.error('Failed to load archived years', err);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {/* Grab handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.surfaceBorder }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Year Archives</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Browse your productivity history and previous years
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Years List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {availableYears.map((year) => {
              const isSelected = year === currentSelectedYear;
              const isCurrent = year === currentActualYear;
              const archiveInfo = archivedYears.find((a) => a.year === year);
              const isArchived = !!archiveInfo;

              return (
                <TouchableOpacity
                  key={year}
                  activeOpacity={0.75}
                  onPress={() => {
                    onSelectYear(year);
                    onClose();
                  }}
                  style={[
                    styles.yearCard,
                    {
                      backgroundColor: isSelected ? colors.surfaceHover : colors.card,
                      borderColor: isSelected ? '#FF2D55' : colors.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.cardLeft}>
                    <Text
                      style={[
                        styles.yearText,
                        {
                          color: isSelected ? colors.text : colors.textSecondary,
                          fontWeight: isSelected ? '900' : '700',
                        },
                      ]}
                    >
                      {year}
                    </Text>

                    <View style={styles.badgesRow}>
                      {isCurrent && (
                        <LinearGradient
                          colors={['#FF2D55', '#FF9500']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.badgePill}
                        >
                          <Text style={styles.badgeText}>CURRENT</Text>
                        </LinearGradient>
                      )}

                      {isArchived ? (
                        <View
                          style={[
                            styles.frozenPill,
                            { backgroundColor: mode === 'dark' ? '#202026' : '#E2E8F0' },
                          ]}
                        >
                          <MaterialCommunityIcons name="lock" size={10} color={colors.textMuted} />
                          <Text style={[styles.frozenText, { color: colors.textMuted }]}>
                            FROZEN ARCHIVE
                          </Text>
                        </View>
                      ) : year < currentActualYear ? (
                        <View style={[styles.frozenPill, { backgroundColor: colors.frozenBg }]}>
                          <Text style={[styles.frozenText, { color: colors.textMuted }]}>
                            PAST YEAR
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.cardRight}>
                    {isSelected && (
                      <MaterialCommunityIcons name="check-circle" size={22} color="#2ECC71" />
                    )}
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color={colors.textMuted}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    maxHeight: '80%',
    minHeight: 400,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  list: {
    flex: 1,
  },
  yearCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  yearText: {
    fontSize: 20,
    letterSpacing: -0.5,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  frozenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  frozenText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
