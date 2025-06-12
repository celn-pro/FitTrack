import React, { useEffect } from 'react';
import { ScrollView, Animated, Text } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Workout } from '../constants';

const WorkoutDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { workout: Workout } }, 'params'>>();
  const navigation = useNavigation();
  const { workout } = route.params;

  const fadeAnim = new Animated.Value(0);

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
        <HeaderTitle numberOfLines={2}>
          {workout.title}
        </HeaderTitle>
      </HeaderRow>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 0 }}>
        <AnimatedCard style={{ opacity: fadeAnim }}>
          {workout.coverImage && (
            <CoverImage source={{ uri: workout.coverImage }} />
          )}
          <Meta>
            <MetaBadge>
              <Icon name="fitness-center" size={16} color={theme.colors.primary} />
              <MetaText>{workout.difficulty}</MetaText>
            </MetaBadge>
            <MetaBadge>
              <Icon name="timer" size={16} color={theme.colors.primary} />
              <MetaText>{workout.duration} min</MetaText>
            </MetaBadge>
          </Meta>
          <Description>
            <Text style={{ color: theme.colors.text, fontSize: 15, textAlign: 'center' }}>
              {workout.description}
            </Text>
          </Description>
          <SectionTitle>
            <Text style={{ color: theme.colors.accent, fontWeight: '700', fontSize: 18 }}>
              Steps
            </Text>
          </SectionTitle>
          {workout.steps.map((step, idx) => (
            <StepCard key={idx}>
              <StepHeader>
                <StepIndex>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{idx + 1}</Text>
                </StepIndex>
                <StepTitle numberOfLines={2}>{step.title}</StepTitle>
              </StepHeader>
              {step.image && <StepImage source={{ uri: step.image }} />}
              <StepDescription>
                {step.description}
              </StepDescription>
              {step.duration && (
                <StepMeta>
                  <Icon name="timer" size={13} color={theme.colors.accent} />{' '}
                  <Text style={{ color: theme.colors.accent, fontSize: 12 }}>
                    {Math.round(step.duration / 60)} min
                  </Text>
                </StepMeta>
              )}
            </StepCard>
          ))}
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

const CoverImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  margin-bottom: 16px;
`;

const Meta = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 12px;
  gap: 10px;
`;

const MetaBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary + '18'};
  border-radius: 12px;
  padding: 4px 10px;
  margin-right: 8px;
`;

const MetaText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
  font-weight: 600;
`;

const Description = styled.View`
  margin-bottom: 18px;
`;

const SectionTitle = styled.View`
  margin-bottom: 10px;
  margin-top: 10px;
  align-self: flex-start;
`;

const StepCard = styled.View`
  margin-bottom: 18px;
  background: ${({ theme }) => theme.colors.background === '#1C2526' ? '#232B34' : '#F8F9FA'};
  border-radius: 14px;
  padding: 14px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.07;
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
  width: 100%;
`;

const StepHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const StepIndex = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 26px;
  height: 26px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const StepTitle = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 15px;
`;

const StepImage = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: 10px;
  margin-bottom: 8px;
  margin-top: 6px;
`;

const StepDescription = styled.Text`
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: 13px;
`;

const StepMeta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

export default WorkoutDetailScreen;