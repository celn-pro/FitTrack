import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL, BASE_URL } from '@env';


// Replace with your actual GraphQL endpoint
const HTTP_ENDPOINT = API_BASE_URL;

const httpLink = createHttpLink({
  uri: HTTP_ENDPOINT,
});

// Auth link to add authentication headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from your auth store
  const token = useAuthStore.getState().token;
  
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  };
});

// Error link for handling GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    
    // Handle authentication errors
    if (
      typeof networkError === 'object' &&
      networkError !== null &&
      'statusCode' in networkError &&
      (networkError as any).statusCode === 401
    ) {
      // Clear user data and redirect to login
      useAuthStore.getState().logout();
    }
  }
});

// Combine all links
const link = from([
  errorLink,
  authLink,
  httpLink,
]);

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;