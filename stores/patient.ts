import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { patientService } from '~/services/patient';
import type { 
  Patient, 
  CreatePatientRequest, 
  PatientOptions, 
  PatientOptionCategory,
  Pagination,
  MultilingualOption,
  Language,
  OptionSelection
} from '~/types/patient';

// Interface for API response patient (matching your API structure)
interface ApiPatient {
  id: string;
  hn: string;
  branchId: string;
  branchName: string;
  nationalId: string;
  nationality: string;
  titlePrefix: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  patientType: string;
  bloodGroup: string;
  occupation: string;
  medicalRights: string;
  maritalStatus: string;
  referralSource: string;
  idCardAddress: {
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;
  };
  currentAddress: {
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;
  };
  phone: string;
  email?: string;
  notes?: string;
  medicalInfo: {
    drugAllergies: string[];
    assistantDoctor: {
      id: string;
      name: string;
    };
    primaryDoctor: {
      id: string;
      name: string;
    };
    chronicDiseases: string[];
    currentMedications: string[];
  };
  emergencyContact: {
    fullName: string;
    relationship: string;
    address: string;
    phone: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Type for API responses
interface ApiPatientResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    patients: ApiPatient[];
  };
}

interface ApiSinglePatientResponse {
  status: string;
  data: {
    patient: ApiPatient;
  };
}

export const usePatientStore = defineStore('patient', () => {
  // State
  const patients = ref<ApiPatient[]>([]);
  const currentPatient = ref<ApiPatient | null>(null);
  const options = ref<PatientOptions>({
    nationalities: [],
    titlePrefixes: [],
    genders: [],
    patientTypes: [],
    bloodGroups: [],
    occupations: [],
    medicalRights: [],
    maritalStatuses: [],
    referralSources: []
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

  // Actions
  async function fetchPatients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    branchId?: string;
    status?: string;
    lang?: string;
  }) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Use current language if not specified
      const fetchParams = {
        ...params,
        lang: params?.lang || currentLanguage.value
      };

      const response = await patientService.getPatients(fetchParams);
      
      if (response.status === 'success') {
        patients.value = response.data.patients || [];
        
        // Update pagination if available
        if (response.pagination) {
          pagination.value = response.pagination;
        }
      }
      
      return patients.value;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch patients';
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoading.value = false;
    }
  }
  
  async function fetchPatientById(id: string, lang?: string): Promise<ApiPatient | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await patientService.getPatientById(id, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        currentPatient.value = response.data.patient;
        return currentPatient.value;
      }
      
      throw new Error('Failed to fetch patient');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch patient with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function createPatient(patientData: CreatePatientRequest, lang?: string): Promise<ApiPatient | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await patientService.createPatient(patientData, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        const newPatient: ApiPatient = response.data.patient;
        
        // Add to local state
        patients.value.unshift(newPatient);
        
        return newPatient;
      }
      
      throw new Error('Failed to create patient');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create patient';
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updatePatient(id: string, patientData: Partial<CreatePatientRequest>, lang?: string): Promise<ApiPatient | null> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await patientService.updatePatient(id, patientData, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        const updatedPatient: ApiPatient = response.data.patient;
        
        // Update in local state
        const index = patients.value.findIndex(patient => patient.id === id);
        if (index !== -1) {
          patients.value[index] = updatedPatient;
        }
        
        if (currentPatient.value && currentPatient.value.id === id) {
          currentPatient.value = updatedPatient;
        }
        
        return updatedPatient;
      }
      
      throw new Error('Failed to update patient');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update patient with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function deletePatient(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await patientService.deletePatient(id);
      
      if (response.status === 'success') {
        // Remove from local state
        patients.value = patients.value.filter(patient => patient.id !== id);
        
        if (currentPatient.value && currentPatient.value.id === id) {
          currentPatient.value = null;
        }
        
        return true;
      }
      
      throw new Error('Failed to delete patient');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete patient with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Language-aware actions
  async function setLanguageAndRefetch(language: Language) {
    currentLanguage.value = language;
    
    // Refetch patients with new language
    await fetchPatients({
      page: pagination.value.page,
      limit: pagination.value.limit,
      lang: language
    });
  }

  // Patient Options Actions
  async function fetchPatientOptions(category: PatientOptionCategory, lang?: string) {
    isLoadingOptions.value = true;
    error.value = null;
    
    try {
      const response = await patientService.getPatientOptions(category, lang || currentLanguage.value);
      
      if (response.status === 'success') {
        // Update the specific category in options
        switch (category) {
          case 'nationality':
            options.value.nationalities = response.data.values;
            break;
          case 'titlePrefix':
            options.value.titlePrefixes = response.data.values;
            break;
          case 'gender':
            options.value.genders = response.data.values;
            break;
          case 'patientType':
            options.value.patientTypes = response.data.values;
            break;
          case 'bloodGroup':
            options.value.bloodGroups = response.data.values;
            break;
          case 'occupation':
            options.value.occupations = response.data.values;
            break;
          case 'medicalRight':
            options.value.medicalRights = response.data.values;
            break;
          case 'maritalStatus':
            options.value.maritalStatuses = response.data.values;
            break;
          case 'referralSource':
            options.value.referralSources = response.data.values;
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

  async function fetchAllPatientOptions(lang?: string) {
    isLoadingOptions.value = true;
    error.value = null;
    
    try {
      const categories: PatientOptionCategory[] = [
        'nationality', 'titlePrefix', 'gender', 'patientType', 
        'bloodGroup', 'occupation', 'medicalRight', 'maritalStatus', 'referralSource'
      ];
      
      const promises = categories.map(async (category) => {
        try {
          const response = await patientService.getPatientOptions(category, lang || currentLanguage.value);
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
          case 'nationality':
            options.value.nationalities = values;
            break;
          case 'titlePrefix':
            options.value.titlePrefixes = values;
            break;
          case 'gender':
            options.value.genders = values;
            break;
          case 'patientType':
            options.value.patientTypes = values;
            break;
          case 'bloodGroup':
            options.value.bloodGroups = values;
            break;
          case 'occupation':
            options.value.occupations = values;
            break;
          case 'medicalRight':
            options.value.medicalRights = values;
            break;
          case 'maritalStatus':
            options.value.maritalStatuses = values;
            break;
          case 'referralSource':
            options.value.referralSources = values;
            break;
        }
      });
      
      return options.value;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch patient options';
      error.value = errorMsg;
      console.error(errorMsg);
      return options.value;
    } finally {
      isLoadingOptions.value = false;
    }
  }
  

  // Utility functions
  function searchPatients(searchTerm: string) {
    if (!searchTerm) return patients.value;
    
    const term = searchTerm.toLowerCase();
    return patients.value.filter(patient => 
      patient.hn.toLowerCase().includes(term) ||
      patient.firstName.toLowerCase().includes(term) ||
      patient.lastName.toLowerCase().includes(term) ||
      patient.fullName.toLowerCase().includes(term) ||
      patient.nickname?.toLowerCase().includes(term) ||
      patient.phone.includes(term)
    );
  }

  function getPatientsByBranch(branchId: string) {
    return patients.value.filter(patient => patient.branchId === branchId);
  }

  function clearError() {
    error.value = null;
  }

  function clearCurrentPatient() {
    currentPatient.value = null;
  }

  // Getters
  const getPatients = computed(() => patients.value);
  const getCurrentPatient = computed(() => currentPatient.value);
  const getPatientOptions = computed(() => options.value);
  const getPatientById = computed(() => (id: string) => patients.value.find(patient => patient.id === id));
  const getActivePatients = computed(() => patients.value.filter(patient => patient.isActive));
  const getLoading = computed(() => isLoading.value);
  const getLoadingOptions = computed(() => isLoadingOptions.value);
  const getError = computed(() => error.value);
  const getPagination = computed(() => pagination.value);
  const getTotalPatients = computed(() => patients.value.length);

  return {
    // State
    patients,
    currentPatient,
    options,
    isLoading,
    isLoadingOptions,
    error,
    pagination,
    currentLanguage,
    
    // Actions
    fetchPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    fetchPatientOptions,
    fetchAllPatientOptions,
    searchPatients,
    getPatientsByBranch,
    clearError,
    clearCurrentPatient,
    setLanguageAndRefetch,
    
    // Getters
    getPatients,
    getCurrentPatient,
    getPatientOptions,
    getPatientById,
    getActivePatients,
    getLoading,
    getLoadingOptions,
    getError,
    getPagination,
    getTotalPatients
  };
});