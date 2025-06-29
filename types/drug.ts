export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  // Multilingual interface for drug options and fields
  export interface MultilingualOption {
    th: string;
    en: string;
  }
  
  // Drug option categories that can be customized per clinic/branch
  export type DrugOptionCategory = 
    | 'category'        // หมวดหมู่ยา
    | 'subcategory'     // หมวดหมู่ย่อย
    | 'unit'            // หน่วย
    | 'instruction'     // วิธีใช้
    | 'timing';         // เวลาใช้
  
  // Drug multilingual fields interface (for API responses)
  export interface DrugMultilingualFields {
    scientificName: MultilingualOption;  // ชื่อทางวิทยาศาสตร์
    printName?: MultilingualOption;      // ชื่อสำหรับพิมพ์
    indications?: MultilingualOption;    // ข้อบ่งใช้
    unit: MultilingualOption;            // หน่วย
    instruction?: MultilingualOption;    // วิธีใช้
    timing?: MultilingualOption;         // เวลาใช้
    usage?: MultilingualOption;          // คำแนะนำการใช้
  }
  
  // API Drug interface (matches API response structure)
  export interface ApiDrug {
    id: string;
    branchId: string;
    branchName: string;
    category: string;           // หมวดหมู่ยา
    subcategory: string;        // หมวดหมู่ย่อย
    code: string;               // รหัสยา
    name: string;               // ชื่อยา
    scientificName: string;     // ชื่อทางวิทยาศาสตร์ (ตามภาษาปัจจุบัน)
    printName?: string;         // ชื่อสำหรับพิมพ์ (ตามภาษาปัจจุบัน)
    indications?: string;       // ข้อบ่งใช้ (ตามภาษาปัจจุบัน)
    description?: string;       // รายละเอียด
    dosage?: string;            // ขนาด
    unit: string;               // หน่วย (ตามภาษาปัจจุบัน)
    instruction?: string;       // วิธีใช้ (ตามภาษาปัจจุบัน)
    timing?: string;            // เวลาใช้ (ตามภาษาปัจจุบัน)
    usage?: string;             // คำแนะนำการใช้ (ตามภาษาปัจจุบัน)
    sellPrice: number;          // ราคาขาย
    buyPrice?: number;          // ราคาซื้อ
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    
    // Full multilingual data (for label settings)
    multilingualFields?: DrugMultilingualFields;
  }
  
  // Create drug request interface with multilingual support (for form submission)
  export interface CreateDrugRequest {
    branchId: string;
    category: MultilingualOption;        // หมวดหมู่ยา
    subcategory: MultilingualOption;     // หมวดหมู่ย่อย
    code: string;                        // รหัสยา
    name: string;                        // ชื่อยา
    scientificName: MultilingualOption;  // ชื่อทางวิทยาศาสตร์
    printName?: MultilingualOption;      // ชื่อสำหรับพิมพ์
    indications?: MultilingualOption;    // ข้อบ่งใช้
    description?: string;                // รายละเอียด
    dosage?: string;                     // ขนาด
    unit: MultilingualOption;            // หน่วย
    instruction?: MultilingualOption;    // วิธีใช้
    timing?: MultilingualOption;         // เวลาใช้
    usage?: MultilingualOption;          // คำแนะนำการใช้
    sellPrice: number;                   // ราคาขาย
    buyPrice?: number;                   // ราคาซื้อ
  }
  
  // Drug option response for multilingual
  export interface DrugOptionResponse {
    status: string;
    data: {
      category: string;
      values: MultilingualOption[];
    };
  }
  
  // Create drug option request
  export interface CreateDrugOptionRequest {
    value: MultilingualOption;
  }
  
  // Drug options state with multilingual support
  export interface DrugOptions {
    categories: MultilingualOption[];     // หมวดหมู่ยา
    subcategories: MultilingualOption[];  // หมวดหมู่ย่อย
    units: MultilingualOption[];          // หน่วย
    instructions: MultilingualOption[];   // วิธีใช้
    timings: MultilingualOption[];        // เวลาใช้
  }
  
  // Form data interface for drug creation/editing (for display in UI)
  export interface DrugFormData {
    // Basic Info
    branchId: string;
    category: string;           // Display value
    subcategory: string;        // Display value
    code: string;
    name: string;
    
    // Multilingual fields (current language display)
    scientificName: string;
    printName: string;
    indications: string;
    unit: string;              // Display value
    instruction: string;       // Display value
    timing: string;            // Display value
    usage: string;
    
    // Additional info
    description: string;
    dosage: string;
    sellPrice: number | string;
    buyPrice: number | string;
  }
  
  // Drug label settings form data (for multilingual configuration)
  export interface DrugLabelFormData {
    scientificName: MultilingualOption;
    printName: MultilingualOption;
    indications: MultilingualOption;
    unit: MultilingualOption;
    instruction: MultilingualOption;
    timing: MultilingualOption;
    usage: MultilingualOption;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    status: string;
    pagination?: Pagination;
    data: T;
    message?: string;
  }
  
  // API specific response types
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
  
  export interface CreateDrugResponse {
    drug: ApiDrug;
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
    code: string;              // รหัสยา
    name: string;              // ชื่อยา
    scientificName: string;    // ชื่อทางวิทยาศาสตร์
    category: string;          // หมวดหมู่
    unit: string;              // หน่วย
    sellPrice: string;         // ราคาขาย
    stock?: string;            // สต็อก (อาจจะเพิ่มในอนาคต)
    // Include original drug data for row click
    originalData: ApiDrug;
  }
  
  // Drug search/filter interface
  export interface DrugSearchParams {
    page?: number;
    limit?: number;
    search?: string;           // ค้นหาจากชื่อยา, รหัสยา, ชื่อทางวิทยาศาสตร์
    branchId?: string;
    categoryId?: string;       // หมวดหมู่ยา
    subcategoryId?: string;    // หมวดหมู่ย่อย
    status?: string;           // active, inactive
    lang?: string;
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