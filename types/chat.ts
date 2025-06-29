// export interface ChatUser {
//     userId: string;
//     displayName: string;
//     lastMessage: string;
//     timestamp: string;
//     source: 'user' | 'admin';
//     pictureUrl?: string;
//     statusMessage?: string;
//     active?: boolean;
//   }
  
//   export interface ChatMessage {
//     _id: string;
//     chatAccountId: string;
//     senderId: string;
//     text: string;
//     source: 'user' | 'admin' | 'bot';
//     messageType: 'text' | 'image' | 'flex' | 'sticker' | 'file';
//     timestamp: string;
//     createdAt: string;
//     updatedAt: string;
    
//     // สำหรับ sticker
//     stickerId?: string;
//     packageId?: string;
    
//     // สำหรับไฟล์
//     fileName?: string;
//     fileUrl?: string;
//     fileSize?: number;
//     fileType?: string;
//   }
  
//   export interface UserProfile {
//     userId: string;
//     displayName: string;
//     pictureUrl: string;
//     statusMessage: string;
//     language: string;
    
//     // ข้อมูลเพิ่มเติมที่อาจจัดเก็บในอนาคต
//     hn?: string;
//     medicalCondition?: string;
//     drugAllergy?: string;
//   }
  
//   // สำหรับ API response ที่ต้องการ success flag
//   export interface ApiResponse {
//     success: boolean;
//   }
  
//   // สำหรับระบบนัดหมาย แท็ก และการแชร์ที่อาจพัฒนาในอนาคต
//   export interface Appointment {
//     id: number;
//     status: 'confirmed' | 'pending' | 'cancelled';
//     treatment: string;
//     nextVisit?: string;
//     lastVisit?: string;
//     doctor: string;
//     createdAt: string;
//   }
  
//   export interface Tag {
//     id?: number;
//     name: string;
//   }
  
//   export interface VisibleAdmin {
//     id?: number;
//     name: string;
//   }

export interface ChatUser {
  userId: string;
  displayName: string;
  lastMessage: string;
  timestamp: string;
  source: 'user' | 'admin';
  pictureUrl?: string;
  statusMessage?: string;
  active?: boolean;
  platform?: 'line' | 'facebook';  // เพิ่มฟิลด์ platform เพื่อรู้ว่าเป็นผู้ใช้จากแพลตฟอร์มไหน
}

export interface ChatMessage {
  _id: string;
  chatAccountId: string;
  senderId: string;
  text: string;
  source: 'user' | 'admin' | 'bot';
  messageType: 'text' | 'image' | 'flex' | 'sticker' | 'file' | 'video' | 'audio' | 'template'; // เพิ่มประเภทข้อความของ Facebook
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  
  // เพิ่มข้อมูลของ Facebook
  messageId?: string;        // ID ของข้อความจาก Facebook
  platform?: 'line' | 'facebook';  // แพลตฟอร์มของข้อความ
  
  // สำหรับ sticker (LINE)
  stickerId?: string;
  packageId?: string;
  
  // สำหรับ Facebook Template
  templateType?: 'button' | 'generic' | 'receipt' | 'media';  // ประเภทเทมเพลตของ Facebook
  templateData?: any;  // ข้อมูลของเทมเพลต
  
  // สำหรับไฟล์
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  
  // สำหรับ Facebook Reaction
  reaction?: string;  // ปฏิกิริยาต่อข้อความ (เช่น 'like', 'love', 'haha')
  status?: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage?: string;  // อาจไม่มีใน Facebook
  language?: string;       // อาจไม่มีใน Facebook
  
  // ข้อมูลเพิ่มเติมที่อาจจัดเก็บในอนาคต
  hn?: string;
  medicalCondition?: string;
  drugAllergy?: string;
  
  // ข้อมูลเพิ่มเติมสำหรับ Facebook
  platform: 'line' | 'facebook';
  firstName?: string;
  lastName?: string;
  profileUrl?: string;  // URL ของโปรไฟล์ Facebook
  locale?: string;      // ภาษาท้องถิ่นของผู้ใช้ Facebook
}

// สำหรับ API response ที่ต้องการ success flag
export interface ApiResponse {
  success: boolean;
  messageId?: string;  // เพิ่ม messageId ที่ได้รับจาก API
  error?: string;      // ข้อความแสดงข้อผิดพลาด (ถ้ามี)
  fileUrl?: string;    // เพิ่ม URL ของไฟล์ที่ได้รับจาก API
}

// สำหรับการส่งเทมเพลตของ Facebook
export interface FacebookTemplate {
  type: 'template';
  payload: {
    template_type: 'button' | 'generic' | 'media' | 'receipt';
    text?: string;
    buttons?: FacebookButton[];
    elements?: FacebookElement[];
    // สำหรับเทมเพลตอื่นๆ
    [key: string]: any;
  };
}

export interface FacebookButton {
  type: 'postback' | 'web_url' | 'phone_number';
  title: string;
  payload?: string;  // สำหรับ postback
  url?: string;      // สำหรับ web_url
  webview_height_ratio?: 'compact' | 'tall' | 'full';  // สำหรับ web_url
}

export interface FacebookElement {
  title: string;
  subtitle?: string;
  image_url?: string;
  default_action?: {
    type: 'web_url';
    url: string;
    webview_height_ratio?: 'compact' | 'tall' | 'full';
  };
  buttons?: FacebookButton[];
}

export interface FacebookQuickReply {
  content_type: 'text' | 'location' | 'phone_number' | 'email';
  title?: string;
  payload?: string;
  image_url?: string;
}

// สำหรับระบบนัดหมาย แท็ก และการแชร์ที่อาจพัฒนาในอนาคต
export interface Appointment {
  id: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  treatment: string;
  nextVisit?: string;
  lastVisit?: string;
  doctor: string;
  createdAt: string;
  platform?: 'line' | 'facebook';  // เพิ่มแพลตฟอร์มที่สร้างการนัดหมาย
}

export interface Tag {
  id?: number;
  name: string;
  platform?: 'line' | 'facebook' | 'all';  // แท็กอาจใช้ได้กับทั้งสองแพลตฟอร์มหรือเฉพาะแพลตฟอร์มใดแพลตฟอร์มหนึ่ง
}

export interface VisibleAdmin {
  id?: number;
  name: string;
  platform?: 'line' | 'facebook' | 'all';  // ผู้ดูแลอาจดูแลทั้งสองแพลตฟอร์มหรือเฉพาะแพลตฟอร์มใดแพลตฟอร์มหนึ่ง
}