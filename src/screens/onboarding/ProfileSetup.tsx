import React, { useState, useRef, useEffect } from 'react';
import { TextInput, Alert, Animated, TouchableOpacity, RefreshControl, Dimensions, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { RootStackParamList } from '../../navigation/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import styled, { useTheme } from 'styled-components/native';
import { useAuthStore } from '../../store/authStore';

type ProfileSetupNavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingProfileSetup'>;

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
  margin-bottom: 30px;
  line-height: 22px;
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

const PickerContainer = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
  padding-left: 4px;
`;

const PickerWrapper = styled.View`
  background-color: ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : props.theme.colors.white
  };
  border-radius: 12px;
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

const StyledPicker = styled(Picker)`
  color: ${(props) => props.theme.colors.text};
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
`;

const CheckboxContainer = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const CheckboxRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const Checkbox = styled(TouchableOpacity)`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

const CheckboxText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.text};
`;

const Chatbot = styled.View`
  flex-direction: row;
  background-color: ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : `${props.theme.colors.primary}20`
  };
  border-radius: 20px;
  padding: 20px;
  align-items: center;
  margin-bottom: 30px;
  border: 1px solid ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : `${props.theme.colors.primary}30`
  };
  shadow-color: ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'
  };
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const ChatbotText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.text};
  margin-left: 12px;
  flex: 1;
  line-height: 20px;
`;

const ErrorText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.accent};
  text-align: left;
  margin-bottom: 8px;
  margin-top: -12px;
  padding-left: 4px;
`;

const ProgressContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const ProgressDot = styled.View<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${(props) => 
    props.active ? props.theme.colors.primary : props.theme.colors.secondaryText};
  margin: 0 4px;
`;

const ProgressLine = styled.View<{ completed: boolean }>`
  width: 30px;
  height: 2px;
  background-color: ${(props) => 
    props.completed ? props.theme.colors.primary : props.theme.colors.secondaryText};
  margin: 0 4px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
`;

const SecondaryButton = styled(TouchableOpacity)`
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => 
    props.theme.colors.background === '#1C2526' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'transparent'
  };
`;

const SecondaryButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.primary};
`;

const PrimaryButtonContainer = styled.View`
  flex: 1;
  margin-left: 8px;
`;

const PrimaryButton = styled.View`
  flex-direction: row;
  padding: 16px 20px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const PrimaryButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.white};
`;

const COMPLETE_PROFILE = gql`
  mutation CompleteProfile(
    $name: String!
    $age: Int!
    $weight: Float!
    $height: Float!
    $gender: String!
    $fitnessGoal: String!
    $dietaryPreference: String!
    $healthConditions: [String!]!
    $activityLevel: String!
    $preferredWorkoutTypes: [String!]!
    $dietaryRestrictions: [String!]!
  ) {
    completeProfile(
      name: $name
      age: $age
      weight: $weight
      height: $height
      gender: $gender
      fitnessGoal: $fitnessGoal
      dietaryPreference: $dietaryPreference
      healthConditions: $healthConditions
      activityLevel: $activityLevel
      preferredWorkoutTypes: $preferredWorkoutTypes
      dietaryRestrictions: $dietaryRestrictions
    ) {
      id
      name
      email
      age
      weight
      height
      gender
      fitnessGoal
      dietaryPreference
      healthConditions
      activityLevel
      preferredWorkoutTypes
      dietaryRestrictions
      isProfileComplete
    }
  }
`;

const ProfileSetup: React.FC = () => {
  const navigation = useNavigation<ProfileSetupNavigationProp>();
  const theme = useTheme();
  const { user, setUser } = useAuthStore();

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('Lose Weight');
  const [dietaryPreference, setDietaryPreference] = useState('None');
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState('');
  const [preferredWorkoutTypes, setPreferredWorkoutTypes] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

  // Error state
  const [nameError, setNameError] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [activityLevelError, setActivityLevelError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // UI state
  const [refreshing, setRefreshing] = useState(false);

  // Animation
  const buttonScale = useRef(new Animated.Value(1)).current;
  const chatbotOpacity = useRef(new Animated.Value(0)).current;

  const [completeProfile, { loading }] = useMutation(COMPLETE_PROFILE, {
    onCompleted: (data) => {
      try {
        // Update user in store
        setUser(data.completeProfile);
        
        // Show success message
        Alert.alert(
          'Profile Complete!',
          'Welcome to FitTrack! Your fitness journey starts now.',
          [
            {
              text: 'Let\'s Go!',
              onPress: () => navigation.navigate('Home'),
              style: 'default'
            }
          ]
        );
      } catch (err) {
        setGeneralError('Profile completed but navigation failed. Please restart the app.');
      }
    },
    onError: (error) => {
      console.error('Profile completion error:', error);
      setGeneralError(error.message || 'Failed to complete profile. Please try again.');
    },
  });

  // Animate chatbot on mount
  useEffect(() => {
    Animated.timing(chatbotOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Update chatbot message based on name
  useEffect(() => {
    if (name.trim()) {
      Animated.sequence([
        Animated.timing(chatbotOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(chatbotOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [name]);

  const validateForm = (): boolean => {
    // Clear previous errors
    setNameError(null);
    setAgeError(null);
    setWeightError(null);
    setHeightError(null);
    setGenderError(null);
    setActivityLevelError(null);
    setGeneralError(null);
    
    let hasError = false;
    
    // Name validation
    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      hasError = true;
    }
    
    // Age validation
    const ageNum = parseInt(age);
    if (!age.trim()) {
      setAgeError('Age is required');
      hasError = true;
    } else if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      setAgeError('Please enter a valid age (13-120)');
      hasError = true;
    }
    
    // Weight validation
    const weightNum = parseFloat(weight);
    if (!weight.trim()) {
      setWeightError('Weight is required');
      hasError = true;
    } else if (isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
      setWeightError('Please enter a valid weight (20-500 kg)');
      hasError = true;
    }
    
    // Height validation
    const heightNum = parseFloat(height);
    if (!height.trim()) {
      setHeightError('Height is required');
      hasError = true;
    } else if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      setHeightError('Please enter a valid height (100-250 cm)');
      hasError = true;
    }

    // Gender validation
    if(!gender) {
      setGenderError('Gender is required');
      hasError = true;
    }
    
    // Activity Level validation
    if (!activityLevel) {
      setActivityLevelError('Activity level is required');
      hasError = true;
    }
    
    return !hasError;
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    
    try {
      await completeProfile({
        variables: {
          name: name.trim(),
          age: parseInt(age),
          weight: parseFloat(weight),
          height: parseFloat(height),
          gender,
          fitnessGoal,
          dietaryPreference,
          healthConditions,
          activityLevel,
          preferredWorkoutTypes,
          dietaryRestrictions,
        },
      });
    } catch (err) {
      console.error('Profile completion submission error:', err);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Profile Setup?',
      'You can complete your profile later in settings, but having complete information helps us create better fitness plans for you.',
      [
        {
          text: 'Complete Now',
          style: 'default',
        },
        {
          text: 'Skip for Now',
          style: 'destructive',
          onPress: () => navigation.navigate('Home'),
        },
      ]
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
    setGeneralError(null);
    setNameError(null);
    setAgeError(null);
    setWeightError(null);
    setHeightError(null);
    setGenderError(null);
    setActivityLevelError(null);
    setName('');
    setAge('');
    setWeight('');
    setHeight('');
    setGender('');
    setFitnessGoal('Lose Weight');
    setDietaryPreference('None');
    setHealthConditions([]);
    setActivityLevel('');
    setPreferredWorkoutTypes([]);
    setDietaryRestrictions([]);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleCheckbox = (value: string, current: string[], setter: (values: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  const getChatbotMessage = () => {
    const firstName = name.trim().split(' ')[0];
    if (firstName) {
      if (fitnessGoal === 'Lose Weight') {
        return `Great choice, ${firstName}! I'll help you achieve your weight loss goals with personalized workouts and nutrition tips.`;
      } else if (fitnessGoal === 'Gain Muscle') {
        return `Awesome, ${firstName}! Let's build some muscle together with targeted strength training and nutrition guidance.`;
      } else {
        return `Perfect, ${firstName}! Maintaining health is key to a happy life. I'll help you stay on track with balanced fitness routines.`;
      }
    }
    return "Hi there! I'm your AI fitness assistant. Let's set up your profile so I can create the perfect fitness plan for you!";
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
            <Title>Let's Get to Know You</Title>
            <Subtitle>Complete your profile to get personalized recommendations</Subtitle>

            <ProgressContainer>
              <ProgressDot active={true} />
              <ProgressLine completed={true} />
              <ProgressDot active={false} />
              <ProgressLine completed={false} />
              <ProgressDot active={false} />
            </ProgressContainer>

            <Input
              placeholder="What's your name?"
              placeholderTextColor={
                theme.colors.background === '#1C2526' 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : theme.colors.secondaryText
              }
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError(null);
              }}
              editable={!loading}
              style={{
                borderColor: nameError ? theme.colors.accent : (
                  theme.colors.background === '#1C2526' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : '#E0E0E0'
                )
              }}
            />
            {nameError && <ErrorText>{nameError}</ErrorText>}

            <Input
              placeholder="What's your age?"
              placeholderTextColor={
                theme.colors.background === '#1C2526' 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : theme.colors.secondaryText
              }
              value={age}
              onChangeText={(text) => {
                setAge(text.replace(/[^0-9]/g, ''));
                if (ageError) setAgeError(null);
              }}
              keyboardType="numeric"
              maxLength={3}
              editable={!loading}
              style={{
                borderColor: ageError ? theme.colors.accent : (
                  theme.colors.background === '#1C2526' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : '#E0E0E0'
                )
              }}
            />
            {ageError && <ErrorText>{ageError}</ErrorText>}

            <Input
              placeholder="What's your weight? (kg)"
              placeholderTextColor={
                theme.colors.background === '#1C2526' 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : theme.colors.secondaryText
              }
              value={weight}
              onChangeText={(text) => {
                setWeight(text.replace(/[^0-9.]/g, ''));
                if (weightError) setWeightError(null);
              }}
              keyboardType="numeric"
              editable={!loading}
              style={{
                borderColor: weightError ? theme.colors.accent : (
                  theme.colors.background === '#1C2526' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : '#E0E0E0'
                )
              }}
            />
            {weightError && <ErrorText>{weightError}</ErrorText>}

            <Input
              placeholder="What's your height? (cm)"
              placeholderTextColor={
                theme.colors.background === '#1C2526' 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : theme.colors.secondaryText
              }
              value={height}
              onChangeText={(text) => {
                setHeight(text.replace(/[^0-9.]/g, ''));
                if (heightError) setHeightError(null);
              }}
              keyboardType="numeric"
              editable={!loading}
              style={{
                borderColor: heightError ? theme.colors.accent : (
                  theme.colors.background === '#1C2526' 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : '#E0E0E0'
                )
              }}
            />
            {heightError && <ErrorText>{heightError}</ErrorText>}

            <PickerContainer>
              <Label>Gender</Label>
              <PickerWrapper>
                <StyledPicker
                  selectedValue={gender}
                  onValueChange={(itemValue) => {
                    setGender(itemValue as string);
                    if (genderError) setGenderError(null);
                  }}
                  enabled={!loading}
                  dropdownIconColor={theme.colors.text}
                >
                  <Picker.Item label="Select gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                </StyledPicker>
              </PickerWrapper>
            </PickerContainer>

            <PickerContainer>
              <Label>What's your fitness goal?</Label>
              <PickerWrapper>
                <StyledPicker
                  selectedValue={fitnessGoal}
                  onValueChange={(itemValue) => setFitnessGoal(itemValue as string)}
                  enabled={!loading}
                  dropdownIconColor={theme.colors.text}
                >
                  <Picker.Item label="Select a goal" value="" />
                  <Picker.Item label="Lose Weight" value="Lose Weight" />
                  <Picker.Item label="Gain Muscle" value="Gain Muscle" />
                  <Picker.Item label="Maintain Health" value="Maintain Health" />
                </StyledPicker>
              </PickerWrapper>
            </PickerContainer>

            <PickerContainer>
              <Label>Dietary Preference</Label>
              <PickerWrapper>
                <StyledPicker
                  selectedValue={dietaryPreference}
                  onValueChange={(itemValue) => setDietaryPreference(itemValue as string)}
                  enabled={!loading}
                  dropdownIconColor={theme.colors.text}
                >
                  <Picker.Item label="Select a preference" value="" />
                  <Picker.Item label="None" value="None" />
                  <Picker.Item label="Vegan" value="Vegan" />
                  <Picker.Item label="Vegetarian" value="Vegetarian" />
                  <Picker.Item label="Gluten-Free" value="Gluten-Free" />
                  <Picker.Item label="Keto" value="Keto" />
                  <Picker.Item label="Paleo" value="Paleo" />
                </StyledPicker>
              </PickerWrapper>
            </PickerContainer>

            <CheckboxContainer>
              <Label>Health Conditions</Label>
              {['None', 'Diabetes', 'Hypertension', 'Heart Condition', 'Knee Injury', 'Back Pain', 'Asthma'].map((condition) => (
                <CheckboxRow key={condition}>
                  <Checkbox
                    onPress={() => toggleCheckbox(condition, healthConditions, setHealthConditions)}
                  >
                    {healthConditions.includes(condition) && (
                      <Icon name="check" size={16} color={theme.colors.primary} />
                    )}
                  </Checkbox>
                  <CheckboxText>{condition}</CheckboxText>
                </CheckboxRow>
              ))}
            </CheckboxContainer>

            <PickerContainer>
              <Label>Activity Level</Label>
              <PickerWrapper>
                <StyledPicker
                  selectedValue={activityLevel}
                  onValueChange={(itemValue) => {
                    setActivityLevel(itemValue as string);
                    if (activityLevelError) setActivityLevelError(null);
                  }}
                  enabled={!loading}
                  dropdownIconColor={theme.colors.text}
                >
                  <Picker.Item label="Select activity level" value="" />
                  <Picker.Item label="Sedentary" value="Sedentary" />
                  <Picker.Item label="Moderate" value="Moderate" />
                  <Picker.Item label="Active" value="Active" />
                </StyledPicker>
              </PickerWrapper>
              {activityLevelError && <ErrorText>{activityLevelError}</ErrorText>}
            </PickerContainer>

            <CheckboxContainer>
              <Label>Preferred Workout Types</Label>
              {['Strength', 'Cardio', 'Yoga', 'HIIT', 'Pilates'].map((type) => (
                <CheckboxRow key={type}>
                  <Checkbox
                    onPress={() => toggleCheckbox(type, preferredWorkoutTypes, setPreferredWorkoutTypes)}
                  >
                    {preferredWorkoutTypes.includes(type) && (
                      <Icon name="check" size={16} color={theme.colors.primary} />
                    )}
                  </Checkbox>
                  <CheckboxText>{type}</CheckboxText>
                </CheckboxRow>
              ))}
            </CheckboxContainer>

            <CheckboxContainer>
              <Label>Dietary Restrictions</Label>
              {['None', 'Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy'].map((restriction) => (
                <CheckboxRow key={restriction}>
                  <Checkbox
                    onPress={() => toggleCheckbox(restriction, dietaryRestrictions, setDietaryRestrictions)}
                  >
                    {dietaryRestrictions.includes(restriction) && (
                      <Icon name="check" size={16} color={theme.colors.primary} />
                    )}
                  </Checkbox>
                  <CheckboxText>{restriction}</CheckboxText>
                </CheckboxRow>
              ))}
            </CheckboxContainer>

            {generalError && (
              <ErrorText style={{ textAlign: 'center', marginBottom: 15 }}>
                {generalError}
              </ErrorText>
            )}

            <Animated.View style={{ opacity: chatbotOpacity }}>
              <Chatbot>
                <Icon name="smart-toy" size={24} color={theme.colors.primary} />
                <ChatbotText>{getChatbotMessage()}</ChatbotText>
              </Chatbot>
            </Animated.View>

            <ButtonContainer>
              <SecondaryButton onPress={handleSkip} disabled={loading}>
                <SecondaryButtonText>Skip for Now</SecondaryButtonText>
              </SecondaryButton>

              <PrimaryButtonContainer>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  style={{ borderRadius: 12 }}
                >
                  <AnimatedTouchable
                    style={{
                      transform: [{ scale: buttonScale }],
                    }}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleNext}
                    disabled={loading}
                  >
                    <PrimaryButton>
                      <PrimaryButtonText>
                        {loading ? 'Completing...' : 'Complete Profile'}
                      </PrimaryButtonText>
                    </PrimaryButton>
                  </AnimatedTouchable>
                </LinearGradient>
              </PrimaryButtonContainer>
            </ButtonContainer>
          </FormContainer>
        </CenteredContainer>
      </Content>
    </Container>
  );
};

export default ProfileSetup;