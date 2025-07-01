// import { useCookie } from 'nuxt/app';
// import type { 
//   Assistant,
//   CreateAssistantRequest,
//   UpdateAssistantRequest,
//   AssistantResponse,
//   AssistantsResponse,
//   AssistantOption,
//   AssistantOptionsResponse,
//   ApiResponse
// } from '~/types/assistant';

// // Base API URL
// const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL;

// /**
//  * Custom fetch function with default options and error handling
//  */
// async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
//   const token = useCookie('auth_token').value;
  
//   if (!token) {
//     throw new Error('Authentication required');
//   }
  
//   const defaultOptions = {
//     headers: {
//       'Authorization': `Bearer ${token}`,
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
  
//   // Remove Content-Type for FormData
//   if (options.body instanceof FormData) {
//     delete mergedOptions.headers['Content-Type'];
//   }
  
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       return await $fetch<T>(`${BASE_URL}${url}`, mergedOptions);
//     } catch (error: any) {
//       console.error(`API Error (${url}):`, error);
      
//       if (attempt === retries || error.response?.status < 500) {
//         if (error.response?.status === 401) {
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

// export const assistantService = {
//   /**
//    * Get all assistants
//    */
//   async getAssistants(params?: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     employmentType?: string;
//     branchId?: string;
//   }): Promise<AssistantsResponse> {
//     return await apiFetch<AssistantsResponse>('/assistants', {
//       method: 'GET',
//       params,
//     });
//   },

//   /**
//    * Get a specific assistant by ID
//    */
//   async getAssistantById(id: string): Promise<AssistantResponse> {
//     return await apiFetch<AssistantResponse>(`/assistants/${id}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Create a new assistant
//    */
//   async createAssistant(assistantData: FormData): Promise<AssistantResponse> {
//     return await apiFetch<AssistantResponse>('/assistants', {
//       method: 'POST',
//       body: assistantData,
//     });
//   },

//   /**
//    * Update an existing assistant
//    */
//   async updateAssistant(id: string, assistantData: Partial<CreateAssistantRequest>): Promise<AssistantResponse> {
//     return await apiFetch<AssistantResponse>(`/assistants/${id}`, {
//       method: 'PUT',
//       body: assistantData,
//     });
//   },

//   /**
//    * Delete an assistant
//    */
//   async deleteAssistant(id: string): Promise<ApiResponse<null>> {
//     return await apiFetch<ApiResponse<null>>(`/assistants/${id}`, {
//       method: 'DELETE',
//     });
//   },

//   /**
//    * Update assistant status (active/inactive)
//    */
//   async updateAssistantStatus(id: string, isActive: boolean): Promise<AssistantResponse> {
//     return await apiFetch<AssistantResponse>(`/assistants/${id}/status`, {
//       method: 'PATCH',
//       body: { isActive },
//     });
//   },

//   /**
//    * Get assistants by branch
//    */
//   async getAssistantsByBranch(branchId: string): Promise<AssistantsResponse> {
//     return await apiFetch<AssistantsResponse>(`/assistants/branch/${branchId}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Get assistants by employment type
//    */
//   async getAssistantsByEmploymentType(employmentType: string): Promise<AssistantsResponse> {
//     return await apiFetch<AssistantsResponse>(`/assistants/employment-type/${employmentType}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Search assistants
//    */
//   async searchAssistants(query: string): Promise<AssistantsResponse> {
//     return await apiFetch<AssistantsResponse>('/assistants/search', {
//       method: 'GET',
//       params: { q: query },
//     });
//   },

//   async getAssistantOptions(): Promise<AssistantOption[]> {
//     try {
//       const response = await apiFetch<AssistantOptionsResponse>('/assistants/option', {
//         method: 'GET',
//       });
      
//       if (response.status === 'success') {
//         return response.data.assistants || [];
//       }
      
//       throw new Error('Failed to fetch assistant options');
//     } catch (error: any) {
//       console.error('Error fetching assistant options:', error);
//       throw error;
//     }
//   }
// };

import type { 
  Assistant,
  CreateAssistantRequest,
  UpdateAssistantRequest,
  AssistantResponse,
  AssistantsResponse,
  AssistantOption,
  AssistantOptionsResponse,
  ApiResponse
} from '~/types/assistant';
import { authenticatedRequest } from '~/utils/api';

export const assistantService = {
  /**
   * Get all assistants
   */
  async getAssistants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    employmentType?: string;
    branchId?: string;
  }): Promise<AssistantsResponse> {
    return await authenticatedRequest<AssistantsResponse>('/assistants', {
      method: 'GET',
      params,
    });
  },

  /**
   * Get a specific assistant by ID
   */
  async getAssistantById(id: string): Promise<AssistantResponse> {
    return await authenticatedRequest<AssistantResponse>(`/assistants/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new assistant
   */
  async createAssistant(assistantData: FormData): Promise<AssistantResponse> {
    return await authenticatedRequest<AssistantResponse>('/assistants', {
      method: 'POST',
      body: assistantData,
    });
  },

  /**
   * Update an existing assistant
   */
  async updateAssistant(id: string, assistantData: Partial<CreateAssistantRequest>): Promise<AssistantResponse> {
    return await authenticatedRequest<AssistantResponse>(`/assistants/${id}`, {
      method: 'PUT',
      body: assistantData,
    });
  },

  /**
   * Delete an assistant
   */
  async deleteAssistant(id: string): Promise<ApiResponse<null>> {
    return await authenticatedRequest<ApiResponse<null>>(`/assistants/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update assistant status (active/inactive)
   */
  async updateAssistantStatus(id: string, isActive: boolean): Promise<AssistantResponse> {
    return await authenticatedRequest<AssistantResponse>(`/assistants/${id}/status`, {
      method: 'PATCH',
      body: { isActive },
    });
  },

  /**
   * Get assistants by branch
   */
  async getAssistantsByBranch(branchId: string): Promise<AssistantsResponse> {
    return await authenticatedRequest<AssistantsResponse>(`/assistants/branch/${branchId}`, {
      method: 'GET',
    });
  },

  /**
   * Get assistants by employment type
   */
  async getAssistantsByEmploymentType(employmentType: string): Promise<AssistantsResponse> {
    return await authenticatedRequest<AssistantsResponse>(`/assistants/employment-type/${employmentType}`, {
      method: 'GET',
    });
  },

  /**
   * Search assistants
   */
  async searchAssistants(query: string): Promise<AssistantsResponse> {
    return await authenticatedRequest<AssistantsResponse>('/assistants/search', {
      method: 'GET',
      params: { q: query },
    });
  },

  /**
   * Get assistant options for dropdowns/selects
   */
  async getAssistantOptions(): Promise<AssistantOption[]> {
    const response = await authenticatedRequest<AssistantOptionsResponse>('/assistants/option', {
      method: 'GET',
    });
    
    if (response.status === 'success') {
      return response.data.assistants || [];
    }
    
    throw new Error('Failed to fetch assistant options');
  }
};