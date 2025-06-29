import React, { useState } from 'react';
import { Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMutation, gql } from '@apollo/client';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../navigation/types';

type ProfileSetupNavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingProfileSetup'>;

// Removed unused screen dimensions

const steps = [
  'Physical Stats',
  'Fitness Goals',
  'Health & Diet'
];

export const COMPLETE_PROFILE = gql`
  mutation CompleteProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      firstName
      lastName
      dateOfBirth
      gender
      height
      weight
      fitnessLevel
      activityLevel
      fitnessGoals
      healthConditions
      injuries
      dietaryPreferences
      dietaryRestrictions
      preferredWorkoutTypes
      isProfileComplete
      age
      bmi
      notificationSettings {
        workoutReminders
        nutritionTips
        progressUpdates
        emailNotifications
      }
      updatedAt
    }
  }
`;

const ProfileSetup: React.FC = () => {
  const navigation = useNavigation<ProfileSetupNavigationProp>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuthStore();

  // Multi-step state
  const [step, setStep] = useState(0);



  // Form state - All fields we can send to backend
  const [height, setHeight] = useState(user?.height ? user.height.toString() : '');
  const [weight, setWeight] = useState(user?.weight ? user.weight.toString() : '');
  const [fitnessLevel, setFitnessLevel] = useState(user?.fitnessLevel || '');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || '');
  const [fitnessGoals, setFitnessGoals] = useState<string[]>(user?.fitnessGoals || []);
  const [preferredWorkoutTypes, setPreferredWorkoutTypes] = useState<string[]>(user?.preferredWorkoutTypes || []);
  const [healthConditions, setHealthConditions] = useState<string[]>(user?.healthConditions || []);
  const [injuries, setInjuries] = useState<string[]>(user?.injuries || []);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(user?.dietaryPreferences || []);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(user?.dietaryRestrictions || []);

  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const [completeProfile, { loading }] = useMutation(COMPLETE_PROFILE, {
    onCompleted: (data) => {
      setUser(data.updateProfile);
      Alert.alert(
        'Profile Complete!',
        'Welcome to FitTrack! Your fitness journey starts now.',
        [{ text: 'Let\'s Go!', onPress: () => navigation.navigate('Home') }]
      );
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to complete profile. Please try again.');
    },
  });

  // Validation per step - now optional since we have skip functionality
  const validateStep = (forceValidation = false) => {
    let stepErrors: { [key: string]: string } = {};

    // Only validate if forceValidation is true (for final submission)
    if (forceValidation) {
      if (step === 0) {
        // Basic info - only validate the fields we actually use
        if (weight.trim() && (isNaN(Number(weight)) || Number(weight) < 20 || Number(weight) > 500))
          stepErrors.weight = 'Valid weight (20-500 kg) required';
        if (height.trim() && (isNaN(Number(height)) || Number(height) < 100 || Number(height) > 250))
          stepErrors.height = 'Valid height (100-250 cm) required';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    validateStep(); // Clear any existing errors
    setStep((s) => s + 1);
  };

  const handleSkip = () => {
    setErrors({}); // Clear any errors when skipping
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({}); // Clear errors when going back
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(true)) return; // Force validation for final submission

    // Build input object with all available fields
    const input: any = {};

    // Physical stats
    if (height.trim() && !isNaN(Number(height))) {
      input.height = parseFloat(height);
    }
    if (weight.trim() && !isNaN(Number(weight))) {
      input.weight = parseFloat(weight);
    }

    // Fitness preferences
    if (fitnessLevel) {
      input.fitnessLevel = fitnessLevel;
    }
    if (activityLevel) {
      input.activityLevel = activityLevel;
    }
    if (fitnessGoals.length > 0) {
      input.fitnessGoals = fitnessGoals;
    }
    if (preferredWorkoutTypes.length > 0) {
      input.preferredWorkoutTypes = preferredWorkoutTypes;
    }

    // Health and dietary information
    if (healthConditions.length > 0) {
      input.healthConditions = healthConditions;
    }
    if (injuries.length > 0) {
      input.injuries = injuries;
    }
    if (dietaryPreferences.length > 0) {
      input.dietaryPreferences = dietaryPreferences;
    }
    if (dietaryRestrictions.length > 0) {
      input.dietaryRestrictions = dietaryRestrictions;
    }

    await completeProfile({
      variables: { input },
    });
  };

  // Helper to check if user has provided any meaningful profile data
  const hasProfileData = () => {
    return (
      height.trim() ||
      weight.trim() ||
      fitnessLevel ||
      activityLevel ||
      fitnessGoals.length > 0 ||
      preferredWorkoutTypes.length > 0 ||
      healthConditions.length > 0 ||
      injuries.length > 0 ||
      dietaryPreferences.length > 0 ||
      dietaryRestrictions.length > 0
    );
  };

  // Checkbox helpers
  const toggleCheckbox = (value: string, current: string[], setter: (values: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      // If selecting "none", clear all other selections
      if (value === 'none') {
        setter(['none']);
      } else {
        // If selecting something other than "none", remove "none" if it exists
        const newValues = current.filter(item => item !== 'none');
        setter([...newValues, value]);
      }
    }
  };

  // Progress bar
  const renderProgress = () => (
    <ProgressContainer>
      {steps.map((_, idx) => (
        <React.Fragment key={idx}>
          <ProgressDot active={idx <= step} />
          {idx < steps.length - 1 && <ProgressLine completed={idx < step} />}
        </React.Fragment>
      ))}
    </ProgressContainer>
  );

  // Step screens
  const StepScreens = [
    // Step 1: Basic Info
    <FormContainer key="step1">
      <Title>Your Physical Stats</Title>
      <Subtitle>Help us personalize your fitness experience</Subtitle>
      {(user?.height || user?.weight) && (
        <InfoNote>Some fields are pre-filled from your registration ✓</InfoNote>
      )}
      {renderProgress()}

      <Input
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={text => setWeight(text.replace(/[^0-9.]/g, ''))}
        keyboardType="numeric"
        editable={!loading}
        style={{
          borderColor: errors.weight ? theme.colors.accent :
                      (user?.weight ? theme.colors.primary + '40' : undefined)
        }}
        placeholderTextColor={theme.colors.secondaryText}
      />
      {errors.weight && <ErrorText>{errors.weight}</ErrorText>}

      <Input
        placeholder="Height (cm)"
        value={height}
        onChangeText={text => setHeight(text.replace(/[^0-9.]/g, ''))}
        keyboardType="numeric"
        editable={!loading}
        style={{
          borderColor: errors.height ? theme.colors.accent :
                      (user?.height ? theme.colors.primary + '40' : undefined)
        }}
        placeholderTextColor={theme.colors.secondaryText}
      />
      {errors.height && <ErrorText>{errors.height}</ErrorText>}
    </FormContainer>,

    // Step 2: Goals & Preferences
    <FormContainer key="step2">
      <Title>Your Fitness Goals</Title>
      <Subtitle>Tell us about your fitness preferences</Subtitle>
      {renderProgress()}
      <CheckboxContainer>
        <Label>Fitness Goals</Label>
        {[
          { label: 'Lose Weight', value: 'weight_loss' },
          { label: 'Gain Muscle', value: 'muscle_gain' },
          { label: 'Maintain Health', value: 'maintain_health' },
          { label: 'Improve Endurance', value: 'improve_endurance' },
          { label: 'Build Strength', value: 'build_strength' }
        ].map((goal) => (
          <CheckboxRow key={goal.value}>
            <Checkbox
              onPress={() => toggleCheckbox(goal.value, fitnessGoals, setFitnessGoals)}
            >
              {fitnessGoals.includes(goal.value) && (
                <Icon name="check" size={16} color={theme.colors.primary} />
              )}
            </Checkbox>
            <CheckboxText>{goal.label}</CheckboxText>
          </CheckboxRow>
        ))}
        {errors.fitnessGoals && <ErrorText>{errors.fitnessGoals}</ErrorText>}
      </CheckboxContainer>
      <PickerContainer>
        <Label>Fitness Level</Label>
        <PickerWrapper>
          <StyledPicker
            selectedValue={fitnessLevel}
            onValueChange={(itemValue) => setFitnessLevel(itemValue as string)}
            enabled={!loading}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label="Select fitness level" value="" />
            <Picker.Item label="Beginner" value="beginner" />
            <Picker.Item label="Intermediate" value="intermediate" />
            <Picker.Item label="Advanced" value="advanced" />
          </StyledPicker>
        </PickerWrapper>
        {errors.fitnessLevel && <ErrorText>{errors.fitnessLevel}</ErrorText>}
      </PickerContainer>

      <PickerContainer>
        <Label>Activity Level</Label>
        <PickerWrapper>
          <StyledPicker
            selectedValue={activityLevel}
            onValueChange={(itemValue) => setActivityLevel(itemValue as string)}
            enabled={!loading}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label="Select activity level" value="" />
            <Picker.Item label="Sedentary" value="sedentary" />
            <Picker.Item label="Moderate" value="moderate" />
            <Picker.Item label="Active" value="active" />
          </StyledPicker>
        </PickerWrapper>
        {errors.activityLevel && <ErrorText>{errors.activityLevel}</ErrorText>}
      </PickerContainer>
      <CheckboxContainer>
        <Label>Preferred Workout Types</Label>
        {[
          { label: 'Strength', value: 'strength' },
          { label: 'Cardio', value: 'cardio' },
          { label: 'Yoga', value: 'yoga' },
          { label: 'HIIT', value: 'hiit' },
          { label: 'Pilates', value: 'pilates' }
        ].map((workoutType) => (
          <CheckboxRow key={workoutType.value}>
            <Checkbox
              onPress={() => toggleCheckbox(workoutType.value, preferredWorkoutTypes, setPreferredWorkoutTypes)}
            >
              {preferredWorkoutTypes.includes(workoutType.value) && (
                <Icon name="check" size={16} color={theme.colors.primary} />
              )}
            </Checkbox>
            <CheckboxText>{workoutType.label}</CheckboxText>
          </CheckboxRow>
        ))}
      </CheckboxContainer>
    </FormContainer>,

    // Step 3: Health & Diet
    <FormContainer key="step3">
      <Title>Health & Dietary Information</Title>
      <Subtitle>Help us provide safer and more personalized recommendations</Subtitle>
      {renderProgress()}

      <CheckboxContainer>
        <Label>Health Conditions (Optional)</Label>
        {[
          { label: 'Diabetes', value: 'diabetes' },
          { label: 'High Blood Pressure', value: 'high_blood_pressure' },
          { label: 'Heart Disease', value: 'heart_disease' },
          { label: 'Asthma', value: 'asthma' },
          { label: 'Arthritis', value: 'arthritis' },
          { label: 'None', value: 'none' }
        ].map((condition) => (
          <CheckboxRow key={condition.value}>
            <Checkbox
              onPress={() => toggleCheckbox(condition.value, healthConditions, setHealthConditions)}
            >
              {healthConditions.includes(condition.value) && (
                <Icon name="check" size={16} color={theme.colors.primary} />
              )}
            </Checkbox>
            <CheckboxText>{condition.label}</CheckboxText>
          </CheckboxRow>
        ))}
      </CheckboxContainer>

      <CheckboxContainer>
        <Label>Previous Injuries (Optional)</Label>
        {[
          { label: 'Knee Injury', value: 'knee_injury' },
          { label: 'Back Injury', value: 'back_injury' },
          { label: 'Shoulder Injury', value: 'shoulder_injury' },
          { label: 'Ankle Injury', value: 'ankle_injury' },
          { label: 'Wrist Injury', value: 'wrist_injury' },
          { label: 'None', value: 'none' }
        ].map((injury) => (
          <CheckboxRow key={injury.value}>
            <Checkbox
              onPress={() => toggleCheckbox(injury.value, injuries, setInjuries)}
            >
              {injuries.includes(injury.value) && (
                <Icon name="check" size={16} color={theme.colors.primary} />
              )}
            </Checkbox>
            <CheckboxText>{injury.label}</CheckboxText>
          </CheckboxRow>
        ))}
      </CheckboxContainer>

      <CheckboxContainer>
        <Label>Dietary Preferences (Optional)</Label>
        {[
          { label: 'Vegetarian', value: 'vegetarian' },
          { label: 'Vegan', value: 'vegan' },
          { label: 'Pescatarian', value: 'pescatarian' },
          { label: 'Keto', value: 'keto' },
          { label: 'Mediterranean', value: 'mediterranean' },
          { label: 'No Preference', value: 'none' }
        ].map((preference) => (
          <CheckboxRow key={preference.value}>
            <Checkbox
              onPress={() => toggleCheckbox(preference.value, dietaryPreferences, setDietaryPreferences)}
            >
              {dietaryPreferences.includes(preference.value) && (
                <Icon name="check" size={16} color={theme.colors.primary} />
              )}
            </Checkbox>
            <CheckboxText>{preference.label}</CheckboxText>
          </CheckboxRow>
        ))}
      </CheckboxContainer>

      <CheckboxContainer>
        <Label>Dietary Restrictions (Optional)</Label>
        {[
          { label: 'Gluten-Free', value: 'gluten_free' },
          { label: 'Dairy-Free', value: 'dairy_free' },
          { label: 'Nut Allergy', value: 'nut_allergy' },
          { label: 'Shellfish Allergy', value: 'shellfish_allergy' },
          { label: 'Low Sodium', value: 'low_sodium' },
          { label: 'None', value: 'none' }
        ].map((restriction) => (
          <CheckboxRow key={restriction.value}>
            <Checkbox
              onPress={() => toggleCheckbox(restriction.value, dietaryRestrictions, setDietaryRestrictions)}
            >
              {dietaryRestrictions.includes(restriction.value) && (
                <Icon name="check" size={16} color={theme.colors.primary} />
              )}
            </Checkbox>
            <CheckboxText>{restriction.label}</CheckboxText>
          </CheckboxRow>
        ))}
      </CheckboxContainer>
    </FormContainer>,

  ];

  return (
    <Container>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          marginBottom: 8,
          padding: 18,
          paddingTop: Math.max(insets.top + 18, 38),
          elevation: 2,
        }}
      >
        <Title style={{ color: theme.colors.white }}>Profile Setup</Title>
        <Subtitle style={{ color: 'rgba(255,255,255,0.85)' }}>
          Step {step + 1} of {steps.length}: {steps[step]}
        </Subtitle>
      </LinearGradient>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', backgroundColor: theme.colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <CenteredContainer paddingBottom={insets.bottom}>
            {StepScreens[step]}
          </CenteredContainer>
        </ScrollView>
        <ButtonContainer>
          {step > 0 && (
            <SecondaryButton onPress={handleBack} disabled={loading}>
              <SecondaryButtonText>Back</SecondaryButtonText>
            </SecondaryButton>
          )}

          {step < StepScreens.length - 1 ? (
            <>
              {/* Skip Button for non-final steps */}
              <SkipButton onPress={handleSkip} disabled={loading}>
                <SkipButtonText>Skip</SkipButtonText>
              </SkipButton>

              {/* Next Button */}
              <PrimaryButtonContainer>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  style={{ borderRadius: 10 }}
                >
                  <TouchableOpacity
                    onPress={handleNext}
                    disabled={loading}
                    style={{ width: '100%', alignItems: 'center', padding: 12 }}
                  >
                    <PrimaryButtonText>Next</PrimaryButtonText>
                  </TouchableOpacity>
                </LinearGradient>
              </PrimaryButtonContainer>
            </>
          ) : (
            <>
              {/* Skip/Complete Later Button for final step */}
              <SkipButton onPress={() => navigation.navigate('Home')} disabled={loading}>
                <SkipButtonText>Complete Later</SkipButtonText>
              </SkipButton>

              {/* Complete Profile Button */}
              <PrimaryButtonContainer>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  style={{ borderRadius: 10 }}
                >
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={{ width: '100%', alignItems: 'center', padding: 12 }}
                  >
                    <PrimaryButtonText>
                      {loading ? 'Saving...' : hasProfileData() ? 'Save Profile' : 'Complete Later'}
                    </PrimaryButtonText>
                  </TouchableOpacity>
                </LinearGradient>
              </PrimaryButtonContainer>
            </>
          )}
        </ButtonContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};

// --- styled components (reuse your existing ones, or copy from your Home/ProfileSetup) ---

const Container = styled(SafeAreaView)`
  flex: 1;
`;

const CenteredContainer = styled.View<{ paddingBottom: number }>`
  flex: 1;
  width: 100%;
  padding: 20px;
  padding-bottom: ${(props) => Math.max(props.paddingBottom + 20, 40)}px;
  justify-content: flex-start;
`;

const FormContainer = styled.View`
  width: 100%;
  max-width: 400px;
  align-items: center;
  flex: 1;
  margin-bottom: 24px;
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
  margin-bottom: 25px;
  margin-top: 15px;
  width: 100%;
  max-width: 400px;
  align-self: center;
  padding-left: 10px;
  padding-right: 10px;
`;

const SecondaryButton = styled(TouchableOpacity)`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.theme.colors.background === '#1C2526'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'transparent'
  };
  margin-left: 0;
`;

const SecondaryButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.primary};
`;

const SkipButton = styled(TouchableOpacity)`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.secondaryText};
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.theme.colors.background === '#1C2526'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.02)'
  };
`;

const SkipButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const PrimaryButtonContainer = styled.View`
  flex: 1;
  margin-left: 8px;
  margin-right: 0;
`;

const PrimaryButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.white};
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

const InfoNote = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.small}px;
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: ${(props) => props.theme.colors.primary}15;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.primary}30;
`;

export default ProfileSetup;