// services/branch.ts
import { useCookie } from 'nuxt/app';
import type { Branch, BranchParams, CreateBranchRequest, UpdateBranchRequest } from '~/types/branch';

// Generic API response type
export interface ApiResponse<T> {
  status: string;
  data: T;
  results?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Base API URL
const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

/**
 * Custom fetch function with default options and error handling
 */
async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
  const token = useCookie('auth_token').value;
  
  // Don't check token for auth endpoints
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/refresh-token'];
  const isAuthEndpoint = authEndpoints.some(endpoint => url.includes(endpoint));
  
  if (!token && !isAuthEndpoint) {
    throw new Error('Authentication required');
  }
  
  const defaultOptions = {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as const,
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await $fetch<T>(`${BASE_URL}${url}`, mergedOptions);
    } catch (error: any) {
      console.error(`API Error (${url}):`, error);
      
      // Handle 401 errors specifically
      if (error.response?.status === 401 && !isAuthEndpoint) {
        // Try to refresh token
        const authStore = useAuthStore();
        const refreshSuccess = await authStore.refreshAuthToken();
        
        if (refreshSuccess && attempt === 1) {
          // Retry the original request with new token
          const newToken = useCookie('auth_token').value;
          mergedOptions.headers.Authorization = `Bearer ${newToken}`;
          continue;
        } else {
          // Refresh failed or this is a retry, redirect to login
          authStore.handleAuthExpired();
          throw new Error('Session expired. Please log in again.');
        }
      }
      
      if (attempt === retries || error.response?.status < 500) {
        if (error.response?.status === 403) {
          throw new Error('Forbidden: You do not have permission');
        } else if (error.response?.status === 404) {
          throw new Error('Resource not found');
        } else {
          throw new Error(error.message || 'Failed to fetch data');
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error('Max retries reached');
}

export const branchService = {
  /**
   * Get all branches with optional pagination and filtering
   */
  async getBranches(params?: BranchParams): Promise<ApiResponse<{ branches: Branch[] }>> {
    return await apiFetch<ApiResponse<{ branches: Branch[] }>>('/branches', {
      method: 'GET',
      params,
    });
  },
  
  /**
   * Get a specific branch by ID
   */
  async getBranchById(id: string): Promise<ApiResponse<{ branch: Branch }>> {
    return await apiFetch<ApiResponse<{ branch: Branch }>>(`/branches/${id}`, {
      method: 'GET',
    });
  },
  
  /**
   * Create a new branch
   */
  async createBranch(branchData: CreateBranchRequest): Promise<ApiResponse<{ branch: Branch }>> {
    const clinicId = useCookie('clinic_id').value || '';
    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    const requestData = {
      ...branchData,
      clinicId
    };

    return await apiFetch<ApiResponse<{ branch: Branch }>>('/branches', {
      method: 'POST',
      body: requestData,
    });
  },
  
  /**
   * Update an existing branch
   */
  async updateBranch(id: string, branchData: UpdateBranchRequest): Promise<ApiResponse<{ branch: Branch }>> {
    const clinicId = useCookie('clinic_id').value || '';
    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    const requestData = {
      ...branchData,
      clinicId
    };

    return await apiFetch<ApiResponse<{ branch: Branch }>>(`/branches/${id}`, {
      method: 'PUT',
      body: requestData,
    });
  },
  
  /**
   * Delete a branch
   */
  async deleteBranch(id: string): Promise<ApiResponse<null>> {
    return await apiFetch<ApiResponse<null>>(`/branches/${id}`, {
      method: 'DELETE',
    });
  }
};