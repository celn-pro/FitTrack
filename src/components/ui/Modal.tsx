import React from 'react';
import { Modal as RNModal, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeType } from '../../styles/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'bottom' | 'center' | 'fullscreen';
  showCloseButton?: boolean;
  dismissOnBackdrop?: boolean;
  dismissOnKeyboard?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  variant = 'bottom',
  showCloseButton = true,
  dismissOnBackdrop = true,
  dismissOnKeyboard = true,
}) => {
  const theme = useTheme() as ThemeType;
  const insets = useSafeAreaInsets();

  const handleBackdropPress = () => {
    if (dismissOnBackdrop) {
      onClose();
    }
  };

  const handleKeyboardDismiss = () => {
    if (dismissOnKeyboard) {
      Keyboard.dismiss();
    }
  };

  const getOverlayStyle = () => {
    const baseStyle = {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    };

    const variantStyles = {
      bottom: {
        justifyContent: 'flex-end' as const,
      },
      center: {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingHorizontal: theme.spacing.lg,
      },
      fullscreen: {
        justifyContent: 'flex-start' as const,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const getContentStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
    };

    const variantStyles = {
      bottom: {
        borderTopLeftRadius: theme.borderRadius.modal,
        borderTopRightRadius: theme.borderRadius.modal,
        paddingBottom: Math.max(theme.spacing.lg, insets.bottom),
        maxHeight: '90%',
        minHeight: '50%',
      },
      center: {
        borderRadius: theme.borderRadius.modal,
        maxHeight: '80%',
        width: '100%',
      },
      fullscreen: {
        flex: 1,
        paddingTop: Math.max(theme.spacing.lg, insets.top),
        paddingBottom: Math.max(theme.spacing.lg, insets.bottom),
        borderRadius: 0,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={variant === 'fullscreen' ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Overlay style={getOverlayStyle()}>
          <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
            <Content style={getContentStyle()}>
              {(title || showCloseButton) && (
                <Header>
                  {title && <Title>{title}</Title>}
                  {showCloseButton && (
                    <CloseButton onPress={onClose}>
                      <Icon name="close" size={24} color={theme.colors.secondaryText} />
                    </CloseButton>
                  )}
                </Header>
              )}
              <Body>{children}</Body>
            </Content>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const Overlay = styled.View``;

const Content = styled.View``;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xl}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.xs}px;
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

const Body = styled.View`
  flex: 1;
`;

export default Modal;
