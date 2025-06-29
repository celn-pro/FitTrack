import React from 'react';
import { View, Text } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeType } from '../../styles/theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'circular' | 'rounded' | 'square';
  showBorder?: boolean;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
  fallbackIcon?: string;
  onPress?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  variant = 'circular',
  showBorder = false,
  showOnlineIndicator = false,
  isOnline = false,
  fallbackIcon = 'person',
  onPress,
}) => {
  const theme = useTheme() as ThemeType;

  const getSizeStyle = () => {
    const sizes = {
      small: { width: 32, height: 32 },
      medium: { width: 48, height: 48 },
      large: { width: 64, height: 64 },
      xlarge: { width: 96, height: 96 },
    };
    return sizes[size];
  };

  const getBorderRadius = () => {
    const sizeStyle = getSizeStyle();
    const variants = {
      circular: sizeStyle.width / 2,
      rounded: theme.borderRadius.md,
      square: 0,
    };
    return variants[variant];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFontSize = () => {
    const fontSizes = {
      small: theme.typography.fontSize.xs,
      medium: theme.typography.fontSize.sm,
      large: theme.typography.fontSize.md,
      xlarge: theme.typography.fontSize.lg,
    };
    return fontSizes[size];
  };

  const getIconSize = () => {
    const iconSizes = {
      small: 16,
      medium: 24,
      large: 32,
      xlarge: 48,
    };
    return iconSizes[size];
  };

  const getOnlineIndicatorSize = () => {
    const indicatorSizes = {
      small: 8,
      medium: 12,
      large: 16,
      xlarge: 20,
    };
    return indicatorSizes[size];
  };

  const containerStyle = {
    ...getSizeStyle(),
    borderRadius: getBorderRadius(),
    borderWidth: showBorder ? 2 : 0,
    borderColor: theme.colors.primary,
    overflow: 'hidden' as const,
  };

  const renderContent = () => {
    if (source) {
      return (
        <AvatarImage
          source={{ uri: source }}
          style={containerStyle}
          resizeMode={FastImage.resizeMode.cover}
        />
      );
    }

    if (name) {
      return (
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={[containerStyle, { alignItems: 'center', justifyContent: 'center' }]}
        >
          <InitialsText style={{ fontSize: getFontSize() }}>
            {getInitials(name)}
          </InitialsText>
        </LinearGradient>
      );
    }

    return (
      <FallbackContainer style={containerStyle}>
        <Icon
          name={fallbackIcon}
          size={getIconSize()}
          color={theme.colors.secondaryText}
        />
      </FallbackContainer>
    );
  };

  const Container = onPress ? styled.TouchableOpacity`` : styled.View``;

  return (
    <AvatarContainer>
      <Container onPress={onPress} activeOpacity={onPress ? 0.8 : 1}>
        {renderContent()}
      </Container>
      {showOnlineIndicator && (
        <OnlineIndicator
          style={{
            width: getOnlineIndicatorSize(),
            height: getOnlineIndicatorSize(),
            borderRadius: getOnlineIndicatorSize() / 2,
            backgroundColor: isOnline ? theme.colors.success : theme.colors.secondaryText,
          }}
        />
      )}
    </AvatarContainer>
  );
};

const AvatarContainer = styled.View`
  position: relative;
`;

const AvatarImage = styled(FastImage)``;

const FallbackContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  align-items: center;
  justify-content: center;
`;

const InitialsText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const OnlineIndicator = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.card};
`;

export default Avatar;
