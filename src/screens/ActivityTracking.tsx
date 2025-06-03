import React, { useState, useEffect } from 'react';
import { Platform, Alert, ScrollView, RefreshControl, View, StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../styles/colors';

// Import health/fitness libraries
import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'react-native-health';
import GoogleFit, { Scopes as GoogleFitScopes } from 'react-native-google-fit';

const ActivityTracking: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [steps, setSteps] = useState<number>(0);

  // Mock other metrics for now
  const metrics = {
    stepsGoal: 10000,
    calories: 1800,
    nutritionGoal: 2200,
    waterLiters: 1.5,
    waterGoal: 2.5,
    sleepHours: 6.5,
    sleepGoal: 8,
    streak: 5,
    chart: [5000, 6000, 5234, 7000, 8000, 9000, 10000],
  };

  // Fetch steps from HealthKit or Google Fit
  const fetchSteps = async () => {
    if (Platform.OS === 'ios') {
      const permissions: HealthKitPermissions = {
        permissions: {
          read: [AppleHealthKit.Constants.Permissions.Steps],
          write: [],
        },
      };
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          Alert.alert('HealthKit Error', 'Could not initialize HealthKit');
          return;
        }
        const today = new Date();
        const options = {
          date: today.toISOString(),
        };
        AppleHealthKit.getStepCount(options, (err: Object, results: HealthValue) => {
          if (err) {
            Alert.alert('HealthKit Error', 'Could not fetch steps');
            return;
          }
          setSteps(results.value || 0);
        });
      });
    } else if (Platform.OS === 'android') {
      GoogleFit.checkIsAuthorized().then(() => {
        if (!GoogleFit.isAuthorized) {
          GoogleFit.authorize({
            scopes: [
              GoogleFitScopes.FITNESS_ACTIVITY_READ,
              GoogleFitScopes.FITNESS_ACTIVITY_WRITE,
            ],
          })
            .then(authResult => {
              if (authResult.success) {
                getAndroidSteps();
              } else {
                Alert.alert('Google Fit Error', 'Authorization denied');
              }
            })
            .catch(() => {
              Alert.alert('Google Fit Error', 'Authorization failed');
            });
        } else {
          getAndroidSteps();
        }
      });
    }
  };

  // Helper for Android steps
  const getAndroidSteps = () => {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date().toISOString();
    GoogleFit.getDailyStepCountSamples({
      startDate: start,
      endDate: end,
    }).then((res) => {
      // Try to get steps from Google Fit
      const stepsData =
        res.find((d) => d.source === 'com.google.android.gms:estimated_steps')?.steps ||
        res[0]?.steps ||
        [];
      const todaySteps = stepsData.length > 0 ? stepsData[stepsData.length - 1].value : 0;
      setSteps(todaySteps);
    });
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSteps();
    setRefreshing(false);
  };

  // Calculate progress percentages
  const getProgress = (value: number, goal: number) =>
    Math.min(100, Math.round((value / goal) * 100));

  return (
    <Container>
      <ScrollView
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
        {/* Motivational Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <HeaderContent>
            <View>
              <HeaderTitle>
                {user?.name ? `Hi, ${user.name}!` : 'Your Activity'}
              </HeaderTitle>
              <HeaderSubtitle>
                {metrics.streak >= 3
                  ? `🔥 ${metrics.streak}-day streak!`
                  : 'Stay consistent for a streak!'}
              </HeaderSubtitle>
            </View>
            <Icon name="directions-run" size={32} color={theme.colors.white} />
          </HeaderContent>
        </LinearGradient>

        {/* Metrics Cards */}
        <MetricsRow>
          <MetricCard>
            <Icon name="directions-walk" size={24} color={theme.colors.primary} />
            <MetricLabel>Steps</MetricLabel>
            <MetricValue>
              {steps} / {metrics.stepsGoal}
            </MetricValue>
            <ProgressBar>
              <ProgressFill
                style={{ width: `${getProgress(steps, metrics.stepsGoal)}%` }}
                color={theme.colors.primary}
              />
            </ProgressBar>
          </MetricCard>
          <MetricCard>
            <Icon name="local-fire-department" size={24} color="#FF6B35" />
            <MetricLabel>Calories</MetricLabel>
            <MetricValue>
              {metrics.calories} / {metrics.nutritionGoal}
            </MetricValue>
            <ProgressBar>
              <ProgressFill
                style={{ width: `${getProgress(metrics.calories, metrics.nutritionGoal)}%` }}
                color="#FF6B35"
              />
            </ProgressBar>
          </MetricCard>
        </MetricsRow>
        <MetricsRow>
          <MetricCard>
            <Icon name="local-drink" size={24} color="#3498DB" />
            <MetricLabel>Water</MetricLabel>
            <MetricValue>
              {metrics.waterLiters} / {metrics.waterGoal} L
            </MetricValue>
            <ProgressBar>
              <ProgressFill
                style={{ width: `${getProgress(metrics.waterLiters, metrics.waterGoal)}%` }}
                color="#3498DB"
              />
            </ProgressBar>
          </MetricCard>
          <MetricCard>
            <Icon name="hotel" size={24} color="#8e44ad" />
            <MetricLabel>Sleep</MetricLabel>
            <MetricValue>
              {metrics.sleepHours} / {metrics.sleepGoal} h
            </MetricValue>
            <ProgressBar>
              <ProgressFill
                style={{ width: `${getProgress(metrics.sleepHours, metrics.sleepGoal)}%` }}
                color="#8e44ad"
              />
            </ProgressBar>
          </MetricCard>
        </MetricsRow>

        {/* Weekly Steps Chart */}
        <SectionTitle>Weekly Steps</SectionTitle>
        <ChartContainer>
          <ChartBar>
            {metrics.chart.map((val: number, idx: number) => (
              <ChartBarItem key={idx} height={Math.min(100, val / metrics.stepsGoal * 100)} />
            ))}
          </ChartBar>
          <ChartLabels>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <ChartLabel key={d}>{d}</ChartLabel>
            ))}
          </ChartLabels>
        </ChartContainer>

        {/* Quick Actions */}
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionsRow>
          <ActionButton>
            <Icon name="add" size={20} color={theme.colors.white} />
            <ActionLabel>Log Steps</ActionLabel>
          </ActionButton>
          <ActionButton>
            <Icon name="local-drink" size={20} color={theme.colors.white} />
            <ActionLabel>Log Water</ActionLabel>
          </ActionButton>
          <ActionButton>
            <Icon name="hotel" size={20} color={theme.colors.white} />
            <ActionLabel>Log Sleep</ActionLabel>
          </ActionButton>
        </ActionsRow>
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
`;

const MetricsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 18px 10px 0 10px;
`;

const MetricCard = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.card || '#f6f8fa'};
  border-radius: 14px;
  margin: 0 6px;
  padding: 16px 10px;
  align-items: center;
  elevation: 2;
`;

const MetricLabel = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-top: 6px;
`;

const MetricValue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 6px 0;
`;

const ProgressBar = styled.View`
  width: 100%;
  height: 7px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.View<{ color: string }>`
  height: 100%;
  background-color: ${({ color }) => color};
  border-radius: 4px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 24px 18px 10px 18px;
`;

const ChartContainer = styled.View`
  margin: 0 18px 18px 18px;
`;

const ChartBar = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.card || '#f6f8fa'};
  border-radius: 10px;
  padding: 8px 0;
  margin-bottom: 8px;
`;

const ChartBarItem = styled.View<{ height: number }>`
  width: 12px;
  margin: 0 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  height: ${({ height }) => height || 10}px;
`;

const ChartLabels = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ChartLabel = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.secondaryText};
  width: 24px;
  text-align: center;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 18px 18px 30px 18px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 14px 0;
  align-items: center;
  margin: 0 6px;
  elevation: 2;
`;

const ActionLabel = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  margin-top: 4px;
`;

const styles = StyleSheet.create({
  headerGradient: {
    padding: 18,
    paddingTop: 38,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 8,
    elevation: 2,
  },
});

export default ActivityTracking;