// import { useCookie } from 'nuxt/app';
// import type { 
//   PatientOptionCategory, 
//   PatientOptionResponse, 
//   CreatePatientOptionRequest,
//   CreatePatientRequest,
//   CreatePatientResponse,
//   ApiResponse
// } from '~/types/patient';

// // Base API URL
// const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

// /**
//  * Custom fetch function with default options and error handling
//  */
// async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
//   const token = useCookie('auth_token').value;

//   // Don't check token for auth endpoints
//   const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/refresh-token'];
//   const isAuthEndpoint = authEndpoints.some(endpoint => url.includes(endpoint));

//   if (!token && !isAuthEndpoint) {
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
//       console.error(`API Error (${url}):`, error);

//       if (attempt === retries || error.response?.status < 500) {
//         if (error.response?.status === 401 && !isAuthEndpoint) {
//           throw new Error('Session expired. Please log in again.');
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

// export const patientService = {
//   /**
//    * Get patient options by category
//    */
//   async getPatientOptions(category: PatientOptionCategory): Promise<PatientOptionResponse> {
//     return await apiFetch<PatientOptionResponse>(`/patient-options/${category}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Create new patient option
//    */
//   async createPatientOption(
//     category: PatientOptionCategory, 
//     data: CreatePatientOptionRequest
//   ): Promise<ApiResponse<{ value: string }>> {
//     return await apiFetch<ApiResponse<{ value: string }>>(`/patient-options/${category}`, {
//       method: 'POST',
//       body: data,
//     });
//   },

//   /**
//    * Create a new patient
//    */
//   async createPatient(patientData: CreatePatientRequest): Promise<ApiResponse<CreatePatientResponse>> {
//     return await apiFetch<ApiResponse<CreatePatientResponse>>('/patients', {
//       method: 'POST',
//       body: patientData,
//     });
//   },

//   /**
//    * Get all patients with optional filtering
//    */
//   async getPatients(params?: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     branchId?: string;
//     status?: string;
//   }): Promise<ApiResponse<{ patients: any[] }>> {
//     return await apiFetch<ApiResponse<{ patients: any[] }>>('/patients', {
//       method: 'GET',
//       params,
//     });
//   },

//   /**
//    * Get a specific patient by ID
//    */
//   async getPatientById(id: string): Promise<ApiResponse<{ patient: any }>> {
//     return await apiFetch<ApiResponse<{ patient: any }>>(`/patients/${id}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Update an existing patient
//    */
//   async updatePatient(id: string, patientData: Partial<CreatePatientRequest>): Promise<ApiResponse<{ patient: any }>> {
//     return await apiFetch<ApiResponse<{ patient: any }>>(`/patients/${id}`, {
//       method: 'PUT',
//       body: patientData,
//     });
//   },

//   /**
//    * Delete a patient
//    */
//   async deletePatient(id: string): Promise<ApiResponse<null>> {
//     return await apiFetch<ApiResponse<null>>(`/patients/${id}`, {
//       method: 'DELETE',
//     });
//   }
// };

import { useCookie } from 'nuxt/app';
import type {
  PatientOptionCategory,
  PatientOptionResponse,
  CreatePatientOptionRequest,
  CreatePatientRequest,
  CreatePatientResponse,
  ApiResponse
} from '~/types/patient';

// Base API URL
const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

/**
 * Custom fetch function with default options and error handling
 */
async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
  const token = useCookie('auth_token').value;

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

      if (attempt === retries || error.response?.status < 500) {
        if (error.response?.status === 401 && !isAuthEndpoint) {
          throw new Error('Session expired. Please log in again.');
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

export const patientService = {
  /**
   * Get patient options by category
   */
  async getPatientOptions(category: PatientOptionCategory, lang: string = 'th'): Promise<{
    status: string;
    data: {
      category: string;
      values: any[];
    };
  }> {
    return await apiFetch(`/patient-options/${category}`, {
      method: 'GET',
      params: { lang },
    });
  },

  /**
   * Create new patient option
   */
  async createPatientOption(
    category: PatientOptionCategory,
    data: CreatePatientOptionRequest,
    lang: string = 'th'
  ): Promise<{
    status: string;
    data: {
      value: any;
    };
  }> {
    return await apiFetch(`/patient-options/${category}`, {
      method: 'POST',
      body: data,
      params: { lang },
    });
  },

  /**
   * Create a new patient
   */
  async createPatient(patientData: CreatePatientRequest, lang: string = 'th'): Promise<{
    status: string;
    data: {
      patient: any;
    };
  }> {
    return await apiFetch('/patients', {
      method: 'POST',
      body: patientData,
      params: { lang },
    });
  },

  /**
   * Get all patients with optional filtering and language support
   */
  async getPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    branchId?: string;
    status?: string;
    lang?: string;
  }): Promise<{
    status: string;
    results: number;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: {
      patients: any[];
    };
  }> {
    // Prepare query parameters
    const queryParams: Record<string, any> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.branchId) queryParams.branchId = params.branchId;
    if (params?.status) queryParams.status = params.status;
    if (params?.lang) queryParams.lang = params.lang;

    return await apiFetch('/patients', {
      method: 'GET',
      params: queryParams,
    });
  },

  /**
   * Get a specific patient by ID
   */
  async getPatientById(id: string, lang: string = 'th'): Promise<{
    status: string;
    data: {
      patient: any;
    };
  }> {
    return await apiFetch(`/patients/${id}`, {
      method: 'GET',
      params: { lang },
    });
  },

  /**
   * Update an existing patient
   */
  async updatePatient(id: string, patientData: Partial<CreatePatientRequest>, lang: string = 'th'): Promise<{
    status: string;
    data: {
      patient: any;
    };
  }> {
    return await apiFetch(`/patients/${id}`, {
      method: 'PUT',
      body: patientData,
      params: { lang },
    });
  },

  /**
   * Delete a patient
   */
  async deletePatient(id: string): Promise<{
    status: string;
    data: null;
  }> {
    return await apiFetch(`/patients/${id}`, {
      method: 'DELETE',
    });
  }
};