export interface AssistantOption {
  id: string;
  value: string;
}

export interface AssistantOptionsResponse {
  status: string;
  data: {
    assistants: AssistantOption[];
  };
}

// Assistant types
export interface Timetable {
  day: string;
  time: string[];
}

export interface AssistantBranch {
  branchId: string;
  name?: string;
  timetable: Timetable[];
}

export interface Assistant {
  id: string;
  photo?: string;
  name: string;
  surname: string;
  fullName: string;
  nickname?: string;
  gender: 'male' | 'female';
  nationality: string;
  birthday: string;
  address?: string;
  employmentType: 'fullTime' | 'partTime' | 'contract';
  clinicId: string;
  branches: AssistantBranch[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssistantRequest {
  photo?: string | File;
  name: string;
  surname: string;
  nickname?: string;
  gender: 'male' | 'female';
  nationality: string;
  birthday: string;
  address?: string;
  employmentType: 'fullTime' | 'partTime' | 'contract';
  clinicId: string;
  branches: {
    branchId: string;
    timetable: Timetable[];
  }[];
}

export interface UpdateAssistantRequest extends Partial<CreateAssistantRequest> {
  id: string;
}

export interface AssistantResponse {
  status: string;
  data: {
    assistant: Assistant;
  };
  message?: string;
}

export interface AssistantsResponse {
  status: string;
  data: {
    assistants: Assistant[];
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}