// export interface Pagination {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   }
  
//   // Multilingual interface for drug options and fields
//   export interface MultilingualOption {
//     th: string;
//     en: string;
//   }
  
//   // Drug option categories that can be customized per clinic/branch
//   export type DrugOptionCategory = 
//     | 'drugCategory'
//     | 'drugSubcategory'
//     | 'unit'
//     | 'dosageMethod'
//     | 'dosageTime';
  
//   // Drug multilingual fields interface (for API responses)
//   export interface DrugMultilingualFields {
//     scientificName: MultilingualOption;  // ชื่อทางวิทยาศาสตร์
//     printName?: MultilingualOption;      // ชื่อสำหรับพิมพ์
//     indications?: MultilingualOption;    // ข้อบ่งใช้
//     unit: MultilingualOption;            // หน่วย
//     instruction?: MultilingualOption;    // วิธีใช้
//     timing?: MultilingualOption;         // เวลาใช้
//     usage?: MultilingualOption;          // คำแนะนำการใช้
//   }
  
//   // API Drug interface (matches API response structure)
//   export interface ApiDrug {
//     id: string;
//     branchId: string;
//     branchName: string;
//     category: string;           // หมวดหมู่ยา
//     subcategory: string;        // หมวดหมู่ย่อย
//     code: string;               // รหัสยา
//     name: string;               // ชื่อยา
//     scientificName: string;     // ชื่อทางวิทยาศาสตร์ (ตามภาษาปัจจุบัน)
//     printName?: string;         // ชื่อสำหรับพิมพ์ (ตามภาษาปัจจุบัน)
//     indications?: string;       // ข้อบ่งใช้ (ตามภาษาปัจจุบัน)
//     description?: string;       // รายละเอียด
//     dosage?: string;            // ขนาด
//     unit: string;               // หน่วย (ตามภาษาปัจจุบัน)
//     instruction?: string;       // วิธีใช้ (ตามภาษาปัจจุบัน)
//     timing?: string;            // เวลาใช้ (ตามภาษาปัจจุบัน)
//     usage?: string;             // คำแนะนำการใช้ (ตามภาษาปัจจุบัน)
//     sellPrice: number;          // ราคาขาย
//     buyPrice?: number;          // ราคาซื้อ
//     isActive: boolean;
//     createdAt: string;
//     updatedAt: string;
    
//     // Full multilingual data (for label settings)
//     multilingualFields?: DrugMultilingualFields;
//   }
  
//   // Create drug request interface with multilingual support (for form submission)
//   export interface CreateDrugRequest {
//     branchId: string;
//     category: MultilingualOption;        // หมวดหมู่ยา
//     subcategory: MultilingualOption;     // หมวดหมู่ย่อย
//     code: string;                        // รหัสยา
//     name: string;                        // ชื่อยา
//     scientificName: MultilingualOption;  // ชื่อทางวิทยาศาสตร์
//     printName?: MultilingualOption;      // ชื่อสำหรับพิมพ์
//     indications?: MultilingualOption;    // ข้อบ่งใช้
//     description?: string;                // รายละเอียด
//     dosage?: string;                     // ขนาด
//     unit: MultilingualOption;            // หน่วย
//     instruction?: MultilingualOption;    // วิธีใช้
//     timing?: MultilingualOption;         // เวลาใช้
//     usage?: MultilingualOption;          // คำแนะนำการใช้
//     sellPrice: number;                   // ราคาขาย
//     buyPrice?: number;                   // ราคาซื้อ
//   }
  
//   // Drug option response for multilingual
//   export interface DrugOptionResponse {
//     status: string;
//     data: {
//       category: string;
//       values: MultilingualOption[];
//     };
//   }
  
//   // Create drug option request
//   export interface CreateDrugOptionRequest {
//     value: MultilingualOption;
//   }
  
//   // Drug options state with multilingual support
//   export interface DrugOptions {
//     categories: MultilingualOption[];     // หมวดหมู่ยา
//     subcategories: MultilingualOption[];  // หมวดหมู่ย่อย
//     units: MultilingualOption[];          // หน่วย
//     instructions: MultilingualOption[];   // วิธีใช้
//     timings: MultilingualOption[];        // เวลาใช้
//   }
  
//   // Form data interface for drug creation/editing (for display in UI)
//   export interface DrugFormData {
//     // Basic Info
//     branchId: string;
//     category: string;           // Display value
//     subcategory: string;        // Display value
//     code: string;
//     name: string;
    
//     // Multilingual fields (current language display)
//     scientificName: string;
//     printName: string;
//     indications: string;
//     unit: string;              // Display value
//     instruction: string;       // Display value
//     timing: string;            // Display value
//     usage: string;
    
//     // Additional info
//     description: string;
//     dosage: string;
//     sellPrice: number | string;
//     buyPrice: number | string;
//   }
  
//   // Drug label settings form data (for multilingual configuration)
//   export interface DrugLabelFormData {
//     scientificName: MultilingualOption;
//     printName: MultilingualOption;
//     indications: MultilingualOption;
//     unit: MultilingualOption;
//     instruction: MultilingualOption;
//     timing: MultilingualOption;
//     usage: MultilingualOption;
//   }
  
//   // API Response types
//   export interface ApiResponse<T> {
//     status: string;
//     pagination?: Pagination;
//     data: T;
//     message?: string;
//   }
  
//   // API specific response types
//   export interface ApiDrugListResponse {
//     status: string;
//     results: number;
//     pagination: Pagination;
//     data: {
//       drugs: ApiDrug[];
//     };
//   }
  
//   export interface ApiSingleDrugResponse {
//     status: string;
//     data: {
//       drug: ApiDrug;
//     };
//   }
  
//   export interface CreateDrugResponse {
//     drug: ApiDrug;
//   }
  
//   // Helper type for language preference
//   export type Language = 'th' | 'en';
  
//   // Utility interface for option selection in UI
//   export interface OptionSelection {
//     value: string; // The displayed value in current language
//     data: MultilingualOption; // The full multilingual data
//   }
  
//   // Interface for table display (transformed from ApiDrug)
//   export interface DrugTableRow {
//     id: string;
//     code: string;              // รหัสยา
//     name: string;              // ชื่อยา
//     scientificName: string;    // ชื่อทางวิทยาศาสตร์
//     category: string;          // หมวดหมู่
//     unit: string;              // หน่วย
//     sellPrice: string;         // ราคาขาย
//     stock?: string;            // สต็อก (อาจจะเพิ่มในอนาคต)
//     // Include original drug data for row click
//     originalData: ApiDrug;
//   }
  
//   // Drug search/filter interface
//   export interface DrugSearchParams {
//     page?: number;
//     limit?: number;
//     search?: string;           // ค้นหาจากชื่อยา, รหัสยา, ชื่อทางวิทยาศาสตร์
//     branchId?: string;
//     categoryId?: string;       // หมวดหมู่ยา
//     subcategoryId?: string;    // หมวดหมู่ย่อย
//     status?: string;           // active, inactive
//     lang?: string;
//   }
  
//   // Drug statistics interface (for dashboard)
//   export interface DrugStatistics {
//     totalDrugs: number;
//     activeDrugs: number;
//     inactiveDrugs: number;
//     categoriesCount: number;
//     avgPrice: number;
//     totalValue: number;
//   }

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Multilingual interface for drug options and fields
export interface MultilingualOption {
  th: string;
  en?: string;
}

// Drug option categories that can be customized per clinic/branch
export type DrugOptionCategory = 
  | 'drugCategory'
  | 'drugSubcategory'
  | 'unit'
  | 'dosageMethod'
  | 'dosageTime';

// Extended multilingual interface for drug fields
export interface DrugMultilingualText {
  th?: string;
  en?: string;
  [key: string]: string | undefined;
}

// Backend API Drug interface (matches API response structure)
export interface ApiDrug {
  id: string;
  _id?: string;               // Backend อาจส่งมาเป็น _id
  clinicId: string;
  branchId?: string;
  
  // Basic fields (from backend)
  drugCode: string;           // รหัสยา
  drugName: string;           // ชื่อยา
  category: string;           // หมวดหมู่ยา
  subcategory: string;        // หมวดหมู่ย่อย
  dosage: string;             // ขนาด
  unit: string;               // หน่วย
  sellingPrice: number;       // ราคาขาย
  
  // Optional fields
  scientificName?: string;    // ชื่อทางวิทยาศาสตร์
  printName?: string;         // ชื่อสำหรับพิมพ์
  indications?: string;       // ข้อบ่งใช้
  description?: string;       // รายละเอียด
  dosageMethod?: string;      // วิธีใช้
  dosageTime?: string;        // เวลาใช้
  instructions?: string;      // คำแนะนำการใช้
  purchasePrice?: number;     // ราคาซื้อ
  
  // Status
  isActive: boolean;
  isArchived: boolean;
  
  // Metadata
  createdBy?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    id: string;
  };
  updatedBy?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  
  // Virtual fields (calculated by backend)
  profitMargin?: number;
  profitAmount?: number;
  
  // Multilingual support (when label config is set)
  multilingualData?: {
    scientificName?: DrugMultilingualText;
    printName?: DrugMultilingualText;
    indications?: DrugMultilingualText;
    instructions?: DrugMultilingualText;
    unit?: DrugMultilingualText;
    dosageMethod?: DrugMultilingualText;
    dosageTime?: DrugMultilingualText;
  };
}

// Create drug request interface (for API submission)
export interface CreateDrugRequest {
  branchId?: string;
  drugCode?: string;           // Auto-generated if not provided
  drugName: string;
  category: string;
  subcategory: string;
  dosage: string;
  unit: string;
  sellingPrice: number;
  scientificName?: string;
  printName?: string;
  indications?: string;
  description?: string;
  dosageMethod?: string;
  dosageTime?: string;
  instructions?: string;
  purchasePrice?: number;
  isActive?: boolean;          // Default: true
}

// Update drug request interface
export interface UpdateDrugRequest extends Partial<CreateDrugRequest> {
  isArchived?: boolean;
}

// Drug option response for multilingual
export interface DrugOptionResponse {
  status: string;
  data: {
    category: string;
    values: MultilingualOption[];
  };
}

// All dropdown options response
export interface DrugDropdownOptionsResponse {
  status: string;
  data: {
    options: {
      drugCategories: MultilingualOption[];
      drugSubcategories: MultilingualOption[];
      units: MultilingualOption[];
      dosageMethods: MultilingualOption[];
      dosageTimes: MultilingualOption[];
    };
  };
}

// Create drug option request
export interface CreateDrugOptionRequest {
  value?: MultilingualOption | string;
  th?: string;
  en?: string;
  branchId?: string;
}

// Drug options state with multilingual support
export interface DrugOptions {
  categories: MultilingualOption[];     // หมวดหมู่ยา
  subcategories: MultilingualOption[];  // หมวดหมู่ย่อย
  units: MultilingualOption[];          // หน่วย
  instructions: MultilingualOption[];   // วิธีใช้ (dosageMethod)
  timings: MultilingualOption[];        // เวลาใช้ (dosageTime)
}

// Form data interface for drug creation/editing (for display in UI)
export interface DrugFormData {
  // Basic Info
  branchId: string;
  category: string;           // Display value
  subcategory: string;        // Display value
  code: string;               // drugCode
  name: string;               // drugName
  
  // Scientific fields
  scientificName: string;
  printName: string;
  indications: string;
  unit: string;              // Display value
  instruction: string;       // dosageMethod display value
  timing: string;            // dosageTime display value
  usage: string;             // instructions
  
  // Additional info
  description: string;
  dosage: string;
  sellPrice: number | string;  // sellingPrice
  buyPrice: number | string;   // purchasePrice
}

// Drug label settings form data (for multilingual configuration)
export interface DrugLabelFormData {
  drugId: string;
  languages: string[];
  showFields: {
    scientificName: boolean;
    printName: boolean;
    indications: boolean;
    instructions: boolean;
    dosageMethod: boolean;
    dosageTime: boolean;
  };
  customTranslations?: {
    [fieldName: string]: DrugMultilingualText;
  };
}

// Search/filter parameters
export interface DrugSearchParams {
  page?: number;
  limit?: number;
  q?: string;                // searchTerm
  branchId?: string;
  category?: string;
  subcategory?: string;
  drugName?: string;
  drugCode?: string;
  isActive?: boolean;
  isArchived?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'drugName' | 'drugCode' | 'category' | 'sellingPrice' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T> {
  status: string;
  results?: number;
  pagination?: Pagination;
  data: T;
  message?: string;
}

// Specific API response types
export interface ApiDrugListResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    drugs: ApiDrug[];
  };
}

export interface ApiSingleDrugResponse {
  status: string;
  data: {
    drug: ApiDrug;
  };
}

export interface ApiDrugSearchResponse {
  status: string;
  results: number;
  pagination: Pagination;
  data: {
    drugs: ApiDrug[];
    searchTerm: string;
  };
}

// Helper type for language preference
export type Language = 'th' | 'en';

// Utility interface for option selection in UI
export interface OptionSelection {
  value: string; // The displayed value in current language
  data: MultilingualOption; // The full multilingual data
}

// Interface for table display (transformed from ApiDrug)
export interface DrugTableRow {
  id: string;
  drugCode: string;          // รหัสยา
  drugName: string;          // ชื่อยา
  scientificName?: string;   // ชื่อทางวิทยาศาสตร์
  category: string;          // หมวดหมู่
  unit: string;              // หน่วย
  sellingPrice: string;      // ราคาขาย
  stock?: string;            // สต็อก (future)
  isActive: boolean;
  // Include original drug data for row click
  originalData: ApiDrug;
}

// Drug statistics interface (for dashboard)
export interface DrugStatistics {
  totalDrugs: number;
  activeDrugs: number;
  inactiveDrugs: number;
  categoriesCount: number;
  avgPrice: number;
  totalValue: number;
}

// Bulk operation interfaces
export interface DrugBulkOperation {
  action: 'create' | 'update' | 'delete' | 'archive' | 'activate';
  drugIds?: string[];
  data?: CreateDrugRequest | UpdateDrugRequest;
  filter?: DrugSearchParams;
}

export interface DrugBulkOperationResponse {
  status: string;
  data: {
    success: number;
    failed: number;
    errors: Array<{ operation: DrugBulkOperation; error: string }>;
  };
}

// Export interfaces
export interface DrugExportParams {
  format?: 'csv' | 'excel' | 'json';
  includeMultilingual?: boolean;
  branchId?: string;
  category?: string;
  subcategory?: string;
  isActive?: boolean;
  isArchived?: boolean;
}

// Legacy interfaces for backward compatibility
export interface CreateDrugResponse {
  drug: ApiDrug;
}

// Legacy multilingual support (mapped to new format)
export interface DrugMultilingualFields {
  scientificName: MultilingualOption;
  printName?: MultilingualOption;
  indications?: MultilingualOption;
  unit: MultilingualOption;
  instruction?: MultilingualOption;
  timing?: MultilingualOption;
  usage?: MultilingualOption;
}

// Type guards and utilities
export function isMultilingualOption(value: any): value is MultilingualOption {
  return value && typeof value === 'object' && typeof value.th === 'string';
}

export function isApiDrug(value: any): value is ApiDrug {
  return value && typeof value === 'object' && 
    typeof value.id === 'string' &&
    typeof value.drugCode === 'string' &&
    typeof value.drugName === 'string';
}

// Helper function to convert old format to new format
export function convertLegacyDrug(oldDrug: any): ApiDrug {
  return {
    id: oldDrug.id || oldDrug._id,
    _id: oldDrug._id,
    clinicId: oldDrug.clinicId || oldDrug.branchId,
    branchId: oldDrug.branchId,
    drugCode: oldDrug.code || oldDrug.drugCode,
    drugName: oldDrug.name || oldDrug.drugName,
    category: oldDrug.category,
    subcategory: oldDrug.subcategory,
    dosage: oldDrug.dosage || '',
    unit: oldDrug.unit,
    sellingPrice: oldDrug.sellPrice || oldDrug.sellingPrice || 0,
    scientificName: oldDrug.scientificName,
    printName: oldDrug.printName,
    indications: oldDrug.indications,
    description: oldDrug.description,
    dosageMethod: oldDrug.instruction || oldDrug.dosageMethod,
    dosageTime: oldDrug.timing || oldDrug.dosageTime,
    instructions: oldDrug.usage || oldDrug.instructions,
    purchasePrice: oldDrug.buyPrice || oldDrug.purchasePrice,
    isActive: oldDrug.isActive ?? true,
    isArchived: oldDrug.isArchived ?? false,
    createdBy: oldDrug.createdBy,
    updatedBy: oldDrug.updatedBy,
    createdAt: oldDrug.createdAt || new Date().toISOString(),
    updatedAt: oldDrug.updatedAt || new Date().toISOString(),
    multilingualData: oldDrug.multilingualFields || oldDrug.multilingualData
  };
}

// Helper function to get drug ID (handle both id and _id)
export function getDrugId(drug: ApiDrug | any): string {
  return drug.id || drug._id || '';
}

// Helper function to ensure drug has id field
export function normalizeDrug(drug: any): ApiDrug {
  if (!drug.id && drug._id) {
    drug.id = drug._id;
  }
  return drug as ApiDrug;
}