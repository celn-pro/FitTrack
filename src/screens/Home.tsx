import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  RefreshControl, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Modal,
  Animated,
  Alert
} from 'react-native';
import { useQuery, useSubscription } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import styled, { ThemeProvider } from 'styled-components/native';
import { useTheme } from '../hooks/useTheme'; // or the correct path to your custom hook
import { GET_RECOMMENDATIONS, ON_RECOMMENDATION_UPDATE, GET_HEALTH_TIPS, GET_DID_YOU_KNOW } from '../graphql/queries';
import { useAuthStore } from '../store/authStore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../styles/colors';
import { DID_YOU_KNOW, HEALTH_TIPS, HYDRATION_RECOMMENDATIONS, HydrationRecommendation, NUTRITION_RECOMMENDATIONS, NutritionRecommendation, REST_RECOMMENDATIONS, RestRecommendation, WORKOUTS, Workout } from '../constants';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { getHealthTipIcon } from '../utils/getHealthTipIcon';

const { width } = Dimensions.get('window');

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  priority: number;
  media?: string;
  frequency: string;
}

interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'mental' | 'hydration';
  icon: string;
}

const MOODS = [
  { emoji: '😊', label: 'Great', value: 'great', color: '#2ECC71' },
  { emoji: '🙂', label: 'Good', value: 'good', color: '#F1C40F' },
  { emoji: '😐', label: 'Okay', value: 'okay', color: '#3498DB' },
  { emoji: '😔', label: 'Low', value: 'low', color: '#E67E22' },
  { emoji: '😢', label: 'Sad', value: 'sad', color: '#E74C3C' },
];

const CARD_MARGIN = 10;

const Home: React.FC = () => {
  // const theme = useTheme();
const { theme, toggleTheme, isDark, themeName } = useTheme();

  const { user, isAuthenticated, token } = useAuthStore();
  const email = user?.email || '';

  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [healthTips, setHealthTips] = useState<HealthTip[]>([])
  const [didYouKnow, setDidYouKnow] = useState<any[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentDidYouKnowIndex, setCurrentDidYouKnowIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodSuggestions, setShowMoodSuggestions] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [showAllHealthTips, setShowAllHealthTips] = useState(false);
  const [selectedHealthTip, setSelectedHealthTip] = useState<HealthTip | null>(null);
  const [showDidYouKnowModal, setShowDidYouKnowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const tipScrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // For testing purposes, you can uncomment the following lines to use a smaller set of recommendations
  // const combinedRecommendations = [
  //   ...WORKOUTS.slice(0, 1),
  //   ...NUTRITION_RECOMMENDATIONS.slice(0, 1),
  //   ...HYDRATION_RECOMMENDATIONS.slice(0, 1),
  //   ...REST_RECOMMENDATIONS.slice(0, 1),
  // ];

  // Helper to get today's date string
  const getToday = () => new Date().toISOString().split('T')[0];


  // Auto-scroll health tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate did you know facts
  useEffect(() => {
  if (didYouKnow.length === 0) return; // Don't run interval if no facts

  const interval = setInterval(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentDidYouKnowIndex((prev) => (prev + 1) % didYouKnow.length);
  }, 15000);

  return () => clearInterval(interval);
}, [fadeAnim, didYouKnow.length]);

  // Login streak management
  useEffect(() => {
    const updateStreak = async () => {
      const today = new Date().toDateString();
      const lastLogin = await AsyncStorage.getItem('lastLoginDate');
      const currentStreak = await AsyncStorage.getItem('loginStreak');
      let newStreak = 1;

      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLogin === yesterday.toDateString()) {
          newStreak = parseInt(currentStreak || '0') + 1;
        }
        setStreak(newStreak);
        setLastLoginDate(today);
        await AsyncStorage.setItem('lastLoginDate', today);
        await AsyncStorage.setItem('loginStreak', newStreak.toString());

        // --- Store streak history ---
        const streakHistoryRaw = await AsyncStorage.getItem('streakHistory');
        const streakHistory = streakHistoryRaw ? JSON.parse(streakHistoryRaw) : [];
        streakHistory.push({ date: today, streak: newStreak });
        await AsyncStorage.setItem('streakHistory', JSON.stringify(streakHistory));
      } else {
        setStreak(parseInt(currentStreak || '0'));
        setLastLoginDate(lastLogin);
      }
    };
    
    updateStreak();
  }, []);

  // Fetch recommendations
  const { loading: loadingRecs, error: errorRecs, data: dataRecs, refetch: refetchRecs } = useQuery(GET_RECOMMENDATIONS);

  // Fetch health tips
  const { loading: loadingTips, error: errorTips, data: dataTips, refetch: refetchTips } = useQuery(GET_HEALTH_TIPS);

  const { loading: loadingDidYouKnow, error: errorDidYouKnow, data: dataDidYouKnow, refetch: refetchDidYouKnow } = useQuery(GET_DID_YOU_KNOW);


  useSubscription(ON_RECOMMENDATION_UPDATE, {
    variables: { email },
    skip: !email || !isAuthenticated,
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data?.onRecommendationUpdate) {
        setRecommendations(subscriptionData.data.onRecommendationUpdate);
        AsyncStorage.setItem('recommendations', JSON.stringify(subscriptionData.data.onRecommendationUpdate));
      }
    },
  });

 // Load recommendations from cache or backend
  useEffect(() => {
    const loadRecommendations = async () => {
      const today = getToday();
      const cached = await AsyncStorage.getItem('recommendations');
      const cachedDate = await AsyncStorage.getItem('recommendationsDate');

      if (cached && cachedDate === today) {
        setRecommendations(JSON.parse(cached));
      } else {
        // Fetch from backend
        try {
          const { data } = await refetchRecs();
          if (data?.getRecommendations) {
            setRecommendations(data.getRecommendations);
            await AsyncStorage.setItem('recommendations', JSON.stringify(data.getRecommendations));
            await AsyncStorage.setItem('recommendationsDate', today);
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      }
    };

    const loadHealthTips = async () => {
    const today = getToday();
    const cached = await AsyncStorage.getItem('healthTips');
    const cachedDate = await AsyncStorage.getItem('healthTipsDate');

    if (cached && cachedDate === today) {
      setHealthTips(JSON.parse(cached));
    } else {
      try {
        const { data } = await refetchTips();
        if (data?.getHealthTips) {
          setHealthTips(data.getHealthTips);
          await AsyncStorage.setItem('healthTips', JSON.stringify(data.getHealthTips));
          await AsyncStorage.setItem('healthTipsDate', today);
        }
      } catch (error) {
        console.error('Error fetching health tips:', error);
      }
    }
    };

    const loadDidYouKnow = async () => {
    const today = getToday();
    const cached = await AsyncStorage.getItem('didYouKnow');
    const cachedDate = await AsyncStorage.getItem('didYouKnowDate');

    if (cached && cachedDate === today) {
      setDidYouKnow(JSON.parse(cached));
      } else {
        try {
          const { data } = await refetchDidYouKnow();
          if (data?.getDidYouKnow) {
          setDidYouKnow(data.getDidYouKnow);
          setCurrentDidYouKnowIndex(0); // Reset index!
          await AsyncStorage.setItem('didYouKnow', JSON.stringify(data.getDidYouKnow));
          await AsyncStorage.setItem('didYouKnowDate', today);
}
        } catch (error) {
          console.error('Error fetching did you know:', error);
        }
      }
    };

    loadRecommendations();
    loadHealthTips();
    loadDidYouKnow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showMoodSuggestions) {
      const timer = setTimeout(() => setShowMoodSuggestions(false), 7000); // 7 seconds
      return () => clearTimeout(timer);
    }
  }, [showMoodSuggestions]);

  useEffect(() => {
  const loadTodayMood = async () => {
    const today = new Date().toISOString().split('T')[0];
    const moodHistoryRaw = await AsyncStorage.getItem('moodHistory');
    if (moodHistoryRaw) {
      const moodHistory = JSON.parse(moodHistoryRaw);
      const todayEntry = moodHistory.find((entry: any) => entry.date === today);
      if (todayEntry) {
        setSelectedMood(todayEntry.mood);
      }
    }
  };
  loadTodayMood();
}, []);

 const onRefresh = async () => {
  setRefreshing(true);
  try {
    // Recommendations
    const { data: recData } = await refetchRecs();
    if (recData?.getRecommendations) {
      setRecommendations(recData.getRecommendations);
      await AsyncStorage.setItem('recommendations', JSON.stringify(recData.getRecommendations));
      await AsyncStorage.setItem('recommendationsDate', getToday());
    }
    // Health Tips
    const { data: tipsData } = await refetchTips();
    if (tipsData?.getHealthTips) {
      setHealthTips(tipsData.getHealthTips);
      await AsyncStorage.setItem('healthTips', JSON.stringify(tipsData.getHealthTips));
      await AsyncStorage.setItem('healthTipsDate', getToday());
    }
    // Did You Know
    const { data: didYouKnowData } = await refetchDidYouKnow();
    if (didYouKnowData?.getDidYouKnow) {
      setDidYouKnow(didYouKnowData.getDidYouKnow);
      await AsyncStorage.setItem('didYouKnow', JSON.stringify(didYouKnowData.getDidYouKnow));
      await AsyncStorage.setItem('didYouKnowDate', getToday());
    }
  } catch (error) {
    console.error('Error refreshing:', error);
  } finally {
    setRefreshing(false);
  }
};

  const handleMoodClick = () => {
    setShowMoodModal(true);
  };

  const handleMoodSelection = async (mood: string) => {
  setSelectedMood(mood);
  setShowMoodModal(false);
  setShowMoodSuggestions(true);

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const moodHistoryRaw = await AsyncStorage.getItem('moodHistory');
  let moodHistory = moodHistoryRaw ? JSON.parse(moodHistoryRaw) : [];

  // Remove any existing mood for today
  moodHistory = moodHistory.filter((entry: any) => entry.date !== today);

  // Add the new mood for today
  moodHistory.push({ date: today, mood });

  await AsyncStorage.setItem('moodHistory', JSON.stringify(moodHistory));
};

  const getMoodSuggestion = (mood: string) => {
    const suggestions = {
      great: "Keep up the amazing energy! Try a challenging workout today.",
      good: "You're doing well! Maybe try some meditation to maintain balance.",
      okay: "Take it easy today. A gentle walk or stretching might help.",
      low: "Be kind to yourself. Consider some light exercise or calling a friend.",
      sad: "It's okay to have tough days. Try deep breathing or journaling."
    };
    return suggestions[mood as keyof typeof suggestions] || "Take care of yourself today.";
  };

  const getGoalSubtitle = () => {
  switch (user?.fitnessGoal) {
    case 'Lose Weight':
      return "Let's burn those calories and reach your weight loss goal!";
    case 'Gain Muscle':
      return "Time to build strength and muscle—let's get stronger!";
    case 'Maintain Health':
      return "Keep up the healthy habits and maintain your best self!";
    default:
      return "Ready to crush your goals today?";
  }
};

 const renderCompactRecommendation = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        setShowAllRecommendations(false);
        if (item.category === 'workout') {
          navigation.navigate('WorkoutDetail', { workout: item });
        } else if (item.category === 'nutrition') {
          navigation.navigate('NutritionDetail', { nutrition: item });
        } else if (item.category === 'hydration') {
          navigation.navigate('HydrationDetail', { hydration: item });
        } else if (item.category === 'rest') {
          navigation.navigate('RestDetail', { rest: item });
        }
      }}
      style={{ marginBottom: 14 }}
    >
      <LinearGradient
        colors={theme.colors.background === COLORS.darkBackground 
          ? ['#232B34', '#2A3439']
          : ['#F8F9FA', '#E6F0FA']}
        style={[
          styles.compactCardGradient,
          { flexDirection: 'row', alignItems: 'center' }
        ]}
      >
        {/* Subtle left accent border */}
        <View style={{
          width: 4,
          height: '80%',
          borderRadius: 4,
          backgroundColor: item.category === 'nutrition'
            ? '#E67E22'
            : item.category === 'hydration'
            ? '#3498DB'
            : theme.colors.primary,
          marginRight: 14,
          alignSelf: 'center'
        }} />
        <View style={{ flex: 1 }}>
          <CategoryBadge category={item.category || 'other'}>
            {(item.category || 'Other').toUpperCase()}
          </CategoryBadge>
          <Text style={[styles.compactTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.compactDescription, { color: theme.colors.secondaryText }]} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
        {item.media && (
          <FastImage
            source={{ uri: item.media }}
            style={styles.compactImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

const renderHealthTip = ({ item }: { item: HealthTip }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => navigation.navigate('HealthTipDetail', { tip: item })}
  >
    <LinearGradient
      colors={theme.colors.background === COLORS.darkBackground 
        ? ['#2A3439', '#2F3B41']
        : ['#FFFFFF', '#F8F9FA']}
      style={styles.healthTipGradient}
    >
      <HealthTipCard>
        <Icon name={getHealthTipIcon(item.category, item.title)} size={20} color={theme.colors.primary} />
        <HealthTipContent>
          <HealthTipTitle>{item.title}</HealthTipTitle>
          <HealthTipDescription>{item.description}</HealthTipDescription>
        </HealthTipContent>
      </HealthTipCard>
    </LinearGradient>
  </TouchableOpacity>
);

  if (!isAuthenticated || !user) {
    return (
      <LoadingContainer>
        <Text style={styles.loadingText}>Please log in to view your dashboard</Text>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header with Theme Toggle */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <HeaderContent>
            <View>
              <HeaderTitle>Welcome Back, {user.name || 'User'}!</HeaderTitle>
              <HeaderSubtitle>{getGoalSubtitle()}</HeaderSubtitle>
              <TouchableOpacity onPress={handleMoodClick}>
                <MoodPromptContainer>
                  <MoodPromptText>How are you feeling today?</MoodPromptText>
                  <MoodPromptLink>Click to find out</MoodPromptLink>
                </MoodPromptContainer>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
  onPress={toggleTheme}
  style={styles.themeToggle}
>
  <Icon 
    name={isDark ? 'dark-mode' : 'light-mode'}
    size={24}
    color={theme.colors.white}
  />
</TouchableOpacity>
          </HeaderContent>
          
          {/* Streak Counter */}
          <StreakContainer>
            <Icon name="local-fire-department" size={16} color="#FF6B35" />
            <StreakText>
              {streak} Day Streak! {streak >= 7 ? '🔥' : streak >= 3 ? '💪' : '⭐'}
            </StreakText>
            {streak < 30 && (
              <StreakGoal>Goal: 30 days ({30 - streak} to go!)</StreakGoal>
            )}
          </StreakContainer>
        </LinearGradient>

        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Daily Health Tips</SectionTitle>
            <TouchableOpacity onPress={() => setShowAllHealthTips(true)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </SectionHeader>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={healthTips}
            renderItem={renderHealthTip}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.healthTipsList}
            snapToInterval={width * 0.75 + 10}
            decelerationRate="fast"
          />
        </SectionContainer>

        {/* Did You Know Section */}
        <SectionContainer>
          <SectionTitle>Did You Know?</SectionTitle>
          <TouchableOpacity 
            onPress={() => navigation.navigate('DidYouKnowDetail', { fact: didYouKnow[currentDidYouKnowIndex] })}
          >
            <LinearGradient
              colors={theme.colors.background === COLORS.darkBackground 
                ? ['#2A3439', '#2F3B41']
                : ['#FFFFFF', '#F8F9FA']}
              style={[styles.healthTipGradient, { padding: 0 }]}
            >
              <Animated.View style={[{ flexDirection: 'row', alignItems: 'flex-start' }, { opacity: fadeAnim }]}>
                {/* Left border */}
                <View style={{
                  width: 5,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                  backgroundColor: '#F1C40F',
                  height: '100%',
                  marginRight: 10,
                }} />
                <View style={[styles.didYouKnowContent, { padding: 15 }]}>
                  <Icon name="psychology" size={20} color={theme.colors.accent} />
                 {didYouKnow.length > 0 && didYouKnow[currentDidYouKnowIndex] ? (
                    <>
                      <Text
                        style={[
                          styles.didYouKnowFact,
                          { color: theme.colors.text }
                        ]}
                      >
                        {didYouKnow[currentDidYouKnowIndex].fact}
                      </Text>
                      <Text
                        style={[
                          styles.didYouKnowSource,
                          { color: theme.colors.secondaryText }
                        ]}
                      >
                        Source: {didYouKnow[currentDidYouKnowIndex].source}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.didYouKnowFact,
                      { color: theme.colors.text }
                    ]}
                    >No facts available today.</Text>
                  )}
                </View>
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        </SectionContainer>

        {/* Compact Recommendations */}
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Your Recommendations</SectionTitle>
            <TouchableOpacity onPress={() => setShowAllRecommendations(true)}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </SectionHeader>
            {loadingRecs && !refreshing ? (
              <LoadingContainer>
                <Text style={styles.loadingText}>Loading recommendations...</Text>
              </LoadingContainer>
            ) : recommendations.length > 0 ? (
            <FlatList
              data={recommendations.slice(0,2)}
              renderItem={renderCompactRecommendation}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
            ) : (
              <EmptyState>
                <Icon name="fitness-center" size={40} color={theme.colors.secondary} />
                <Text style={styles.emptyText}>No recommendations yet</Text>
                <Text style={styles.emptySubtext}>Start logging your activities to get personalized tips!</Text>
              </EmptyState>
            )}
        </SectionContainer>
      </ScrollView>

       {showMoodSuggestions && selectedMood && (
        <MoodSuggestion>
          <Icon name="lightbulb" size={18} color={theme.colors.accent} style={{ marginRight: 8 }} />
          <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
            {getMoodSuggestion(selectedMood)}
          </Text>
        </MoodSuggestion>
      )}

      {/* Mood Selection Modal */}
      <Modal
        visible={showMoodModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoodModal(false)}
      >
        <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowMoodModal(false)}
        >
          <View style={[
            styles.moodModalContainer,
            { backgroundColor: theme.colors.background }
          ]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowMoodModal(false)}
            >
              <Icon name="close" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.moodModalTitle, { color: theme.colors.text }]}>How are you feeling today?</Text>
            <MoodContainer>
              {MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.value}
                  onPress={() => handleMoodSelection(mood.value)}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.value && { backgroundColor: mood.color + '20' }
                  ]}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodLabel, { color: theme.colors.text }]}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </MoodContainer>
            <Text style={[styles.moodModalInstruction, { color: theme.colors.secondaryText }]}>
              Select your mood or tap anywhere to close
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* See All Health Tips Modal */}
      <Modal
        visible={showAllHealthTips}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllHealthTips(false)}
      >
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>All Health Tips</ModalTitle>
            <TouchableOpacity onPress={() => setShowAllHealthTips(false)}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </ModalHeader>
          <ModalContent>
            {healthTips.map((tip) => (
              <TouchableOpacity
                key={tip.id}
                onPress={() => {
                  setSelectedHealthTip(tip);
                  setShowAllHealthTips(false);
                  navigation.navigate('HealthTipDetail', { tip });
                }}
              >
                <LinearGradient
                  colors={theme.colors.background === COLORS.darkBackground
                    ? ['#2A3439', '#2F3B41']
                    : ['#FFFFFF', '#F8F9FA']}
                  style={styles.healthTipGradient}
                >
                  <HealthTipCard>
                    <Icon name={tip.icon} size={20} color={theme.colors.primary} />
                    <HealthTipContent>
                      <HealthTipTitle>{tip.title}</HealthTipTitle>
                      <HealthTipDescription>{tip.description}</HealthTipDescription>
                    </HealthTipContent>
                  </HealthTipCard>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ModalContent>
        </ModalContainer>
      </Modal>

     {/* View All Recommendations Modal */}
      <Modal
        visible={showAllRecommendations}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllRecommendations(false)}
      >
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>All Recommendations</ModalTitle>
            <TouchableOpacity onPress={() => setShowAllRecommendations(false)}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </ModalHeader>
          <ModalContent>
            {recommendations.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{ marginBottom: 12 }}
                activeOpacity={0.85}
                onPress={() => {
                  setShowAllRecommendations(false);
                  if (item.category === 'workout') {
                    navigation.navigate('WorkoutDetail', { workout: item });
                  } else if (item.category === 'nutrition') {
                    navigation.navigate('NutritionDetail', { nutrition: item });
                  } else if (item.category === 'hydration') {
                    navigation.navigate('HydrationDetail', { hydration: item });
                  } else if (item.category === 'rest') {
                    navigation.navigate('RestDetail', { rest: item });
                  }
                }}
              >
                {renderCompactRecommendation({ item })}
              </TouchableOpacity>
            ))}
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

// Styled Components
const MoodPromptContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const MoodPromptText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
`;

const MoodPromptLink = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.7;
  margin-left: 8px;
  text-decoration: underline;
`;

const HealthTipCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  width: ${width * 0.75}px;
`;

const HealthTipContent = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const HealthTipTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const HealthTipDescription = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-top: 4px;
`;

const SectionContainer = styled.View`
  margin: 15px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
`;

const StreakContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 16px;
`;

const StreakText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 12px;
  margin-left: 6px;
`;

const StreakGoal = styled.Text`
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  margin-left: 8px;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const MoodContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const MoodSuggestion = styled.View`
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  margin: 0 auto;
  align-self: center;
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  elevation: 6;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
  z-index: 100;
`;

const CategoryBadge = styled.Text<{ category: string }>`
  align-self: flex-start;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ category, theme }) =>
    category === 'workout' ? theme.colors.secondary :
    category === 'nutrition' ? '#E67E22' :
    category === 'hydration' ? '#3498DB' :
    theme.colors.primary};
  margin-bottom: 8px;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: 40px 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

// Modal Components
const ModalContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  padding-top: 40px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background};
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const ModalContent = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const ModalDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 24px;
  margin: 15px 0;
`;

const ModalDetails = styled.View`
  margin-top: 20px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background};
`;

const DetailLabel = styled.Text`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const DetailValue = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const styles = StyleSheet.create({
  headerGradient: {
    padding: 15,
    paddingTop: 35,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  themeToggle: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  moodButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    minWidth: 50,
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodModalContainer: {
    backgroundColor: '#2A3439',
    borderRadius: 15,
    padding: 20,
    width: width * 0.85,
    alignItems: 'center',
  },
  moodModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 15,
  },
  moodModalInstruction: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 15,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  healthTipGradient: {
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  compactCardGradient: {
    borderRadius: 14,
    padding: 14,
    marginBottom: CARD_MARGIN,
    minHeight: 90,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  healthTipsList: {
    paddingHorizontal: 5,
  },
  recommendationsRow: {
    justifyContent: 'space-between',
  },
  compactCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  compactCardContent: {
    flex: 1,
    padding: 12,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  compactDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  compactImage: {
    width: 60,
    height: 60,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  didYouKnowCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F1C40F',
  },
  didYouKnowContent: {
    flex: 1,
    marginLeft: 12,
  },
  didYouKnowFact: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 6,
  },
  didYouKnowSource: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  suggestionText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  tipContainer: {
    width: width * 0.8,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  seeAllText: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default Home;