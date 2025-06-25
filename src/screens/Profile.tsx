import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore, authUtils } from '../store/authStore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Profile: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useAuthStore();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove([
              'recommendations',
              'recommendationsDate',
              'healthTips',
              'healthTipsDate',
              'didYouKnow',
              'didYouKnowDate',
              'moodHistory',
              'lastLoginDate',
              'loginStreak',
              'streakHistory'
            ]);
            logout();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        },
      ]
    );
  };

  if (!user) {
    return (
      <Container>
        <Centered>
          <Icon name="person-off" size={60} color={theme.colors.secondaryText} />
          <EmptyText>You are not logged in.</EmptyText>
        </Centered>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <HeaderContent>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ProfileAvatar>
              <Icon name="person" size={38} color={theme.colors.white} />
            </ProfileAvatar>
            <View style={{ marginLeft: 14 }}>
              <HeaderTitle>{authUtils.getDisplayName()}</HeaderTitle>
              <HeaderSubtitle>{user.email}</HeaderSubtitle>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Icon name="logout" size={22} color={theme.colors.white} />
          </TouchableOpacity>
        </HeaderContent>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <SectionTitle>Profile Overview</SectionTitle>
        <DetailRow>
          <DetailLabel>Name</DetailLabel>
          <DetailValue>{user.name || '-'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Email</DetailLabel>
          <DetailValue>{user.email}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Fitness Goal</DetailLabel>
          <DetailValue>{user.fitnessGoal || '-'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Profile Complete</DetailLabel>
          <DetailValue>
            {user.isProfileComplete ? (
              <Icon name="check-circle" size={18} color={theme.colors.primary} />
            ) : (
              <Icon name="cancel" size={18} color={theme.colors.accent} />
            )}
          </DetailValue>
        </DetailRow>

        <SectionTitle>Activity</SectionTitle>
        <ActivityRow>
          <ActivityCard onPress={() => navigation.navigate('Tracking')}>
            <Icon name="directions-walk" size={28} color={theme.colors.primary} />
            <ActivityLabel>Activity</ActivityLabel>
          </ActivityCard>
          <ActivityCard onPress={() => navigation.navigate('Courses')}>
            <Icon name="school" size={28} color={theme.colors.primary} />
            <ActivityLabel>Courses</ActivityLabel>
          </ActivityCard>
          <ActivityCard onPress={() => navigation.navigate('SocialFeed')}>
            <Icon name="groups" size={28} color={theme.colors.primary} />
            <ActivityLabel>Social</ActivityLabel>
          </ActivityCard>
        </ActivityRow>

        <SectionTitle>Quick Links</SectionTitle>
        <ActionButton onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={20} color={theme.colors.primary} />
          <ActionLabel>Settings</ActionLabel>
        </ActionButton>
        <ActionButton onPress={() => navigation.navigate('Courses')}>
          <Icon name="school" size={20} color={theme.colors.secondary} />
          <ActionLabel>My Courses</ActionLabel>
        </ActionButton>
        <ActionButton onPress={() => navigation.navigate('Tracking')}>
          <Icon name="directions-run" size={20} color={theme.colors.secondary} />
          <ActionLabel>My Activity</ActionLabel>
        </ActionButton>
        <ActionButton onPress={() => navigation.navigate('SocialFeed')}>
          <Icon name="groups" size={20} color={theme.colors.secondary} />
          <ActionLabel>Community Feed</ActionLabel>
        </ActionButton>
        <ActionButton onPress={handleLogout}>
          <Icon name="logout" size={20} color={theme.colors.accent} />
          <ActionLabel>Log Out</ActionLabel>
        </ActionButton>
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0 0 0;
`;

const ProfileAvatar = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.secondary};
  justify-content: center;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderSubtitle = styled.Text`
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  margin-top: 2px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 24px 0 12px 0;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.card || '#eaeaea'};
`;

const DetailLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const DetailValue = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-top: 20px;
`;

const ActivityRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0 18px 0;
`;

const ActivityCard = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.card || '#f6f8fa'};
  border-radius: 12px;
  margin: 0 6px;
  padding: 18px 0 10px 0;
  elevation: 1;
`;

const ActivityLabel = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-top: 8px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.card || '#f6f8fa'};
  border-radius: 10px;
  padding: 12px 18px;
  margin-top: 12px;
  elevation: 1;
`;

const ActionLabel = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 12px;
  font-weight: 500;
`;

const styles = StyleSheet.create({
  headerGradient: {
    padding: 18,
    paddingTop: 38,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    marginBottom: 8,
    elevation: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
  },
});

export default Profile;