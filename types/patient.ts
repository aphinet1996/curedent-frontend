// export interface Pagination {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   }
// // Patient option categories
// export type PatientOptionCategory = 
//   | 'nationality' 
//   | 'titlePrefix' 
//   | 'gender' 
//   | 'patientType' 
//   | 'bloodGroup' 
//   | 'occupation' 
//   | 'medicalRight' 
//   | 'maritalStatus' 
//   | 'referralSource';

// // Address interface
// export interface Address {
//   address: string;
//   subdistrict: string;
//   district: string;
//   province: string;
//   zipcode: string;
// }

// // Medical info interface
// export interface MedicalInfo {
//   drugAllergies: string[];
//   assistantDoctorId?: string;
//   primaryDoctorId?: string;
//   chronicDiseases: string[];
//   currentMedications: string[];
// }

// // Emergency contact interface
// export interface EmergencyContact {
//   fullName: string;
//   relationship: string;
//   address: string;
//   phone: string;
// }

// // Create patient request interface
// export interface CreatePatientRequest {
//   branchId: string;
//   hn: string;
//   nationalId: string;
//   nationality: string;
//   titlePrefix: string;
//   firstNameTh: string;
//   lastNameTh: string;
//   firstNameEn?: string;
//   lastNameEn?: string;
//   nickname?: string;
//   gender: string;
//   dateOfBirth: string;
//   patientType: string;
//   bloodGroup: string;
//   occupation: string;
//   medicalRights: string;
//   maritalStatus: string;
//   referralSource: string;
//   idCardAddress: Address;
//   currentAddress: Address;
//   phone: string;
//   email?: string;
//   notes?: string;
//   medicalInfo: MedicalInfo;
//   emergencyContact: EmergencyContact;
// }

// // Patient response interface
// export interface Patient extends CreatePatientRequest {
//   id: string;
//   patientNumber: string;
//   status: string;
//   registrationDate: string;
//   lastVisit?: string;
//   totalVisits: number;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// // Patient option response
// export interface PatientOptionResponse {
//   status: string;
//   data: {
//     category: string;
//     values: string[];
//   };
// }

// // Create patient option request
// export interface CreatePatientOptionRequest {
//   value: string;
// }

// // Patient options state
// export interface PatientOptions {
//   nationalities: string[];
//   titlePrefixes: string[];
//   genders: string[];
//   patientTypes: string[];
//   bloodGroups: string[];
//   occupations: string[];
//   medicalRights: string[];
//   maritalStatuses: string[];
//   referralSources: string[];
// }

// // Form data interface for stepper
// export interface PatientFormData {
//   // Step 1: Basic Info
//   hn: string;
//   nationalId: string;
//   titlePrefix: string;
//   firstNameTh: string;
//   lastNameTh: string;
//   firstNameEn: string;
//   lastNameEn: string;
//   nickname: string;
//   gender: string;
//   dateOfBirth: string;
//   nationality: string;
//   patientType: string;
//   bloodGroup: string;
//   occupation: string;
//   medicalRights: string;
//   maritalStatus: string;
//   referralSource: string;

//   // Step 2: Address
//   idCardAddress: Address;
//   currentAddress: Address;
//   sameAsIdCard: boolean;

//   // Step 3: Contact Info
//   phone: string;
//   email: string;
//   emergencyContact: EmergencyContact;

//   // Step 4: Medical Info
//   drugAllergies: string[];
//   chronicDiseases: string[];
//   currentMedications: string[];
//   assistantDoctorId: string;
//   primaryDoctorId: string;

//   // Additional
//   branchId: string;
//   notes: string;
// }

// // API Response types
// export interface ApiResponse<T> {
//   status: string;
//   pagination: Pagination;
//   data: T;
//   message?: string;
// }

// export interface CreatePatientResponse {
//   patient: Patient;
// }

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Multilingual interface for patient options (for form creation)
export interface MultilingualOption {
  th: string;
  en: string;
}

// Patient option categories
export type PatientOptionCategory = 
  | 'nationality' 
  | 'titlePrefix' 
  | 'gender' 
  | 'patientType' 
  | 'bloodGroup' 
  | 'occupation' 
  | 'medicalRight' 
  | 'maritalStatus' 
  | 'referralSource';

// Address interface
export interface Address {
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
}

// Medical info interface (for API response)
export interface ApiMedicalInfo {
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
}

// Medical info interface (for form creation - legacy)
export interface MedicalInfo {
  drugAllergies: string[];
  assistantDoctorId?: string;
  primaryDoctorId?: string;
  chronicDiseases: string[];
  currentMedications: string[];
}

// Emergency contact interface
export interface EmergencyContact {
  fullName: string;
  relationship: string;
  address: string;
  phone: string;
}

// API Patient interface (matches API response structure)
export interface ApiPatient {
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
  idCardAddress: Address;
  currentAddress: Address;
  phone: string;
  email?: string;
  notes?: string;
  medicalInfo: ApiMedicalInfo;
  emergencyContact: EmergencyContact;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create patient request interface with multilingual support (for form submission)
export interface CreatePatientRequest {
  branchId: string;
  hn: string;
  nationalId: string;
  nationality: MultilingualOption;
  titlePrefix: MultilingualOption;
  firstName: MultilingualOption;
  lastName: MultilingualOption;
  nickname?: string;
  gender: MultilingualOption;
  dateOfBirth: string;
  patientType: MultilingualOption;
  bloodGroup: MultilingualOption;
  occupation: MultilingualOption;
  medicalRights: MultilingualOption;
  maritalStatus: MultilingualOption;
  referralSource: MultilingualOption;
  idCardAddress: Address;
  currentAddress: Address;
  phone: string;
  email?: string;
  notes?: string;
  medicalInfo: MedicalInfo;
  emergencyContact: EmergencyContact;
}

// Legacy Patient interface (keeping for backward compatibility)
export interface Patient extends CreatePatientRequest {
  id: string;
  patientNumber: string;
  status: string;
  registrationDate: string;
  lastVisit?: string;
  totalVisits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Updated patient option response for multilingual
export interface PatientOptionResponse {
  status: string;
  data: {
    category: string;
    values: MultilingualOption[];
  };
}

// Create patient option request
export interface CreatePatientOptionRequest {
  value: MultilingualOption;
}

// Patient options state with multilingual support
export interface PatientOptions {
  nationalities: MultilingualOption[];
  titlePrefixes: MultilingualOption[];
  genders: MultilingualOption[];
  patientTypes: MultilingualOption[];
  bloodGroups: MultilingualOption[];
  occupations: MultilingualOption[];
  medicalRights: MultilingualOption[];
  maritalStatuses: MultilingualOption[];
  referralSources: MultilingualOption[];
}

// Form data interface for stepper (for display in UI)
export interface PatientFormData {
  // Step 1: Basic Info
  hn: string;
  nationalId: string;
  titlePrefix: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  nickname: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  patientType: string;
  bloodGroup: string;
  occupation: string;
  medicalRights: string;
  maritalStatus: string;
  referralSource: string;

  // Step 2: Address
  idCardAddress: Address;
  currentAddress: Address;
  sameAsIdCard: boolean;

  // Step 3: Contact Info
  phone: string;
  email: string;
  emergencyContact: EmergencyContact;

  // Step 4: Medical Info
  drugAllergies: string[];
  chronicDiseases: string[];
  currentMedications: string[];
  assistantDoctorId: string;
  primaryDoctorId: string;

  // Additional
  branchId: string;
  notes: string;
}

// API Response types
export interface ApiResponse<T> {
  status: string;
  pagination?: Pagination;
  data: T;
  message?: string;
}

// API specific response types
export interface ApiPatientListResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    patients: ApiPatient[];
  };
}

export interface ApiSinglePatientResponse {
  status: string;
  data: {
    patient: ApiPatient;
  };
}

export interface CreatePatientResponse {
  patient: ApiPatient;
}

// Helper type for language preference
export type Language = 'th' | 'en';

// Utility interface for option selection in UI
export interface OptionSelection {
  value: string; // The displayed value in current language
  data: MultilingualOption; // The full multilingual data
}

// Interface for table display (transformed from ApiPatient)
export interface PatientTableRow {
  id: string;
  name: string;
  tel: string;
  age: string;
  gender: string;
  contact: string;
  // Include original patient data for row click
  originalData: ApiPatient;
}