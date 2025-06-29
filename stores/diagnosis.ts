
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { diagnosisService } from '~/services/diagnosis';
import type { Diagnosis, DiagnosisParams, Pagination } from '~/types/diagnosis';

export const useDiagnosisStore = defineStore('diagnosis', () => {
  // State
  const diagnoses = ref<Diagnosis[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Actions
  async function fetchDiagnoses(params?: DiagnosisParams) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await diagnosisService.getDiagnoses(params);
      
      if (response.status === 'success') {
        diagnoses.value = response.data.diagnoses;
        
        if (response.pagination) {
          pagination.value = response.pagination;
        }
      }
      
      return diagnoses.value;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch diagnoses';
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoading.value = false;
    }
  }
  
  async function createDiagnosis(name: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await diagnosisService.createDiagnosis(name);
      
      if (response.status === 'success') {
        const newDiagnosis = response.data.diagnosis;
        
        // Add to local state
        diagnoses.value.push(newDiagnosis);
        
        return newDiagnosis;
      }
      
      throw new Error('Failed to create diagnosis');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create diagnosis';
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updateDiagnosis(id: string, name: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await diagnosisService.updateDiagnosis(id, name);
      
      if (response.status === 'success') {
        const updatedDiagnosis = response.data.diagnosis;
        
        // Update in local state
        const index = diagnoses.value.findIndex(d => d.id === id);
        if (index !== -1) {
          diagnoses.value[index] = updatedDiagnosis;
        }
        
        return updatedDiagnosis;
      }
      
      throw new Error('Failed to update diagnosis');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update diagnosis with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function deleteDiagnosis(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await diagnosisService.deleteDiagnosis(id);
      
      if (response.status === 'success') {
        // Remove from local state
        diagnoses.value = diagnoses.value.filter(d => d.id !== id);
        return true;
      }
      
      throw new Error('Failed to delete diagnosis');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete diagnosis with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  
  function sortDiagnosesAZ() {
    diagnoses.value = [...diagnoses.value].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  function sortDiagnosesZA() {
    diagnoses.value = [...diagnoses.value].sort((a, b) => b.name.localeCompare(a.name));
  }

  // Getters
  const getDiagnoses = computed(() => diagnoses.value);
  const getLoading = computed(() => isLoading.value);
  const getError = computed(() => error.value);
  const getPagination = computed(() => pagination.value);

  return {
    // State
    diagnoses,
    isLoading,
    error,
    pagination,
    
    // Actions
    fetchDiagnoses,
    createDiagnosis,
    updateDiagnosis,
    deleteDiagnosis,
    sortDiagnosesAZ,
    sortDiagnosesZA,
    
    // Getters
    getDiagnoses,
    getLoading,
    getError,
    getPagination
  };
});