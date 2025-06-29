// stores/treatment.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { treatmentService } from '~/services/treatment';
import type { Treatment, TreatmentParams, Pagination, CreateTreatmentRequest, UpdateTreatmentRequest } from '~/types/treatment';

export const useTreatmentStore = defineStore('treatment', () => {
  // State
  const treatments = ref<Treatment[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Actions
  async function fetchTreatments(params?: TreatmentParams) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await treatmentService.getTreatments(params);
      
      if (response.status === 'success') {
        treatments.value = response.data.treatments;
        
        if (response.pagination) {
          pagination.value = response.pagination;
        }
      }
      
      return treatments.value;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch treatments';
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoading.value = false;
    }
  }
  
  async function createTreatment(treatmentData: CreateTreatmentRequest) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await treatmentService.createTreatment(treatmentData);
      
      if (response.status === 'success') {
        const newTreatment = response.data.treatment;
        
        // Add to local state
        treatments.value.push(newTreatment);
        
        return newTreatment;
      }
      
      throw new Error('Failed to create treatment');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create treatment';
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updateTreatment(id: string, treatmentData: UpdateTreatmentRequest) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await treatmentService.updateTreatment(id, treatmentData);
      
      if (response.status === 'success') {
        const updatedTreatment = response.data.treatment;
        
        // Update in local state
        const index = treatments.value.findIndex(t => t.id === id);
        if (index !== -1) {
          treatments.value[index] = updatedTreatment;
        }
        
        return updatedTreatment;
      }
      
      throw new Error('Failed to update treatment');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update treatment with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function deleteTreatment(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await treatmentService.deleteTreatment(id);
      
      if (response.status === 'success') {
        // Remove from local state
        treatments.value = treatments.value.filter(t => t.id !== id);
        return true;
      }
      
      throw new Error('Failed to delete treatment');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete treatment with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  
  function sortTreatmentsAZ() {
    treatments.value = [...treatments.value].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  function sortTreatmentsPriceHighLow() {
    treatments.value = [...treatments.value].sort((a, b) => b.price - a.price);
  }
  
  function sortTreatmentsPriceLowHigh() {
    treatments.value = [...treatments.value].sort((a, b) => a.price - b.price);
  }

  // Getters
  const getTreatments = computed(() => treatments.value);
  const getLoading = computed(() => isLoading.value);
  const getError = computed(() => error.value);
  const getPagination = computed(() => pagination.value);

  return {
    // State
    treatments,
    isLoading,
    error,
    pagination,
    
    // Actions
    fetchTreatments,
    createTreatment,
    updateTreatment,
    deleteTreatment,
    sortTreatmentsAZ,
    sortTreatmentsPriceHighLow,
    sortTreatmentsPriceLowHigh,
    
    // Getters
    getTreatments,
    getLoading,
    getError,
    getPagination
  };
});