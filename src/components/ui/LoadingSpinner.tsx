import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeType } from '../../styles/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  variant?: 'default' | 'gradient' | 'dots';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
  variant = 'default',
}) => {
  const theme = useTheme() as ThemeType;
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValues = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;

  const getSizeValue = () => {
    const sizes = {
      small: 20,
      medium: 32,
      large: 48,
    };
    return sizes[size];
  };

  const getColor = () => {
    return color || theme.colors.primary;
  };

  useEffect(() => {
    if (variant === 'dots') {
      const animateDots = () => {
        const animations = scaleValues.map((value, index) =>
          Animated.sequence([
            Animated.delay(index * 200),
            Animated.timing(value, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0.3,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );

        Animated.loop(
          Animated.parallel(animations),
          { iterations: -1 }
        ).start();
      };

      animateDots();
    } else {
      const spin = () => {
        spinValue.setValue(0);
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => spin());
      };

      spin();
    }
  }, [variant, spinValue, scaleValues]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (variant === 'dots') {
    return (
      <DotsContainer>
        {scaleValues.map((scaleValue, index) => (
          <Animated.View
            key={index}
            style={{
              transform: [{ scale: scaleValue }],
            }}
          >
            <Dot
              style={{
                width: getSizeValue() / 3,
                height: getSizeValue() / 3,
                backgroundColor: getColor(),
              }}
            />
          </Animated.View>
        ))}
      </DotsContainer>
    );
  }

  if (variant === 'gradient') {
    return (
      <SpinnerContainer style={{ width: getSizeValue(), height: getSizeValue() }}>
        <Animated.View
          style={{
            transform: [{ rotate: spin }],
            width: '100%',
            height: '100%',
          }}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryLight, 'transparent']}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: getSizeValue() / 2,
            }}
          />
        </Animated.View>
      </SpinnerContainer>
    );
  }

  return (
    <SpinnerContainer style={{ width: getSizeValue(), height: getSizeValue() }}>
      <Animated.View
        style={{
          transform: [{ rotate: spin }],
          width: '100%',
          height: '100%',
          borderWidth: 2,
          borderColor: 'transparent',
          borderTopColor: getColor(),
          borderRadius: getSizeValue() / 2,
        }}
      />
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const DotsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.View`
  border-radius: 50px;
  margin: 0 2px;
`;

export default LoadingSpinner;
