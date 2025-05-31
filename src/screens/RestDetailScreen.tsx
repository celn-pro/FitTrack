import React from 'react';
import { ScrollView, Linking } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RestRecommendation } from '../constants';

const RestDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { rest: RestRecommendation } }, 'params'>>();
  const { rest } = route.params;

  return (
    <Container>
      <ScrollView>
        {rest.image && <CoverImage source={{ uri: rest.image }} />}
        <Title>{rest.title}</Title>
        <Description>{rest.description}</Description>
        {rest.sleepGoalHours && (
          <Goal>
            Sleep Goal: <GoalValue>{rest.sleepGoalHours} hours</GoalValue>
          </Goal>
        )}
        <SectionTitle>Tips</SectionTitle>
        {rest.tips.map((tip, idx) => (
          <Tip key={idx}>• {tip}</Tip>
        ))}
        {rest.articles && rest.articles.length > 0 && (
          <>
            <SectionTitle>Helpful Articles</SectionTitle>
            {rest.articles.map((a, idx) => (
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

const Goal = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const GoalValue = styled.Text`
  font-weight: bold;
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

export default RestDetailScreen;