// Types for Diagnosis API Response
export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface DiagnosisResponse {
    status: string;
    results: number;
    pagination: Pagination;
    data: {
      diagnoses: Diagnosis[];
    };
  }
  
  export interface Diagnosis {
    id: string;
    name: string;
    clinicId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Request params for fetching diagnoses
  export interface DiagnosisParams {
    page?: number;
    limit?: number;
    search?: string;
  }