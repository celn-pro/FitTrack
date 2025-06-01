import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Animated, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled, { useTheme } from 'styled-components/native';
import TouchID from 'react-native-touch-id';
import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from '../navigation/types';

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Content = styled(ScrollView)`
  flex: 1;
`;

const CenteredContainer = styled.View`
  min-height: ${screenHeight - 100}px;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const FormContainer = styled.View`
  width: 100%;
  max-width: 400px;
  align-items: center;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.bold};
  font-size: ${(props) => props.theme.typography.fontSize.xlarge}px;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.secondaryText};
  text-align: center;
  margin-bottom: 40px;
`;

const InputContainer = styled.View`
  width: 100%;
  position: relative;
  margin-bottom: 16px;
`;

const Input = styled.TextInput`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : props.theme.colors.white
  };
  border-radius: 12px;
  padding: 16px;
  padding-right: 50px;
  width: 100%;
  border: 1px solid ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.3)' 
      : '#E0E0E0'
  };
  shadow-color: ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const PasswordToggle = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-10px);
  padding: 4px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  padding: 14px 20px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  width: 100%;
`;

const IconContainer = styled.View`
  margin-right: 10px;
`;

const ButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.white};
`;

const BiometricButtonContainer = styled.View`
  flex-direction: row;
  padding: 14px 20px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  width: 100%;
  background-color: ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'
  };
  border: 1px solid ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
`;

const BiometricButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.text};
`;

const ErrorText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.accent};
  text-align: left;
  margin-bottom: 8px;
  margin-top: 4px;
  padding-left: 4px;
`;

const ForgotPasswordContainer = styled.View`
  align-items: flex-end;
  width: 100%;
  margin-bottom: 24px;
`;

const ForgotPasswordText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.primary};
`;

const SeparatorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 24px 0;
  width: 100%;
`;

const SeparatorLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
`;

const SeparatorText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.secondaryText};
  margin: 0 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const RegisterLinkContainer = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const RegisterText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const RegisterLink = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.primary};
`;

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        id
        name
        email
        fitnessGoal
        isProfileComplete
      }
      token
    }
  }
`;

const Login: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const theme = useTheme();
  const { setUser, setToken } = useAuthStore();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // UI states
  const [refreshing, setRefreshing] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  // Animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Check biometric support on mount
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const biometryType = await TouchID.isSupported();
      if (biometryType) {
        setBiometricSupported(true);
        setBiometricType(biometryType);
      }
    } catch (error) {
      setBiometricSupported(false);
    }
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      try {
        const { user, token } = data.loginUser;
        
        // Store user and token
        setUser(user);
        setToken(token);
        
        // Navigate based on profile completion status
        if (user.isProfileComplete) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('OnboardingProfileSetup');
        }
        
        // Show success message
        Alert.alert(
          'Welcome Back!',
          'You have successfully logged in.',
          [{ text: 'Continue', style: 'default' }]
        );
      } catch (err) {
        setError('Login completed but navigation failed. Please restart the app.');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.message.includes('Invalid credentials') || error.message.includes('not found')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('email')) {
        setEmailError('Please check your email address');
      } else if (error.message.includes('password')) {
        setPasswordError('Please check your password');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    },
  });

  const validateForm = (): boolean => {
    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);
    setError(null);
    
    let hasError = false;
    
    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }
    
    return !hasError;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await loginUser({ 
        variables: { 
          email: email.trim().toLowerCase(), 
          password 
        } 
      });
    } catch (err) {
      // Error is handled in onError callback
      console.error('Login submission error:', err);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await TouchID.authenticate(
        `Use your ${biometricType.toLowerCase()} to sign in to FitTrack`,
        {
          title: 'Biometric Authentication',
          fallbackLabel: 'Use Password',
        }
      );
      
      if (result) {
        // Here you would typically retrieve stored credentials and auto-login
        // For now, we'll show a success message
        Alert.alert(
          'Biometric Authentication Successful',
          'Feature coming soon! Please use email/password for now.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.log('Biometric authentication failed:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as any).message === 'string' &&
        (error as any).message !== 'UserCancel' &&
        (error as any).message !== 'UserFallback'
      ) {
        Alert.alert('Authentication Failed', 'Please try again or use your password.');
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      'Coming Soon', 
      `${provider} Sign In will be available in the next update!`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset functionality will be available soon!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const onRefresh = () => {
    setRefreshing(true);
    setError(null);
    setEmailError(null);
    setPasswordError(null);
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <Container>
      <Content
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <CenteredContainer>
          <FormContainer>
            <Title>Welcome Back</Title>
            <Subtitle>Sign in to continue your fitness journey</Subtitle>
            
            {/* Email Input */}
            <InputContainer>
              <Input
                placeholder="Email"
                placeholderTextColor={
                  theme.colors.background === '#1C2526' 
                    ? 'rgba(255, 255, 255, 0.6)' 
                    : theme.colors.secondaryText
                }
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(null);
                  if (error) setError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={{
                  borderColor: emailError ? theme.colors.accent : (
                    theme.colors.background === '#1C2526' 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : '#E0E0E0'
                  )
                }}
              />
            </InputContainer>
            {emailError && <ErrorText>{emailError}</ErrorText>}
            
            {/* Password Input */}
            <InputContainer>
              <Input
                placeholder="Password"
                placeholderTextColor={
                  theme.colors.background === '#1C2526' 
                    ? 'rgba(255, 255, 255, 0.6)' 
                    : theme.colors.secondaryText
                }
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError(null);
                  if (error) setError(null);
                }}
                secureTextEntry={!showPassword}
                editable={!loading}
                style={{
                  borderColor: passwordError ? theme.colors.accent : (
                    theme.colors.background === '#1C2526' 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : '#E0E0E0'
                  )
                }}
              />
              <PasswordToggle onPress={() => setShowPassword(!showPassword)}>
                <Icon 
                  name={showPassword ? "visibility-off" : "visibility"} 
                  size={20} 
                  color={theme.colors.background === '#1C2526' 
                    ? 'rgba(255, 255, 255, 0.6)' 
                    : theme.colors.secondaryText
                  } 
                />
              </PasswordToggle>
            </InputContainer>
            {passwordError && <ErrorText>{passwordError}</ErrorText>}
            
            {/* Forgot Password */}
            <ForgotPasswordContainer>
              <TouchableOpacity onPress={handleForgotPassword}>
                <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
              </TouchableOpacity>
            </ForgotPasswordContainer>
            
            {/* General Error */}
            {error && (
              <ErrorText style={{ textAlign: 'center', marginBottom: 16 }}>
                {error}
              </ErrorText>
            )}
            
            {/* Sign In Button */}
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={{ borderRadius: 12, marginBottom: 20, width: '100%' }}
            >
              <AnimatedTouchable
                style={{
                  transform: [{ scale: buttonScale }],
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleLogin}
                disabled={loading}
              >
                <ButtonContainer>
                  <IconContainer>
                    <Icon name="login" size={20} color={theme.colors.white} />
                  </IconContainer>
                  <ButtonText>{loading ? 'Signing In...' : 'Sign In'}</ButtonText>
                </ButtonContainer>
              </AnimatedTouchable>
            </LinearGradient>

            {/* Biometric Authentication */}
            {biometricSupported && (
              <TouchableOpacity 
                onPress={handleBiometricLogin}
                disabled={loading}
                style={{ width: '100%' }}
              >
                <BiometricButtonContainer>
                  <IconContainer>
                    <Icon 
                      name={biometricType === 'FaceID' ? "face" : "fingerprint"} 
                      size={20} 
                      color={theme.colors.text} 
                    />
                  </IconContainer>
                  <BiometricButtonText>
                    Continue with {biometricType === 'FaceID' ? 'Face ID' : 'Fingerprint'}
                  </BiometricButtonText>
                </BiometricButtonContainer>
              </TouchableOpacity>
            )}

            <SeparatorContainer>
              <SeparatorLine />
              <SeparatorText>or continue with</SeparatorText>
              <SeparatorLine />
            </SeparatorContainer>
            
            {/* Google Sign In */}
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={{ borderRadius: 12, marginBottom: 12, width: '100%' }}
            >
              <AnimatedTouchable
                style={{
                  transform: [{ scale: buttonScale }],
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => handleSocialLogin('Google')}
                disabled={loading}
              >
                <ButtonContainer>
                  <IconContainer>
                    <Icon name="g-translate" size={20} color={theme.colors.white} />
                  </IconContainer>
                  <ButtonText>Continue with Google</ButtonText>
                </ButtonContainer>
              </AnimatedTouchable>
            </LinearGradient>
            
            {/* Apple Sign In */}
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={{ borderRadius: 12, marginBottom: 12, width: '100%' }}
            >
              <AnimatedTouchable
                style={{
                  transform: [{ scale: buttonScale }],
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => handleSocialLogin('Apple')}
                disabled={loading}
              >
                <ButtonContainer>
                  <IconContainer>
                    <Icon name="phone-iphone" size={20} color={theme.colors.white} />
                  </IconContainer>
                  <ButtonText>Continue with Apple</ButtonText>
                </ButtonContainer>
              </AnimatedTouchable>
            </LinearGradient>
            
            {/* Register Link */}
            <RegisterLinkContainer>
              <TouchableOpacity onPress={() => navigation.navigate('OnboardingRegistration')}>
                <RegisterText>
                  Don't have an account? <RegisterLink>Sign Up</RegisterLink>
                </RegisterText>
              </TouchableOpacity>
            </RegisterLinkContainer>
          </FormContainer>
        </CenteredContainer>
      </Content>
    </Container>
  );
};

export default Login;