import React, { useEffect } from 'react';
import { ScrollView, Linking, Animated } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

interface DidYouKnowFact {
  id: string;
  fact: string;
  category: string;
  source: string;
  difficulty: string;
  estimatedReadTime: number;
  isVerified: boolean;
}

const DidYouKnowDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { fact: DidYouKnowFact } }, 'params'>>();
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
          <Title>Did You Know?</Title>
          <CategoryBadge>
            <Icon name="category" size={16} color={theme.colors.primary} />
            <CategoryText>{fact.category}</CategoryText>
          </CategoryBadge>
          <FactText>{fact.fact}</FactText>
          <MetaInfo>
            <MetaItem>
              <Icon name="trending-up" size={16} color={theme.colors.accent} />
              <MetaText>Difficulty: {fact.difficulty}</MetaText>
            </MetaItem>
            <MetaItem>
              <Icon name="schedule" size={16} color={theme.colors.accent} />
              <MetaText>Read time: {fact.estimatedReadTime} min</MetaText>
            </MetaItem>
            {fact.isVerified && (
              <MetaItem>
                <Icon name="verified" size={16} color="#4CAF50" />
                <MetaText style={{ color: '#4CAF50' }}>Verified</MetaText>
              </MetaItem>
            )}
          </MetaInfo>
          <Source>Source: {fact.source}</Source>
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

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin: 10px 0 4px 0;
  text-align: center;
`;

const CategoryBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary + '15'};
  border-radius: 20px;
  padding: 8px 12px;
  margin-bottom: 16px;
`;

const CategoryText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  margin-left: 6px;
  text-transform: capitalize;
`;

const FactText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 18px;
  line-height: 24px;
  text-align: center;
`;

const MetaInfo = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 16px 0;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background === '#1C2526' ? '#2A3439' : '#F8F9FA'};
  border-radius: 12px;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 4px 8px;
`;

const MetaText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  margin-left: 6px;
  font-weight: 500;
`;

const Source = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-bottom: 12px;
  text-align: center;
`;

export default DidYouKnowDetailScreen;