import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeType } from '../../styles/theme';

interface ScreenProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'card';
  scrollable?: boolean;
  padding?: boolean;
  safeArea?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

const Screen: React.FC<ScreenProps> = ({
  children,
  variant = 'default',
  scrollable = false,
  padding = true,
  safeArea = true,
  style,
  contentContainerStyle,
}) => {
  const theme = useTheme() as ThemeType;
  const insets = useSafeAreaInsets();

  const getContainerStyle = () => {
    const baseStyle = {
      flex: 1,
    };

    const paddingStyle = padding ? {
      paddingHorizontal: theme.spacing.screen.horizontal,
    } : {};

    const safeAreaStyle = safeArea ? {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    } : {};

    return {
      ...baseStyle,
      ...paddingStyle,
      ...safeAreaStyle,
    };
  };

  const getBackgroundColor = () => {
    const variants = {
      default: theme.colors.background,
      gradient: 'transparent',
      card: theme.colors.card,
    };
    return variants[variant];
  };

  if (variant === 'gradient') {
    const Container = scrollable ? ScrollView : styled.View``;
    
    return (
      <GradientContainer>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <Container
            style={[getContainerStyle(), style]}
            contentContainerStyle={scrollable ? contentContainerStyle : undefined}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </Container>
        </LinearGradient>
      </GradientContainer>
    );
  }

  if (scrollable) {
    return (
      <Container style={{ backgroundColor: getBackgroundColor() }}>
        <ScrollView
          style={[getContainerStyle(), style]}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Container>
    );
  }

  return (
    <Container style={[getContainerStyle(), { backgroundColor: getBackgroundColor() }, style]}>
      {children}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const GradientContainer = styled.View`
  flex: 1;
`;

export default Screen;
