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
// const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL;

// /**
//  * Custom fetch function with default options and error handling
//  */
// async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
//   const token = useCookie('auth_token').value;

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
//   async getPatientOptions(category: PatientOptionCategory, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       category: string;
//       values: any[];
//     };
//   }> {
//     return await apiFetch(`/patient-options/${category}`, {
//       method: 'GET',
//       params: { lang },
//     });
//   },

//   /**
//    * Create new patient option
//    */
//   async createPatientOption(
//     category: PatientOptionCategory,
//     data: CreatePatientOptionRequest,
//     lang: string = 'th'
//   ): Promise<{
//     status: string;
//     data: {
//       value: any;
//     };
//   }> {
//     return await apiFetch(`/patient-options/${category}`, {
//       method: 'POST',
//       body: data,
//       params: { lang },
//     });
//   },

//   /**
//    * Create a new patient
//    */
//   async createPatient(patientData: CreatePatientRequest, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       patient: any;
//     };
//   }> {
//     return await apiFetch('/patients', {
//       method: 'POST',
//       body: patientData,
//       params: { lang },
//     });
//   },

//   /**
//    * Get all patients with optional filtering and language support
//    */
//   async getPatients(params?: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     branchId?: string;
//     status?: string;
//     lang?: string;
//   }): Promise<{
//     status: string;
//     results: number;
//     pagination: {
//       total: number;
//       page: number;
//       limit: number;
//       totalPages: number;
//     };
//     data: {
//       patients: any[];
//     };
//   }> {
//     // Prepare query parameters
//     const queryParams: Record<string, any> = {};

//     if (params?.page) queryParams.page = params.page;
//     if (params?.limit) queryParams.limit = params.limit;
//     if (params?.search) queryParams.search = params.search;
//     if (params?.branchId) queryParams.branchId = params.branchId;
//     if (params?.status) queryParams.status = params.status;
//     if (params?.lang) queryParams.lang = params.lang;

//     return await apiFetch('/patients', {
//       method: 'GET',
//       params: queryParams,
//     });
//   },

//   /**
//    * Get a specific patient by ID
//    */
//   async getPatientById(id: string, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       patient: any;
//     };
//   }> {
//     return await apiFetch(`/patients/${id}`, {
//       method: 'GET',
//       params: { lang },
//     });
//   },

//   /**
//    * Update an existing patient
//    */
//   async updatePatient(id: string, patientData: Partial<CreatePatientRequest>, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       patient: any;
//     };
//   }> {
//     return await apiFetch(`/patients/${id}`, {
//       method: 'PUT',
//       body: patientData,
//       params: { lang },
//     });
//   },

//   /**
//    * Delete a patient
//    */
//   async deletePatient(id: string): Promise<{
//     status: string;
//     data: null;
//   }> {
//     return await apiFetch(`/patients/${id}`, {
//       method: 'DELETE',
//     });
//   }
// };

import type {
  PatientOptionCategory,
  CreatePatientOptionRequest,
  CreatePatientRequest,
} from '~/types/patient';
import { authenticatedRequest } from '~/utils/api';

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
    return await authenticatedRequest(`/patient-options/${category}`, {
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
    return await authenticatedRequest(`/patient-options/${category}`, {
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
    return await authenticatedRequest('/patients', {
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

    return await authenticatedRequest('/patients', {
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
    return await authenticatedRequest(`/patients/${id}`, {
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
    return await authenticatedRequest(`/patients/${id}`, {
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
    return await authenticatedRequest(`/patients/${id}`, {
      method: 'DELETE',
    });
  }
};