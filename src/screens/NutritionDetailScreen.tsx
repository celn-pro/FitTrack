import React, { useEffect, useRef } from 'react';
import { ScrollView, Linking, Animated } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { NutritionRecommendation } from '../constants';

const NutritionDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { nutrition: NutritionRecommendation } }, 'params'>>();
  const navigation = useNavigation();
  const { nutrition } = route.params;

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
        <HeaderTitle numberOfLines={2}>{nutrition.title}</HeaderTitle>
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
            <Icon name="restaurant" size={36} color={theme.colors.primary} />
          </IconCircle>
          {nutrition.image && <CoverImage source={{ uri: nutrition.image }} />}
          {/* Title moved to header */}
          <Description>{nutrition.description}</Description>
          {nutrition.macros && (
            <Macros>
              <Macro>
                <Icon name="fitness-center" size={14} color={theme.colors.accent} /> Protein: {nutrition.macros.protein}g
              </Macro>
              <Macro>
                <Icon name="grain" size={14} color={theme.colors.accent} /> Carbs: {nutrition.macros.carbs}g
              </Macro>
              <Macro>
                <Icon name="opacity" size={14} color={theme.colors.accent} /> Fat: {nutrition.macros.fat}g
              </Macro>
            </Macros>
          )}
          {nutrition.calories && (
            <Calories>
              <Icon name="local-fire-department" size={14} color={theme.colors.primary} /> {nutrition.calories} kcal
            </Calories>
          )}
          <SectionTitle>Tips</SectionTitle>
          {nutrition.tips.map((tip, idx) => (
            <TipCard key={idx}>
              <Icon name="check-circle" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
              <TipText>{tip}</TipText>
            </TipCard>
          ))}
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

export default NutritionDetailScreen;