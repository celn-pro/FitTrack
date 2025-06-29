import React, { useEffect } from 'react';
import { ScrollView, Linking, Animated, StatusBar, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHealthTipIcon } from '../utils/getHealthTipIcon';
import { HealthTip } from '../constants';

const HealthTipDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { tip: HealthTip } }, 'params'>>();
  const navigation = useNavigation();
  const { tip } = route.params;

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Set status bar style based on theme
    StatusBar.setBarStyle(
      theme.colors.background === '#1C2526' ? 'light-content' : 'dark-content',
      true
    );

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [theme]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <Header>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              paddingBottom: 18,
              paddingTop: 0,
            }}
          >
            <HeaderRow>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={26} color={theme.colors.white} />
              </TouchableOpacity>
              <HeaderTitle>{tip.title}</HeaderTitle>
              <TouchableOpacity style={{ opacity: 0 }}>
                <Icon name="arrow-back" size={26} color="transparent" />
              </TouchableOpacity>
            </HeaderRow>
            <HeaderSubtitle>
              {tip.category.toUpperCase()} • {tip.difficulty} • {tip.estimatedReadTime} min read
            </HeaderSubtitle>
          </LinearGradient>
        </Header>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedCard style={{ opacity: fadeAnim }}>
            <IconCircle>
              <Icon name={getHealthTipIcon(tip.category, tip.title)} size={38} color={theme.colors.primary} />
            </IconCircle>
            <Description>{tip.content}</Description>
            {tip.link && (
              <LearnMoreButton onPress={() => Linking.openURL(tip.link!)}>
                <LearnMoreGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <LearnMoreText>Learn More</LearnMoreText>
                </LearnMoreGradient>
              </LearnMoreButton>
            )}
          </AnimatedCard>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  position: relative;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 0 16px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  flex: 1;
  text-align: center;
  margin: 0 16px;
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  margin-top: 2px;
  opacity: 0.85;
`;

const AnimatedCard = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const IconCircle = styled.View`
  background-color: ${({ theme }) => theme.colors.primary + '18'};
  border-radius: 32px;
  padding: 16px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const Description = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  line-height: 24px;
  text-align: left;
`;

const LearnMoreButton = styled.TouchableOpacity`
  width: 150px;
  height: 44px;
  border-radius: 22px;
  overflow: hidden;
  align-self: center;
  margin-top: 8px;
`;

const LearnMoreGradient = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LearnMoreText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  font-size: 16px;
`;

export default HealthTipDetailScreen;