import React, { useState, useRef, useEffect } from 'react';
import { Alert, Animated, TouchableOpacity, Dimensions, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMutation, gql } from '@apollo/client';
import { useAuthStore } from '../../store/authStore';
import { RootStackParamList } from '../../navigation/types';

type ProfileSetupNavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingProfileSetup'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const steps = [
  'Basic Info',
  'Goals & Preferences',
  'Health & Finish'
];

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
      isProfileComplete
    }
  }
`;

const ProfileSetup: React.FC = () => {
  const navigation = useNavigation<ProfileSetupNavigationProp>();
  const theme = useTheme();
  const { setUser } = useAuthStore();

  // Multi-step state
  const [step, setStep] = useState(0);

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
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const [completeProfile, { loading }] = useMutation(COMPLETE_PROFILE, {
    onCompleted: (data) => {
      setUser(data.completeProfile);
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

  // Validation per step
  const validateStep = () => {
    let stepErrors: { [key: string]: string } = {};
    if (step === 0) {
      if (!name.trim()) stepErrors.name = 'Name is required';
      if (!age.trim() || isNaN(Number(age)) || Number(age) < 13 || Number(age) > 120)
        stepErrors.age = 'Valid age (13-120) required';
      if (!weight.trim() || isNaN(Number(weight)) || Number(weight) < 20 || Number(weight) > 500)
        stepErrors.weight = 'Valid weight (20-500 kg) required';
      if (!height.trim() || isNaN(Number(height)) || Number(height) < 100 || Number(height) > 250)
        stepErrors.height = 'Valid height (100-250 cm) required';
      if (!gender) stepErrors.gender = 'Gender is required';
    }
    if (step === 1) {
      if (!fitnessGoal) stepErrors.fitnessGoal = 'Select a goal';
      if (!activityLevel) stepErrors.activityLevel = 'Select activity level';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
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
  };

  // Helper to check if all required fields in the last step are filled
const isLastStepComplete = () => {
  // You can refine this logic as needed for your required fields
  return (
    healthConditions.length > 0 &&
    dietaryRestrictions.length > 0
  );
};

  // Checkbox helpers
  const toggleCheckbox = (value: string, current: string[], setter: (values: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
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
      <Title>Let's Get to Know You</Title>
      <Subtitle>Fill in your basic info</Subtitle>
      {renderProgress()}
      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
        editable={!loading}
        style={{ borderColor: errors.name ? theme.colors.accent : undefined }}
        placeholderTextColor={theme.colors.secondaryText}
      />
      {errors.name && <ErrorText>{errors.name}</ErrorText>}
      <Input
        placeholder="Age"
        value={age}
        onChangeText={text => setAge(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        editable={!loading}
        style={{ borderColor: errors.age ? theme.colors.accent : undefined }}
        placeholderTextColor={theme.colors.secondaryText}
      />
      {errors.age && <ErrorText>{errors.age}</ErrorText>}
      <Input
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={text => setWeight(text.replace(/[^0-9.]/g, ''))}
        keyboardType="numeric"
        editable={!loading}
        style={{ borderColor: errors.weight ? theme.colors.accent : undefined }}
        placeholderTextColor={theme.colors.secondaryText}
      />
      {errors.weight && <ErrorText>{errors.weight}</ErrorText>}
      <Input
        placeholder="Height (cm)"
        value={height}
        onChangeText={text => setHeight(text.replace(/[^0-9.]/g, ''))}
        keyboardType="numeric"
        editable={!loading}
        style={{ borderColor: errors.height ? theme.colors.accent : undefined }}
        placeholderTextColor={theme.colors.secondaryText}
      />
      {errors.height && <ErrorText>{errors.height}</ErrorText>}
      <PickerContainer>
        <Label>Gender</Label>
        <PickerWrapper>
          <StyledPicker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue as string)}
            enabled={!loading}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label="Select gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </StyledPicker>
        </PickerWrapper>
        {errors.gender && <ErrorText>{errors.gender}</ErrorText>}
      </PickerContainer>
    </FormContainer>,

    // Step 2: Goals & Preferences
    <FormContainer key="step2">
      <Title>Your Goals & Preferences</Title>
      <Subtitle>Personalize your experience</Subtitle>
      {renderProgress()}
      <PickerContainer>
        <Label>Fitness Goal</Label>
        <PickerWrapper>
          <StyledPicker
            selectedValue={fitnessGoal}
            onValueChange={(itemValue) => setFitnessGoal(itemValue as string)}
            enabled={!loading}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label="Lose Weight" value="Lose Weight" />
            <Picker.Item label="Gain Muscle" value="Gain Muscle" />
            <Picker.Item label="Maintain Health" value="Maintain Health" />
          </StyledPicker>
        </PickerWrapper>
        {errors.fitnessGoal && <ErrorText>{errors.fitnessGoal}</ErrorText>}
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
            <Picker.Item label="None" value="None" />
            <Picker.Item label="Vegan" value="Vegan" />
            <Picker.Item label="Vegetarian" value="Vegetarian" />
            <Picker.Item label="Gluten-Free" value="Gluten-Free" />
            <Picker.Item label="Keto" value="Keto" />
            <Picker.Item label="Paleo" value="Paleo" />
          </StyledPicker>
        </PickerWrapper>
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
            <Picker.Item label="Sedentary" value="Sedentary" />
            <Picker.Item label="Moderate" value="Moderate" />
            <Picker.Item label="Active" value="Active" />
          </StyledPicker>
        </PickerWrapper>
        {errors.activityLevel && <ErrorText>{errors.activityLevel}</ErrorText>}
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
    </FormContainer>,

    // Step 3: Health & Finish
    <FormContainer key="step3">
  <Title>Health & Finish</Title>
  <Subtitle>Almost done!</Subtitle>
  {renderProgress()}
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
</FormContainer>
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
          paddingTop: 38,
          elevation: 2,
        }}
      >
        <Title style={{ color: theme.colors.white }}>Profile Setup</Title>
        <Subtitle style={{ color: 'rgba(255,255,255,0.85)' }}>
          Step {step + 1} of {steps.length}: {steps[step]}
        </Subtitle>
      </LinearGradient>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <CenteredContainer>
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
                  <PrimaryButtonText>
                    Next
                  </PrimaryButtonText>
                </TouchableOpacity>
              </LinearGradient>
            </PrimaryButtonContainer>
          ) : (
            <PrimaryButtonContainer>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={{ borderRadius: 10 }}
              >
                <TouchableOpacity
                  onPress={isLastStepComplete() ? handleSubmit : () => navigation.navigate('Home')}
                  disabled={loading}
                  style={{ width: '100%', alignItems: 'center', padding: 12 }}
                >
                  <PrimaryButtonText>
                    {isLastStepComplete() ? (loading ? 'Completing...' : 'Complete Profile') : 'Skip for Now'}
                  </PrimaryButtonText>
                </TouchableOpacity>
              </LinearGradient>
            </PrimaryButtonContainer>
          )}
        </ButtonContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};

// --- styled components (reuse your existing ones, or copy from your Home/ProfileSetup) ---

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const CenteredContainer = styled.View`
  flex: 1;
  width: 100%;
  padding: 20px;
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

// ...existing code...

const PillRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
`;

const Pill = styled(TouchableOpacity)<{ selected: boolean }>`
  padding: 4px 10px; 
  border-radius: 14px; 
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.background === '#1C2526'
      ? 'rgba(255,255,255,0.08)'
      : '#F0F0F0'};
  border: 1px solid ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.secondaryText};
  margin-bottom: 4px;
`;

const PillText = styled.Text<{ selected: boolean }>`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.xsmall || 12}px; 
  color: ${({ selected, theme }) =>
    selected ? theme.colors.white : theme.colors.text};
`;

const CheckboxGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CheckboxGridItem = styled.View`
  width: 48%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;


export default ProfileSetup;