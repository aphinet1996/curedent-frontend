import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { drugService } from '~/services/drug';
import type { 
  ApiDrug,
  CreateDrugRequest, 
  DrugOptions, 
  DrugOptionCategory,
  Pagination,
  MultilingualOption,
  Language,
  OptionSelection,
  DrugSearchParams,
  DrugStatistics,
  DrugLabelFormData
} from '~/types/drug';

// Type for API responses
interface ApiDrugResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    drugs: ApiDrug[];
  };
}

interface ApiSingleDrugResponse {
  status: string;
  data: {
    drug: ApiDrug;
  };
}

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
    return option[lang] || option.th || option.en || '';
  }

  function findOptionByDisplayValue(options: MultilingualOption[], displayValue: string): MultilingualOption | null {
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
      // Use current language if not specified
      const fetchParams = {
        ...params,
        lang: params?.lang || currentLanguage.value
      };

      const response = await drugService.getDrugs(fetchParams);
      
      if (response.status === 'success') {
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
  
  async function fetchDrugById(id: string, lang?: string): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getDrugById(id, lang || currentLanguage.value);
      
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
  
  async function createDrug(drugData: CreateDrugRequest, lang?: string): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.createDrug(drugData, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        const newDrug: ApiDrug = response.data.drug;
        
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
  
  async function updateDrug(id: string, drugData: Partial<CreateDrugRequest>, lang?: string): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.updateDrug(id, drugData, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        const updatedDrug: ApiDrug = response.data.drug;
        
        // Update in local state
        const index = drugs.value.findIndex(drug => drug.id === id);
        if (index !== -1) {
          drugs.value[index] = updatedDrug;
        }
        
        if (currentDrug.value && currentDrug.value.id === id) {
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
  
  async function deleteDrug(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.deleteDrug(id);
      
      if (response.status === 'success') {
        // Remove from local state
        drugs.value = drugs.value.filter(drug => drug.id !== id);
        
        if (currentDrug.value && currentDrug.value.id === id) {
          currentDrug.value = null;
        }

        // Update statistics
        updateStatistics();
        
        return true;
      }
      
      throw new Error('Failed to delete drug');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete drug with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Drug label management
  async function updateDrugLabel(id: string, labelData: DrugLabelFormData, lang?: string): Promise<ApiDrug | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.updateDrugLabel(id, labelData, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        const updatedDrug: ApiDrug = response.data.drug;
        
        // Update in local state
        const index = drugs.value.findIndex(drug => drug.id === id);
        if (index !== -1) {
          drugs.value[index] = updatedDrug;
        }
        
        if (currentDrug.value && currentDrug.value.id === id) {
          currentDrug.value = updatedDrug;
        }
        
        return updatedDrug;
      }
      
      throw new Error('Failed to update drug label');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update drug label with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function getDrugLabel(id: string, lang?: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getDrugLabel(id, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        return response.data.label;
      }
      
      throw new Error('Failed to fetch drug label');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch drug label with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Language-aware actions
  async function setLanguageAndRefetch(language: Language) {
    currentLanguage.value = language;
    
    // Refetch drugs with new language
    await fetchDrugs({
      page: pagination.value.page,
      limit: pagination.value.limit,
      lang: language
    });
  }

  // Drug Options Actions
  async function fetchDrugOptions(category: DrugOptionCategory, lang?: string) {
    isLoadingOptions.value = true;
    error.value = null;
    
    try {
      const response = await drugService.getDrugOptions(category, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        // Update the specific category in options
        switch (category) {
          case 'category':
            options.value.categories = response.data.values;
            break;
          case 'subcategory':
            options.value.subcategories = response.data.values;
            break;
          case 'unit':
            options.value.units = response.data.values;
            break;
          case 'instruction':
            options.value.instructions = response.data.values;
            break;
          case 'timing':
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

  async function fetchAllDrugOptions(lang?: string) {
    isLoadingOptions.value = true;
    error.value = null;
    
    try {
      const categories: DrugOptionCategory[] = [
        'category', 'subcategory', 'unit', 'instruction', 'timing'
      ];
      
      const promises = categories.map(async (category) => {
        try {
          const response = await drugService.getDrugOptions(category, lang || currentLanguage.value);
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
          case 'category':
            options.value.categories = values;
            break;
          case 'subcategory':
            options.value.subcategories = values;
            break;
          case 'unit':
            options.value.units = values;
            break;
          case 'instruction':
            options.value.instructions = values;
            break;
          case 'timing':
            options.value.timings = values;
            break;
        }
      });
      
      return options.value;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch drug options';
      error.value = errorMsg;
      console.error(errorMsg);
      return options.value;
    } finally {
      isLoadingOptions.value = false;
    }
  }

  async function createDrugOption(category: DrugOptionCategory, value: MultilingualOption, lang?: string) {
    isLoadingOptions.value = true;
    error.value = null;
    
    try {
      const response = await drugService.createDrugOption(
        category, 
        { value }, 
        lang || currentLanguage.value
      );
      
      if (response.status === 'success') {
        // Refresh the specific category options
        await fetchDrugOptions(category, lang || currentLanguage.value);
        return response.data.value;
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

  // Statistics calculation
  function updateStatistics() {
    statistics.value.totalDrugs = drugs.value.length;
    statistics.value.activeDrugs = drugs.value.filter(drug => drug.isActive).length;
    statistics.value.inactiveDrugs = drugs.value.filter(drug => !drug.isActive).length;
    
    // Get unique categories
    const uniqueCategories = new Set(drugs.value.map(drug => drug.category));
    statistics.value.categoriesCount = uniqueCategories.size;
    
    // Calculate average price
    const totalPrice = drugs.value.reduce((sum, drug) => sum + (drug.sellPrice || 0), 0);
    statistics.value.avgPrice = drugs.value.length > 0 ? totalPrice / drugs.value.length : 0;
    statistics.value.totalValue = totalPrice;
  }

  // Utility functions
  function searchDrugs(searchTerm: string) {
    if (!searchTerm) return drugs.value;
    
    const term = searchTerm.toLowerCase();
    return drugs.value.filter(drug => 
      drug.code.toLowerCase().includes(term) ||
      drug.name.toLowerCase().includes(term) ||
      drug.scientificName.toLowerCase().includes(term) ||
      drug.category.toLowerCase().includes(term) ||
      drug.subcategory.toLowerCase().includes(term)
    );
  }

  function getDrugsByCategory(category: string) {
    return drugs.value.filter(drug => drug.category === category);
  }

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
  const getDrugById = computed(() => (id: string) => drugs.value.find(drug => drug.id === id));
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
    createDrug,
    updateDrug,
    deleteDrug,
    updateDrugLabel,
    getDrugLabel,
    fetchDrugOptions,
    fetchAllDrugOptions,
    createDrugOption,
    searchDrugs,
    getDrugsByCategory,
    getDrugsByBranch,
    clearError,
    clearCurrentDrug,
    setLanguageAndRefetch,
    updateStatistics,
    
    // Helper functions
    getDisplayValue,
    findOptionByDisplayValue,
    
    // Getters
    getDrugs,
    getCurrentDrug,
    getDrugOptions,
    getDrugById,
    getActiveDrugs,
    getLoading,
    getLoadingOptions,
    getError,
    getPagination,
    getTotalDrugs,
    getStatistics,
    getDisplayOptions
  };
});