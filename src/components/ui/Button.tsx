import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeType } from '../../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const theme = useTheme() as ThemeType;

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.button,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      ...theme.shadows.sm,
    };

    const sizeStyles = {
      small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        minHeight: 36,
      },
      medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 44,
      },
      large: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 52,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      gradient: {
        // Will be handled by LinearGradient
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    };
  };

  const getTextStyle = () => {
    const sizeStyles = {
      small: {
        fontSize: theme.typography.fontSize.sm,
      },
      medium: {
        fontSize: theme.typography.fontSize.md,
      },
      large: {
        fontSize: theme.typography.fontSize.lg,
      },
    };

    const variantStyles = {
      primary: {
        color: theme.colors.white,
      },
      secondary: {
        color: theme.colors.white,
      },
      outline: {
        color: theme.colors.primary,
      },
      ghost: {
        color: theme.colors.primary,
      },
      gradient: {
        color: theme.colors.white,
      },
    };

    return {
      fontWeight: theme.typography.fontWeight.semibold,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.white} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon 
              name={icon} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={getTextStyle().color}
              style={{ marginRight: theme.spacing.xs }}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Icon 
              name={icon} 
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              color={getTextStyle().color}
              style={{ marginLeft: theme.spacing.xs }}
            />
          )}
        </>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={getButtonStyle()}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
