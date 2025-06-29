import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import styled, { useTheme } from 'styled-components/native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const Container = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const BackgroundView = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
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
  font-size: ${(props) => props.theme.typography.fontSize.xl}px;
  color: black; // MaskedView uses this for the mask, color doesn't matter
  margin-top: 20px;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.12);
`;

// ...existing imports...

const AppNameGradient = ({ children, opacity }: { children: React.ReactNode; opacity: Animated.Value }) => {
  const theme = useTheme();
  const gradientColors = [theme.colors.primary, theme.colors.secondary];

  return (
    <MaskedView
  maskElement={
    <Text
      style={{
        fontFamily: theme.typography.fontFamily.bold, // Use bold only
        fontWeight: '900',
        fontSize: theme.typography.fontSize.xl + 6,
        lineHeight: (theme.typography.fontSize.xl + 6) * 1.18,
        color: 'black',
        marginTop: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.12)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
        letterSpacing: 1,
      }}
    >
      {children}
    </Text>
  }
>
  <Animated.View style={{ opacity }}>
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ width: 240, height: 72, alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Invisible text for layout */}
      <Text
        style={{
          fontFamily: theme.typography.fontFamily.bold,
          fontWeight: '900',
          fontSize: theme.typography.fontSize.xl + 6,
          lineHeight: (theme.typography.fontSize.xl + 6) * 1.18,
          opacity: 0,
          marginTop: 20,
          textAlign: 'center',
          letterSpacing: 1,
        }}
      >
        {children}
      </Text>
    </LinearGradient>
  </Animated.View>
</MaskedView>
  );
};

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
      {/* Background */}
      <BackgroundView />
      {/* Animated blobs background */}
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
      <AppNameGradient opacity={textFadeAnim}>
        FitTrack
      </AppNameGradient>
    </Container>
  );
};

export default SplashScreen;