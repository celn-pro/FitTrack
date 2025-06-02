import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore, authUtils } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '../styles/colors';
type RootStackParamList = {
  Login: undefined;
  // add other routes here if needed
};

const Profile: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => {
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
    <Container>
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
        <SectionTitle>Profile Details</SectionTitle>
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
          <DetailLabel>Height</DetailLabel>
          <DetailValue>{user.height ? `${user.height} cm` : '-'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Weight</DetailLabel>
          <DetailValue>{user.weight ? `${user.weight} kg` : '-'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>BMI</DetailLabel>
          <DetailValue>
            {authUtils.calculateBMI() !== null
              ? `${authUtils.calculateBMI()} (${authUtils.getBMICategory()})`
              : '-'}
          </DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Dietary Preference</DetailLabel>
          <DetailValue>{user.dietaryPreference || '-'}</DetailValue>
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
        {/* Add more profile details as needed */}
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
  margin-bottom: 18px;
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

const styles = StyleSheet.create({
  headerGradient: {
    padding: 18,
    paddingTop: 38,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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