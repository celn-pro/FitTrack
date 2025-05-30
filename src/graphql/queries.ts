// frontend/src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_RECOMMENDATIONS = gql`
  query GetRecommendations($email: String!) {
    getRecommendations(email: $email) {
      id
      title
      description
      type
      category
      priority
      media
      frequency
    }
  }
`;

export const ON_RECOMMENDATION_UPDATE = gql`
  subscription OnRecommendationUpdate($email: String!) {
    onRecommendationUpdate(email: $email) {
      id
      title
      description
      type
      category
      priority
      media
      frequency
    }
  }
`;