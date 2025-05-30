import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useQuery, useSubscription } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import styled, { ThemeProvider, useTheme } from 'styled-components/native';
import { GET_RECOMMENDATIONS, ON_RECOMMENDATION_UPDATE } from '../graphql/queries';
import { useAuthStore } from '../store/authStore'; // Import the auth store

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

const Home: React.FC = () => {
  const theme = useTheme();
  
  // Use Zustand store instead of AsyncStorage directly
  const { user, isAuthenticated, token } = useAuthStore();
  const email = user?.email || '';

  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Fetch recommendations using the email from Zustand store
  const { data, loading, error, refetch } = useQuery(GET_RECOMMENDATIONS, {
    variables: { email },
    skip: !email || !isAuthenticated, // Skip if no email or not authenticated
    fetchPolicy: 'cache-and-network',
    onCompleted: async (data) => {
      console.log('Query completed successfully:', data);
      if (data.getRecommendations) {
        // Cache recommendations
        await AsyncStorage.setItem('recommendations', JSON.stringify(data.getRecommendations));
      }
    },
    onError: async (error) => {
      console.error('GraphQL query error:', error);
      // Load cached recommendations if offline
      try {
        const cached = await AsyncStorage.getItem('recommendations');
        if (cached) {
          setRecommendations(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.error('Error loading cached data:', cacheError);
      }
    },
  });

  // Subscription for real-time updates
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

  // Update recommendations when data changes
  useEffect(() => {
    if (data?.getRecommendations) {
      setRecommendations(data.getRecommendations);
    }
  }, [data]);

  // Load cached recommendations on mount
  useEffect(() => {
    const loadCached = async () => {
      try {
        const cached = await AsyncStorage.getItem('recommendations');
        if (cached) {
          setRecommendations(JSON.parse(cached));
        }
      } catch (error) {
        console.error('Error loading cached recommendations:', error);
      }
    };
    loadCached();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Render recommendation card
  const renderRecommendation = ({ item }: { item: Recommendation }) => (
    <RecommendationCard>
      {item.media ? (
        <FastImage
          source={{ uri: item.media, priority: FastImage.priority.high }}
          style={styles.media}
          resizeMode={FastImage.resizeMode.cover}
          accessibilityLabel={`${item.title} media`}
        />
      ) : (
        <PlaceholderMedia>
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#666' }}>No Image</Text>
        </PlaceholderMedia>
      )}
      <CardContent>
        <CategoryBadge category={item.category}>{item.category.toUpperCase()}</CategoryBadge>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
        <CardFooter>
          <Text style={styles.footerText}>Type: {item.type}</Text>
          <Text style={styles.footerText}>Frequency: {item.frequency}</Text>
        </CardFooter>
      </CardContent>
    </RecommendationCard>
  );

  // Check authentication first
  if (!isAuthenticated || !user) {
    return (
      <LoadingContainer>
        <Text style={styles.loadingText}>Please log in to view recommendations</Text>
        <Text style={styles.debugText}>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</Text>
        <Text style={styles.debugText}>User: {user ? user.email : 'No user data'}</Text>
        <Text style={styles.debugText}>Token: {token ? 'Present' : 'Missing'}</Text>
      </LoadingContainer>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
          <HeaderTitle>Welcome Back!</HeaderTitle>
          <HeaderSubtitle>Your Personalized Fitness Plan</HeaderSubtitle>
          <Text style={styles.emailText}>Email: {email}</Text>
        </Header>
        
        {loading && !refreshing ? (
          <LoadingContainer>
            <Text style={styles.loadingText}>Loading recommendations...</Text>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorText>Error loading recommendations: {error.message}</ErrorText>
            <Text style={styles.debugText}>Using cached data if available</Text>
            <RetryButton onPress={onRefresh}>
              <RetryButtonText>Retry</RetryButtonText>
            </RetryButton>
          </ErrorContainer>
        ) : (
          <FlatList
            data={recommendations}
            renderItem={renderRecommendation}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No recommendations available</Text>
                <Text style={styles.debugText}>Recommendations count: {recommendations.length}</Text>
                <RetryButton onPress={onRefresh}>
                  <RetryButtonText>Refresh</RetryButtonText>
                </RetryButton>
              </View>
            }
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

const HeaderSubtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white};
  margin-top: 5px;
`;

const RecommendationCard = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.white};
  margin: 10px 15px;
  border-radius: 15px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const CardContent = styled.View`
  flex: 1;
  padding: 15px;
`;

const CategoryBadge = styled.Text<{ category: string }>`
  align-self: flex-start;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ category, theme }) =>
    category === 'workout' ? theme.colors.success :
    category === 'nutrition' ? theme.colors.warning :
    category === 'hydration' ? theme.colors.info :
    theme.colors.secondary};
`;

const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 10px;
`;

const CardDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 5px;
`;

const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const PlaceholderMedia = styled.View`
  width: 100px;
  height: 100px;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  align-items: center;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-bottom: 20px;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px 20px;
  border-radius: 10px;
  margin-top: 10px;
`;

const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: bold;
`;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  media: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 5,
  },
  emailText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Home;