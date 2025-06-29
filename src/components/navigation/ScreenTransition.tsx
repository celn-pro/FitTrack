import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { ThemeType } from '../../styles/theme';

interface ScreenTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'slideUp';
  duration?: number;
  delay?: number;
  onAnimationComplete?: () => void;
}

const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  delay = 0,
  onAnimationComplete,
}) => {
  const theme = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const translateX = useSharedValue(50);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const startAnimation = () => {
      switch (type) {
        case 'fade':
          opacity.value = withTiming(1, {
            duration,
            easing: Easing.out(Easing.cubic),
          }, (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
          break;

        case 'slide':
          opacity.value = withTiming(1, { duration: duration / 2 });
          translateX.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          }, (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
          break;

        case 'slideUp':
          opacity.value = withTiming(1, { duration: duration / 2 });
          translateY.value = withSpring(0, {
            damping: 15,
            stiffness: 150,
          }, (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
          break;

        case 'scale':
          opacity.value = withTiming(1, { duration: duration / 2 });
          scale.value = withSpring(1, {
            damping: 12,
            stiffness: 100,
          }, (finished) => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
          break;
      }
    };

    if (delay > 0) {
      setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
  }, [type, duration, delay, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseStyle = {
      opacity: opacity.value,
    };

    switch (type) {
      case 'slide':
        return {
          ...baseStyle,
          transform: [{ translateX: translateX.value }],
        };
      case 'slideUp':
        return {
          ...baseStyle,
          transform: [{ translateY: translateY.value }],
        };
      case 'scale':
        return {
          ...baseStyle,
          transform: [{ scale: scale.value }],
        };
      default:
        return baseStyle;
    }
  });

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: theme.colors.background }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default ScreenTransition;
