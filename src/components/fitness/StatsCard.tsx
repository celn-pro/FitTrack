import React from 'react';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeType } from '../../styles/theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'gradient' | 'compact';
  onPress?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  variant = 'default',
  onPress,
}) => {
  const theme = useTheme() as ThemeType;

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.colors.success;
      case 'down':
        return theme.colors.error;
      default:
        return theme.colors.secondaryText;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'trending-flat';
    }
  };

  const renderContent = () => (
    <>
      <CardHeader>
        <IconContainer variant={variant}>
          <Icon
            name={icon}
            size={variant === 'compact' ? 20 : 24}
            color={variant === 'gradient' ? theme.colors.white : theme.colors.primary}
          />
        </IconContainer>
        <CardTitle variant={variant}>{title}</CardTitle>
      </CardHeader>

      <ValueContainer>
        <ValueText variant={variant}>
          {value}
          {unit && <UnitText variant={variant}> {unit}</UnitText>}
        </ValueText>
      </ValueContainer>

      {trend && trendValue && (
        <TrendContainer>
          <Icon
            name={getTrendIcon()}
            size={16}
            color={getTrendColor()}
            style={{ marginRight: theme.spacing.xs }}
          />
          <TrendText style={{ color: getTrendColor() }}>{trendValue}</TrendText>
        </TrendContainer>
      )}
    </>
  );

  if (variant === 'gradient') {
    const Container = onPress ? styled.TouchableOpacity`` : styled.View``;
    
    return (
      <Container onPress={onPress} activeOpacity={onPress ? 0.8 : 1}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: theme.borderRadius.card,
            padding: theme.spacing.md,
            margin: theme.spacing.sm,
            ...theme.shadows.md,
          }}
        >
          {renderContent()}
        </LinearGradient>
      </Container>
    );
  }

  const Container = onPress ? styled.TouchableOpacity`` : styled.View``;

  return (
    <Container onPress={onPress} activeOpacity={onPress ? 0.8 : 1}>
      <CardContainer variant={variant}>
        {renderContent()}
      </CardContainer>
    </Container>
  );
};

const CardContainer = styled.View<{ variant: string }>`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.card}px;
  padding: ${({ theme, variant }) => 
    variant === 'compact' ? theme.spacing.sm : theme.spacing.md}px;
  margin: ${({ theme }) => theme.spacing.sm}px;
  ${({ theme }) => theme.shadows.md};
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const IconContainer = styled.View<{ variant: string }>`
  width: ${({ variant }) => variant === 'compact' ? 32 : 40}px;
  height: ${({ variant }) => variant === 'compact' ? 32 : 40}px;
  border-radius: ${({ variant }) => variant === 'compact' ? 16 : 20}px;
  background-color: ${({ theme, variant }) => 
    variant === 'gradient' ? 'rgba(255, 255, 255, 0.2)' : theme.colors.surface};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const CardTitle = styled.Text<{ variant: string }>`
  font-size: ${({ theme, variant }) => 
    variant === 'compact' ? theme.typography.fontSize.sm : theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, variant }) => 
    variant === 'gradient' ? theme.colors.white : theme.colors.text};
  flex: 1;
`;

const ValueContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const ValueText = styled.Text<{ variant: string }>`
  font-size: ${({ theme, variant }) => 
    variant === 'compact' ? theme.typography.fontSize.lg : theme.typography.fontSize['2xl']}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme, variant }) => 
    variant === 'gradient' ? theme.colors.white : theme.colors.text};
`;

const UnitText = styled.Text<{ variant: string }>`
  font-size: ${({ theme, variant }) => 
    variant === 'compact' ? theme.typography.fontSize.sm : theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme, variant }) => 
    variant === 'gradient' ? 'rgba(255, 255, 255, 0.8)' : theme.colors.secondaryText};
`;

const TrendContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TrendText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export default StatsCard;
