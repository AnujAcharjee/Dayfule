import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { RAINBOW_STOPS } from '@/utils/colors';

interface RainbowCelebrationProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  dateStr?: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Generate confetti pieces with random positions, colors, angles, and velocities
const NUM_CONFETTI = 35;
interface ConfettiPiece {
  x: number;
  yAnim: Animated.Value;
  xAnim: Animated.Value;
  rotationAnim: Animated.Value;
  scaleAnim: Animated.Value;
  color: string;
  size: number;
  shape: 'circle' | 'rect';
}

export const RainbowCelebration: React.FC<RainbowCelebrationProps> = ({
  visible,
  title = 'Day Complete!',
  subtitle = 'You finished all your planned tasks for today. Keep up the legendary momentum!',
  dateStr,
  onClose,
}) => {
  const { colors, mode } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Initialize confetti animations
  const confettiList = useRef<ConfettiPiece[]>(
    Array.from({ length: NUM_CONFETTI }, (_, i) => ({
      x: Math.random() * SCREEN_WIDTH,
      yAnim: new Animated.Value(-20),
      xAnim: new Animated.Value(0),
      rotationAnim: new Animated.Value(0),
      scaleAnim: new Animated.Value(0),
      color: RAINBOW_STOPS[i % RAINBOW_STOPS.length],
      size: Math.floor(Math.random() * 8) + 8,
      shape: i % 2 === 0 ? 'rect' : 'circle',
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Trigger haptics
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        // Haptics safe fallback
      }

      // Pop-in animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate confetti fall
      const animations = confettiList.map((piece) => {
        piece.yAnim.setValue(-20);
        piece.xAnim.setValue(0);
        piece.rotationAnim.setValue(0);
        piece.scaleAnim.setValue(1);

        const drift = (Math.random() - 0.5) * 120;
        const duration = 2000 + Math.random() * 1200;
        const delay = Math.random() * 300;

        return Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(piece.yAnim, {
              toValue: SCREEN_HEIGHT + 40,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(piece.xAnim, {
              toValue: drift,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(piece.rotationAnim, {
              toValue: 360 * (Math.random() > 0.5 ? 2 : -2),
              duration,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });

      Animated.parallel(animations).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Confetti particles */}
        {confettiList.map((piece, index) => {
          const spin = piece.rotationAnim.interpolate({
            inputRange: [-360, 360],
            outputRange: ['-360deg', '360deg'],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  left: piece.x,
                  width: piece.shape === 'rect' ? piece.size * 1.4 : piece.size,
                  height: piece.size,
                  borderRadius: piece.shape === 'circle' ? piece.size / 2 : 2,
                  backgroundColor: piece.color,
                  transform: [
                    { translateY: piece.yAnim },
                    { translateX: piece.xAnim },
                    { rotate: spin },
                    { scale: piece.scaleAnim },
                  ],
                },
              ]}
            />
          );
        })}

        {/* Backdrop overlay */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Rainbow Border Card Container */}
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Outer Rainbow Gradient Border */}
          <LinearGradient
            colors={RAINBOW_STOPS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rainbowBorder}
          >
            {/* Inner Content Card */}
            <View style={[styles.cardContent, { backgroundColor: colors.surface }]}>
              {/* Rainbow Icon Badge */}
              <LinearGradient
                colors={['#FF2D55', '#FFA500', '#2ECC71', '#00C9FF', '#8A2387']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircle}
              >
                <View style={[styles.innerIconCircle, { backgroundColor: colors.surface }]}>
                  <MaterialCommunityIcons name="trophy-variant" size={38} color="#FFD700" />
                </View>
              </LinearGradient>

              {dateStr && (
                <View style={[styles.datePill, { backgroundColor: colors.surfaceHover }]}>
                  <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                    {dateStr}
                  </Text>
                </View>
              )}

              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>

              {/* Progress 100% Badge */}
              <View style={styles.badgeRow}>
                <LinearGradient
                  colors={['#2ECC71', '#00C9FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.pctBadge}
                >
                  <MaterialCommunityIcons name="check-all" size={16} color="#FFFFFF" />
                  <Text style={styles.pctText}>100% COMPLETE</Text>
                </LinearGradient>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={onClose}
              >
                <Text style={styles.actionButtonText}>Awesome!</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    zIndex: 9999,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 15,
  },
  rainbowBorder: {
    borderRadius: 24,
    padding: 3, // rainbow border thickness
  },
  cardContent: {
    borderRadius: 21,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 3,
  },
  innerIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  badgeRow: {
    marginBottom: 24,
  },
  pctBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pctText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  actionButton: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#0A84FF',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
