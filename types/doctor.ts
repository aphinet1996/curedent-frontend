export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Doctor Option Types (for dropdown)
export interface DoctorOption {
  id: string;
  value: string;
  color?: string; // เพิ่ม color สำหรับ option
}

export interface DoctorOptionsResponse {
  status: string;
  data: {
    doctors: DoctorOption[];
  };
}

// Existing Doctor types...
export interface Timetable {
  date: string;
  time: string[];
}

export interface DoctorBranch {
  branchId: string;
  name?: string;
  timetable: Timetable[];
}

export interface Doctor {
  id: string;
  photo?: string;
  name: string;
  surname: string;
  fullName: string;
  nickname?: string;
  gender: 'male' | 'female';
  nationality: string;
  birthday: string;
  age?: number; // เพิ่ม age field จาก response
  address?: string;
  specialty: string;
  color?: string; // เพิ่ม color field
  clinicId: string;
  clinicName?: string; // เพิ่ม clinicName จาก response
  branches: DoctorBranch[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorRequest {
  photo?: string | File;
  name: string;
  surname: string;
  nickname?: string;
  gender: 'male' | 'female';
  nationality: string;
  birthday: string;
  address?: string;
  specialty: string;
  color?: string; // เพิ่ม color field
  clinicId: string;
  branches: {
    branchId: string;
    timetable: Timetable[];
  }[];
}

export interface DoctorParams {
  page?: number;
  limit?: number;
  search?: string;
  specialty?: string;
  branchId?: string;
  color?: string; // เพิ่ม color filter
}

export interface UpdateDoctorRequest extends Partial<CreateDoctorRequest> {
  id: string;
}

export interface DoctorResponse {
  status: string;
  data: {
    doctor: Doctor;
  };
  message?: string;
}

export interface DoctorsResponse {
  status: string;
  data: {
    doctors: Doctor[];
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

// Color Palette Type
export interface ColorOption {
  name: string;
  value: string;
  start: string;
  end: string;
}

// Predefined color palette
export const COLOR_PALETTE: ColorOption[] = [
  { name: 'Ocean Blue', value: '#3B82F6', start: '#3B82F6', end: '#3B82F6' },
  { name: 'Emerald Green', value: '#10B981', start: '#10B981', end: '#10B981' },
  { name: 'Purple Heart', value: '#8B5CF6', start: '#8B5CF6', end: '#8B5CF6' },
  { name: 'Rose Pink', value: '#F43F5E', start: '#F43F5E', end: '#F43F5E' },
  { name: 'Amber Gold', value: '#F59E0B', start: '#F59E0B', end: '#F59E0B' },
  { name: 'Cyan Fresh', value: '#06B6D4', start: '#06B6D4', end: '#06B6D4' },
  { name: 'Indigo Deep', value: '#6366F1', start: '#6366F1', end: '#6366F1' },
  { name: 'Teal Mint', value: '#14B8A6', start: '#14B8A6', end: '#14B8A6' },
  { name: 'Orange Burst', value: '#F97316', start: '#F97316', end: '#F97316' },
  { name: 'Lime Fresh', value: '#65A30D', start: '#65A30D', end: '#65A30D' },
  { name: 'Pink Blossom', value: '#EC4899', start: '#EC4899', end: '#EC4899' },
  { name: 'Slate Steel', value: '#64748B', start: '#64748B', end: '#64748B' },
];