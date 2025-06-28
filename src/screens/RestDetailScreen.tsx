import React, { useRef, useEffect } from 'react';
import { ScrollView, Linking, Animated, Text } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Recommendation } from '../types/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RestDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { rest: Recommendation } }, 'params'>>();
  const navigation = useNavigation();
  const { rest } = route.params;
  const insets = useSafeAreaInsets();

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
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <HeaderRow>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color={theme.colors.primary} />
        </BackButton>
        <HeaderTitle numberOfLines={2}>{rest.title}</HeaderTitle>
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
          {rest.image && <CoverImage source={{ uri: rest.image }} />}
          <Description>{rest.description}</Description>
          {rest.sleepGoalHours && (
            <Goal>
              <Icon name="flag" size={14} color={theme.colors.accent} />{' '}
              Sleep Goal: <GoalValue>{rest.sleepGoalHours} hours</GoalValue>
            </Goal>
          )}
          {rest.difficultyLevel && (
            <DifficultyLevel>
              <Icon name="trending-up" size={14} color={theme.colors.accent} /> Difficulty: {rest.difficultyLevel}
            </DifficultyLevel>
          )}
          {rest.estimatedDuration && (
            <EstimatedDuration>
              <Icon name="timer" size={14} color={theme.colors.accent} /> Duration: {rest.estimatedDuration} min
            </EstimatedDuration>
          )}
          <SectionTitle>Steps</SectionTitle>
          {rest.steps?.map((step, idx) => (
            <StepCard key={idx}>
              <StepHeader>
                <StepIndex>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{idx + 1}</Text>
                </StepIndex>
                <StepTitle numberOfLines={2}>{step.title}</StepTitle>
              </StepHeader>
              {step.media && step.media.map((media, mIdx) => {
                if (media.type === 'image' || media.type === 'gif') {
                  return (
                    <StepImage key={mIdx} source={{ uri: media.url }} />
                  );
                }
                if (media.type === 'video') {
                  return (
                    <StepVideoContainer key={mIdx}>
                      <StepVideoThumbnail source={{ uri: media.url || '' }} />
                      <StepVideoLabel>Video</StepVideoLabel>
                    </StepVideoContainer>
                  );
                }
                return null;
              })}
              <StepDescription>
                {step.description}
              </StepDescription>
            </StepCard>
          ))}
          {rest.tips && rest.tips.length > 0 && (
            <>
              <SectionTitle>Tips</SectionTitle>
              {rest.tips.map((tip, idx) => (
                <TipCard key={idx}>
                  <Icon name="check-circle" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <TipText>{tip}</TipText>
                </TipCard>
              ))}
            </>
          )}
          {rest.personalizedTips && rest.personalizedTips.length > 0 && (
            <>
              <SectionTitle>Personalized Tips</SectionTitle>
              {rest.personalizedTips.map((tip, idx) => (
                <TipCard key={`personalized-${idx}`}>
                  <Icon name="person" size={16} color={theme.colors.accent} style={{ marginRight: 8 }} />
                  <TipText>{tip}</TipText>
                </TipCard>
              ))}
            </>
          )}
          {rest.articles && rest.articles.length > 0 && (
            <>
              <SectionTitle>Helpful Articles</SectionTitle>
              {rest.articles.map((a, idx) => (
                <ArticleLink key={idx} onPress={() => Linking.openURL(a.url)}>
                  <Icon name="launch" size={14} color={theme.colors.accent} /> {a.title}
                </ArticleLink>
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

const ArticleLink = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: underline;
  margin-bottom: 8px;
  margin-top: 2px;
  flex-direction: row;
  align-items: center;
`;

const StepCard = styled.View`
  background-color: ${({ theme }) => theme.colors.card || '#f6f8fa'};
  border-radius: 14px;
  margin-bottom: 18px;
  padding: 14px 12px 10px 12px;
  width: 100%;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.04;
  shadow-radius: 4px;
  shadow-offset: 0px 1px;
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
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  flex: 1;
`;

const StepImage = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: 10px;
  margin-bottom: 8px;
  background: #eee;
`;

const StepVideoContainer = styled.View`
  margin-bottom: 8px;
  align-items: center;
`;

const StepVideoThumbnail = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: 10px;
  background: #222;
`;

const StepVideoLabel = styled.Text`
  position: absolute;
  bottom: 8px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
`;

const StepDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const DifficultyLevel = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`;

const EstimatedDuration = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
`;

export default RestDetailScreen;