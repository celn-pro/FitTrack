export interface WorkoutStep {
  title: string;
  description: string;
  image?: string; // URL to image or gif
  duration?: number; // seconds
}

export interface Workout {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  steps: WorkoutStep[];
  coverImage?: string;
}

export const WORKOUTS: Workout[] = [
  {
    id: 'w1',
    category: 'workout',
    title: 'Full Body Morning Routine',
    description: 'A quick full body workout to start your day with energy and focus. Includes warmup, main sets, and cooldown...',
    difficulty: 'beginner',
    duration: 20,
    coverImage: 'https://images.unsplash.com/photo-1517960413843-0aee8e2d471c',
    steps: [
      {
        title: 'Warmup',
        description: 'Light jogging in place and dynamic stretches.',
        image: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
        duration: 180,
      },
      {
        title: 'Push-ups',
        description: 'Standard push-ups, keep your back straight.',
        image: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
        duration: 60,
      },
      {
        title: 'Squats',
        description: 'Bodyweight squats, feet shoulder-width apart.',
        image: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
        duration: 60,
      },
      {
        title: 'Cooldown',
        description: 'Gentle stretching and deep breathing.',
        duration: 120,
      },
    ],
  },
  
  // Add more workouts as needed
];

export interface NutritionRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  tips: string[];
  articles?: { title: string; url: string }[];
  image?: string;
  calories?: number;
  macros?: { protein: number; carbs: number; fat: number };
}

export const NUTRITION_RECOMMENDATIONS: NutritionRecommendation[] = [
  {
    id: 'n1',
    category: 'nutrition',
    title: 'Balanced Breakfast',
    description: 'Start your day with a balanced meal including protein, healthy fats, and fiber...',
    tips: [
      'Include eggs or Greek yogurt for protein.',
      'Add whole grains like oats or whole wheat bread.',
      'Top with fruits or nuts for extra nutrients.'
    ],
    articles: [
      { title: 'Why Breakfast Matters', url: 'https://www.healthline.com/nutrition/why-breakfast-is-important' }
    ],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    calories: 350,
    macros: { protein: 20, carbs: 40, fat: 10 }
  },
  // Add more as needed
];

export interface HydrationRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  reminders?: string[]; // e.g., ["8am", "12pm", "4pm"]
  dailyGoalMl?: number;
  image?: string;
  tips?: string[];
}

export const HYDRATION_RECOMMENDATIONS: HydrationRecommendation[] = [
  {
    id: 'h1',
    category: 'hydration',
    title: 'Stay Hydrated All Day',
    description: 'Drinking water regularly helps maintain energy and focus...',
    reminders: ['8:00', '10:30', '13:00', '15:30', '18:00'],
    dailyGoalMl: 2000,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tips: [
      'Carry a reusable water bottle.',
      'Drink a glass of water before each meal.',
      'Set reminders to drink water throughout the day.'
    ]
  },
  // Add more as needed
];

export interface RestRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  tips: string[];
  sleepGoalHours?: number;
  image?: string;
  articles?: { title: string; url: string }[];
}

export const REST_RECOMMENDATIONS: RestRecommendation[] = [
  {
    id: 'r1',
    category: 'rest',
    title: 'Better Sleep Tonight',
    description: 'Quality sleep is essential for recovery and mental clarity...',
    tips: [
      'Avoid screens 30 minutes before bed.',
      'Keep your bedroom cool and dark.',
      'Try a relaxing bedtime routine like reading or meditation.'
    ],
    sleepGoalHours: 8,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    articles: [
      { title: 'The Science of Sleep', url: 'https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep' }
    ]
  },
  // Add more as needed
];

export interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'mental' | 'hydration';
  icon: string;
  image?: string;
  link?: string;
}

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: '1',
    title: 'Hydration Boost',
    description: 'Drink water immediately after waking up to kickstart metabolism.',
    category: 'hydration',
    icon: 'local-drink',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    link: 'https://www.healthline.com/nutrition/how-much-water-should-you-drink-per-day'
  },
  {
    id: '2',
    title: 'Power Nap',
    description: '20-minute naps can improve alertness and cognitive function.',
    category: 'sleep',
    icon: 'bedtime',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    link: 'https://www.sleepfoundation.org/sleep-hygiene/napping'
  },
  {
    id: '3',
    title: 'Protein Power',
    description: 'Include protein in every meal to maintain stable blood sugar.',
    category: 'nutrition',
    icon: 'restaurant',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    link: 'https://www.healthline.com/nutrition/importance-of-protein'
  },
];

export interface DidYouKnow {
  id: string;
  fact: string;
  source: string;
  image?: string;
  link?: string;
}

export const DID_YOU_KNOW: DidYouKnow[] = [
  {
    id: '1',
    fact: 'Your brain uses 20% of your daily caloric intake despite being only 2% of your body weight.',
    source: 'Harvard Medical School',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    link: 'https://hms.harvard.edu/news/brain-food'
  },
  {
    id: '2',
    fact: 'Walking for just 2 minutes every hour can increase lifespan by 33%.',
    source: 'Clinical Journal of Sport Medicine',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    link: 'https://journals.lww.com/cjsportsmed'
  },
  {
    id: '3',
    fact: 'Laughing for 15 minutes burns the same calories as walking for 2 minutes.',
    source: 'Vanderbilt University',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    link: 'https://news.vanderbilt.edu/2005/04/07/laughing-just-for-the-health-of-it-59315/'
  },
];

export type FitnessGoal = 'Lose Weight' | 'Gain Muscle' | 'Maintain Health';

export interface Course {
  id: string;
  goal: FitnessGoal;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  coverImage?: string;
  topics: CourseTopic[];
}

export interface CourseTopic {
  id: string;
  title: string;
  description?: string;
  steps: CourseStep[];
  completed?: boolean; // for user progress
}

export interface CourseStep {
  id: string;
  title: string;
  content: string; // explanation or instruction
  illustration?: string; // image URL
  videoUrl?: string;     // optional video for guidance
  completed?: boolean;   // for user progress
}

// ...existing code...
export const COURSES: Course[] = [
  {
    id: 'c1',
    goal: 'Gain Muscle',
    title: 'Full Body Strength',
    description: 'A progressive course to build muscle from beginner to advanced.',
    level: 'Beginner',
    coverImage: 'https://example.com/cover1.jpg',
    topics: [
      {
        id: 't1',
        title: 'Introduction to Strength Training',
        description: 'Learn the basics of muscle gain.',
        steps: [
          {
            id: 's1',
            title: 'What is Strength Training?',
            content: 'Strength training involves...',
            illustration: 'https://example.com/step1.jpg',
            videoUrl: 'https://youtube.com/embed/xyz'
          },
          {
            id: 's2',
            title: 'Warming Up',
            content: 'Always start with a warm-up...',
            illustration: 'https://example.com/step2.jpg'
          }
        ]
      },
      {
        id: 't2',
        title: 'Compound Movements',
        steps: [
          {
            id: 's3',
            title: 'Squats',
            content: 'Squats are essential for...',
            videoUrl: 'https://youtube.com/embed/abc'
          }
        ]
      }
    ]
  },
  // --- Weight Loss Courses ---
  {
    id: 'lw1',
    goal: 'Lose Weight',
    title: 'Fat Loss Fundamentals',
    description: 'Step-by-step guide to effective fat loss.',
    level: 'Beginner',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    topics: [
      {
        id: 'lw1-t1',
        title: 'Understanding Calories',
        steps: [
          {
            id: 'lw1-s1',
            title: 'Calorie Deficit',
            content: 'To lose weight, you need to burn more calories than you consume. Learn how to track your intake and output.',
            illustration: 'https://example.com/calorie.jpg'
          }
        ]
      },
      {
        id: 'lw1-t2',
        title: 'Healthy Food Choices',
        steps: [
          {
            id: 'lw1-s2',
            title: 'Choosing Whole Foods',
            content: 'Whole foods are less processed and more filling. Focus on vegetables, fruits, lean proteins, and whole grains.',
            illustration: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0'
          }
        ]
      },
      {
        id: 'lw1-t3',
        title: 'Getting Started with Cardio',
        steps: [
          {
            id: 'lw1-s3',
            title: 'Walking for Fat Loss',
            content: 'Walking is a simple and effective way to burn calories. Aim for 30 minutes a day.',
            videoUrl: 'https://youtube.com/embed/walking-fat-loss'
          }
        ]
      }
    ]
  },
  {
    id: 'lw2',
    goal: 'Lose Weight',
    title: 'Intermediate Weight Loss Strategies',
    description: 'Take your fat loss journey to the next level with these strategies.',
    level: 'Intermediate',
    coverImage: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    topics: [
      {
        id: 'lw2-t1',
        title: 'Meal Planning',
        steps: [
          {
            id: 'lw2-s1',
            title: 'Batch Cooking',
            content: 'Prepare meals in advance to avoid unhealthy choices.',
            illustration: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc'
          }
        ]
      },
      {
        id: 'lw2-t2',
        title: 'HIIT Workouts',
        steps: [
          {
            id: 'lw2-s2',
            title: 'Beginner HIIT Routine',
            content: 'High-Intensity Interval Training burns more calories in less time.',
            videoUrl: 'https://youtube.com/embed/hiit-beginner'
          }
        ]
      },
      {
        id: 'lw2-t3',
        title: 'Tracking Progress',
        steps: [
          {
            id: 'lw2-s3',
            title: 'Using a Journal',
            content: 'Track your food, workouts, and weight to stay motivated.',
            illustration: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2'
          }
        ]
      }
    ]
  },
  {
    id: 'lw3',
    goal: 'Lose Weight',
    title: 'Advanced Fat Loss Mastery',
    description: 'Master advanced techniques for sustainable fat loss.',
    level: 'Advanced',
    coverImage: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41',
    topics: [
      {
        id: 'lw3-t1',
        title: 'Carb Cycling',
        steps: [
          {
            id: 'lw3-s1',
            title: 'How Carb Cycling Works',
            content: 'Alternate high and low carb days to optimize fat loss and performance.',
            illustration: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
          }
        ]
      },
      {
        id: 'lw3-t2',
        title: 'Strength Training for Fat Loss',
        steps: [
          {
            id: 'lw3-s2',
            title: 'Lifting Heavy',
            content: 'Building muscle increases your metabolism and helps burn more fat.',
            videoUrl: 'https://youtube.com/embed/strength-fat-loss'
          }
        ]
      },
      {
        id: 'lw3-t3',
        title: 'Overcoming Plateaus',
        steps: [
          {
            id: 'lw3-s3',
            title: 'Breaking Through Stalls',
            content: 'Learn strategies to overcome weight loss plateaus and keep progressing.',
            illustration: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
          }
        ]
      }
    ]
  },
  // ...other courses for other goals
];

// ...existing code...

export interface FeedPost {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  image?: string;
  likes: number;
  comments: number;
  activityType?: string; // e.g. 'steps', 'workout', 'course'
  activityValue?: string;
}

// --- Rich mock data for Social Feed ---
export const MOCK_SOCIAL_FEED: FeedPost[] = [
  {
    id: 'p1',
    user: {
      name: 'Alice Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    content: "Just finished my morning run! 🏃‍♀️ Feeling energized and ready to take on the day.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    likes: 23,
    comments: 5,
    activityType: 'steps',
    activityValue: '8500',
  },
  {
    id: 'p2',
    user: {
      name: 'Brian Lee',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    content: "Completed the 'Full Body Strength' course! 💪 Highly recommend for beginners.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    likes: 15,
    comments: 2,
    activityType: 'course',
    activityValue: '',
  },
  {
    id: 'p3',
    user: {
      name: 'Carla Mendes',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    content: "Hydration tip: Always keep a bottle at your desk. Hit my 2L goal today! 💧",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    likes: 12,
    comments: 1,
    activityType: 'hydration',
    activityValue: '2000',
  },
  {
    id: 'p4',
    user: {
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    },
    content: "Smashed my personal best: 12,000 steps! 🚶‍♂️",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likes: 30,
    comments: 7,
    activityType: 'steps',
    activityValue: '12000',
  },
  {
    id: 'p5',
    user: {
      name: 'Emily Zhang',
      avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    },
    content: "Tried a new healthy breakfast recipe today. So tasty and filling! 🍳🥑",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    likes: 18,
    comments: 3,
    activityType: 'nutrition',
    activityValue: '',
  },
  {
    id: 'p6',
    user: {
      name: 'Frank O\'Connor',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
    content: "Finished 'Fat Loss Fundamentals' course. Down 2kg already! 🔥",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likes: 22,
    comments: 4,
    activityType: 'course',
    activityValue: '',
  },
  {
    id: 'p7',
    user: {
      name: 'Grace Lin',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    content: "Power nap for 20 minutes. Feel so refreshed! 😴",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    likes: 9,
    comments: 0,
    activityType: 'sleep',
    activityValue: '20',
  },
  {
    id: 'p8',
    user: {
      name: 'Henry Ford',
      avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    },
    content: "Logged 8 hours of sleep last night. Ready to crush my goals today!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    likes: 14,
    comments: 2,
    activityType: 'sleep',
    activityValue: '8',
  },
];

// ...existing code...