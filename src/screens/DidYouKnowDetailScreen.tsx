import React, { useEffect } from 'react';
import { ScrollView, Linking, Animated, StatusBar, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    // Set status bar style based on theme
    StatusBar.setBarStyle(
      theme.colors.background === '#1C2526' ? 'light-content' : 'dark-content',
      true
    );

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [theme]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <Header>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              paddingBottom: 18,
              paddingTop: 0,
            }}
          >
            <HeaderRow>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={26} color={theme.colors.white} />
              </TouchableOpacity>
              <HeaderTitle>Did You Know?</HeaderTitle>
              <TouchableOpacity style={{ opacity: 0 }}>
                <Icon name="arrow-back" size={26} color="transparent" />
              </TouchableOpacity>
            </HeaderRow>
            <HeaderSubtitle>
              {fact.category.toUpperCase()} • {fact.difficulty} • {fact.estimatedReadTime} min read
              {fact.isVerified && ' • ✓ Verified'}
            </HeaderSubtitle>
          </LinearGradient>
        </Header>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedCard style={{ opacity: fadeAnim }}>
            <IconCircle>
              <Icon name="emoji-objects" size={38} color={theme.colors.primary} />
            </IconCircle>
            <FactText>{fact.fact}</FactText>
            <Source>Source: {fact.source}</Source>
          </AnimatedCard>
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  position: relative;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 0 16px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  flex: 1;
  text-align: center;
  margin: 0 16px;
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  margin-top: 2px;
  opacity: 0.85;
`;

const AnimatedCard = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  shadow-color: #000;
`;

const IconCircle = styled.View`
  background-color: ${({ theme }) => theme.colors.primary + '18'};
  border-radius: 32px;
  padding: 16px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const FactText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
  line-height: 26px;
  text-align: left;
  font-weight: 500;
`;

const Source = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondaryText};
  text-align: center;
  font-style: italic;
  margin-top: 8px;
`;

export default DidYouKnowDetailScreen;