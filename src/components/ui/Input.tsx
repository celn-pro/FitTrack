import React, { useState } from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeType } from '../../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  size = 'medium',
  style,
  ...props
}) => {
  const theme = useTheme() as ThemeType;
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = () => {
    const sizeStyles = {
      small: {
        minHeight: 36,
        paddingHorizontal: theme.spacing.sm,
      },
      medium: {
        minHeight: 44,
        paddingHorizontal: theme.spacing.md,
      },
      large: {
        minHeight: 52,
        paddingHorizontal: theme.spacing.lg,
      },
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.card,
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
      },
      filled: {
        backgroundColor: theme.colors.surface,
        borderWidth: 0,
      },
    };

    return {
      borderRadius: theme.borderRadius.input,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      ...sizeStyles[size],
      ...variantStyles[variant],
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

    return {
      flex: 1,
      color: theme.colors.text,
      ...sizeStyles[size],
    };
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputContainer style={getContainerStyle()}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={iconSize}
            color={theme.colors.secondaryText}
            style={{ marginRight: theme.spacing.sm }}
          />
        )}
        <TextInput
          style={[getTextStyle(), style]}
          placeholderTextColor={theme.colors.secondaryText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <IconButton onPress={onRightIconPress}>
            <Icon
              name={rightIcon}
              size={iconSize}
              color={theme.colors.secondaryText}
            />
          </IconButton>
        )}
      </InputContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Label = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const InputContainer = styled.View``;

const ErrorText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const IconButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

export default Input;
