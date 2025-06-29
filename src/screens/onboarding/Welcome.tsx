import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, RefreshControl, Animated, Easing, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled, { useTheme } from 'styled-components/native';
import { HapticButton } from '../../components/HapticButton';
import { useThemeStore } from '../../store/themeStore';
import { RootStackParamList } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { useAuthStore, authUtils } from '../../store/authStore'; // <-- import auth store and utils


type WelcomeNavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingWelcome'>;

const Container = styled(SafeAreaView)`
  flex: 1;
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

const HeaderText = styled(Animated.Text)`
  font-family: ${(props) => props.theme.typography.fontFamily.bold};
  font-size: ${(props) => props.theme.typography.fontSize['4xl']}px;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  margin-bottom: 10px;
`;

const SubheaderText = styled(Animated.Text)`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.lg}px;
  color: ${(props) => props.theme.colors.secondaryText};
  text-align: center;
  margin-bottom: 40px;
`;

const IllustrationContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const AnimatedButton = styled(HapticButton)<{
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: Animated.AnimatedProps<ViewStyle>;
}>`
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 25px;
`;

const ButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.md}px;
  color: ${(props) => props.theme.colors.white};
`;

const SecondaryButton = styled.TouchableOpacity`
  padding: 15px;
  border-radius: 25px;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.primary};
  margin-top: 15px;
`;

const SecondaryButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.md}px;
  color: ${(props) => props.theme.colors.primary};
`;

const Welcome: React.FC = () => {
  const navigation = useNavigation<WelcomeNavigationProp>();
  const theme = useTheme();
  const { toggleTheme } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

   // Auth state
  const { isAuthenticated, user, token } = useAuthStore();

  // Check auth and auto-navigate if valid
  useEffect(() => {
    // You can add a real token expiry check here if you store expiry
    if (isAuthenticated && user && token) {
      // If you want to check profile completion:
      if (user.isProfileComplete) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'OnboardingProfileSetup' }] });
      }
    }
  }, [isAuthenticated, user, token, navigation]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(buttonScale, {
      toValue: 1.05,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim, slideAnim, buttonScale]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000); // Simulate refresh
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Container>
      {/* Animated background blobs */}
      <LottieView
        source={require('../../assets/animations/gradient-blobs.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />

      <Content
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <IllustrationContainer>
          <LottieView
            source={require('../../assets/animations/heart-pulse.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </IllustrationContainer>

        <HeaderText
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          Track, Plan, Succeed
        </HeaderText>

        <SubheaderText
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          Your Fitness Journey Starts Here
        </SubheaderText>

        <AnimatedButton
          style={{ transform: [{ scale: buttonScale }] }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          onPress={() => navigation.navigate('OnboardingRegistration')}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={{ borderRadius: 25, padding: 15, width: '100%', alignItems: 'center' }}
          >
            <ButtonText>Sign Up</ButtonText>
          </LinearGradient>
        </AnimatedButton>

        <SecondaryButton onPress={() => navigation.navigate('Login')}>
          <SecondaryButtonText>Log In</SecondaryButtonText>
        </SecondaryButton>
      </Content>
    </Container>
  );
};

export default Welcome;
