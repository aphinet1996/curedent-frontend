// services/treatment.ts
import { useCookie } from 'nuxt/app';
import type { Treatment, TreatmentParams, CreateTreatmentRequest, UpdateTreatmentRequest } from '~/types/treatment';

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
const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL;

/**
 * Custom fetch function with default options and error handling
 */
async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
  const token = useCookie('auth_token').value;
  if (!token && !url.includes('/login')) {
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
      if (attempt === retries || error.response?.status < 500) {
        console.error(`API Error (${url}):`, error.message);
        if (error.response?.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (error.response?.status === 403) {
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

export const treatmentService = {
  async getTreatments(params?: TreatmentParams): Promise<ApiResponse<{ treatments: Treatment[] }>> {
    return await apiFetch<ApiResponse<{ treatments: Treatment[] }>>('/treatments', {
      method: 'GET',
      params,
    });
  },

  async getTreatmentById(id: string): Promise<ApiResponse<{ treatment: Treatment }>> {
    return await apiFetch<ApiResponse<{ treatment: Treatment }>>(`/treatments/${id}`, {
      method: 'GET',
    });
  },

  async createTreatment(treatmentData: CreateTreatmentRequest): Promise<ApiResponse<{ treatment: Treatment }>> {
    const clinicId = useCookie('clinic_id').value || '';
    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    const requestData = {
      ...treatmentData,
      clinicId
    };

    return await apiFetch<ApiResponse<{ treatment: Treatment }>>('/treatments', {
      method: 'POST',
      body: requestData,
    });
  },

  async updateTreatment(id: string, treatmentData: UpdateTreatmentRequest): Promise<ApiResponse<{ treatment: Treatment }>> {
    const clinicId = useCookie('clinic_id').value || '';
    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    const requestData = {
      ...treatmentData,
      clinicId
    };

    return await apiFetch<ApiResponse<{ treatment: Treatment }>>(`/treatments/${id}`, {
      method: 'PUT',
      body: requestData,
    });
  },

  async deleteTreatment(id: string): Promise<ApiResponse<null>> {
    return await apiFetch<ApiResponse<null>>(`/treatments/${id}`, {
      method: 'DELETE',
    });
  },
};