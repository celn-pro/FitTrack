# FitTrack - Health & Fitness Tracking App

A modern, professional-grade React Native health and fitness tracking application designed for DIT students. Built with cutting-edge technologies and best practices for optimal performance and user experience.

## 🌟 Features

### Core Functionality
- **User Authentication & Profile Management** - Secure login/registration with comprehensive profile setup
- **Activity Tracking** - Track workouts, nutrition, hydration, and sleep
- **Social Feed** - Share achievements and connect with the fitness community
- **Learning Platform** - Access fitness courses and educational content
- **Personalized Recommendations** - AI-powered suggestions based on user data
- **Progress Analytics** - Detailed insights and progress tracking

### Modern UI/UX
- **Material Design 3** - Clean, modern interface with smooth animations
- **Dark/Light Theme** - Automatic theme switching with system preference detection
- **Responsive Design** - Optimized for all screen sizes and orientations
- **Accessibility** - Full accessibility support with screen readers and high contrast
- **Haptic Feedback** - Enhanced user interaction with tactile responses

### Technical Excellence
- **TypeScript** - Full type safety and enhanced developer experience
- **GraphQL** - Efficient data fetching with Apollo Client
- **Offline Support** - Cached data and offline functionality
- **Performance Optimized** - Lazy loading, memoization, and bundle optimization
- **Error Handling** - Comprehensive error boundaries and user-friendly error messages

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.0.0)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Yarn or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fittrack.git
   cd fittrack
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your configuration
   ```

### Running the App

#### Development Mode
```bash
# Start Metro bundler
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

## 🏗️ Architecture & Design System

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, Input, etc.)
│   ├── layout/         # Layout components (Screen, Header)
│   ├── fitness/        # Fitness-specific components
│   └── navigation/     # Navigation components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API and external services
├── store/             # State management (Zustand)
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── styles/            # Theme and styling
├── types/             # TypeScript type definitions
├── constants/         # App constants
└── assets/            # Images, fonts, animations
```

### Modern Component Library
- **UI Components** - Button, Card, Input, Modal, Avatar, LoadingSpinner
- **Layout Components** - Screen, Header with gradient support
- **Fitness Components** - StatsCard, ProgressBar with animations
- **Navigation** - Animated tab bar with smooth transitions

### Design System Features
- **Colors** - Modern gradient-friendly palette with accessibility compliance
- **Typography** - Inter font family with responsive sizing scale
- **Spacing** - Consistent 4px-based spacing system
- **Animations** - Smooth transitions using react-native-reanimated
- **Themes** - Light/dark mode with automatic system detection

## 🛠️ Development

### Code Quality Tools
- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

### Testing
```bash
yarn test              # Run unit tests
yarn test:coverage     # Run with coverage
yarn test:e2e         # Run E2E tests
```

### Performance Optimizations
- **Lazy Loading** - Components and screens loaded on demand
- **Memoization** - Optimized re-renders with React.memo and useMemo
- **Image Optimization** - Fast image loading with caching
- **Bundle Splitting** - Reduced initial bundle size

## 📱 Key Features Showcase

### Modern Dashboard
- Real-time stats with animated progress bars
- Quick action cards with gradient backgrounds
- Recent activity feed with smooth animations
- Personalized recommendations

### Enhanced Social Feed
- Modern card-based post layout
- Animated interactions (likes, comments)
- Activity type badges with icons
- Smooth modal transitions

### Professional Navigation
- Animated tab bar with spring animations
- Smooth screen transitions
- Gesture-based navigation
- Loading states and error boundaries

## 🎯 Presentation Ready

This app is designed to impress during final year presentations with:
- **Professional UI/UX** - Modern design that rivals commercial apps
- **Smooth Animations** - Every interaction feels polished
- **Performance** - Optimized for smooth 60fps experience
- **Accessibility** - Full support for screen readers and high contrast
- **Error Handling** - Graceful error states and recovery

## 📚 Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Apollo GraphQL](https://www.apollographql.com/docs/react/)

---

**Built with ❤️ for DIT Students**
