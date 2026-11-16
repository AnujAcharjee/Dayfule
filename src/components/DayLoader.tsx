import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DayProgress } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { getProgressColor } from '@/utils/colors';

interface DayLoaderProps {
  day: DayProgress;
  size?: number;
  strokeWidth?: number;
  showDayNumber?: boolean;
  onPress: (day: DayProgress) => void;
}

export const DayLoader: React.FC<DayLoaderProps> = React.memo(({
  day,
  size = 26,
  strokeWidth = 3,
  showDayNumber = false,
  onPress,
}) => {
  const { colors, mode } = useTheme();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - day.progress * circumference;

  const hasTasks = day.totalTasks > 0;
  const isPerfect = hasTasks && day.progress === 1;

  // Background ring color
  const trackColor = day.isFrozen
    ? mode === 'dark' ? '#202026' : '#E2E8F0'
    : mode === 'dark' ? '#2A2A36' : '#CBD5E1';

  // Gradient ID unique to this loader instance to avoid SVG defs collision
  const gradId = `dayGrad_${day.date_str}`;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(day)}
      style={[
        styles.touchable,
        { width: size, height: size },
        day.isToday && styles.todayWrapper,
      ]}
    >
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              {isPerfect ? [
                <Stop key="1" offset="0%" stopColor="#FF2D55" />,
                <Stop key="2" offset="25%" stopColor="#FFA500" />,
                <Stop key="3" offset="50%" stopColor="#2ECC71" />,
                <Stop key="4" offset="75%" stopColor="#00C9FF" />,
                <Stop key="5" offset="100%" stopColor="#AF52DE" />,
              ] : [
                <Stop key="a" offset="0%" stopColor="#00C9FF" />,
                <Stop key="b" offset="100%" stopColor="#2ECC71" />,
              ]}
            </LinearGradient>
          </Defs>

          {/* If Break Day: full round dark pink */}
          {day.isBreakDay ? (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#880E4F"
              strokeWidth={strokeWidth}
              fill="#C2185B"
            />
          ) : (
            <>
              {/* Background track circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={trackColor}
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Progress arc */}
              {hasTasks && day.progress > 0 && (
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={`url(#${gradId})`}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              )}
            </>
          )}
        </Svg>

        {/* Center content */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.centerContainer}>
            {day.isBreakDay ? (
              showDayNumber ? (
                <Text
                  style={[
                    styles.dayText,
                    {
                      fontSize: Math.max(8, size * 0.36),
                      color: '#FFFFFF',
                      fontWeight: '800',
                    },
                  ]}
                >
                  {day.dayOfMonth}
                </Text>
              ) : (
                <MaterialCommunityIcons
                  name="coffee"
                  size={Math.max(9, size * 0.44)}
                  color="#FFFFFF"
                />
              )
            ) : isPerfect ? (
              <MaterialCommunityIcons
                name="check"
                size={Math.max(10, size * 0.44)}
                color={day.isFrozen ? colors.textSecondary : '#2ECC71'}
              />
            ) : day.isFrozen && hasTasks && day.progress < 1 ? (
              <MaterialCommunityIcons
                name="lock-outline"
                size={Math.max(8, size * 0.36)}
                color={colors.textMuted}
              />
            ) : showDayNumber ? (
              <Text
                style={[
                  styles.dayText,
                  {
                    fontSize: Math.max(8, size * 0.36),
                    color: day.isToday
                      ? '#FFFFFF'
                      : day.isFrozen
                      ? colors.textMuted
                      : colors.textSecondary,
                    fontWeight: day.isToday ? '800' : '500',
                  },
                ]}
              >
                {day.dayOfMonth}
              </Text>
            ) : day.isToday ? (
              <View style={[styles.todayDot, { backgroundColor: '#0A84FF' }]} />
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayWrapper: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#0A84FF',
    padding: 1,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dayText: {
    letterSpacing: -0.5,
  },
});
