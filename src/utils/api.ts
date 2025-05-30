// src/utils/api.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { API_BASE_URL, BASE_URL } from '@env';

const httpLink = createHttpLink({
  uri: 'http://10.0.2.2:4000/graphql', // Replace with your API URL
});

const authLink = setContext((_, { headers }) => {
  // Add authentication token if needed (e.g., after login)
  return {
    headers: {
      ...headers,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});