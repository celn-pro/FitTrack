import React, { useEffect } from 'react';
import { ScrollView, Linking, Animated } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { DidYouKnow } from '../constants';

const DidYouKnowDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { fact: DidYouKnow } }, 'params'>>();
  const { fact } = route.params;

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <GradientContainer
      colors={
        theme.colors.background === '#1C2526'
          ? [theme.colors.background, theme.colors.secondary]
          : ['#F8F9FA', '#E6F0FA']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <BackButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={theme.colors.primary} />
      </BackButton>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <AnimatedCard style={{ opacity: fadeAnim }}>
          <IconCircle>
            <Icon name="emoji-objects" size={38} color={theme.colors.primary} />
          </IconCircle>
          {fact.image && <CoverImage source={{ uri: fact.image }} />}
          <Title>Did You Know?</Title>
          <FactText>{fact.fact}</FactText>
          <Source>Source: {fact.source}</Source>
          {fact.link && (
            <LearnMoreButton onPress={() => Linking.openURL(fact.link!)}>
              <LearnMoreGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <LearnMoreText>Learn More</LearnMoreText>
              </LearnMoreGradient>
            </LearnMoreButton>
          )}
        </AnimatedCard>
      </ScrollView>
    </GradientContainer>
  );
};

const GradientContainer = styled(LinearGradient)`
  flex: 1;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 48px;
  left: 20px;
  z-index: 1;
  padding: 8px;
  background-color: rgba(255,255,255,0.7);
  border-radius: 20px;
`;

const AnimatedCard = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#232B34' : '#fff'};
  border-radius: 22px;
  padding: 28px 20px 20px 20px;
  width: 100%;
  max-width: 420px;
  align-items: center;
  elevation: 8;
  shadow-color: #000;
  shadow-opacity: 0.10;
  shadow-radius: 16px;
  shadow-offset: 0px 6px;
`;

const IconCircle = styled.View`
  background-color: ${({ theme }) => theme.colors.primary + '18'};
  border-radius: 32px;
  padding: 16px;
  margin-bottom: 14px;
  align-items: center;
  justify-content: center;
`;

const CoverImage = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 16px;
  margin-bottom: 18px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin: 10px 0 4px 0;
  text-align: center;
`;

const FactText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
  line-height: 24px;
  text-align: center;
`;

const Source = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-bottom: 12px;
  text-align: center;
`;

const LearnMoreButton = styled.TouchableOpacity`
  width: 150px;
  height: 44px;
  border-radius: 22px;
  overflow: hidden;
  align-self: center;
  margin-top: 8px;
`;

const LearnMoreGradient = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LearnMoreText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

export default DidYouKnowDetailScreen;