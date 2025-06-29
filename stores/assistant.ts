// stores/assistant.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { assistantService } from '~/services/assistant';
import type {
  Assistant,
  CreateAssistantRequest,
  UpdateAssistantRequest,
  AssistantOption
} from '~/types/assistant';

export const useAssistantStore = defineStore('assistant', () => {
  // State
  const assistants = ref<Assistant[]>([]);
  const currentAssistant = ref<Assistant | null>(null);
  const assistantOptions = ref<AssistantOption[]>([]);
  const isLoading = ref(false);
  const isLoadingOptions = ref(false);
  const error = ref<string | null>(null);
  const optionsError = ref<string | null>(null);

  // Actions
  async function fetchAssistants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    employmentType?: string;
    branchId?: string;
  }): Promise<Assistant[]> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await assistantService.getAssistants(params);

      if (response.status === 'success') {
        assistants.value = response.data.assistants || [];
        return assistants.value;
      }

      throw new Error('Failed to fetch assistants');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch assistants';
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchAssistantById(id: string): Promise<Assistant | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await assistantService.getAssistantById(id);

      if (response.status === 'success') {
        currentAssistant.value = response.data.assistant;
        return currentAssistant.value;
      }

      throw new Error('Failed to fetch assistant');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch assistant with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createAssistant(assistantData: FormData): Promise<Assistant | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await assistantService.createAssistant(assistantData);

      if (response.status === 'success') {
        const newAssistant = response.data.assistant;

        // Add to local state
        assistants.value.unshift(newAssistant);

        // Clear options cache to include new assistant
        assistantOptions.value = [];

        return newAssistant;
      }

      throw new Error('Failed to create assistant');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create assistant';
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAssistant(id: string, assistantData: Partial<CreateAssistantRequest>): Promise<Assistant | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await assistantService.updateAssistant(id, assistantData);

      if (response.status === 'success') {
        const updatedAssistant = response.data.assistant;

        // Update in local state
        const index = assistants.value.findIndex(assistant => assistant.id === id);
        if (index !== -1) {
          assistants.value[index] = updatedAssistant;
        }

        if (currentAssistant.value && currentAssistant.value.id === id) {
          currentAssistant.value = updatedAssistant;
        }

        // Clear options cache to reflect updates
        assistantOptions.value = [];

        return updatedAssistant;
      }

      throw new Error('Failed to update assistant');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update assistant with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAssistant(id: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      await assistantService.deleteAssistant(id);

      // Remove from local state
      assistants.value = assistants.value.filter(assistant => assistant.id !== id);

      if (currentAssistant.value && currentAssistant.value.id === id) {
        currentAssistant.value = null;
      }

      // Clear options cache
      assistantOptions.value = [];

      return true;
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete assistant with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // NEW: Get assistant options for dropdown
  async function fetchAssistantOptions(): Promise<AssistantOption[]> {
    // Return cached data if available
    if (assistantOptions.value.length > 0) {
      return assistantOptions.value;
    }

    isLoadingOptions.value = true;
    optionsError.value = null;

    try {
      const options = await assistantService.getAssistantOptions();
      assistantOptions.value = options;
      return options;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch assistant options';
      optionsError.value = errorMsg;
      console.error('Error fetching assistant options:', error);
      throw error;
    } finally {
      isLoadingOptions.value = false;
    }
  }

  // NEW: Get assistant name by ID
  function getAssistantNameById(id: string): string {
    const assistant = assistantOptions.value.find(a => a.id === id);
    return assistant?.value || 'ไม่ระบุผู้ช่วย';
  }

  // NEW: Refresh assistant options (force reload)
  async function refreshAssistantOptions(): Promise<AssistantOption[]> {
    assistantOptions.value = [];
    return await fetchAssistantOptions();
  }

  // Utility functions
  function searchAssistants(searchTerm: string): Assistant[] {
    if (!searchTerm) return assistants.value;

    const term = searchTerm.toLowerCase();
    return assistants.value.filter(assistant =>
      assistant.fullName.toLowerCase().includes(term) ||
      assistant.name.toLowerCase().includes(term) ||
      assistant.surname.toLowerCase().includes(term) ||
      assistant.nickname?.toLowerCase().includes(term) ||
      assistant.employmentType.toLowerCase().includes(term)
    );
  }

  function getAssistantsByEmploymentType(employmentType: string): Assistant[] {
    return assistants.value.filter(assistant => assistant.employmentType === employmentType);
  }

  function getActiveAssistants(): Assistant[] {
    return assistants.value.filter(assistant => assistant.isActive);
  }

  function clearError(): void {
    error.value = null;
    optionsError.value = null;
  }

  function clearCurrentAssistant(): void {
    currentAssistant.value = null;
  }

  // Getters
  const getAssistants = computed(() => assistants.value);
  const getCurrentAssistant = computed(() => currentAssistant.value);
  const getAssistantOptions = computed(() => assistantOptions.value);
  const getLoading = computed(() => isLoading.value);
  const getLoadingOptions = computed(() => isLoadingOptions.value);
  const getError = computed(() => error.value);
  const getOptionsError = computed(() => optionsError.value);
  const getTotalAssistants = computed(() => assistants.value.length);
  const getAssistantById = computed(() => (id: string) =>
    assistants.value.find(assistant => assistant.id === id)
  );
  const hasAssistantOptions = computed(() => assistantOptions.value.length > 0);

  return {
    // State
    assistants,
    currentAssistant,
    assistantOptions,
    isLoading,
    isLoadingOptions,
    error,
    optionsError,

    // Actions
    fetchAssistants,
    fetchAssistantById,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    fetchAssistantOptions,
    getAssistantNameById,
    refreshAssistantOptions,
    searchAssistants,
    getAssistantsByEmploymentType,
    getActiveAssistants,
    clearError,
    clearCurrentAssistant,

    // Getters
    getAssistants,
    getCurrentAssistant,
    getAssistantOptions,
    getLoading,
    getLoadingOptions,
    getError,
    getOptionsError,
    getTotalAssistants,
    getAssistantById,
    hasAssistantOptions
  };
});