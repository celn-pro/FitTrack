import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../utils/env';

// Use API_BASE_URL from environment configuration
const httpLink = createHttpLink({
  uri: API_BASE_URL,
});

// Auth link - simplified
const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  
  return {
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }), // Only add if token exists
    }
  };
});

// Enhanced error link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);
    
    // Handle authentication errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      useAuthStore.getState().logout();
    }
  }
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all', // Add this for mutations
    },
  },
});

export default apolloClient;