import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeType } from '../../styles/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  variant?: 'default' | 'gradient' | 'transparent';
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  variant = 'default',
  showBackButton = false,
}) => {
  const theme = useTheme() as ThemeType;
  const insets = useSafeAreaInsets();

  const getHeaderStyle = () => {
    const baseStyle = {
      paddingTop: Math.max(insets.top, theme.spacing.md),
      paddingHorizontal: theme.spacing.screen.horizontal,
      paddingBottom: theme.spacing.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.card,
        ...theme.shadows.sm,
      },
      gradient: {
        // Will be handled by LinearGradient
      },
      transparent: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const getTextColor = () => {
    return variant === 'gradient' ? theme.colors.white : theme.colors.text;
  };

  const getSubtitleColor = () => {
    return variant === 'gradient' ? 'rgba(255, 255, 255, 0.8)' : theme.colors.secondaryText;
  };

  const renderContent = () => (
    <>
      <LeftSection>
        {(showBackButton || leftIcon) && (
          <IconButton onPress={onLeftPress}>
            <Icon
              name={showBackButton ? 'arrow-back' : leftIcon || 'menu'}
              size={24}
              color={getTextColor()}
            />
          </IconButton>
        )}
      </LeftSection>

      <CenterSection>
        <HeaderTitle style={{ color: getTextColor() }}>{title}</HeaderTitle>
        {subtitle && (
          <HeaderSubtitle style={{ color: getSubtitleColor() }}>
            {subtitle}
          </HeaderSubtitle>
        )}
      </CenterSection>

      <RightSection>
        {rightIcon && (
          <IconButton onPress={onRightPress}>
            <Icon name={rightIcon} size={24} color={getTextColor()} />
          </IconButton>
        )}
      </RightSection>
    </>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={getHeaderStyle()}
      >
        {renderContent()}
      </LinearGradient>
    );
  }

  return <HeaderContainer style={getHeaderStyle()}>{renderContent()}</HeaderContainer>;
};

const HeaderContainer = styled.View``;

const LeftSection = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const CenterSection = styled.View`
  flex: 2;
  align-items: center;
`;

const RightSection = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const HeaderSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const IconButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

export default Header;
