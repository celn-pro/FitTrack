import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Animated, TouchableOpacity, RefreshControl, Dimensions, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styled, { useTheme } from 'styled-components/native';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../navigation/types';

type RegistrationNavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingRegistration'>;

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
  margin-bottom: 40px;
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
  margin-bottom: 16px;
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

const Disclaimer = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.secondaryText};
  text-align: center;
  margin-top: 24px;
  line-height: 18px;
  max-width: 300px;
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

const LoginLinkContainer = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const LoginText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const LoginLink = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.primary};
`;

const InputContainer = styled.View`
  width: 100%;
  position: relative;
  margin-bottom: 16px;
`;

const PasswordToggle = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-10px);
  padding: 4px;
`;

const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!) {
    registerUser(email: $email, password: $password) {
      user {
        id
        email
        isProfileComplete
      }
      token
    }
  }
`;

const Registration: React.FC = () => {
  const navigation = useNavigation<RegistrationNavigationProp>();
  const theme = useTheme();
  const { setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      try {
        const { user, token } = data.registerUser;
        
        // Store user and token
        setUser(user);
        setToken(token);
        
        // Navigate to profile setup
        navigation.navigate('OnboardingProfileSetup');
        
        // Show success message
        Alert.alert(
          'Welcome to FitTrack!',
          'Your account has been created successfully. Let\'s complete your profile.',
          [{ text: 'Continue', style: 'default' }]
        );
      } catch (err) {
        setError('Registration completed but navigation failed. Please try logging in.');
      }
    },
    onError: (error) => {
      console.error('Registration error:', error);
      
      // Handle specific error types
      if (error.message.includes('already exists')) {
        setEmailError('An account with this email already exists');
      } else if (error.message.includes('password')) {
        setPasswordError('Password does not meet requirements');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    },
  });

  const validateForm = (): boolean => {
    // Clear previous errors
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      hasError = true;
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }
    
    return !hasError;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      await registerUser({ 
        variables: { 
          email: email.trim().toLowerCase(), 
          password 
        } 
      });
    } catch (err) {
      // Error is handled in onError callback
      console.error('Registration submission error:', err);
    }
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
    setConfirmPasswordError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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
            <Title>Join FitTrack</Title>
            
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
            {emailError && <ErrorText>{emailError}</ErrorText>}
            
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

          <InputContainer>
            <Input
              placeholder="Confirm Password"
              placeholderTextColor={
                theme.colors.background === '#1C2526' 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : theme.colors.secondaryText
              }
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError(null);
              }}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
              style={{
                borderColor: confirmPasswordError ? theme.colors.accent : (
                  theme.colors.background === '#1C2526' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : '#E0E0E0'
                )
              }}
            />
            <PasswordToggle onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon 
                name={showConfirmPassword ? "visibility-off" : "visibility"} 
                size={20} 
                color={theme.colors.background === '#1C2526' 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : theme.colors.secondaryText
                } 
              />
            </PasswordToggle>
          </InputContainer>
          {confirmPasswordError && <ErrorText>{confirmPasswordError}</ErrorText>}
            
            {error && (
              <ErrorText style={{ textAlign: 'center', marginTop: 8 }}>
                {error}
              </ErrorText>
            )}
            
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
                onPress={handleRegister}
                disabled={loading}
              >
                <ButtonContainer>
                  <IconContainer>
                    <Icon name="email" size={20} color={theme.colors.white} />
                  </IconContainer>
                  <ButtonText>{loading ? 'Creating Account...' : 'Continue with Email'}</ButtonText>
                </ButtonContainer>
              </AnimatedTouchable>
            </LinearGradient>

            <SeparatorContainer>
              <SeparatorLine />
              <SeparatorText>or continue with</SeparatorText>
              <SeparatorLine />
            </SeparatorContainer>
            
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
                onPress={() => {
                  Alert.alert('Coming Soon', 'Google Sign In will be available in the next update!');
                }}
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
                onPress={() => {
                  Alert.alert('Coming Soon', 'Apple Sign In will be available in the next update!');
                }}
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
            
            <LoginLinkContainer>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <LoginText>
                  Already have an account? <LoginLink>Sign In</LoginLink>
                </LoginText>
              </TouchableOpacity>
            </LoginLinkContainer>
            
            <Disclaimer>
              By signing up, you agree to our Terms, Privacy Policy, and Cookie Use.
            </Disclaimer>
          </FormContainer>
        </CenteredContainer>
      </Content>
    </Container>
  );
};

export default Registration;