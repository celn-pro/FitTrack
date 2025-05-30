import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled, { useTheme } from 'styled-components/native';
import { Container, Title, ButtonText } from '../styles/globalStyles';

const Header = styled.View`
  margin-bottom: 20px;
`;

const Tabs = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Tab = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: #e0e0e0;
`;

const ActiveTab = styled(Tab)`
  border-bottom-color: ${(props) => props.theme.colors.primary};
`;

const TabText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const ActiveTabText = styled(TabText)`
  color: ${(props) => props.theme.colors.primary};
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
`;

const Metrics = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const MetricCard = styled.View`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 10px;
  padding: 15px;
  flex: 1;
  margin: 0 5px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 3;
`;

const MetricLabel = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.text};
`;

const MetricValue = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.bold};
  font-size: ${(props) => props.theme.typography.fontSize.large}px;
  color: ${(props) => props.theme.colors.primary};
`;

const SectionTitle = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.large}px;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 10px;
`;

const Chart = styled(LineChart)`
  border-radius: 10px;
  margin-bottom: 20px;
`;

const WorkoutCard = styled.View`
  flex-direction: row;
  border-radius: 15px;
  padding: 15px;
  align-items: center;
  margin-bottom: 20px;
`;

const WorkoutDetails = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const WorkoutTitle = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.white};
`;

const WorkoutTime = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.white};
`;

const WorkoutAction = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.white};
`;

const VoiceButton = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 25px;
  padding: 15px;
  align-items: center;
  justify-content: center;
`;

const VoiceButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.white};
  margin-left: 10px;
`;

const ActivityTracking: React.FC = () => {
  const [tab, setTab] = useState('Overview');
  const theme = useTheme();

  return (
    <Container as={ScrollView}>
      <Header>
        <Title>Activity</Title>
      </Header>
      <Tabs>
        {['Overview', 'Daily', 'Weekly'].map((item) => (
          <Tab
            key={item}
            as={tab === item ? ActiveTab : Tab}
            onPress={() => setTab(item)}
          >
            <TabText as={tab === item ? ActiveTabText : TabText}>{item}</TabText>
          </Tab>
        ))}
      </Tabs>
      <Metrics>
        <MetricCard>
          <MetricLabel>Steps</MetricLabel>
          <MetricValue>5,234</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Calories</MetricLabel>
          <MetricValue>234</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>Distance</MetricLabel>
          <MetricValue>2.3 mi</MetricValue>
        </MetricCard>
      </Metrics>
      <SectionTitle>Progress</SectionTitle>
      <Chart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [{ data: [5000, 6000, 5234, 7000, 8000] }],
        }}
        width={350}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
        }}
      />
      <SectionTitle>Workouts</SectionTitle>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={{ borderRadius: 15 }}
      >
        <WorkoutCard>
          <Icon name="directions-walk" size={24} color={theme.colors.white} />
          <WorkoutDetails>
            <WorkoutTitle>Morning Walk</WorkoutTitle>
            <WorkoutTime>10:00 AM</WorkoutTime>
          </WorkoutDetails>
          <WorkoutAction>View in AR</WorkoutAction>
        </WorkoutCard>
      </LinearGradient>
      <VoiceButton>
        <Icon name="mic" size={24} color={theme.colors.white} />
        <VoiceButtonText>Log with Voice</VoiceButtonText>
      </VoiceButton>
    </Container>
  );
};

export default ActivityTracking;