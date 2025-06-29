export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Fee {
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface Treatment {
  id: string;
  name: string;
  price: number;
  includeVat: boolean;
  doctorFee: Fee;
  assistantFee: Fee;
  clinicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentRequest {
  name: string;
  price: number;
  includeVat: boolean;
  doctorFee: Fee;
  assistantFee: Fee;
  clinicId: string;
}

export interface UpdateTreatmentRequest {
  name: string;
  price: number;
  includeVat: boolean;
  doctorFee: Fee;
  assistantFee: Fee;
  clinicId: string;
}

export interface TreatmentResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    treatments: Treatment[];
  };
}

// Request params for fetching treatments
export interface TreatmentParams {
  page?: number;
  limit?: number;
  search?: string;
}