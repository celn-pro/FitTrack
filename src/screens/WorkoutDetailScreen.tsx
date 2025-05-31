import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Workout } from '../constants';

const WorkoutDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { workout: Workout } }, 'params'>>();
  const navigation = useNavigation();
  const { workout } = route.params;

  return (
    <Container>
      <ScrollView>
        {workout.coverImage && (
          <CoverImage source={{ uri: workout.coverImage }} />
        )}
        <Title>{workout.title}</Title>
        <Meta>
          <MetaText>{workout.difficulty.toUpperCase()}</MetaText>
          <MetaText>• {workout.duration} min</MetaText>
        </Meta>
        <Description>{workout.description}</Description>
        <SectionTitle>Steps</SectionTitle>
        {workout.steps.map((step, idx) => (
          <StepContainer key={idx}>
            {step.image && <StepImage source={{ uri: step.image }} />}
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
            {step.duration && (
              <StepMeta>Duration: {Math.round(step.duration / 60)} min</StepMeta>
            )}
          </StepContainer>
        ))}
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

const Meta = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const MetaText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-right: 12px;
`;

const Description = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 10px;
`;

const StepContainer = styled.View`
  margin-bottom: 18px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 12px;
  elevation: 1;
`;

const StepImage = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const StepTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const StepDescription = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-bottom: 4px;
`;

const StepMeta = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText};
`;

export default WorkoutDetailScreen;