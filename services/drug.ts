// import { useCookie } from 'nuxt/app';
// import type {
//   DrugOptionCategory,
//   DrugOptionResponse,
//   CreateDrugOptionRequest,
//   CreateDrugRequest,
//   CreateDrugResponse,
//   ApiResponse
// } from '~/types/drug';

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

// export const drugService = {
//   /**
//    * Get drug options by category
//    */
//   async getDrugOptions(category: DrugOptionCategory, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       category: string;
//       values: any[];
//     };
//   }> {
//     return await apiFetch(`/drug-options/${category}`, {
//       method: 'GET',
//       params: { lang },
//     });
//   },

//   /**
//    * Create new drug option
//    */
//   async createDrugOption(
//     category: DrugOptionCategory,
//     data: CreateDrugOptionRequest,
//     lang: string = 'th'
//   ): Promise<{
//     status: string;
//     data: {
//       value: any;
//     };
//   }> {
//     return await apiFetch(`/drug-options/${category}`, {
//       method: 'POST',
//       body: data,
//       params: { lang },
//     });
//   },

//   /**
//    * Create a new drug
//    */
//   async createDrug(drugData: CreateDrugRequest, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       drug: any;
//     };
//   }> {
//     return await apiFetch('/drugs', {
//       method: 'POST',
//       body: drugData,
//       params: { lang },
//     });
//   },

//   /**
//    * Get all drugs with optional filtering and language support
//    */
//   async getDrugs(params?: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     branchId?: string;
//     categoryId?: string;
//     subcategoryId?: string;
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
//       drugs: any[];
//     };
//   }> {
//     // Prepare query parameters
//     const queryParams: Record<string, any> = {};

//     if (params?.page) queryParams.page = params.page;
//     if (params?.limit) queryParams.limit = params.limit;
//     if (params?.search) queryParams.search = params.search;
//     if (params?.branchId) queryParams.branchId = params.branchId;
//     if (params?.categoryId) queryParams.categoryId = params.categoryId;
//     if (params?.subcategoryId) queryParams.subcategoryId = params.subcategoryId;
//     if (params?.status) queryParams.status = params.status;
//     if (params?.lang) queryParams.lang = params.lang;

//     return await apiFetch('/drugs', {
//       method: 'GET',
//       params: queryParams,
//     });
//   },

//   /**
//    * Get a specific drug by ID
//    */
//   async getDrugById(id: string, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       drug: any;
//     };
//   }> {
//     return await apiFetch(`/drugs/${id}`, {
//       method: 'GET',
//       params: { lang },
//     });
//   },

//   /**
//    * Update an existing drug
//    */
//   async updateDrug(id: string, drugData: Partial<CreateDrugRequest>, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       drug: any;
//     };
//   }> {
//     return await apiFetch(`/drugs/${id}`, {
//       method: 'PUT',
//       body: drugData,
//       params: { lang },
//     });
//   },

//   /**
//    * Delete a drug
//    */
//   async deleteDrug(id: string): Promise<{
//     status: string;
//     data: null;
//   }> {
//     return await apiFetch(`/drugs/${id}`, {
//       method: 'DELETE',
//     });
//   },

//   /**
//    * Update drug label settings (multilingual data)
//    */
//   async updateDrugLabel(id: string, labelData: any, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       drug: any;
//     };
//   }> {
//     return await apiFetch(`/drugs/${id}/label`, {
//       method: 'PUT',
//       body: labelData,
//       params: { lang },
//     });
//   },

//   /**
//    * Get drug label data for specific language
//    */
//   async getDrugLabel(id: string, lang: string = 'th'): Promise<{
//     status: string;
//     data: {
//       label: any;
//     };
//   }> {
//     return await apiFetch(`/drugs/${id}/label`, {
//       method: 'GET',
//       params: { lang },
//     });
//   }
// };

// services/drug.ts
import type {
  DrugOptionCategory,
  CreateDrugOptionRequest,
  CreateDrugRequest,
} from '~/types/drug';
import { authenticatedRequest } from '~/utils/api';

export const drugService = {
  /**
   * Get drug options by category
   */
  async getDrugOptions(category: DrugOptionCategory, lang: string = 'th'): Promise<{
    status: string;
    data: {
      category: string;
      values: any[];
    };
  }> {
    return await authenticatedRequest(`/drug-options/${category}`, {
      method: 'GET',
      params: { lang },
    });
  },

  /**
   * Create new drug option
   */
  async createDrugOption(
    category: DrugOptionCategory,
    data: CreateDrugOptionRequest,
    lang: string = 'th'
  ): Promise<{
    status: string;
    data: {
      value: any;
    };
  }> {
    return await authenticatedRequest(`/drug-options/${category}`, {
      method: 'POST',
      body: data,
      params: { lang },
    });
  },

  /**
   * Create a new drug
   */
  async createDrug(drugData: CreateDrugRequest, lang: string = 'th'): Promise<{
    status: string;
    data: {
      drug: any;
    };
  }> {
    return await authenticatedRequest('/drugs', {
      method: 'POST',
      body: drugData,
      params: { lang },
    });
  },

  /**
   * Get all drugs with optional filtering and language support
   */
  async getDrugs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    branchId?: string;
    categoryId?: string;
    subcategoryId?: string;
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
      drugs: any[];
    };
  }> {
    // Prepare query parameters
    const queryParams: Record<string, any> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.search = params.search;
    if (params?.branchId) queryParams.branchId = params.branchId;
    if (params?.categoryId) queryParams.categoryId = params.categoryId;
    if (params?.subcategoryId) queryParams.subcategoryId = params.subcategoryId;
    if (params?.status) queryParams.status = params.status;
    if (params?.lang) queryParams.lang = params.lang;

    return await authenticatedRequest('/drugs', {
      method: 'GET',
      params: queryParams,
    });
  },

  /**
   * Get a specific drug by ID
   */
  async getDrugById(id: string, lang: string = 'th'): Promise<{
    status: string;
    data: {
      drug: any;
    };
  }> {
    return await authenticatedRequest(`/drugs/${id}`, {
      method: 'GET',
      params: { lang },
    });
  },

  /**
   * Update an existing drug
   */
  async updateDrug(id: string, drugData: Partial<CreateDrugRequest>, lang: string = 'th'): Promise<{
    status: string;
    data: {
      drug: any;
    };
  }> {
    return await authenticatedRequest(`/drugs/${id}`, {
      method: 'PUT',
      body: drugData,
      params: { lang },
    });
  },

  /**
   * Delete a drug
   */
  async deleteDrug(id: string): Promise<{
    status: string;
    data: null;
  }> {
    return await authenticatedRequest(`/drugs/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update drug label settings (multilingual data)
   */
  async updateDrugLabel(id: string, labelData: any, lang: string = 'th'): Promise<{
    status: string;
    data: {
      drug: any;
    };
  }> {
    return await authenticatedRequest(`/drugs/${id}/label`, {
      method: 'PUT',
      body: labelData,
      params: { lang },
    });
  },

  /**
   * Get drug label data for specific language
   */
  async getDrugLabel(id: string, lang: string = 'th'): Promise<{
    status: string;
    data: {
      label: any;
    };
  }> {
    return await authenticatedRequest(`/drugs/${id}/label`, {
      method: 'GET',
      params: { lang },
    });
  }
};