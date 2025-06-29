import React, { useEffect, useRef } from 'react';
import { ScrollView, Linking, Animated, Text, StatusBar, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { NutritionRecommendation } from '../constants';
import { Recommendation } from '../types/types';

const NutritionDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { nutrition: Recommendation } }, 'params'>>();
  const navigation = useNavigation();
  const { nutrition } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;

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
              <HeaderTitle numberOfLines={2}>{nutrition.title}</HeaderTitle>
              <TouchableOpacity style={{ opacity: 0 }}>
                <Icon name="arrow-back" size={26} color="transparent" />
              </TouchableOpacity>
            </HeaderRow>
            <HeaderSubtitle>
              {nutrition.category} • {nutrition.difficultyLevel} • {nutrition.estimatedDuration} min
            </HeaderSubtitle>
          </LinearGradient>
        </Header>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
        <AnimatedCard style={{ opacity: fadeAnim }}>
          {nutrition.image && <CoverImage source={{ uri: nutrition.image }} />}
          <Description>{nutrition.description}</Description>
          {nutrition.macros && (
            <Macros>
              {nutrition.macros.protein && (
                <Macro>
                  <Icon name="fitness-center" size={14} color={theme.colors.accent} />
                  Protein: {nutrition.macros.protein.grams ? `${nutrition.macros.protein.grams}g` : 'N/A'} ({nutrition.macros.protein.calories ? `${nutrition.macros.protein.calories} cal` : 'N/A'}, {nutrition.macros.protein.percentage}%)
                </Macro>
              )}
              {nutrition.macros.carbohydrates && (
                <Macro>
                  <Icon name="grain" size={14} color={theme.colors.accent} />
                  Carbs: {nutrition.macros.carbohydrates.grams ? `${nutrition.macros.carbohydrates.grams}g` : 'N/A'} ({nutrition.macros.carbohydrates.calories ? `${nutrition.macros.carbohydrates.calories} cal` : 'N/A'}, {nutrition.macros.carbohydrates.percentage}%)
                </Macro>
              )}
              {nutrition.macros.fats && (
                <Macro>
                  <Icon name="opacity" size={14} color={theme.colors.accent} />
                  Fats: {nutrition.macros.fats.grams ? `${nutrition.macros.fats.grams}g` : 'N/A'} ({nutrition.macros.fats.calories ? `${nutrition.macros.fats.calories} cal` : 'N/A'}, {nutrition.macros.fats.percentage}%)
                </Macro>
              )}
            </Macros>
          )}
          {nutrition.calories && (
            <Calories>
              <Icon name="local-fire-department" size={14} color={theme.colors.primary} /> {nutrition.calories} kcal
            </Calories>
          )}
          {nutrition.difficultyLevel && (
            <DifficultyLevel>
              <Icon name="trending-up" size={14} color={theme.colors.accent} /> Difficulty: {nutrition.difficultyLevel}
            </DifficultyLevel>
          )}
          {nutrition.estimatedDuration && (
            <EstimatedDuration>
              <Icon name="timer" size={14} color={theme.colors.accent} /> Prep time: {nutrition.estimatedDuration} min
            </EstimatedDuration>
          )}
          <SectionTitle>Steps</SectionTitle>
          {nutrition.steps?.map((step, idx) => (
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
          {nutrition.tips && nutrition.tips.length > 0 && (
            <>
              <SectionTitle>Tips</SectionTitle>
              {nutrition.tips.map((tip, idx) => (
                <TipCard key={idx}>
                  <Icon name="check-circle" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <TipText>{tip}</TipText>
                </TipCard>
              ))}
            </>
          )}
          {nutrition.personalizedTips && nutrition.personalizedTips.length > 0 && (
            <>
              <SectionTitle>Personalized Tips</SectionTitle>
              {nutrition.personalizedTips.map((tip, idx) => (
                <TipCard key={`personalized-${idx}`}>
                  <Icon name="person" size={16} color={theme.colors.accent} style={{ marginRight: 8 }} />
                  <TipText>{tip}</TipText>
                </TipCard>
              ))}
            </>
          )}

          {nutrition.reminders && nutrition.reminders.length > 0 && (
            <>
              <SectionTitle>Reminders</SectionTitle>
              {nutrition.reminders.map((reminder, idx) => (
                <TipCard key={`reminder-${idx}`} style={{ backgroundColor: theme.colors.primary + '15' }}>
                  <Icon name="notifications" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <TipText>{reminder}</TipText>
                </TipCard>
              ))}
            </>
          )}

          {nutrition.articles && nutrition.articles.length > 0 && (
            <>
              <SectionTitle>Related Articles</SectionTitle>
              {nutrition.articles.map((article, idx) => (
                <ArticleCard key={`article-${idx}`}>
                  <Icon name="article" size={16} color={theme.colors.accent} style={{ marginRight: 8 }} />
                  <ArticleContent>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    {article.summary && (
                      <ArticleSummary>{article.summary}</ArticleSummary>
                    )}
                    <ArticleLink>Read more</ArticleLink>
                  </ArticleContent>
                </ArticleCard>
              ))}
            </>
          )}
          {nutrition.articles && nutrition.articles.length > 0 && (
            <>
              <SectionTitle>Helpful Articles</SectionTitle>
              {nutrition.articles.map((a, idx) => (
                <ArticleLink key={idx} onPress={() => Linking.openURL(a.url)}>
                  <Icon name="launch" size={14} color={theme.colors.accent} /> {a.title}
                </ArticleLink>
              ))}
            </>
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

const Macros = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Macro = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-right: 16px;
  margin-bottom: 4px;
  flex-direction: row;
  align-items: center;
`;

const Calories = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
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
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
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

// Step-related styles
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

const CalorieInfo = styled.View`
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#F8F9FA'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const CalorieRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const CalorieText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  margin-left: 8px;
  font-weight: 500;
`;

const ArticleCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#F8F9FA'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const ArticleContent = styled.View`
  flex: 1;
`;

const ArticleTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ArticleSummary = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  line-height: 18px;
  margin-bottom: 8px;
`;

export default NutritionDetailScreen;