import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeType } from '../../styles/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  variant?: 'default' | 'gradient' | 'rounded';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  variant = 'default',
  showLabel = false,
  label,
  animated = true,
  color,
}) => {
  const theme = useTheme() as ThemeType;
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      animatedProgress.setValue(progress);
    }
  }, [progress, animated, animatedProgress]);

  const getProgressColor = () => {
    return color || theme.colors.primary;
  };

  const getBorderRadius = () => {
    return variant === 'rounded' ? height / 2 : theme.borderRadius.sm;
  };

  const progressWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Container>
      {showLabel && (
        <LabelContainer>
          <LabelText>{label}</LabelText>
          <PercentageText>{Math.round(progress * 100)}%</PercentageText>
        </LabelContainer>
      )}
      <ProgressContainer
        style={{
          height,
          borderRadius: getBorderRadius(),
        }}
      >
        {variant === 'gradient' ? (
          <Animated.View
            style={{
              width: progressWidth,
              height: '100%',
              borderRadius: getBorderRadius(),
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Animated.View>
        ) : (
          <ProgressFill
            style={{
              width: progressWidth,
              height: '100%',
              backgroundColor: getProgressColor(),
              borderRadius: getBorderRadius(),
            }}
          />
        )}
      </ProgressContainer>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const LabelText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const PercentageText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ProgressContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`;

const ProgressFill = styled(Animated.View)``;

export default ProgressBar;
