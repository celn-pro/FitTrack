import React from 'react';
import { ScrollView, Linking } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NutritionRecommendation } from '../constants';

const NutritionDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { nutrition: NutritionRecommendation } }, 'params'>>();
  const navigation = useNavigation();
  const { nutrition } = route.params;

  return (
    <Container>
      <ScrollView>
        {nutrition.image && <CoverImage source={{ uri: nutrition.image }} />}
        <Title>{nutrition.title}</Title>
        <Description>{nutrition.description}</Description>
        {nutrition.macros && (
          <Macros>
            <Macro>Protein: {nutrition.macros.protein}g</Macro>
            <Macro>Carbs: {nutrition.macros.carbs}g</Macro>
            <Macro>Fat: {nutrition.macros.fat}g</Macro>
          </Macros>
        )}
        {nutrition.calories && (
          <Calories>{nutrition.calories} kcal</Calories>
        )}
        <SectionTitle>Tips</SectionTitle>
        {nutrition.tips.map((tip, idx) => (
          <Tip key={idx}>• {tip}</Tip>
        ))}
        {nutrition.articles && nutrition.articles.length > 0 && (
          <>
            <SectionTitle>Helpful Articles</SectionTitle>
            {nutrition.articles.map((a, idx) => (
              <ArticleLink key={idx} onPress={() => Linking.openURL(a.url)}>
                {a.title}
              </ArticleLink>
            ))}
          </>
        )}
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 16px;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin: 16px 0 8px 0;
`;

const Description = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
`;

const Macros = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const Macro = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-right: 16px;
`;

const Calories = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
`;

const Tip = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
`;

const ArticleLink = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: underline;
  margin-bottom: 8px;
`;

export default NutritionDetailScreen;