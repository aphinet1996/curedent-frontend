// stores/branch.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { branchService } from '~/services/branch';
import type { Branch, BranchParams, Pagination, CreateBranchRequest, UpdateBranchRequest } from '~/types/branch';

export const useBranchStore = defineStore('branch', () => {
  // State
  const branches = ref<Branch[]>([]);
  const currentBranch = ref<Branch | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Helper function to add display properties
  const addDisplayProperties = (branch: Branch): Branch => ({
    ...branch,
    branchCount: 1, // Default to 1 since each record is a branch
    dateJoined: new Date(branch.createdAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    revenue: 0, // Set default value, to be updated if needed
    selected: false
  });

  // Actions
  async function fetchBranches(params?: BranchParams) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await branchService.getBranches(params);
      
      if (response.status === 'success') {
        branches.value = response.data.branches.map(addDisplayProperties);
        
        if (response.pagination) {
          pagination.value = response.pagination;
        }
      }
      
      return branches.value;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch branches';
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoading.value = false;
    }
  }
  
  async function fetchBranchById(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await branchService.getBranchById(id);
      
      if (response.status === 'success') {
        currentBranch.value = addDisplayProperties(response.data.branch);
        return currentBranch.value;
      }
      
      throw new Error('Failed to fetch branch');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch branch with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function createBranch(branchData: CreateBranchRequest) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await branchService.createBranch(branchData);
      
      if (response.status === 'success') {
        const newBranch = addDisplayProperties(response.data.branch);
        
        // Add to local state
        branches.value.push(newBranch);
        
        return newBranch;
      }
      
      throw new Error('Failed to create branch');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create branch';
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function updateBranch(id: string, branchData: UpdateBranchRequest) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await branchService.updateBranch(id, branchData);
      
      if (response.status === 'success') {
        const updatedBranch = response.data.branch;
        
        // Update in local state
        const index = branches.value.findIndex(branch => branch.id === id);
        if (index !== -1) {
          // Preserve frontend display properties
          const existingBranch = branches.value[index];
          branches.value[index] = {
            ...addDisplayProperties(updatedBranch),
            branchCount: existingBranch.branchCount,
            dateJoined: existingBranch.dateJoined,
            revenue: existingBranch.revenue,
            selected: existingBranch.selected
          };
        }
        
        if (currentBranch.value && currentBranch.value.id === id) {
          const existingCurrent = currentBranch.value;
          currentBranch.value = {
            ...addDisplayProperties(updatedBranch),
            branchCount: existingCurrent.branchCount,
            dateJoined: existingCurrent.dateJoined,
            revenue: existingCurrent.revenue,
            selected: existingCurrent.selected
          };
        }
        
        return updatedBranch;
      }
      
      throw new Error('Failed to update branch');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update branch with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function deleteBranch(id: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await branchService.deleteBranch(id);
      
      if (response.status === 'success') {
        // Remove from local state
        branches.value = branches.value.filter(branch => branch.id !== id);
        
        if (currentBranch.value && currentBranch.value.id === id) {
          currentBranch.value = null;
        }
        
        return true;
      }
      
      throw new Error('Failed to delete branch');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete branch with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  
  function toggleBranchSelection(id: string) {
    const branch = branches.value.find(b => b.id === id);
    if (branch) {
      branch.selected = !branch.selected;
    }
  }
  
  function setBranchRevenue(id: string, revenue: number) {
    const branch = branches.value.find(b => b.id === id);
    if (branch) {
      branch.revenue = revenue;
    }
  }

  function sortBranchesAZ() {
    branches.value = [...branches.value].sort((a, b) => a.name.localeCompare(b.name));
  }

  function sortBranchesByProvince() {
    branches.value = [...branches.value].sort((a, b) => a.province.localeCompare(b.province));
  }

  function sortBranchesByStatus() {
    branches.value = [...branches.value].sort((a, b) => a.status.localeCompare(b.status));
  }

  // Getters
  const getBranches = computed(() => branches.value);
  const getBranchById = computed(() => (id: string) => branches.value.find(branch => branch.id === id));
  const getSelectedBranches = computed(() => branches.value.filter(branch => branch.selected));
  const getActiveBranches = computed(() => branches.value.filter(branch => branch.status === 'active'));
  const getLoading = computed(() => isLoading.value);
  const getError = computed(() => error.value);
  const getPagination = computed(() => pagination.value);

  return {
    // State
    branches,
    currentBranch,
    isLoading,
    error,
    pagination,
    
    // Actions
    fetchBranches,
    fetchBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
    toggleBranchSelection,
    setBranchRevenue,
    sortBranchesAZ,
    sortBranchesByProvince,
    sortBranchesByStatus,
    
    // Getters
    getBranches,
    getBranchById,
    getSelectedBranches,
    getActiveBranches,
    getLoading,
    getError,
    getPagination
  };
});