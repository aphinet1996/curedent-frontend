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
// import { authenticatedRequest } from '~/utils/api';

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
//     return await authenticatedRequest<AssistantsResponse>('/assistants', {
//       method: 'GET',
//       params,
//     });
//   },

//   /**
//    * Get a specific assistant by ID
//    */
//   async getAssistantById(id: string): Promise<AssistantResponse> {
//     return await authenticatedRequest<AssistantResponse>(`/assistants/${id}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Create a new assistant
//    */
//   async createAssistant(assistantData: FormData): Promise<AssistantResponse> {
//     return await authenticatedRequest<AssistantResponse>('/assistants', {
//       method: 'POST',
//       body: assistantData,
//     });
//   },

//   /**
//    * Update an existing assistant
//    */
//   async updateAssistant(id: string, assistantData: Partial<CreateAssistantRequest>): Promise<AssistantResponse> {
//     return await authenticatedRequest<AssistantResponse>(`/assistants/${id}`, {
//       method: 'PUT',
//       body: assistantData,
//     });
//   },

//   /**
//    * Delete an assistant
//    */
//   async deleteAssistant(id: string): Promise<ApiResponse<null>> {
//     return await authenticatedRequest<ApiResponse<null>>(`/assistants/${id}`, {
//       method: 'DELETE',
//     });
//   },

//   /**
//    * Update assistant status (active/inactive)
//    */
//   async updateAssistantStatus(id: string, isActive: boolean): Promise<AssistantResponse> {
//     return await authenticatedRequest<AssistantResponse>(`/assistants/${id}/status`, {
//       method: 'PATCH',
//       body: { isActive },
//     });
//   },

//   /**
//    * Get assistants by branch
//    */
//   async getAssistantsByBranch(branchId: string): Promise<AssistantsResponse> {
//     return await authenticatedRequest<AssistantsResponse>(`/assistants/branch/${branchId}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Get assistants by employment type
//    */
//   async getAssistantsByEmploymentType(employmentType: string): Promise<AssistantsResponse> {
//     return await authenticatedRequest<AssistantsResponse>(`/assistants/employment-type/${employmentType}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Search assistants
//    */
//   async searchAssistants(query: string): Promise<AssistantsResponse> {
//     return await authenticatedRequest<AssistantsResponse>('/assistants/search', {
//       method: 'GET',
//       params: { q: query },
//     });
//   },

//   /**
//    * Get assistant options for dropdowns/selects
//    */
//   async getAssistantOptions(): Promise<AssistantOption[]> {
//     const response = await authenticatedRequest<AssistantOptionsResponse>('/assistants/option', {
//       method: 'GET',
//     });

//     if (response.status === 'success') {
//       return response.data.assistants || [];
//     }

//     throw new Error('Failed to fetch assistant options');
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
   * แก้ไข: ใช้ UpdateAssistantRequest และรองรับทั้ง FormData และ Object
   */
  async updateAssistant(id: string, assistantData: UpdateAssistantRequest | FormData): Promise<AssistantResponse> {
    // ถ้าเป็น FormData ให้ส่งตรงๆ
    if (assistantData instanceof FormData) {
      return await authenticatedRequest<AssistantResponse>(`/assistants/${id}`, {
        method: 'PUT',
        body: assistantData,
      });
    }

    // ถ้าเป็น Object ให้แปลงเป็น FormData หรือ JSON ตามที่ API ต้องการ
    // ลองส่งเป็น JSON ก่อน
    return await authenticatedRequest<AssistantResponse>(`/assistants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assistantData),
      headers: {
        'Content-Type': 'application/json',
      },
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