// import type {
//   DrugOptionCategory,
//   CreateDrugOptionRequest,
//   CreateDrugRequest,
// } from '~/types/drug';
// import { authenticatedRequest } from '~/utils/api';

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
//     return await authenticatedRequest(`/drug-options/${category}`, {
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
//     return await authenticatedRequest(`/drug-options/${category}`, {
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
//     return await authenticatedRequest('/drugs', {
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

//     return await authenticatedRequest('/drugs', {
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
//     return await authenticatedRequest(`/drugs/${id}`, {
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
//     return await authenticatedRequest(`/drugs/${id}`, {
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
//     return await authenticatedRequest(`/drugs/${id}`, {
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
//     return await authenticatedRequest(`/drugs/${id}/label`, {
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
//     return await authenticatedRequest(`/drugs/${id}/label`, {
//       method: 'GET',
//       params: { lang },
//     });
//   }
// };

import type {
  DrugOptionCategory,
  CreateDrugOptionRequest,
  CreateDrugRequest,
  ApiDrug,
  DrugSearchParams,
  Pagination,
  normalizeDrug
} from '~/types/drug';
import { authenticatedRequest } from '~/utils/api';

export const drugService = {
  /**
   * Get drug options by category
   */
  async getDrugOptions(category: DrugOptionCategory, branchId?: string): Promise<{
    status: string;
    data: {
      category: string;
      values: any[];
    };
  }> {
    const params: Record<string, any> = {};
    if (branchId) params.branchId = branchId;

    return await authenticatedRequest(`/drug-options/${category}`, {
      method: 'GET',
      params,
    });
  },

  /**
   * Get all dropdown options for drugs
   */
  async getAllDropdownOptions(branchId?: string): Promise<{
    status: string;
    data: {
      options: {
        drugCategories: any[];
        drugSubcategories: any[];
        units: any[];
        dosageMethods: any[];
        dosageTimes: any[];
      };
    };
  }> {
    const params: Record<string, any> = {};
    if (branchId) params.branchId = branchId;

    return await authenticatedRequest('/drug-options', {
      method: 'GET',
      params,
    });
  },

  /**
   * Create new drug option
   */
  async createDrugOption(
    category: DrugOptionCategory,
    data: CreateDrugOptionRequest,
    branchId?: string
  ): Promise<{
    status: string;
    data: {
      option: any;
    };
  }> {
    const body: any = { ...data };
    if (branchId) body.branchId = branchId;

    return await authenticatedRequest(`/drug-options/${category}`, {
      method: 'POST',
      body,
    });
  },

  /**
   * Create a new drug
   */
  async createDrug(drugData: CreateDrugRequest): Promise<{
    status: string;
    data: {
      drug: ApiDrug;
    };
  }> {
    return await authenticatedRequest('/drugs', {
      method: 'POST',
      body: drugData,
    });
  },

  /**
   * Get all drugs with optional filtering
   */
  async getDrugs(params?: DrugSearchParams): Promise<{
    status: string;
    results: number;
    pagination: Pagination;
    data: {
      drugs: ApiDrug[];
    };
  }> {
    // Prepare query parameters
    const queryParams: Record<string, any> = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.q) queryParams.q = params.q;
    if (params?.branchId) queryParams.branchId = params.branchId;
    if (params?.category) queryParams.category = params.category;
    if (params?.subcategory) queryParams.subcategory = params.subcategory;
    if (params?.drugName) queryParams.drugName = params.drugName;
    if (params?.drugCode) queryParams.drugCode = params.drugCode;
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive;
    if (params?.isArchived !== undefined) queryParams.isArchived = params.isArchived;
    if (params?.minPrice) queryParams.minPrice = params.minPrice;
    if (params?.maxPrice) queryParams.maxPrice = params.maxPrice;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

    return await authenticatedRequest('/drugs', {
      method: 'GET',
      params: queryParams,
    });
  },

  /**
   * Search drugs
   */
  async searchDrugs(searchTerm: string, params?: Omit<DrugSearchParams, 'q'>): Promise<{
    status: string;
    results: number;
    pagination: Pagination;
    data: {
      drugs: ApiDrug[];
      searchTerm: string;
    };
  }> {
    const queryParams: Record<string, any> = { q: searchTerm };

    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.branchId) queryParams.branchId = params.branchId;
    if (params?.category) queryParams.category = params.category;

    return await authenticatedRequest('/drugs/search', {
      method: 'GET',
      params: queryParams,
    });
  },

  /**
   * Get a specific drug by ID
   */
  async getDrugById(id: string): Promise<{
    status: string;
    data: {
      drug: ApiDrug;
    };
  }> {
    return await authenticatedRequest(`/drugs/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Get a specific drug by code
   */
  async getDrugByCode(drugCode: string, branchId?: string): Promise<{
    status: string;
    data: {
      drug: ApiDrug;
    };
  }> {
    const params: Record<string, any> = {};
    if (branchId) params.branchId = branchId;

    return await authenticatedRequest(`/drugs/code/${drugCode}`, {
      method: 'GET',
      params,
    });
  },

  /**
   * Update an existing drug
   */
  async updateDrug(id: string, drugData: Partial<CreateDrugRequest>): Promise<{
    status: string;
    data: {
      drug: ApiDrug;
    };
  }> {
    return await authenticatedRequest(`/drugs/${id}`, {
      method: 'PUT',
      body: drugData,
    });
  },

  /**
   * Delete a drug (soft delete)
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
   * Toggle archive status
   */
  async toggleArchiveStatus(id: string, isArchived: boolean): Promise<{
    status: string;
    data: {
      drug: ApiDrug;
    };
  }> {
    return await authenticatedRequest(`/drugs/${id}/archive`, {
      method: 'PATCH',
      body: { isArchived },
    });
  },

  /**
   * Set drug label config (multilingual)
   */
  async setDrugLabelConfig(id: string, config: any): Promise<{
    status: string;
    data: {
      drug: ApiDrug;
    };
  }> {
    return await authenticatedRequest(`/drugs/${id}/label-config`, {
      method: 'PUT',
      body: config,
    });
  },

  /**
   * Get drugs by category
   */
  async getDrugsByCategory(category: string, subcategory?: string, branchId?: string): Promise<{
    status: string;
    results: number;
    data: {
      category: string;
      subcategory?: string;
      drugs: ApiDrug[];
    };
  }> {
    const params: Record<string, any> = {};
    if (subcategory) params.subcategory = subcategory;
    if (branchId) params.branchId = branchId;

    return await authenticatedRequest(`/drugs/category/${category}`, {
      method: 'GET',
      params,
    });
  },

  /**
   * Generate drug code
   */
  async generateDrugCode(prefix?: string): Promise<{
    status: string;
    data: {
      drugCode: string;
    };
  }> {
    const params: Record<string, any> = {};
    if (prefix) params.prefix = prefix;

    return await authenticatedRequest('/drugs/generate-code', {
      method: 'GET',
      params,
    });
  },

  /**
   * Export drugs
   */
  async exportDrugs(params?: {
    format?: 'csv' | 'excel' | 'json';
    includeMultilingual?: boolean;
    branchId?: string;
    category?: string;
    subcategory?: string;
    isActive?: boolean;
    isArchived?: boolean;
  }): Promise<{
    status: string;
    data: any;
    message?: string;
  }> {
    const queryParams: Record<string, any> = {};
    
    if (params?.format) queryParams.format = params.format;
    if (params?.includeMultilingual) queryParams.includeMultilingual = params.includeMultilingual;
    if (params?.branchId) queryParams.branchId = params.branchId;
    if (params?.category) queryParams.category = params.category;
    if (params?.subcategory) queryParams.subcategory = params.subcategory;
    if (params?.isActive !== undefined) queryParams.isActive = params.isActive;
    if (params?.isArchived !== undefined) queryParams.isArchived = params.isArchived;

    return await authenticatedRequest('/drugs/export', {
      method: 'GET',
      params: queryParams,
    });
  },

  /**
   * Bulk operations
   */
  async bulkOperations(operations: any[]): Promise<{
    status: string;
    data: {
      success: number;
      failed: number;
      errors: Array<{ operation: any; error: string }>;
    };
  }> {
    return await authenticatedRequest('/drugs/bulk', {
      method: 'POST',
      body: { operations },
    });
  }
};