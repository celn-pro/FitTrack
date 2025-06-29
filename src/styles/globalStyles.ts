// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';
import { SPACING, BORDER_RADIUS, SHADOWS } from './spacing';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },

  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
    paddingHorizontal: SPACING.screen.horizontal,
  },

  // Flex utilities
  flex1: {
    flex: 1,
  },

  flexRow: {
    flexDirection: 'row',
  },

  flexColumn: {
    flexDirection: 'column',
  },

  alignCenter: {
    alignItems: 'center',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  justifyBetween: {
    justifyContent: 'space-between',
  },

  justifyAround: {
    justifyContent: 'space-around',
  },

  // Text styles
  textCenter: {
    textAlign: 'center',
  },

  textLeft: {
    textAlign: 'left',
  },

  textRight: {
    textAlign: 'right',
  },

  // Typography styles
  h1: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
    color: COLORS.text,
  },

  h2: {
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
    color: COLORS.text,
  },

  h3: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
    color: COLORS.text,
  },

  h4: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text,
  },

  bodyLarge: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text,
  },

  body: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.text,
  },

  bodySmall: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.secondaryText,
  },

  caption: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.secondaryText,
  },

  // Card styles
  card: {
    backgroundColor: COLORS.cardLight,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.card.padding,
    margin: SPACING.card.margin,
    ...SHADOWS.md,
  },

  cardSecondary: {
    backgroundColor: COLORS.cardLightSecondary,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.card.padding,
    margin: SPACING.card.margin,
    ...SHADOWS.sm,
  },

  // Button styles
  button: {
    borderRadius: BORDER_RADIUS.button,
    paddingVertical: SPACING.button.paddingVertical,
    paddingHorizontal: SPACING.button.paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },

  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },

  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },

  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },

  // Input styles
  input: {
    borderRadius: BORDER_RADIUS.input,
    padding: SPACING.input.padding,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    backgroundColor: COLORS.cardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Spacing utilities
  mt1: { marginTop: SPACING.xs },
  mt2: { marginTop: SPACING.sm },
  mt3: { marginTop: SPACING.md },
  mt4: { marginTop: SPACING.lg },
  mt5: { marginTop: SPACING.xl },

  mb1: { marginBottom: SPACING.xs },
  mb2: { marginBottom: SPACING.sm },
  mb3: { marginBottom: SPACING.md },
  mb4: { marginBottom: SPACING.lg },
  mb5: { marginBottom: SPACING.xl },

  ml1: { marginLeft: SPACING.xs },
  ml2: { marginLeft: SPACING.sm },
  ml3: { marginLeft: SPACING.md },
  ml4: { marginLeft: SPACING.lg },
  ml5: { marginLeft: SPACING.xl },

  mr1: { marginRight: SPACING.xs },
  mr2: { marginRight: SPACING.sm },
  mr3: { marginRight: SPACING.md },
  mr4: { marginRight: SPACING.lg },
  mr5: { marginRight: SPACING.xl },

  pt1: { paddingTop: SPACING.xs },
  pt2: { paddingTop: SPACING.sm },
  pt3: { paddingTop: SPACING.md },
  pt4: { paddingTop: SPACING.lg },
  pt5: { paddingTop: SPACING.xl },

  pb1: { paddingBottom: SPACING.xs },
  pb2: { paddingBottom: SPACING.sm },
  pb3: { paddingBottom: SPACING.md },
  pb4: { paddingBottom: SPACING.lg },
  pb5: { paddingBottom: SPACING.xl },

  pl1: { paddingLeft: SPACING.xs },
  pl2: { paddingLeft: SPACING.sm },
  pl3: { paddingLeft: SPACING.md },
  pl4: { paddingLeft: SPACING.lg },
  pl5: { paddingLeft: SPACING.xl },

  pr1: { paddingRight: SPACING.xs },
  pr2: { paddingRight: SPACING.sm },
  pr3: { paddingRight: SPACING.md },
  pr4: { paddingRight: SPACING.lg },
  pr5: { paddingRight: SPACING.xl },
});
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
`;

export const Title = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.bold};
  font-size: ${(props) => props.theme.typography.fontSize.xl}px;
  color: ${(props) => props.theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-family: ${(props) => props.theme.typography.fontFamily.regular};
  font-size: ${(props) => props.theme.typography.fontSize.md}px;
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