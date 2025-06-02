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

export const GET_HEALTH_TIPS = gql`
  query GetHealthTips {
    getHealthTips {
      id
      title
      description
      category
      icon
      image
      link
      createdAt
      updatedAt
    }
  }
`;

export const GET_DID_YOU_KNOW = gql`
  query GetDidYouKnow {
    getDidYouKnow {
      id
      fact
      source
      image
      link
      createdAt
      updatedAt
    }
  }
`;

export const GET_COURSES = gql`
  query GetCourses {
    getCourses {
      id
      goal
      title
      description
      level
      coverImage
      topics {
        id
        title
        description
        steps {
          id
          title
          content
          illustration
          videoUrl
        }
      }
      createdAt
      updatedAt
    }
  }
`;