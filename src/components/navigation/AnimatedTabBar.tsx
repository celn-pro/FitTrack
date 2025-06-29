import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeType } from '../../styles/theme';

const { width } = Dimensions.get('window');

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const AnimatedTabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const theme = useTheme() as ThemeType;
  const insets = useSafeAreaInsets();
  const tabWidth = width / state.routes.length;
  const translateX = useSharedValue(0);

  const getIconName = (routeName: string): string => {
    switch (routeName) {
      case 'Home':
        return 'home';
      case 'Tracking':
        return 'fitness-center';
      case 'Social':
        return 'group';
      case 'Courses':
        return 'school';
      case 'Profile':
        return 'person';
      default:
        return 'home';
    }
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleTabPress = (index: number, route: any) => {
    const targetX = index * tabWidth;
    translateX.value = withSpring(targetX, {
      damping: 15,
      stiffness: 150,
    });

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  React.useEffect(() => {
    const targetX = state.index * tabWidth;
    translateX.value = withSpring(targetX, {
      damping: 15,
      stiffness: 150,
    });
  }, [state.index, tabWidth]);

  return (
    <TabBarContainer style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <LinearGradient
        colors={[theme.colors.card, theme.colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Animated Indicator */}
      <Animated.View
        style={[
          animatedIndicatorStyle,
          {
            position: 'absolute',
            top: 0,
            width: tabWidth,
            height: 3,
            backgroundColor: theme.colors.primary,
            borderRadius: 2,
          },
        ]}
      />

      <TabsContainer>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const animatedTabStyle = useAnimatedStyle(() => {
            const scale = interpolate(
              translateX.value,
              [(index - 1) * tabWidth, index * tabWidth, (index + 1) * tabWidth],
              [0.85, 1.15, 0.85],
              Extrapolate.CLAMP
            );

            const opacity = interpolate(
              translateX.value,
              [(index - 1) * tabWidth, index * tabWidth, (index + 1) * tabWidth],
              [0.7, 1, 0.7],
              Extrapolate.CLAMP
            );

            return {
              transform: [{ scale }],
              opacity,
            };
          });

          return (
            <TabButton
              key={route.key}
              onPress={() => handleTabPress(index, route)}
              activeOpacity={0.8}
            >
              <Animated.View style={[animatedTabStyle, { alignItems: 'center' }]}>
                <IconContainer isFocused={isFocused}>
                  {isFocused ? (
                    <LinearGradient
                      colors={[theme.colors.primary, theme.colors.primaryDark || theme.colors.primary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon
                        name={getIconName(route.name)}
                        size={24}
                        color={theme.colors.white}
                      />
                    </LinearGradient>
                  ) : (
                    <Icon
                      name={getIconName(route.name)}
                      size={24}
                      color={theme.colors.secondaryText}
                    />
                  )}
                </IconContainer>
                <TabLabel isFocused={isFocused}>
                  {options.tabBarLabel || route.name}
                </TabLabel>
              </Animated.View>
            </TabButton>
          );
        })}
      </TabsContainer>
    </TabBarContainer>
  );
};

const TabBarContainer = styled.View`
  position: relative;
  background-color: ${({ theme }) => theme.colors.card};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  elevation: 8;
  shadow-color: ${({ theme }) => theme.colors.shadow};
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
`;

const TabsContainer = styled.View`
  flex-direction: row;
  padding-top: ${({ theme }) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
`;

const TabButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const IconContainer = styled.View<{ isFocused: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  elevation: ${({ isFocused }) => isFocused ? 6 : 0};
  shadow-color: ${({ theme, isFocused }) => isFocused ? theme.colors.primary : 'transparent'};
  shadow-offset: 0px 3px;
  shadow-opacity: ${({ isFocused }) => isFocused ? 0.4 : 0};
  shadow-radius: 6px;
`;

const TabLabel = styled.Text<{ isFocused: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme, isFocused }) =>
    isFocused ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  color: ${({ theme, isFocused }) =>
    isFocused ? theme.colors.primary : theme.colors.secondaryText};
`;

export default AnimatedTabBar;
