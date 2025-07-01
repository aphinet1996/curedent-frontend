import { useCookie } from 'nuxt/app';
import type { Branch, BranchParams, CreateBranchRequest, UpdateBranchRequest } from '~/types/branch';
import { authenticatedRequest, type ApiResponse } from '~/utils/api';

export const branchService = {
  async getBranches(params?: BranchParams): Promise<ApiResponse<{ branches: Branch[] }>> {
    console.log('🔵 Branch Service: Getting branches with params:', params);
    
    try {
      const result = await authenticatedRequest<ApiResponse<{ branches: Branch[] }>>('/branches', {
        method: 'GET',
        params,
      });
      
      console.log('✅ Branch Service: Successfully got branches:', result);
      return result;
    } catch (error) {
      console.error('❌ Branch Service: Failed to get branches:', error);
      throw error;
    }
  },
  
  async getBranchById(id: string): Promise<ApiResponse<{ branch: Branch }>> {
    console.log('🔵 Branch Service: Getting branch by ID:', id);
    
    return await authenticatedRequest<ApiResponse<{ branch: Branch }>>(`/branches/${id}`, {
      method: 'GET',
    });
  },
  
  async createBranch(branchData: CreateBranchRequest): Promise<ApiResponse<{ branch: Branch }>> {
    const clinicId = useCookie('clinic_id').value || '';
    console.log('🔵 Branch Service: Creating branch with clinicId:', clinicId);
    
    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    const requestData = {
      ...branchData,
      clinicId
    };

    return await authenticatedRequest<ApiResponse<{ branch: Branch }>>('/branches', {
      method: 'POST',
      body: requestData,
    });
  },
  
  async updateBranch(id: string, branchData: UpdateBranchRequest): Promise<ApiResponse<{ branch: Branch }>> {
    const clinicId = useCookie('clinic_id').value || '';
    
    if (!clinicId) {
      throw new Error('Clinic ID is required');
    }

    const requestData = {
      ...branchData,
      clinicId
    };

    return await authenticatedRequest<ApiResponse<{ branch: Branch }>>(`/branches/${id}`, {
      method: 'PUT',
      body: requestData,
    });
  },
  
  async deleteBranch(id: string): Promise<ApiResponse<null>> {
    return await authenticatedRequest<ApiResponse<null>>(`/branches/${id}`, {
      method: 'DELETE',
    });
  }
};