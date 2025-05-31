import React from 'react';
import { ScrollView, Linking } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { HealthTip } from '../constants';

const HealthTipDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { tip: HealthTip } }, 'params'>>();
  const { tip } = route.params;

  return (
    <Container>
      <ScrollView>
        {tip.image && <CoverImage source={{ uri: tip.image }} />}
        <Title>{tip.title}</Title>
        <Category>{tip.category.toUpperCase()}</Category>
        <Description>{tip.description}</Description>
        {tip.link && (
          <ArticleLink onPress={() => Linking.openURL(tip.link!)}>
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
  color: ${({ theme }) => theme.colors.text};
  margin: 16px 0 8px 0;
`;

const Category = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
`;

const ArticleLink = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: underline;
  margin-bottom: 8px;
`;

export default HealthTipDetailScreen;