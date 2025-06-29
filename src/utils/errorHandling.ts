// Error handling utilities

import { Alert } from 'react-native';
import { ApolloError } from '@apollo/client';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

export class CustomError extends Error {
  code: string;
  details?: any;
  timestamp: Date;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

// Error codes
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // API errors
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // App errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  FEATURE_UNAVAILABLE: 'FEATURE_UNAVAILABLE',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_CODES.CONNECTION_ERROR]: 'Unable to connect to server. Please try again later.',
  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ERROR_CODES.FORBIDDEN]: 'Access denied. You do not have permission to access this resource.',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.REQUIRED_FIELD]: 'This field is required.',
  [ERROR_CODES.INVALID_FORMAT]: 'Invalid format. Please check your input.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_CODES.CONFLICT]: 'A conflict occurred. Please refresh and try again.',
  [ERROR_CODES.RATE_LIMITED]: 'Too many requests. Please wait a moment and try again.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.FEATURE_UNAVAILABLE]: 'This feature is currently unavailable.',
  [ERROR_CODES.PERMISSION_DENIED]: 'Permission denied. Please check your app permissions.',
} as const;

// Error handling functions
export const handleGraphQLError = (error: ApolloError): AppError => {
  console.error('GraphQL Error:', error);
  
  if (error.networkError) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      details: error.networkError,
      timestamp: new Date(),
    };
  }
  
  if (error.graphQLErrors?.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    const code = graphQLError.extensions?.code || ERROR_CODES.SERVER_ERROR;
    
    return {
      code: code as string,
      message: graphQLError.message || ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR],
      details: graphQLError,
      timestamp: new Date(),
    };
  }
  
  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    details: error,
    timestamp: new Date(),
  };
};

export const handleApiError = (error: any): AppError => {
  console.error('API Error:', error);
  
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        return {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: data?.message || ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
          details: data,
          timestamp: new Date(),
        };
      case 401:
        return {
          code: ERROR_CODES.UNAUTHORIZED,
          message: ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED],
          details: data,
          timestamp: new Date(),
        };
      case 403:
        return {
          code: ERROR_CODES.FORBIDDEN,
          message: ERROR_MESSAGES[ERROR_CODES.FORBIDDEN],
          details: data,
          timestamp: new Date(),
        };
      case 404:
        return {
          code: ERROR_CODES.NOT_FOUND,
          message: ERROR_MESSAGES[ERROR_CODES.NOT_FOUND],
          details: data,
          timestamp: new Date(),
        };
      case 409:
        return {
          code: ERROR_CODES.CONFLICT,
          message: ERROR_MESSAGES[ERROR_CODES.CONFLICT],
          details: data,
          timestamp: new Date(),
        };
      case 429:
        return {
          code: ERROR_CODES.RATE_LIMITED,
          message: ERROR_MESSAGES[ERROR_CODES.RATE_LIMITED],
          details: data,
          timestamp: new Date(),
        };
      default:
        return {
          code: ERROR_CODES.SERVER_ERROR,
          message: data?.message || ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR],
          details: data,
          timestamp: new Date(),
        };
    }
  }
  
  if (error.request) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      details: error.request,
      timestamp: new Date(),
    };
  }
  
  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    details: error,
    timestamp: new Date(),
  };
};

export const showErrorAlert = (error: AppError | string, title: string = 'Error') => {
  const message = typeof error === 'string' ? error : error.message;
  Alert.alert(title, message);
};

export const logError = (error: AppError | Error, context?: string) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
    ...(error instanceof CustomError && {
      code: error.code,
      details: error.details,
    }),
  };
  
  console.error('Error logged:', errorInfo);
  
  // In production, you might want to send this to a crash reporting service
  // crashlytics().recordError(error);
};

export const createErrorBoundary = (fallbackComponent: React.ComponentType<any>) => {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      logError(error, 'React Error Boundary');
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return React.createElement(fallbackComponent, { error: this.state.error });
      }
      
      return this.props.children;
    }
  };
};

// React import for error boundary
import React from 'react';
