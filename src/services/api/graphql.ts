// GraphQL service functions
import { ApolloClient, gql } from '@apollo/client';

// Re-export queries from the existing location for now
export * from '../../graphql/queries';

// Add any additional GraphQL service functions here
export const createOptimisticResponse = (mutation: string, variables: any) => {
  // Helper function to create optimistic responses for mutations
  return {
    __typename: 'Mutation',
    [mutation]: {
      __typename: 'MutationResult',
      success: true,
      ...variables,
    },
  };
};

export const handleGraphQLError = (error: any) => {
  // Centralized error handling for GraphQL operations
  console.error('GraphQL Error:', error);
  
  if (error.networkError) {
    return 'Network error. Please check your connection.';
  }
  
  if (error.graphQLErrors?.length > 0) {
    return error.graphQLErrors[0].message;
  }
  
  return 'An unexpected error occurred.';
};
