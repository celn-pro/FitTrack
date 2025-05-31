import React from 'react';
import { ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { HydrationRecommendation } from '../constants';

const HydrationDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<{ params: { hydration: HydrationRecommendation } }, 'params'>>();
  const { hydration } = route.params;

  return (
    <Container>
      <ScrollView>
        {hydration.image && <CoverImage source={{ uri: hydration.image }} />}
        <Title>{hydration.title}</Title>
        <Description>{hydration.description}</Description>
        {hydration.dailyGoalMl && (
          <Goal>
            Daily Goal: <GoalValue>{hydration.dailyGoalMl} ml</GoalValue>
          </Goal>
        )}
        {hydration.reminders && hydration.reminders.length > 0 && (
          <>
            <SectionTitle>Reminders</SectionTitle>
            <Reminders>
              {hydration.reminders.map((time, idx) => (
                <Reminder key={idx}>{time}</Reminder>
              ))}
            </Reminders>
          </>
        )}
        {hydration.tips && hydration.tips.length > 0 && (
          <>
            <SectionTitle>Tips</SectionTitle>
            {hydration.tips.map((tip, idx) => (
              <Tip key={idx}>• {tip}</Tip>
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

const Reminders = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const Reminder = styled.Text`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  padding: 6px 12px;
  border-radius: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 13px;
`;

const Tip = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
`;

export default HydrationDetailScreen;