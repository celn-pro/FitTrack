import React, { useState } from 'react';
import { ScrollView, Linking } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { CourseTopic, CourseStep } from '../constants';
import styled, { useTheme } from 'styled-components/native';
import { ThemeType } from '../styles/theme';

type RouteParams = { topic: CourseTopic };

const TopicDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { topic } = route.params;
  const [completedSteps, setCompletedSteps] = useState<{ [id: string]: boolean }>({});
  const theme = useTheme() as ThemeType;

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Container>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <TopicTitle>{topic.title}</TopicTitle>
        {topic.description && (
          <TopicDescription>{topic.description}</TopicDescription>
        )}
        {topic.steps.map((step: CourseStep, idx: number) => (
          <StepCard
            key={step.id}
            completed={completedSteps[step.id]}
          >
            <StepHeader>
              <CheckboxContainer
                onPress={() => toggleStep(step.id)}
                completed={completedSteps[step.id]}
              >
                {completedSteps[step.id] && (
                  <CheckboxText>✓</CheckboxText>
                )}
              </CheckboxContainer>
              <StepTitle>{step.title}</StepTitle>
            </StepHeader>
            <StepContent>{step.content}</StepContent>
            {step.illustration && (
              <StepImage
                source={{ uri: step.illustration }}
                resizeMode="cover"
              />
            )}
            {step.videoUrl && (
              <VideoButton
                onPress={() => {
                  if (step.videoUrl) {
                    Linking.openURL(step.videoUrl);
                  }
                }}
              >
                <VideoButtonText>Watch Video</VideoButtonText>
              </VideoButton>
            )}
          </StepCard>
        ))}
      </ScrollView>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TopicTitle = styled.Text`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.text};
`;

const TopicDescription = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-bottom: 16px;
  line-height: 20px;
`;

const StepCard = styled.View<{ completed: boolean }>`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 18px;
  border-left-width: 4px;
  border-left-color: ${({ completed, theme }) => completed ? '#4caf50' : theme.colors.border};
`;

const StepHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const CheckboxContainer = styled.TouchableOpacity<{ completed: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2px;
  border-color: ${({ completed }) => completed ? '#4caf50' : '#bdbdbd'};
  background-color: ${({ completed }) => completed ? '#4caf50' : 'transparent'};
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;

const CheckboxText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const StepTitle = styled.Text`
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const StepContent = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-bottom: 8px;
  line-height: 18px;
`;

const StepImage = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const VideoButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  padding: 10px;
  align-items: center;
  margin-top: 6px;
`;

const VideoButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

export default TopicDetailScreen;