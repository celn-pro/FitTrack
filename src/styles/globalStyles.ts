// src/styles/globalStyles.ts
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
`;

export const Title = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.bold};
  font-size: ${(props) => props.theme.typography.fontSize.xlarge}px;
  color: ${(props) => props.theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.secondaryText};
`;

export const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  padding: 15px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.semiBold};
  font-size: ${(props) => props.theme.typography.fontSize.medium}px;
  color: ${(props) => props.theme.colors.white};
`;