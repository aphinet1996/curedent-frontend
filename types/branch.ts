// types/branch.ts
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Branch {
  id: string;
  name: string;
  photo: string;
  tel: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
  clinicId: string;
  linkMap: string;
  status: string;
  fullAddress: string;
  createdAt: string;
  updatedAt: string;
  
  // Frontend display properties
  branchCount?: number;
  dateJoined?: string;
  revenue?: number;
  selected?: boolean;
}

export interface CreateBranchRequest {
  name: string;
  photo?: string;
  tel: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
  linkMap?: string;
  status?: string;
  clinicId: string;
}

export interface UpdateBranchRequest {
  name?: string;
  photo?: string;
  tel?: string;
  address?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  zipcode?: string;
  linkMap?: string;
  status?: string;
  clinicId?: string;
}

export interface BranchResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    branches: Branch[];
  };
}

// Request params for fetching branches
export interface BranchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}