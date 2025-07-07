// import { ref, computed } from 'vue';
// import { defineStore } from 'pinia';
// import { drugService } from '~/services/drug';
// import type { 
//   ApiDrug,
//   CreateDrugRequest, 
//   UpdateDrugRequest,
//   DrugOptions, 
//   DrugOptionCategory,
//   Pagination,
//   MultilingualOption,
//   Language,
//   OptionSelection,
//   DrugSearchParams,
//   DrugStatistics,
//   DrugLabelFormData,
//   DrugFormData,
//   ApiDrugListResponse,
//   ApiSingleDrugResponse,
//   DrugDropdownOptionsResponse,
//   convertLegacyDrug
// } from '~/types/drug';

// export const useDrugStore = defineStore('drug', () => {
//   // State
//   const drugs = ref<ApiDrug[]>([]);
//   const currentDrug = ref<ApiDrug | null>(null);
//   const options = ref<DrugOptions>({
//     categories: [],
//     subcategories: [],
//     units: [],
//     instructions: [],
//     timings: []
//   });
  
//   const isLoading = ref(false);
//   const isLoadingOptions = ref(false);
//   const error = ref<string | null>(null);
//   const pagination = ref<Pagination>({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 0
//   });

//   // Current language
//   const currentLanguage = ref<Language>('th');

//   // Statistics
//   const statistics = ref<DrugStatistics>({
//     totalDrugs: 0,
//     activeDrugs: 0,
//     inactiveDrugs: 0,
//     categoriesCount: 0,
//     avgPrice: 0,
//     totalValue: 0
//   });

//   // Helper functions
//   function getDisplayValue(option: MultilingualOption, lang: Language = currentLanguage.value): string {
//     if (!option) return '';
//     return option[lang] || option.th || option.en || '';
//   }

//   function findOptionByDisplayValue(options: MultilingualOption[], displayValue: string): MultilingualOption | null {
//     if (!options || !Array.isArray(options)) return null;
//     return options.find(option => 
//       getDisplayValue(option) === displayValue ||
//       option.th === displayValue ||
//       option.en === displayValue
//     ) || null;
//   }

//   // Actions
//   async function fetchDrugs(params?: DrugSearchParams) {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.getDrugs(params);
      
//       if (response.status === 'success') {
//         drugs.value = response.data.drugs || [];
        
//         // Update pagination if available
//         if (response.pagination) {
//           pagination.value = response.pagination;
//         }

//         // Update statistics
//         updateStatistics();
//       }
      
//       return drugs.value;
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to fetch drugs';
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return [];
//     } finally {
//       isLoading.value = false;
//     }
//   }
  
//   async function fetchDrugById(id: string): Promise<ApiDrug | null> {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.getDrugById(id);
      
//       if (response.status === 'success') {
//         currentDrug.value = response.data.drug;
//         return currentDrug.value;
//       }
      
//       throw new Error('Failed to fetch drug');
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to fetch drug with ID ${id}`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function fetchDrugByCode(drugCode: string, branchId?: string): Promise<ApiDrug | null> {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.getDrugByCode(drugCode, branchId);
      
//       if (response.status === 'success') {
//         return response.data.drug;
//       }
      
//       throw new Error('Failed to fetch drug by code');
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to fetch drug with code ${drugCode}`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function searchDrugs(searchTerm: string, params?: Omit<DrugSearchParams, 'q'>): Promise<ApiDrug[]> {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.searchDrugs(searchTerm, params);
      
//       if (response.status === 'success') {
//         const searchResults = response.data.drugs || [];
        
//         // Update pagination if available
//         if (response.pagination) {
//           pagination.value = response.pagination;
//         }

//         return searchResults;
//       }
      
//       throw new Error('Failed to search drugs');
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to search drugs';
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return [];
//     } finally {
//       isLoading.value = false;
//     }
//   }
  
//   async function createDrug(drugData: CreateDrugRequest): Promise<ApiDrug | null> {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.createDrug(drugData);
      
//       if (response.status === 'success') {
//         const newDrug: ApiDrug = response.data.drug;
        
//         // Add to local state
//         drugs.value.unshift(newDrug);
        
//         // Update statistics
//         updateStatistics();
        
//         return newDrug;
//       }
      
//       throw new Error('Failed to create drug');
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to create drug';
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }
  
//   async function updateDrug(id: string, drugData: UpdateDrugRequest): Promise<ApiDrug | null> {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.updateDrug(id, drugData);
      
//       if (response.status === 'success') {
//         const updatedDrug: ApiDrug = response.data.drug;
        
//         // Update in local state
//         const index = drugs.value.findIndex(drug => drug.id === id);
//         if (index !== -1) {
//           drugs.value[index] = updatedDrug;
//         }
        
//         if (currentDrug.value && currentDrug.value.id === id) {
//           currentDrug.value = updatedDrug;
//         }

//         // Update statistics
//         updateStatistics();
        
//         return updatedDrug;
//       }
      
//       throw new Error('Failed to update drug');
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to update drug with ID ${id}`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }
  
//   async function deleteDrug(id: string) {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.deleteDrug(id);
      
//       if (response.status === 'success') {
//         // Remove from local state
//         drugs.value = drugs.value.filter(drug => drug.id !== id);
        
//         if (currentDrug.value && currentDrug.value.id === id) {
//           currentDrug.value = null;
//         }

//         // Update statistics
//         updateStatistics();
        
//         return true;
//       }
      
//       throw new Error('Failed to delete drug');
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to delete drug with ID ${id}`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return false;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function toggleArchiveStatus(id: string, isArchived: boolean): Promise<ApiDrug | null> {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.toggleArchiveStatus(id, isArchived);
      
//       if (response.status === 'success') {
//         const updatedDrug: ApiDrug = response.data.drug;
        
//         // Update in local state
//         const index = drugs.value.findIndex(drug => drug.id === id);
//         if (index !== -1) {
//           drugs.value[index] = updatedDrug;
//         }
        
//         if (currentDrug.value && currentDrug.value.id === id) {
//           currentDrug.value = updatedDrug;
//         }

//         // Update statistics
//         updateStatistics();
        
//         return updatedDrug;
//       }
      
//       throw new Error('Failed to toggle archive status');
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to toggle archive status for drug ${id}`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   // Drug label management
//   async function setDrugLabelConfig(id: string, config: any): Promise<ApiDrug | null> {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.setDrugLabelConfig(id, config);
      
//       if (response.status === 'success') {
//         const updatedDrug: ApiDrug = response.data.drug;
        
//         // Update in local state
//         const index = drugs.value.findIndex(drug => drug.id === id);
//         if (index !== -1) {
//           drugs.value[index] = updatedDrug;
//         }
        
//         if (currentDrug.value && currentDrug.value.id === id) {
//           currentDrug.value = updatedDrug;
//         }
        
//         return updatedDrug;
//       }
      
//       throw new Error('Failed to set drug label config');
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to set drug label config for drug ${id}`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   // Drug Options Actions
//   async function fetchDrugOptions(category: DrugOptionCategory, branchId?: string) {
//     isLoadingOptions.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.getDrugOptions(category, branchId);
      
//       if (response.status === 'success') {
//         // Update the specific category in options
//         switch (category) {
//           case 'drugCategory':
//             options.value.categories = response.data.values;
//             break;
//           case 'drugSubcategory':
//             options.value.subcategories = response.data.values;
//             break;
//           case 'unit':
//             options.value.units = response.data.values;
//             break;
//           case 'dosageMethod':
//             options.value.instructions = response.data.values;
//             break;
//           case 'dosageTime':
//             options.value.timings = response.data.values;
//             break;
//         }
        
//         return response.data.values;
//       }
      
//       throw new Error(`Failed to fetch ${category} options`);
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to fetch ${category} options`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return [];
//     } finally {
//       isLoadingOptions.value = false;
//     }
//   }

//   async function fetchAllDrugOptions(branchId?: string) {
//     isLoadingOptions.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.getAllDropdownOptions(branchId);
      
//       if (response.status === 'success') {
//         const data = response.data.options;
        
//         // Update all options
//         options.value = {
//           categories: data.drugCategories || [],
//           subcategories: data.drugSubcategories || [],
//           units: data.units || [],
//           instructions: data.dosageMethods || [],
//           timings: data.dosageTimes || []
//         };
        
//         return options.value;
//       }
      
//       throw new Error('Failed to fetch all drug options');
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to fetch drug options';
//       error.value = errorMsg;
//       console.error(errorMsg);
      
//       // Fallback: try individual fetches
//       try {
//         const categories: DrugOptionCategory[] = [
//           'drugCategory', 'drugSubcategory', 'unit', 'dosageMethod', 'dosageTime'
//         ];
        
//         const promises = categories.map(async (category) => {
//           try {
//             const response = await drugService.getDrugOptions(category, branchId);
//             return { category, values: response.data.values };
//           } catch (error) {
//             console.error(`Error fetching ${category}:`, error);
//             return { category, values: [] };
//           }
//         });
        
//         const results = await Promise.all(promises);
        
//         // Update all options
//         results.forEach(({ category, values }) => {
//           switch (category) {
//             case 'drugCategory':
//               options.value.categories = values;
//               break;
//             case 'drugSubcategory':
//               options.value.subcategories = values;
//               break;
//             case 'unit':
//               options.value.units = values;
//               break;
//             case 'dosageMethod':
//               options.value.instructions = values;
//               break;
//             case 'dosageTime':
//               options.value.timings = values;
//               break;
//           }
//         });
        
//         return options.value;
//       } catch (fallbackError) {
//         console.error('Fallback fetch also failed:', fallbackError);
//         return options.value;
//       }
//     } finally {
//       isLoadingOptions.value = false;
//     }
//   }

//   async function createDrugOption(category: DrugOptionCategory, value: MultilingualOption | string, branchId?: string) {
//     isLoadingOptions.value = true;
//     error.value = null;
    
//     try {
//       // Format the value correctly
//       let optionValue: any;
//       if (typeof value === 'string') {
//         // Parse "thai/english" format or just use as Thai
//         const parts = value.split('/');
//         optionValue = {
//           th: parts[0].trim(),
//           en: parts[1]?.trim()
//         };
//       } else {
//         optionValue = value;
//       }

//       const response = await drugService.createDrugOption(
//         category, 
//         { value: optionValue }, 
//         branchId
//       );
      
//       if (response.status === 'success') {
//         // Refresh the specific category options
//         await fetchDrugOptions(category, branchId);
//         return response.data.option;
//       }
      
//       throw new Error(`Failed to create ${category} option`);
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to create ${category} option`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoadingOptions.value = false;
//     }
//   }

//   // Generate drug code
//   async function generateDrugCode(prefix?: string): Promise<string | null> {
//     try {
//       const response = await drugService.generateDrugCode(prefix);
      
//       if (response.status === 'success') {
//         return response.data.drugCode;
//       }
      
//       throw new Error('Failed to generate drug code');
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to generate drug code';
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     }
//   }

//   // Get drugs by category
//   async function getDrugsByCategory(category: string, subcategory?: string, branchId?: string): Promise<ApiDrug[]> {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await drugService.getDrugsByCategory(category, subcategory, branchId);
      
//       if (response.status === 'success') {
//         return response.data.drugs || [];
//       }
      
//       throw new Error('Failed to get drugs by category');
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to get drugs by category';
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return [];
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   // Statistics calculation
//   function updateStatistics() {
//     statistics.value.totalDrugs = drugs.value.length;
//     statistics.value.activeDrugs = drugs.value.filter(drug => drug.isActive).length;
//     statistics.value.inactiveDrugs = drugs.value.filter(drug => !drug.isActive).length;
    
//     // Get unique categories
//     const uniqueCategories = new Set(drugs.value.map(drug => drug.category));
//     statistics.value.categoriesCount = uniqueCategories.size;
    
//     // Calculate average price
//     const totalPrice = drugs.value.reduce((sum, drug) => sum + (drug.sellingPrice || 0), 0);
//     statistics.value.avgPrice = drugs.value.length > 0 ? totalPrice / drugs.value.length : 0;
//     statistics.value.totalValue = totalPrice;
//   }

//   // Utility functions
//   function getDrugsByBranch(branchId: string) {
//     return drugs.value.filter(drug => drug.branchId === branchId);
//   }

//   function clearError() {
//     error.value = null;
//   }

//   function clearCurrentDrug() {
//     currentDrug.value = null;
//   }

//   // Display options computed properties
//   const getDisplayOptions = computed(() => ({
//     categories: options.value.categories.map(option => ({
//       value: getDisplayValue(option),
//       data: option
//     })),
//     subcategories: options.value.subcategories.map(option => ({
//       value: getDisplayValue(option),
//       data: option
//     })),
//     units: options.value.units.map(option => ({
//       value: getDisplayValue(option),
//       data: option
//     })),
//     instructions: options.value.instructions.map(option => ({
//       value: getDisplayValue(option),
//       data: option
//     })),
//     timings: options.value.timings.map(option => ({
//       value: getDisplayValue(option),
//       data: option
//     }))
//   }));

//   // Getters
//   const getDrugs = computed(() => drugs.value);
//   const getCurrentDrug = computed(() => currentDrug.value);
//   const getDrugOptions = computed(() => options.value);
//   const getDrugById = computed(() => (id: string) => drugs.value.find(drug => drug.id === id));
//   const getActiveDrugs = computed(() => drugs.value.filter(drug => drug.isActive));
//   const getLoading = computed(() => isLoading.value);
//   const getLoadingOptions = computed(() => isLoadingOptions.value);
//   const getError = computed(() => error.value);
//   const getPagination = computed(() => pagination.value);
//   const getTotalDrugs = computed(() => drugs.value.length);
//   const getStatistics = computed(() => statistics.value);

//   return {
//     // State
//     drugs,
//     currentDrug,
//     options,
//     isLoading,
//     isLoadingOptions,
//     error,
//     pagination,
//     currentLanguage,
//     statistics,
    
//     // Actions
//     fetchDrugs,
//     fetchDrugById,
//     fetchDrugByCode,
//     searchDrugs,
//     createDrug,
//     updateDrug,
//     deleteDrug,
//     toggleArchiveStatus,
//     setDrugLabelConfig,
//     fetchDrugOptions,
//     fetchAllDrugOptions,
//     createDrugOption,
//     generateDrugCode,
//     getDrugsByCategory,
//     getDrugsByBranch,
//     clearError,
//     clearCurrentDrug,
//     updateStatistics,
    
//     // Helper functions
//     getDisplayValue,
//     findOptionByDisplayValue,
    
//     // Getters
//     getDrugs,
//     getCurrentDrug,
//     getDrugOptions,
//     getDrugById,
//     getActiveDrugs,
//     getLoading,
//     getLoadingOptions,
//     getError,
//     getPagination,
//     getTotalDrugs,
//     getStatistics,
//     getDisplayOptions
//   };
// });

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { drugService } from '~/services/drug';
import type { 
  ApiDrug,
  CreateDrugRequest, 
  UpdateDrugRequest,
  DrugOptions, 
  DrugOptionCategory,
  Pagination,
  MultilingualOption,
  Language,
  OptionSelection,
  DrugSearchParams,
  DrugStatistics,
  DrugLabelFormData,
  DrugFormData,
  ApiDrugListResponse,
  ApiSingleDrugResponse,
  DrugDropdownOptionsResponse
} from '~/types/drug';
import { 
  convertLegacyDrug,
  getDrugId
} from '~/types/drug';

export const useDrugStore = defineStore('drug', () => {
  // State
  const drugs = ref<ApiDrug[]>([]);
  const currentDrug = ref<ApiDrug | null>(null);
  const options = ref<DrugOptions>({
    categories: [],
    subcategories: [],
    units: [],
    instructions: [],
    timings: []
  });
  
  const isLoading = ref(false);
  const isLoadingOptions = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Current language
  const currentLanguage = ref<Language>('th');

  // Statistics
  const statistics = ref<DrugStatistics>({
    totalDrugs: 0,
    activeDrugs: 0,
    inactiveDrugs: 0,
    categoriesCount: 0,
    avgPrice: 0,
    totalValue: 0
  });

  // Helper functions
  function getDisplayValue(option: MultilingualOption, lang: Language = currentLanguage.value): string {
    if (!option) return '';
    return option[lang] || option.th || option.en || '';
  }

  function findOptionByDisplayValue(options: MultilingualOption[], displayValue: string): MultilingualOption | null {
    if (!options || !Array.isArray(options)) return null;
    return options.find(option => 
      getDisplayValue(option) === displayValue ||
      option.th === displayValue ||
      option.en === displayValue
    ) || null;
  }

  // Actions
  async function fetchDrugs(params?: DrugSearchParams) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getDrugs(params);
      
      if (response.status === 'success') {
        // Data is already normalized by service
        drugs.value = response.data.drugs || [];
        
        // Update pagination if available
        if (response.pagination) {
          pagination.value = response.pagination;
        }

        // Update statistics
        updateStatistics();
      }
      
      return drugs.value;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch drugs';
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoading.value = false;
    }
  }
  
  async function fetchDrugById(id: string): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getDrugById(id);
      
      if (response.status === 'success') {
        currentDrug.value = response.data.drug;
        return currentDrug.value;
      }
      
      throw new Error('Failed to fetch drug');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch drug with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchDrugByCode(drugCode: string, branchId?: string): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getDrugByCode(drugCode, branchId);
      
      if (response.status === 'success') {
        return response.data.drug;
      }
      
      throw new Error('Failed to fetch drug by code');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch drug with code ${drugCode}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function searchDrugs(searchTerm: string, params?: Omit<DrugSearchParams, 'q'>): Promise<ApiDrug[]> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.searchDrugs(searchTerm, params);
      
      if (response.status === 'success') {
        const searchResults = response.data.drugs || [];
        
        // Update pagination if available
        if (response.pagination) {
          pagination.value = response.pagination;
        }

        return searchResults;
      }
      
      throw new Error('Failed to search drugs');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to search drugs';
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoading.value = false;
    }
  }
  
  async function createDrug(drugData: CreateDrugRequest): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.createDrug(drugData);
      
      if (response.status === 'success') {
        const newDrug = response.data.drug;
        
        // Add to local state
        drugs.value.unshift(newDrug);
        
        // Update statistics
        updateStatistics();
        
        return newDrug;
      }
      
      throw new Error('Failed to create drug');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create drug';
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updateDrug(id: string, drugData: UpdateDrugRequest): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.updateDrug(id, drugData);
      
      if (response.status === 'success') {
        const updatedDrug = response.data.drug;
        
        // Update in local state
        const index = drugs.value.findIndex(drug => getDrugId(drug) === id);
        if (index !== -1) {
          drugs.value[index] = updatedDrug;
        }
        
        if (currentDrug.value && getDrugId(currentDrug.value) === id) {
          currentDrug.value = updatedDrug;
        }

        // Update statistics
        updateStatistics();
        
        return updatedDrug;
      }
      
      throw new Error('Failed to update drug');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update drug with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function deleteDrug(drugId: string) {
    isLoading.value = true;
    error.value = null;
    
    if (!drugId) {
      throw new Error('Drug ID is required');
    }
    
    try {
      const response = await drugService.deleteDrug(drugId);
      
      if (response.status === 'success') {
        // Remove from local state using both id and _id for comparison
        drugs.value = drugs.value.filter(drug => {
          const currentDrugId = getDrugId(drug);
          return currentDrugId !== drugId;
        });
        
        if (currentDrug.value) {
          const currentDrugId = getDrugId(currentDrug.value);
          if (currentDrugId === drugId) {
            currentDrug.value = null;
          }
        }

        // Update statistics
        updateStatistics();
        
        return true;
      }
      
      throw new Error('Failed to delete drug');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete drug with ID ${drugId}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function toggleArchiveStatus(id: string, isArchived: boolean): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.toggleArchiveStatus(id, isArchived);
      
      if (response.status === 'success') {
        const updatedDrug = response.data.drug;
        
        // Update in local state
        const index = drugs.value.findIndex(drug => getDrugId(drug) === id);
        if (index !== -1) {
          drugs.value[index] = updatedDrug;
        }
        
        if (currentDrug.value && getDrugId(currentDrug.value) === id) {
          currentDrug.value = updatedDrug;
        }

        // Update statistics
        updateStatistics();
        
        return updatedDrug;
      }
      
      throw new Error('Failed to toggle archive status');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to toggle archive status for drug ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Drug label management
  async function setDrugLabelConfig(id: string, config: any): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.setDrugLabelConfig(id, config);
      
      if (response.status === 'success') {
        const updatedDrug = response.data.drug;
        
        // Update in local state
        const index = drugs.value.findIndex(drug => getDrugId(drug) === id);
        if (index !== -1) {
          drugs.value[index] = updatedDrug;
        }
        
        if (currentDrug.value && getDrugId(currentDrug.value) === id) {
          currentDrug.value = updatedDrug;
        }
        
        return updatedDrug;
      }
      
      throw new Error('Failed to set drug label config');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to set drug label config for drug ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Drug Options Actions
  async function fetchDrugOptions(category: DrugOptionCategory, branchId?: string) {
    isLoadingOptions.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getDrugOptions(category, branchId);
      
      if (response.status === 'success') {
        // Update the specific category in options
        switch (category) {
          case 'drugCategory':
            options.value.categories = response.data.values;
            break;
          case 'drugSubcategory':
            options.value.subcategories = response.data.values;
            break;
          case 'unit':
            options.value.units = response.data.values;
            break;
          case 'dosageMethod':
            options.value.instructions = response.data.values;
            break;
          case 'dosageTime':
            options.value.timings = response.data.values;
            break;
        }
        
        return response.data.values;
      }
      
      throw new Error(`Failed to fetch ${category} options`);
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch ${category} options`;
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoadingOptions.value = false;
    }
  }

  async function fetchAllDrugOptions(branchId?: string) {
    isLoadingOptions.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getAllDropdownOptions(branchId);
      
      if (response.status === 'success') {
        const data = response.data.options;
        
        // Update all options
        options.value = {
          categories: data.drugCategories || [],
          subcategories: data.drugSubcategories || [],
          units: data.units || [],
          instructions: data.dosageMethods || [],
          timings: data.dosageTimes || []
        };
        
        return options.value;
      }
      
      throw new Error('Failed to fetch all drug options');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch drug options';
      error.value = errorMsg;
      console.error(errorMsg);
      
      // Fallback: try individual fetches
      try {
        const categories: DrugOptionCategory[] = [
          'drugCategory', 'drugSubcategory', 'unit', 'dosageMethod', 'dosageTime'
        ];
        
        const promises = categories.map(async (category) => {
          try {
            const response = await drugService.getDrugOptions(category, branchId);
            return { category, values: response.data.values };
          } catch (error) {
            console.error(`Error fetching ${category}:`, error);
            return { category, values: [] };
          }
        });
        
        const results = await Promise.all(promises);
        
        // Update all options
        results.forEach(({ category, values }) => {
          switch (category) {
            case 'drugCategory':
              options.value.categories = values;
              break;
            case 'drugSubcategory':
              options.value.subcategories = values;
              break;
            case 'unit':
              options.value.units = values;
              break;
            case 'dosageMethod':
              options.value.instructions = values;
              break;
            case 'dosageTime':
              options.value.timings = values;
              break;
          }
        });
        
        return options.value;
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
        return options.value;
      }
    } finally {
      isLoadingOptions.value = false;
    }
  }

  async function createDrugOption(category: DrugOptionCategory, value: MultilingualOption | string, branchId?: string) {
    isLoadingOptions.value = true;
    error.value = null;
    
    try {
      // Format the value correctly
      let optionValue: any;
      if (typeof value === 'string') {
        // Parse "thai/english" format or just use as Thai
        const parts = value.split('/');
        optionValue = {
          th: parts[0].trim(),
          en: parts[1]?.trim()
        };
      } else {
        optionValue = value;
      }

      const response = await drugService.createDrugOption(
        category, 
        { value: optionValue }, 
        branchId
      );
      
      if (response.status === 'success') {
        // Refresh the specific category options
        await fetchDrugOptions(category, branchId);
        return response.data.option;
      }
      
      throw new Error(`Failed to create ${category} option`);
    } catch (error: any) {
      const errorMsg = error.message || `Failed to create ${category} option`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoadingOptions.value = false;
    }
  }

  // Generate drug code
  async function generateDrugCode(prefix?: string): Promise<string | null> {
    try {
      const response = await drugService.generateDrugCode(prefix);
      
      if (response.status === 'success') {
        return response.data.drugCode;
      }
      
      throw new Error('Failed to generate drug code');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to generate drug code';
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    }
  }

  // Get drugs by category
  async function getDrugsByCategory(category: string, subcategory?: string, branchId?: string): Promise<ApiDrug[]> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getDrugsByCategory(category, subcategory, branchId);
      
      if (response.status === 'success') {
        return response.data.drugs || [];
      }
      
      throw new Error('Failed to get drugs by category');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to get drugs by category';
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  // Statistics calculation
  function updateStatistics() {
    statistics.value.totalDrugs = drugs.value.length;
    statistics.value.activeDrugs = drugs.value.filter(drug => drug.isActive).length;
    statistics.value.inactiveDrugs = drugs.value.filter(drug => !drug.isActive).length;
    
    // Get unique categories
    const uniqueCategories = new Set(drugs.value.map(drug => drug.category));
    statistics.value.categoriesCount = uniqueCategories.size;
    
    // Calculate average price
    const totalPrice = drugs.value.reduce((sum, drug) => sum + (drug.sellingPrice || 0), 0);
    statistics.value.avgPrice = drugs.value.length > 0 ? totalPrice / drugs.value.length : 0;
    statistics.value.totalValue = totalPrice;
  }

  // Utility functions
  function getDrugsByBranch(branchId: string) {
    return drugs.value.filter(drug => drug.branchId === branchId);
  }

  function clearError() {
    error.value = null;
  }

  function clearCurrentDrug() {
    currentDrug.value = null;
  }

  // Display options computed properties
  const getDisplayOptions = computed(() => ({
    categories: options.value.categories.map(option => ({
      value: getDisplayValue(option),
      data: option
    })),
    subcategories: options.value.subcategories.map(option => ({
      value: getDisplayValue(option),
      data: option
    })),
    units: options.value.units.map(option => ({
      value: getDisplayValue(option),
      data: option
    })),
    instructions: options.value.instructions.map(option => ({
      value: getDisplayValue(option),
      data: option
    })),
    timings: options.value.timings.map(option => ({
      value: getDisplayValue(option),
      data: option
    }))
  }));

  // Getters
  const getDrugs = computed(() => drugs.value);
  const getCurrentDrug = computed(() => currentDrug.value);
  const getDrugOptions = computed(() => options.value);
  const findDrugById = computed(() => (id: string) => drugs.value.find(drug => drug.id === id));
  const getActiveDrugs = computed(() => drugs.value.filter(drug => drug.isActive));
  const getLoading = computed(() => isLoading.value);
  const getLoadingOptions = computed(() => isLoadingOptions.value);
  const getError = computed(() => error.value);
  const getPagination = computed(() => pagination.value);
  const getTotalDrugs = computed(() => drugs.value.length);
  const getStatistics = computed(() => statistics.value);

  return {
    // State
    drugs,
    currentDrug,
    options,
    isLoading,
    isLoadingOptions,
    error,
    pagination,
    currentLanguage,
    statistics,
    
    // Actions
    fetchDrugs,
    fetchDrugById,
    fetchDrugByCode,
    searchDrugs,
    createDrug,
    updateDrug,
    deleteDrug,
    toggleArchiveStatus,
    setDrugLabelConfig,
    fetchDrugOptions,
    fetchAllDrugOptions,
    createDrugOption,
    generateDrugCode,
    getDrugsByCategory,
    getDrugsByBranch,
    clearError,
    clearCurrentDrug,
    updateStatistics,
    
    // Helper functions
    getDisplayValue,
    findOptionByDisplayValue,
    
    // Getters
    getDrugs,
    getCurrentDrug,
    getDrugOptions,
    findDrugById,
    getActiveDrugs,
    getLoading,
    getLoadingOptions,
    getError,
    getPagination,
    getTotalDrugs,
    getStatistics,
    getDisplayOptions,
    
    // Legacy aliases for backward compatibility
    updateDrugLabel: setDrugLabelConfig,
    getDrugLabel: fetchDrugById
  };
});