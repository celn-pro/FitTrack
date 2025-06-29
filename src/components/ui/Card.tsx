import React from 'react';
import { View, ViewStyle } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeType } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'medium',
  style,
  onPress,
}) => {
  const theme = useTheme() as ThemeType;

  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.card,
      backgroundColor: theme.colors.card,
    };

    const paddingStyles = {
      none: { padding: 0 },
      small: { padding: theme.spacing.sm },
      medium: { padding: theme.spacing.md },
      large: { padding: theme.spacing.lg },
    };

    const marginStyles = {
      none: { margin: 0 },
      small: { margin: theme.spacing.sm },
      medium: { margin: theme.spacing.md },
      large: { margin: theme.spacing.lg },
    };

    const variantStyles = {
      default: {
        ...theme.shadows.sm,
      },
      elevated: {
        ...theme.shadows.lg,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.none,
      },
      gradient: {
        // Will be handled by LinearGradient
        ...theme.shadows.md,
      },
    };

    return {
      ...baseStyle,
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...variantStyles[variant],
    };
  };

  if (variant === 'gradient') {
    const CardContainer = onPress ? styled.TouchableOpacity`` : styled.View``;
    
    return (
      <CardContainer onPress={onPress} style={style} activeOpacity={onPress ? 0.8 : 1}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={getCardStyle()}
        >
          {children}
        </LinearGradient>
      </CardContainer>
    );
  }

  const CardContainer = onPress ? styled.TouchableOpacity`` : styled.View``;

  return (
    <CardContainer
      onPress={onPress}
      style={[getCardStyle(), style]}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </CardContainer>
  );
};

// Styled components for common card layouts
export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const CardTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

export const CardSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

export const CardContent = styled.View`
  flex: 1;
`;

export const CardFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export default Card;
