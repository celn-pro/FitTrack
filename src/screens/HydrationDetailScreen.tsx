import React, { useRef, useEffect } from 'react';
import { ScrollView, Animated } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { HydrationRecommendation } from '../constants';

const HydrationDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { hydration: HydrationRecommendation } }, 'params'>>();
  const navigation = useNavigation();
  const { hydration } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <GradientContainer
      colors={
        theme.colors.background === '#1C2526'
          ? [theme.colors.background, theme.colors.secondary]
          : ['#F8F9FA', '#E6F0FA']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <HeaderRow>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color={theme.colors.primary} />
        </BackButton>
        <HeaderTitle numberOfLines={2}>{hydration.title}</HeaderTitle>
      </HeaderRow>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          paddingTop: 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedCard style={{ opacity: fadeAnim }}>
          <IconCircle>
            <Icon name="water-drop" size={36} color={theme.colors.primary} />
          </IconCircle>
          {hydration.image && <CoverImage source={{ uri: hydration.image }} />}
          <Description>{hydration.description}</Description>
          {hydration.dailyGoalMl && (
            <Goal>
              <Icon name="flag" size={14} color={theme.colors.accent} />{' '}
              Daily Goal: <GoalValue>{hydration.dailyGoalMl} ml</GoalValue>
            </Goal>
          )}
          {hydration.reminders && hydration.reminders.length > 0 && (
            <>
              <SectionTitle>Reminders</SectionTitle>
              <Reminders>
                {hydration.reminders.map((time, idx) => (
                  <Reminder key={idx}>
                    <Icon name="alarm" size={13} color="#fff" style={{ marginRight: 4 }} />
                    {time}
                  </Reminder>
                ))}
              </Reminders>
            </>
          )}
          {hydration.tips && hydration.tips.length > 0 && (
            <>
              <SectionTitle>Tips</SectionTitle>
              {hydration.tips.map((tip, idx) => (
                <TipCard key={idx}>
                  <Icon name="check-circle" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <TipText>{tip}</TipText>
                </TipCard>
              ))}
            </>
          )}
        </AnimatedCard>
      </ScrollView>
    </GradientContainer>
  );
};

const GradientContainer = styled(LinearGradient)`
  flex: 1;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 18px;
  padding-top: 48px;
  margin-bottom: 8px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  background-color: rgba(255,255,255,0.7);
  border-radius: 20px;
  margin-right: 10px;
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-align: left;
`;

const AnimatedCard = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#232B34' : '#fff'};
  border-radius: 22px;
  padding: 28px 20px 20px 20px;
  width: 100%;
  max-width: 440px;
  align-items: center;
  elevation: 8;
  shadow-color: #000;
  shadow-opacity: 0.10;
  shadow-radius: 16px;
  shadow-offset: 0px 6px;
`;

const IconCircle = styled.View`
  background-color: ${({ theme }) => theme.colors.primary + '18'};
  border-radius: 32px;
  padding: 16px;
  margin-bottom: 14px;
  align-items: center;
  justify-content: center;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 16px;
  margin-bottom: 18px;
`;

const Description = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
  text-align: center;
`;

const Goal = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`;

const GoalValue = styled.Text`
  font-weight: bold;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
  margin-top: 10px;
  align-self: flex-start;
`;

const Reminders = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 10px;
  width: 100%;
`;

const Reminder = styled.Text`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  padding: 6px 12px;
  border-radius: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  flex-direction: row;
  align-items: center;
`;

const TipCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary + '10'};
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 8px;
  width: 100%;
`;

const TipText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

export default HydrationDetailScreen;