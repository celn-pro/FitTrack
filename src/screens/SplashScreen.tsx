import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled, { useTheme } from 'styled-components/native';
import { RootStackParamList } from '../navigation/types';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const Container = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const AnimationContainer = styled(Animated.View)`
  width: 200px;
  height: 200px;
  justify-content: center;
  align-items: center;
`;

const Animation = styled(LottieView)`
  width: 200px;
  height: 200px;
`;

const AppName = styled(Animated.Text)`
  font-family: ${(props) => props.theme.typography.fontFamily.bold};
  font-size: ${(props) => props.theme.typography.fontSize.xlarge}px;
  color: ${(props) => props.theme.colors.white};
  margin-top: 20px;
  text-align: center;
`;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const theme = useTheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Fade in and scale up the animation container
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      // Fade in the app name after a slight delay
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Navigate to Welcome screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('OnboardingWelcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, textFadeAnim]);

  return (
    <Container>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary, theme.colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {/* Background blobs animation */}
      <LottieView
        source={require('../assets/animations/gradient-blobs.json')}
        autoPlay
        loop
        resizeMode="cover"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.5,
        }}
      />
      <AnimationContainer
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Animation
          source={require('../assets/animations/heart-pulse.json')}
          autoPlay
          loop
        />
      </AnimationContainer>
      <AppName
        style={{
          opacity: textFadeAnim,
        }}
      >
        FitTrack
      </AppName>
    </Container>
  );
};

export default SplashScreen;