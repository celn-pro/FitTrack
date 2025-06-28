import React from 'react';
import { ScrollView, Linking, StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../store/authStore';
import { useTheme as useAppTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Settings: React.FC = () => {
  const { theme, toggleTheme, isDark } = useAppTheme();
  const { user } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const insets = useSafeAreaInsets();

  const handleToggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleToggleDarkMode = () => {
    toggleTheme();
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@fittrack.com');
  };

  const handleOpenPrivacy = () => {
    Linking.openURL('https://fittrack.com/privacy');
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://fittrack.com/terms');
  };

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <HeaderTitle>Settings</HeaderTitle>
        <HeaderSubtitle>Customize your FitTrack experience</HeaderSubtitle>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <SectionTitle>Preferences</SectionTitle>
        <SettingRow onPress={handleToggleNotifications}>
          <Icon name={notificationsEnabled ? 'notifications-active' : 'notifications-off'} size={22} color={theme.colors.primary} />
          <SettingLabel>Notifications</SettingLabel>
          <SettingValue>{notificationsEnabled ? 'On' : 'Off'}</SettingValue>
        </SettingRow>
        <SettingRow onPress={handleToggleDarkMode}>
          <Icon name={isDark ? 'dark-mode' : 'light-mode'} size={22} color={theme.colors.primary} />
          <SettingLabel>Dark Mode</SettingLabel>
          <SettingValue>{isDark ? 'On' : 'Off'}</SettingValue>
        </SettingRow>

        <SectionTitle>Account</SectionTitle>
        <SettingRow>
          <Icon name="person" size={22} color={theme.colors.primary} />
          <SettingLabel>Name</SettingLabel>
          <SettingValue>
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.name || user?.firstName || '-'}
          </SettingValue>
        </SettingRow>
        <SettingRow>
          <Icon name="email" size={22} color={theme.colors.primary} />
          <SettingLabel>Email</SettingLabel>
          <SettingValue>{user?.email || '-'}</SettingValue>
        </SettingRow>

        <SectionTitle>Support</SectionTitle>
        <SettingRow onPress={handleContactSupport}>
          <Icon name="support-agent" size={22} color={theme.colors.primary} />
          <SettingLabel>Contact Support</SettingLabel>
        </SettingRow>
        <SettingRow onPress={handleOpenPrivacy}>
          <Icon name="privacy-tip" size={22} color={theme.colors.primary} />
          <SettingLabel>Privacy Policy</SettingLabel>
        </SettingRow>
        <SettingRow onPress={handleOpenTerms}>
          <Icon name="gavel" size={22} color={theme.colors.primary} />
          <SettingLabel>Terms of Service</SettingLabel>
        </SettingRow>
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  margin-top: 4px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 24px 0 12px 0;
`;

const SettingRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 14px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.card || '#eaeaea'};
`;

const SettingLabel = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 14px;
  flex: 1;
`;

const SettingValue = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
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
});

export default Settings;