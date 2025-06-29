// App configuration

export const APP_CONFIG = {
  // App Information
  name: 'FitTrack',
  version: '1.0.0',
  description: 'Health and Fitness Tracking App for DIT Students',
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.fittrack.app',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  // GraphQL Configuration
  graphql: {
    uri: process.env.GRAPHQL_URI || 'https://api.fittrack.app/graphql',
    wsUri: process.env.GRAPHQL_WS_URI || 'wss://api.fittrack.app/graphql',
  },
  
  // Storage Configuration
  storage: {
    prefix: '@fittrack/',
    encryptionKey: process.env.STORAGE_ENCRYPTION_KEY,
  },
  
  // Performance Configuration
  performance: {
    enableHermes: true,
    enableFlipper: __DEV__,
    enableReduxDevTools: __DEV__,
    imageCache: {
      maxSize: 100 * 1024 * 1024, // 100MB
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    requestCache: {
      ttl: 5 * 60 * 1000, // 5 minutes
    },
  },
  
  // Feature Flags
  features: {
    socialFeed: true,
    arWorkouts: true,
    voiceCommands: true,
    biometricAuth: true,
    pushNotifications: true,
    analytics: !__DEV__,
    crashReporting: !__DEV__,
  },
  
  // UI Configuration
  ui: {
    animationDuration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    hapticFeedback: true,
    darkModeSupport: true,
    systemThemeDetection: true,
  },
  
  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  
  // Validation
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
    profile: {
      minAge: 13,
      maxAge: 120,
      minHeight: 100, // cm
      maxHeight: 250, // cm
      minWeight: 30, // kg
      maxWeight: 300, // kg
    },
  },
  
  // External Services
  services: {
    oneSignal: {
      appId: process.env.ONESIGNAL_APP_ID,
    },
    analytics: {
      trackingId: process.env.ANALYTICS_TRACKING_ID,
    },
    crashlytics: {
      enabled: !__DEV__,
    },
  },
  
  // Development
  development: {
    showReduxLogger: __DEV__,
    showNetworkLogger: __DEV__,
    enableStorybook: __DEV__,
    mockApi: false,
  },
} as const;

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...APP_CONFIG,
        api: {
          ...APP_CONFIG.api,
          baseUrl: 'https://api.fittrack.app',
        },
        features: {
          ...APP_CONFIG.features,
          analytics: true,
          crashReporting: true,
        },
      };
      
    case 'staging':
      return {
        ...APP_CONFIG,
        api: {
          ...APP_CONFIG.api,
          baseUrl: 'https://staging-api.fittrack.app',
        },
      };
      
    default: // development
      return {
        ...APP_CONFIG,
        api: {
          ...APP_CONFIG.api,
          baseUrl: 'http://localhost:4000',
        },
        development: {
          ...APP_CONFIG.development,
          mockApi: true,
        },
      };
  }
};

export default getEnvironmentConfig();
