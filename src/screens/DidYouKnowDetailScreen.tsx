import React from 'react';
import { ScrollView, Linking } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { DidYouKnow } from '../constants';

const DidYouKnowDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { fact: DidYouKnow } }, 'params'>>();
  const { fact } = route.params;

  return (
    <Container>
      <ScrollView>
        {fact.image && <CoverImage source={{ uri: fact.image }} />}
        <Title>Did You Know?</Title>
        <FactText>{fact.fact}</FactText>
        <Source>Source: {fact.source}</Source>
        {fact.link && (
          <ArticleLink onPress={() => Linking.openURL(fact.link!)}>
            Learn more
          </ArticleLink>
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
  color: ${({ theme }) => theme.colors.primary};
  margin: 16px 0 8px 0;
`;

const FactText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
  line-height: 24px;
`;

const Source = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-bottom: 12px;
`;

const ArticleLink = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: underline;
  margin-bottom: 8px;
`;

export default DidYouKnowDetailScreen;