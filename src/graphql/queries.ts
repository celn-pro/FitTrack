// frontend/src/graphql/queries.ts
import { gql } from '@apollo/client';

// Recommendations queries and mutations
export const GET_RECOMMENDATIONS = gql`
  query GetRecommendations($filter: RecommendationFilter) {
    getRecommendations(filter: $filter) {
      id
      category
      title
      description
      image
      steps {
        title
        description
        duration
        media {
          type
          url
          caption
        }
      }
      tips
      articles {
        title
        url
        summary
      }
      macros {
        protein {
          grams
          calories
          percentage
        }
        carbohydrates {
          grams
          calories
          percentage
        }
        fats {
          grams
          calories
          percentage
        }
      }
      calories
      reminders
      dailyGoalMl
      sleepGoalHours
      calculatedCalories
      difficultyLevel
      estimatedDuration
      personalizedTips
      createdAt
      source
      hasWorkingImage
    }
  }
`;

// Optional: Filter input type for TypeScript
export interface RecommendationFilter {
  category?: string;
  difficultyLevel?: string;
  maxDuration?: number;
  includeEquipment?: string[];
  excludeHealthConditions?: string[];
}

export const CREATE_RECOMMENDATION = gql`
  mutation CreateRecommendation($input: RecommendationInput!) {
  createRecommendation(input: $input) {
    id
    category
    title
    description
    image
    steps {
      title
      description
      duration
      media {
        type
        url
        caption
      }
    }
    tips
    articles {
      title
      url
      summary
    }
    macros {
      protein {
        grams
        calories
        percentage
      }
      carbohydrates {
        grams
        calories
        percentage
      }
      fats {
        grams
        calories
        percentage
      }
    }
    calories
    reminders
    dailyGoalMl
    sleepGoalHours
    calculatedCalories
    difficultyLevel
    estimatedDuration
    personalizedTips
    createdAt
    source
    hasWorkingImage
  }
}
`;

export const UPDATE_RECOMMENDATION = gql`
  mutation UpdateRecommendation($id: ID!, $input: RecommendationInput!) {
    updateRecommendation(id: $id, input: $input) {
      id
      category
      title
      description
      image
      steps {
        title
        description
        duration
        media {
          type
          url
          caption
        }
      }
      tips
      articles {
        title
        url
        summary
      }
      macros {
        protein {
          grams
          calories
          percentage
        }
        carbohydrates {
          grams
          calories
          percentage
        }
        fats {
          grams
          calories
          percentage
        }
      }
      calories
      reminders
      dailyGoalMl
      sleepGoalHours
      calculatedCalories
      difficultyLevel
      estimatedDuration
      personalizedTips
      createdAt
      source
      hasWorkingImage
    }
}
`;

export const DELETE_RECOMMENDATION = gql`
  mutation DeleteRecommendation($id: ID!) {
    deleteRecommendation(id: $id)
}
`;

export const ON_RECOMMENDATION_UPDATE = gql`
  subscription OnRecommendationUpdate($email: String!) {
    onRecommendationUpdate(email: $email) {
      id
      category
      title
      description
      image
      steps {
        title
        description
        duration
        media {
          type
          url
          caption
        }
      }
      tips
      articles {
        title
        url
        summary
      }
      macros {
        protein {
          grams
          calories
          percentage
        }
        carbohydrates {
          grams
          calories
          percentage
        }
        fats {
          grams
          calories
          percentage
        }
      }
      calories
      reminders
      dailyGoalMl
      sleepGoalHours
      calculatedCalories
      difficultyLevel
      estimatedDuration
      personalizedTips
      createdAt
      source
      hasWorkingImage
    }
  }
`;

// Healthy tips queries and mutaions
export const GET_HEALTH_TIPS = gql`
  query GetDailyHealthTips {
    getDailyHealthTips {
      date
      tips {
        id
        title
        content
        category
        difficulty
        estimatedReadTime
      }
    }
  }
`;

export const CREATE_HEALTH_TIP = gql`
  mutation CreateHealthTip($input: HealthTipInput!) {
  createHealthTip(input: $input) {
    id
    title
    description
    category
    icon
    image
    link
    fitnessGoal
    ageRange { min max }
    gender
    healthConditions
    weightRange { min max }
    activityLevel
    dietaryPreference
    dietaryRestrictions
    preferredWorkoutTypes
    createdAt
    updatedAt
  }
}
`;

export const UPDATE_HEALTH_TIP = gql`
  mutation UpdateHealthTip($id: ID!, $input: HealthTipInput!) {
  updateHealthTip(id: $id, input: $input) {
    id
    title
    description
    category
    icon
    image
    link
    fitnessGoal
    ageRange { min max }
    gender
    healthConditions
    weightRange { min max }
    activityLevel
    dietaryPreference
    dietaryRestrictions
    preferredWorkoutTypes
    createdAt
    updatedAt
  }
}
`;

export const DELETE_HEALTH_TIP = gql`
  mutation DeleteHealthTip($id: ID!) {
    deleteHealthTip(id: $id)
}
`;

// Didi you know queries and mutations
export const GET_DID_YOU_KNOW = gql`
  query GetDailyDidYouKnowFacts {
    getDailyDidYouKnowFacts {
      date
      totalFacts
      facts {
        id
        fact
        category
        source
        difficulty
        estimatedReadTime
        isVerified
      }
    }
  }
`;

export const CREATE_DID_YOU_KNOW = gql`
  mutation CreateDidYouKnow($input: DidYouKnowInput!) {
  createDidYouKnow(input: $input) {
    id
    fact
    source
    image
    link
    fitnessGoal
    ageRange { min max }
    gender
    healthConditions
    weightRange { min max }
    activityLevel
    dietaryPreference
    dietaryRestrictions
    preferredWorkoutTypes
    createdAt
    updatedAt
  }
}
`;

export const UPDATE_DID_YOU_KNOW = gql`
  mutation UpdateDidYouKnow($id: ID!, $input: DidYouKnowInput!) {
  updateDidYouKnow(id: $id, input: $input) {
    id
    fact
    source
    image
    link
    fitnessGoal
    ageRange { min max }
    gender
    healthConditions
    weightRange { min max }
    activityLevel
    dietaryPreference
    dietaryRestrictions
    preferredWorkoutTypes
    createdAt
    updatedAt
  }
}
`;

export const DELETE_DID_YOU_KNOW = gql`
 mutation DeleteDidYouKnow($id: ID!) {
  deleteDidYouKnow(id: $id)
}
`;

// Courses queries and mutations
export const GET_COURSES = gql`
  query GET_COURSES {
    getFeaturedCourses {
      id
      title
      description
      category
      difficulty
      duration
      instructor
      thumbnailUrl
      tags
      lessons {
        id
        title
        description
        duration
        contentType
        content
        exercises {
          name
          instructions
          duration
          reps
          sets
          imageUrl
          targetMuscles
          equipment
        }
        quiz {
          questions {
            question
            options
            correctAnswer
            explanation
          }
          passingScore
        }
      }
      learningObjectives
      targetAudience
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CourseInput!) {
  createCourse(input: $input) {
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
    ageRange { min max }
    gender
    healthConditions
    weightRange { min max }
    activityLevel
    dietaryPreference
    dietaryRestrictions
    preferredWorkoutTypes
    createdAt
    updatedAt
  }
}
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: CourseInput!) {
  updateCourse(id: $id, input: $input) {
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
    ageRange { min max }
    gender
    healthConditions
    weightRange { min max }
    activityLevel
    dietaryPreference
    dietaryRestrictions
    preferredWorkoutTypes
    createdAt
    updatedAt
  }
}
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
  deleteCourse(id: $id)
}
`;

// Social Feeds queries and mutations
export const GET_SOCIAL_FEED = gql`
  query GetSocialFeed {
    getSocialFeed {
      id
      user {
        id
        firstName
        lastName
        name
        avatar
      }
      content
      createdAt
      updatedAt
      image
      likes
      likedByCurrentUser
      comments {
        user {
          id
          firstName
          lastName
          name
          avatar
        }
        comment
        createdAt
      }
      activityType
      activityValue
    }
  }
`;

export const CREATE_FEED_POST = gql`
  mutation CreateFeedPost($input: FeedPostInput!) {
    createFeedPost(input: $input) {
      id
      user {
        id
        firstName
        lastName
        name
        avatar
      }
      content
      createdAt
      updatedAt
      image
      likes
      likedByCurrentUser
      comments {
        user {
          id
          firstName
          lastName
          name
          avatar
        }
        comment
        createdAt
      }
      activityType
      activityValue
    }
  }
`;

export const UPDATE_FEED_POST = gql`
  mutation UpdateFeedPost($id: ID!, $input: UpdateFeedPostInput!) {
    updateFeedPost(id: $id, input: $input) {
      id
      content
      image
      activityType
      activityValue
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        name
        avatar
      }
      likes
      likedByCurrentUser
      comments {
        user {
          id
          firstName
          lastName
          name
          avatar
        }
        comment
        createdAt
      }
    }
  }
`;

export const DELETE_FEED_POST = gql`
  mutation DeleteFeedPost($id: ID!) {
    deleteFeedPost(id: $id)
  }
`;

export const LIKE_POST = gql`
  mutation LikeFeedPost($id: ID!) {
    likeFeedPost(id: $id) {
      id
      likes
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation CommentFeedPost($id: ID!, $comment: String!) {
    commentFeedPost(id: $id, comment: $comment) {
      id
      comments {
        user {
          id
          firstName
          lastName
          name
          avatar
        }
        comment
        createdAt
      }
    }
  }
`;