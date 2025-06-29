// Social feed related TypeScript types

export type ActivityType = 'workout' | 'nutrition' | 'achievement' | 'general';

export interface SocialUser {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  avatar?: string;
  isFollowing?: boolean;
  followersCount?: number;
  followingCount?: number;
}

export interface FeedComment {
  id: string;
  user: SocialUser;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  likesCount?: number;
  isLikedByCurrentUser?: boolean;
}

export interface FeedPost {
  id: string;
  user: SocialUser;
  content: string;
  image?: string;
  activityType?: ActivityType;
  activityValue?: string;
  likes: number;
  likedByCurrentUser?: boolean;
  comments: FeedComment[];
  commentsCount: number;
  sharesCount?: number;
  isSharedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostInput {
  content: string;
  image?: string;
  activityType?: ActivityType;
  activityValue?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export interface CreateCommentInput {
  postId: string;
  comment: string;
}

export interface UpdateCommentInput {
  id: string;
  comment: string;
}

export interface LikePostInput {
  postId: string;
}

export interface LikeCommentInput {
  commentId: string;
}

export interface FollowUserInput {
  userId: string;
}

export interface SocialFeedFilters {
  activityType?: ActivityType;
  following?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface SocialStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesReceived: number;
  commentsReceived: number;
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  mentions: boolean;
  achievements: boolean;
  workoutReminders: boolean;
  mealReminders: boolean;
  hydrationReminders: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
    distance: 'km' | 'miles';
    temperature: 'celsius' | 'fahrenheit';
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    activityVisibility: 'public' | 'friends' | 'private';
    allowMessages: boolean;
    allowFriendRequests: boolean;
  };
  notifications: NotificationSettings;
  createdAt: string;
  updatedAt: string;
}
