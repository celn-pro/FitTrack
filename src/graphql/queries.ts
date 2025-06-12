// frontend/src/graphql/queries.ts
import { gql } from '@apollo/client';

// Recommendations queries and mutations
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
      ageRange {
        min
        max
      }
      weightRange {
        min
        max
      }
      createdAt
      updatedAt
    }
  }
`;

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

// Healthy tips queries and mutaions
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
  query GetDidYouKnow {
    getDidYouKnow {
      id
      fact
      source
      image
      link
      ageRange {
        min
        max
      }
      weightRange {
        min
        max
      }
      createdAt
      updatedAt
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
      ageRange {
        min
        max
      }
      weightRange {
        min
        max
      }
      createdAt
      updatedAt
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
        name
        avatar
      }
      content
      createdAt
      image
      likes
      likedByCurrentUser
      comments {
        user {
          id
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
      name
      avatar
    }
    content
    createdAt
    image
    likes
    likedByCurrentUser
    comments {
      user {
        id
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
    user { id name avatar }
    likes
    likedByCurrentUser
    comments {
      user { id name avatar }
      comment
      createdAt
    }
  }
}`

export const DELETE_FEED_POST = gql`
  mutation DeleteFeedPost($id: ID!) {
  deleteFeedPost(id: $id)
}
`

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
          name
          avatar
        }
        comment
        createdAt
      }
    }
  }
`;