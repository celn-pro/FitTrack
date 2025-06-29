// API-related TypeScript types

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: {
    code?: string;
    [key: string]: any;
  };
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
  extensions?: {
    [key: string]: any;
  };
}

// Mutation response types
export interface MutationResponse {
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface CreateResponse extends MutationResponse {
  id: string;
}

export interface UpdateResponse extends MutationResponse {
  id: string;
}

export interface DeleteResponse extends MutationResponse {
  id: string;
}

// Query variables types
export interface PaginationVariables {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortVariables {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterVariables {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface QueryVariables extends PaginationVariables, SortVariables, FilterVariables {
  [key: string]: any;
}
