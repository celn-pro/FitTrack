// frontend/src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_RECOMMENDATIONS = gql`
  query GetRecommendations {
    getRecommendations {
      id
      category
      title
      description
      image
      steps {
      title
      description
      image
      duration
    }
      tips
      articles {
        title
        url
      }
      macros {
        protein
        carbs
        fat
      }
      calories
      reminders
      dailyGoalMl
      sleepGoalHours
      createdAt
      updatedAt
    }
  }
`;;

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