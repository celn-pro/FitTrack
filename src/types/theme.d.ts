// src/types/theme.d.ts
import { ThemeType } from '../styles/theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {}
}