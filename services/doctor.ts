import { useCookie } from 'nuxt/app';
import type { Doctor, DoctorParams, DoctorOption, DoctorOptionsResponse } from '~/types/doctor';

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

  // Define headers with proper typing
  const headers: Record<string, string> = {
    'Authorization': token ? `Bearer ${token}` : '',
  };

  // Don't set Content-Type for FormData - let browser handle it
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const defaultOptions = {
    headers,
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

export const doctorService = {
  async getDoctors(params?: DoctorParams): Promise<ApiResponse<{ doctors: Doctor[] }>> {
    return await apiFetch<ApiResponse<{ doctors: Doctor[] }>>('/doctors', {
      method: 'GET',
      params,
    });
  },

  async getDoctorById(id: string): Promise<ApiResponse<{ doctor: Doctor }>> {
    return await apiFetch<ApiResponse<{ doctor: Doctor }>>(`/doctors/${id}`, {
      method: 'GET',
    });
  },

  async createDoctor(formData: FormData): Promise<ApiResponse<{ doctor: Doctor }>> {
    return await apiFetch<ApiResponse<{ doctor: Doctor }>>('/doctors', {
      method: 'POST',
      body: formData,
    });
  },

  async updateDoctor(id: string, formData: FormData): Promise<ApiResponse<{ doctor: Doctor }>> {
    return await apiFetch<ApiResponse<{ doctor: Doctor }>>(`/doctors/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  async deleteDoctor(id: string): Promise<boolean> {
    try {
      await apiFetch<any>(`/doctors/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  async getDoctorOptions(): Promise<DoctorOption[]> {
    try {
      const response = await apiFetch<DoctorOptionsResponse>('/doctors/option', {
        method: 'GET',
      });

      if (response.status === 'success') {
        return response.data.doctors || [];
      }

      throw new Error('Failed to fetch doctor options');
    } catch (error: any) {
      console.error('Error fetching doctor options:', error);
      throw error;
    }
  }
};