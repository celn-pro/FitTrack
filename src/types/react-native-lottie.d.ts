// react-native-lottie.d.ts
declare module 'react-native-lottie' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  interface LottieViewProps extends ViewProps {
    source: object | string;
    autoPlay?: boolean;
    loop?: boolean;
    style?: object;
  }

  export default class LottieView extends Component<LottieViewProps> {}
}
