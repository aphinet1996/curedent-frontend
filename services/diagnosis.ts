// import { useCookie } from 'nuxt/app';
// import type { Diagnosis, DiagnosisParams } from '~/types/diagnosis';

// // Generic API response type
// export interface ApiResponse<T> {
//   status: string;
//   data: T;
//   results?: number;
//   pagination?: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

// // Base API URL
// const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL;

// /**
//  * Custom fetch function with default options and error handling
//  */
// async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
//   const token = useCookie('auth_token').value;
//   if (!token && !url.includes('/login')) {
//     throw new Error('Authentication required');
//   }

//   const defaultOptions = {
//     headers: {
//       'Authorization': token ? `Bearer ${token}` : '',
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include' as const,
//   };

//   const mergedOptions = {
//     ...defaultOptions,
//     ...options,
//     headers: {
//       ...defaultOptions.headers,
//       ...(options.headers || {}),
//     },
//   };

//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       return await $fetch<T>(`${BASE_URL}${url}`, mergedOptions);
//     } catch (error: any) {
//       if (attempt === retries || error.response?.status < 500) {
//         console.error(`API Error (${url}):`, error.message);
//         if (error.response?.status === 401) {
//           throw new Error('Unauthorized: Please log in again');
//         } else if (error.response?.status === 403) {
//           throw new Error('Forbidden: You do not have permission');
//         } else if (error.response?.status === 404) {
//           throw new Error('Resource not found');
//         } else {
//           throw new Error(error.message || 'Failed to fetch data');
//         }
//       }
//       await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
//     }
//   }
//   throw new Error('Max retries reached');
// }

// export const diagnosisService = {
//   async getDiagnoses(params?: DiagnosisParams): Promise<ApiResponse<{ diagnoses: Diagnosis[] }>> {
//     return await apiFetch<ApiResponse<{ diagnoses: Diagnosis[] }>>('/diagnoses', {
//       method: 'GET',
//       params,
//     });
//   },

//   async getDiagnosisById(id: string): Promise<ApiResponse<{ diagnosis: Diagnosis }>> {
//     return await apiFetch<ApiResponse<{ diagnosis: Diagnosis }>>(`/diagnoses/${id}`, {
//       method: 'GET',
//     });
//   },

//   async createDiagnosis(name: string): Promise<ApiResponse<{ diagnosis: Diagnosis }>> {
//     const clinicId = useCookie('clinic_id').value || '';
//     if (!clinicId) {
//       throw new Error('Clinic ID is required');
//     }
//     return await apiFetch<ApiResponse<{ diagnosis: Diagnosis }>>('/diagnoses', {
//       method: 'POST',
//       body: { name, clinicId },
//     });
//   },

//   async updateDiagnosis(id: string, name: string): Promise<ApiResponse<{ diagnosis: Diagnosis }>> {
//     const clinicId = useCookie('clinic_id').value || '';
//     if (!clinicId) {
//       throw new Error('Clinic ID is required');
//     }
//     return await apiFetch<ApiResponse<{ diagnosis: Diagnosis }>>(`/diagnoses/${id}`, {
//       method: 'PUT',
//       body: { name, clinicId },
//     });
//   },

//   async deleteDiagnosis(id: string): Promise<ApiResponse<null>> {
//     return await apiFetch<ApiResponse<null>>(`/diagnoses/${id}`, {
//       method: 'DELETE',
//     });
//   },
// };

import { useCookie } from 'nuxt/app';
import type { Diagnosis, DiagnosisParams } from '~/types/diagnosis';
import { authenticatedRequest, type ApiResponse } from '~/utils/api';

export const diagnosisService = {
  async getDiagnoses(params?: DiagnosisParams): Promise<ApiResponse<{ diagnoses: Diagnosis[] }>> {
    return await authenticatedRequest<ApiResponse<{ diagnoses: Diagnosis[] }>>('/diagnoses', {
      method: 'GET',
      params,
    });
  },

  async getDiagnosisById(id: string): Promise<ApiResponse<{ diagnosis: Diagnosis }>> {
    return await authenticatedRequest<ApiResponse<{ diagnosis: Diagnosis }>>(`/diagnoses/${id}`, {
      method: 'GET',
    });
  },

  async createDiagnosis(name: string): Promise<ApiResponse<{ diagnosis: Diagnosis }>> {
    const clinicId = useCookie('clinic_id').value || '';
    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }
    return await authenticatedRequest<ApiResponse<{ diagnosis: Diagnosis }>>('/diagnoses', {
      method: 'POST',
      body: { name, clinicId },
    });
  },

  async updateDiagnosis(id: string, name: string): Promise<ApiResponse<{ diagnosis: Diagnosis }>> {
    const clinicId = useCookie('clinic_id').value || '';
    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }
    return await authenticatedRequest<ApiResponse<{ diagnosis: Diagnosis }>>(`/diagnoses/${id}`, {
      method: 'PUT',
      body: { name, clinicId },
    });
  },

  async deleteDiagnosis(id: string): Promise<ApiResponse<null>> {
    return await authenticatedRequest<ApiResponse<null>>(`/diagnoses/${id}`, {
      method: 'DELETE',
    });
  },
};