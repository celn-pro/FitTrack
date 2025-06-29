import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useQuery } from '@apollo/client';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import { Screen, Header } from '../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';
import { StatsCard, ProgressBar } from '../components/fitness';
import { ScreenTransition } from '../components/navigation';

// Utils & Types
import { ThemeType } from '../styles/theme';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { GET_RECOMMENDATIONS, GET_HEALTH_TIPS } from '../graphql/queries';

const { width } = Dimensions.get('window');

const HomeNew: React.FC = () => {
  const theme = useTheme() as ThemeType;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  const todayStats = {
    steps: 8432,
    stepsGoal: 10000,
    calories: 1850,
    caloriesGoal: 2200,
    water: 6,
    waterGoal: 8,
    workouts: 1,
    workoutsGoal: 1,
  };

  const quickActions = [
    { title: 'Start Workout', icon: 'fitness-center', color: theme.colors.primary, action: () => navigation.navigate('Tracking') },
    { title: 'Log Meal', icon: 'restaurant', color: theme.colors.secondary, action: () => navigation.navigate('MealPlanning') },
    { title: 'Track Water', icon: 'local-drink', color: theme.colors.info, action: () => navigation.navigate('HydrationDetail', { recommendation: null }) },
    { title: 'View Progress', icon: 'trending-up', color: theme.colors.accent, action: () => navigation.navigate('ProgressTracking') },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStepsProgress = () => todayStats.steps / todayStats.stepsGoal;
  const getCaloriesProgress = () => todayStats.calories / todayStats.caloriesGoal;
  const getWaterProgress = () => todayStats.water / todayStats.waterGoal;

  return (
    <ScreenTransition type="fade">
      <Screen variant="default" scrollable={false} padding={false}>
        {/* Header */}
        <Header
          title={`${getGreeting()}, ${user?.firstName || 'User'}!`}
          subtitle="Let's crush your fitness goals today"
          variant="gradient"
          rightIcon="notifications"
          onRightPress={() => navigation.navigate('NotificationCenter')}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Today's Overview */}
          <SectionContainer>
            <SectionTitle>Today's Overview</SectionTitle>
            <StatsGrid>
              <StatsCard
                title="Steps"
                value={todayStats.steps.toLocaleString()}
                unit={`/ ${todayStats.stepsGoal.toLocaleString()}`}
                icon="directions-walk"
                trend="up"
                trendValue="+12%"
                variant="compact"
                onPress={() => navigation.navigate('Tracking')}
              />
              <StatsCard
                title="Calories"
                value={todayStats.calories}
                unit="kcal"
                icon="local-fire-department"
                trend="up"
                trendValue="+5%"
                variant="compact"
                onPress={() => navigation.navigate('MealPlanning')}
              />
            </StatsGrid>
          </SectionContainer>

          {/* Progress Section */}
          <SectionContainer>
            <SectionTitle>Daily Progress</SectionTitle>
            <Card variant="default" padding="medium">
              <ProgressItem>
                <ProgressBar
                  progress={getStepsProgress()}
                  variant="gradient"
                  showLabel
                  label="Steps"
                  animated
                />
              </ProgressItem>
              <ProgressItem>
                <ProgressBar
                  progress={getCaloriesProgress()}
                  variant="default"
                  color={theme.colors.secondary}
                  showLabel
                  label="Calories"
                  animated
                />
              </ProgressItem>
              <ProgressItem>
                <ProgressBar
                  progress={getWaterProgress()}
                  variant="default"
                  color={theme.colors.info}
                  showLabel
                  label="Water Intake"
                  animated
                />
              </ProgressItem>
            </Card>
          </SectionContainer>

          {/* Quick Actions */}
          <SectionContainer>
            <SectionTitle>Quick Actions</SectionTitle>
            <ActionsGrid>
              {quickActions.map((action, index) => (
                <ActionCard
                  key={index}
                  onPress={action.action}
                  style={{ backgroundColor: action.color }}
                >
                  <ActionIcon name={action.icon} size={24} color={theme.colors.white} />
                  <ActionText>{action.title}</ActionText>
                </ActionCard>
              ))}
            </ActionsGrid>
          </SectionContainer>

          {/* Recent Activity */}
          <SectionContainer>
            <CardHeader>
              <SectionTitle>Recent Activity</SectionTitle>
              <Button
                title="View All"
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('ProgressTracking')}
              />
            </CardHeader>
            <Card variant="default">
              <ActivityItem>
                <ActivityIcon name="fitness-center" />
                <ActivityContent>
                  <ActivityTitle>Morning Workout</ActivityTitle>
                  <ActivitySubtitle>30 min • Completed</ActivitySubtitle>
                </ActivityContent>
                <ActivityTime>2h ago</ActivityTime>
              </ActivityItem>
              <ActivityItem>
                <ActivityIcon name="restaurant" />
                <ActivityContent>
                  <ActivityTitle>Healthy Breakfast</ActivityTitle>
                  <ActivitySubtitle>420 calories logged</ActivitySubtitle>
                </ActivityContent>
                <ActivityTime>3h ago</ActivityTime>
              </ActivityItem>
            </Card>
          </SectionContainer>

          {/* Recommendations */}
          <SectionContainer>
            <CardHeader>
              <SectionTitle>For You</SectionTitle>
              <Button
                title="See More"
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('Recommendations')}
              />
            </CardHeader>
            <Card variant="gradient" padding="medium">
              <CardContent>
                <RecommendationTitle>💪 Ready for a Challenge?</RecommendationTitle>
                <RecommendationText>
                  Try our new HIIT workout designed for your fitness level
                </RecommendationText>
                <Button
                  title="Start Workout"
                  variant="outline"
                  size="small"
                  style={{ marginTop: theme.spacing.md, alignSelf: 'flex-start' }}
                  onPress={() => navigation.navigate('WorkoutDetail', { workout: null })}
                />
              </CardContent>
            </Card>
          </SectionContainer>
        </ScrollView>
      </Screen>
    </ScreenTransition>
  );
};

// Styled Components
const SectionContainer = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.screen.horizontal}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ProgressItem = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const ActionsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ActionCard = styled.TouchableOpacity`
  width: ${(width - 48 - 12) / 2}px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.card}px;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.shadows.md};
`;

const ActionIcon = styled.Icon`
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const ActionText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ActivityItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const ActivityIcon = styled.Icon`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const ActivityContent = styled.View`
  flex: 1;
`;

const ActivityTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const ActivitySubtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const ActivityTime = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const RecommendationTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const RecommendationText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  color: rgba(255, 255, 255, 0.9);
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

export default HomeNew;
