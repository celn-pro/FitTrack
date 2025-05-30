// src/components/HapticButton.tsx
import React from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Button } from '../styles/globalStyles';

interface HapticButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

export const HapticButton: React.FC<HapticButtonProps> = ({ onPress, children }) => {
  const handlePress = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onPress();
  };

  return <Button onPress={handlePress}>{children}</Button>;
};