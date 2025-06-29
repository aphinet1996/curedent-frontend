// import type { ChatUser, ChatMessage, UserProfile, Appointment, Tag, VisibleAdmin, ApiResponse } from '~/types/chat';

// // สร้าง service สำหรับเชื่อมต่อกับ Line API ของ NestJS backend
// export const chatService = {
//   // ตั้งค่า base URL - ปรับตามสภาพแวดล้อมของคุณ
//   baseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',

//   // Helper เพื่อรับ auth token - ปรับตามระบบ auth ของคุณ
//   getAuthHeaders() {
//     // const token = useCookie('auth_token').value;
//     const token = "WExvRPwzLWgtKQ/YWev/HEyZ9CiCjuNusxxZeBrp5j5DqekubSLVyEnCSLI95zKwBtbZV8JUv03z+pqPNTPB4LtgmugKCpwB4z0GOcr+5+wV/ykMkIkWSEeO2vwqu3Bvds8GV4SHVlPZZDIthYMCZQdB04t89/1O/w1cDnyilFU="
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': token ? `Bearer ${token}` : ''
//     };
//   },

//   // ฟังก์ชัน fetch พร้อมจัดการข้อผิดพลาด
//   async fetchApi<T>(endpoint: string, options = {}): Promise<T> {
//     try {
//       const headers = this.getAuthHeaders();
//       const response = await $fetch<T>(`${this.baseUrl}${endpoint}`, {
//         headers,
//         ...options,
//       });

//       return response;
//     } catch (error: any) {
//       console.error(`API Error (${endpoint}):`, error.message);
//       throw error;
//     }
//   },

//   // ตัวแปรที่ใช้เก็บ chatAccountId
//   chatAccountId: computed(() => {
//     return useCookie('chat_account_id').value || '6804dd2ed64af4bbd9fa832d'; // เปลี่ยนเป็น default chatAccountId ของคุณ
//   }),

//   // รายการแชท
//   async getChatList(): Promise<ChatUser[]> {
//     return this.fetchApi<ChatUser[]>(`/line/chat-list/${this.chatAccountId.value}`);
//   },

//   // ข้อความแชท
//   async getMessages(userId: string): Promise<ChatMessage[]> {
//     return this.fetchApi<ChatMessage[]>(`/line/history/${this.chatAccountId.value}/${userId}`);
//   },

//   // ส่งข้อความ
//   async sendMessage(userId: string, text: string): Promise<ApiResponse> {
//     return this.fetchApi<ApiResponse>(`/line/send/${this.chatAccountId.value}/${userId}`, {
//       method: 'POST',
//       body: { message: text }
//     });
//   },

//   // ส่งไฟล์
//   async uploadFile(file: File, userId: string): Promise<ApiResponse> {
//     const formData = new FormData();
//     formData.append('file', file);

//     return this.fetchApi<ApiResponse>(`/line/upload-file/${this.chatAccountId.value}/${userId}`, {
//       method: 'POST',
//       body: formData,
//       // ไม่ต้องมี Content-Type header เมื่อใช้ FormData
//       headers: {
//         'Authorization': this.getAuthHeaders().Authorization
//       }
//     });
//   },

//   // ข้อมูลผู้ใช้
//   async getUserProfile(userId: string): Promise<UserProfile> {
//     return this.fetchApi<UserProfile>(`/line/user/${this.chatAccountId.value}/${userId}`);
//   },

//   // ฟังก์ชันต่อไปนี้เป็นตัวอย่างสำหรับฟีเจอร์เพิ่มเติมที่อาจพัฒนาในอนาคต

//   // นัดหมาย - ใช้เฉพาะเมื่อมี API endpoint
//   async getAppointments(userId: string): Promise<Appointment[]> {
//     // สำหรับตอนนี้ให้ return ข้อมูลเปล่า เนื่องจากยังไม่มี API endpoint
//     return [];
//     // เมื่อมี API แล้ว ให้ uncomment บรรทัดต่อไปนี้
//     // return this.fetchApi<Appointment[]>(`/line/appointments/${this.chatAccountId.value}/${userId}`);
//   },

//   // Tags - ใช้เฉพาะเมื่อมี API endpoint
//   async getTags(userId: string): Promise<Tag[]> {
//     // สำหรับตอนนี้ให้ return ข้อมูลเปล่า
//     return [];
//     // เมื่อมี API แล้ว ให้ uncomment บรรทัดต่อไปนี้
//     // return this.fetchApi<Tag[]>(`/line/tags/${this.chatAccountId.value}/${userId}`);
//   },

//   // Visible Admins - ใช้เฉพาะเมื่อมี API endpoint
//   async getVisibleAdmins(userId: string): Promise<VisibleAdmin[]> {
//     // สำหรับตอนนี้ให้ return ข้อมูลเปล่า
//     return [];
//     // เมื่อมี API แล้ว ให้ uncomment บรรทัดต่อไปนี้
//     // return this.fetchApi<VisibleAdmin[]>(`/line/visibility/${this.chatAccountId.value}/${userId}`);
//   }
// };

import type { ChatUser, ChatMessage, UserProfile, Appointment, Tag, VisibleAdmin, ApiResponse } from '~/types/chat';

// สร้าง service สำหรับเชื่อมต่อกับ Line และ Facebook API ของ NestJS backend
export const chatService = {
  // ตั้งค่า base URL - ปรับตามสภาพแวดล้อมของคุณ
  baseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',

  // Helper เพื่อรับ auth token ตามแพลตฟอร์ม
  getAuthHeaders() {
    const platform = this.platform.value;
    let token;

    if (platform === 'line') {
      // Token สำหรับ LINE
      token = "WExvRPwzLWgtKQ/YWev/HEyZ9CiCjuNusxxZeBrp5j5DqekubSLVyEnCSLI95zKwBtbZV8JUv03z+pqPNTPB4LtgmugKCpwB4z0GOcr+5+wV/ykMkIkWSEeO2vwqu3Bvds8GV4SHVlPZZDIthYMCZQdB04t89/1O/w1cDnyilFU=";
    } else if (platform === 'facebook') {
      // Token สำหรับ Facebook
      token = useCookie('fb_token').value || "EAAYDYKXeDC0BO6a9HU5nXRsZCoahpNZAIclQZBjaypZAiU5dxr6hbc5rKGmLcGB2FW6uvaGGDZCwobI1HkB2x5XyZC9mRmccQ7ZBND63rBaNPNSAkKD6BvxRZBp7MeoWmKwdoZAHcqdtYGwhtMrkKLWzB3XNoKouV0shz9RqmZCpSnn5Bk10GkvwukZCFZCDtZBwFd3AOQwZDZD";
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'X-Platform': platform // เพิ่ม header เพื่อแจ้ง platform ให้ backend รู้
    };
  },

  // ฟังก์ชัน fetch พร้อมจัดการข้อผิดพลาด
  async fetchApi<T>(endpoint: string, options = {}): Promise<T> {
    try {
      const headers = this.getAuthHeaders();
      const response = await $fetch<T>(`${this.baseUrl}${endpoint}`, {
        headers,
        ...options,
      });

      return response;
    } catch (error: any) {
      // จัดการข้อผิดพลาดที่เฉพาะเจาะจงมากขึ้น
      if (error.response) {
        // ข้อผิดพลาดจาก Server (มี status code)
        const status = error.response.status;
        if (status === 401 || status === 403) {
          console.error(`Authentication error: ${error.message}`);
          throw new Error('การตรวจสอบสิทธิ์ล้มเหลว กรุณาเข้าสู่ระบบใหม่');
        } else if (status >= 500) {
          console.error(`Server error: ${error.message}`);
          throw new Error('เซิร์ฟเวอร์มีปัญหา กรุณาลองอีกครั้งในภายหลัง');
        }
      } else if (error.request) {
        // ข้อผิดพลาดจาก Network (ไม่มีการตอบกลับ)
        console.error(`Network error: ${error.message}`);
        throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ');
      }

      // ข้อผิดพลาดอื่นๆ
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  },

  // ตัวแปรที่ใช้เก็บ chatAccountId
  chatAccountId: computed(() => {
    const platform = useCookie('chat_platform').value || 'line';

    // ใช้ chatAccountId ที่แตกต่างกันตามแพลตฟอร์ม
    if (platform === 'line') {
      return useCookie('line_chat_account_id').value || '6804dd2ed64af4bbd9fa832d'; // LINE account ID
    } else {
      return useCookie('fb_chat_account_id').value || '68108f40c211820f6324df7c'; // Facebook account ID
    }
  }),

  // ตัวแปรที่ใช้เก็บ platform (line หรือ facebook)
  platform: computed(() => {
    return useCookie('chat_platform').value || 'line'; // default เป็น line
  }),

  // ฟังก์ชันสำหรับเปลี่ยน platform
  setPlatform(platform: 'line' | 'facebook') {
    const platformCookie = useCookie('chat_platform');
    platformCookie.value = platform;
  },

  // รายการแชท
  async getChatList(): Promise<ChatUser[]> {
    const platform = this.platform.value;
    const endpoint = platform === 'line'
      ? `/line/chat-list/${this.chatAccountId.value}`
      : `/meta/chat-list/${this.chatAccountId.value}`;

    return this.fetchApi<ChatUser[]>(endpoint);
  },

  // ข้อความแชท
  async getMessages(userId: string, params?: { before?: string; after?: string; limit?: number }): Promise<ChatMessage[]> {
    const platform = this.platform.value;
    let endpoint = platform === 'line'
      ? `/line/history/${this.chatAccountId.value}/${userId}`
      : `/meta/history/${this.chatAccountId.value}/${userId}`;

    // เพิ่ม query parameters ถ้ามี
    if (params) {
      const queryParams = new URLSearchParams();

      if (params.before) queryParams.append('before', params.before);
      if (params.after) queryParams.append('after', params.after);
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.fetchApi<ChatMessage[]>(endpoint);
  },

  // ส่งข้อความ
  async sendMessage(userId: string, text: string): Promise<ApiResponse> {
    const platform = this.platform.value;
    const endpoint = platform === 'line'
      ? `/line/send/${this.chatAccountId.value}/${userId}`
      : `/meta/send/${this.chatAccountId.value}/${userId}`;

    return this.fetchApi<ApiResponse>(endpoint, {
      method: 'POST',
      body: { message: text, platform: this.platform.value }
    });
  },

  // ส่งข้อความพร้อมปุ่มหรือเทมเพลต (สำหรับ Facebook)
  async sendTemplate(userId: string, template: any): Promise<ApiResponse> {
    if (this.platform.value !== 'facebook') {
      throw new Error('Template messages are only supported on Facebook platform');
    }

    return this.fetchApi<ApiResponse>(`/meta/send-template/${this.chatAccountId.value}/${userId}`, {
      method: 'POST',
      body: { template, platform: 'facebook' }
    });
  },

  // ส่ง Flex Message (สำหรับ LINE)
  async sendFlexMessage(userId: string, flexContent: any): Promise<ApiResponse> {
    if (this.platform.value !== 'line') {
      throw new Error('Flex messages are only supported on LINE platform');
    }

    return this.fetchApi<ApiResponse>(`/line/send-flex/${this.chatAccountId.value}/${userId}`, {
      method: 'POST',
      body: { flex: flexContent }
    });
  },

  // ส่งไฟล์
  async uploadFile(file: File, userId: string, caption?: string): Promise<ApiResponse> {
    const platform = this.platform.value;
    const endpoint = platform === 'line'
      ? `/line/upload-file/${this.chatAccountId.value}/${userId}`
      : `/meta/upload-file/${this.chatAccountId.value}/${userId}`;

    const formData = new FormData();
    formData.append('file', file);

    // เพิ่ม caption สำหรับ Facebook (ถ้ามี)
    if (platform === 'facebook' && caption) {
      formData.append('caption', caption);
    }

    // เพิ่ม platform parameter
    formData.append('platform', this.platform.value);

    // สำหรับ FormData ต้องใช้เฉพาะ Authorization header
    const authHeader = {
      'Authorization': this.getAuthHeaders().Authorization,
      'X-Platform': this.platform.value
    };

    return this.fetchApi<ApiResponse>(endpoint, {
      method: 'POST',
      body: formData,
      headers: authHeader
    });
  },

  // ข้อมูลผู้ใช้
  async getUserProfile(userId: string): Promise<UserProfile> {
    const platform = this.platform.value;
    const endpoint = platform === 'line'
      ? `/line/user/${this.chatAccountId.value}/${userId}`
      : `/meta/user/${this.chatAccountId.value}/${userId}?platform=${platform}`;

    return this.fetchApi<UserProfile>(endpoint);
  },

  // ฟังก์ชันต่อไปนี้เป็นตัวอย่างสำหรับฟีเจอร์เพิ่มเติมที่อาจพัฒนาในอนาคต

  // นัดหมาย - ใช้เฉพาะเมื่อมี API endpoint
  async getAppointments(userId: string): Promise<Appointment[]> {
    // สำหรับตอนนี้ให้ return ข้อมูลเปล่า เนื่องจากยังไม่มี API endpoint
    return [];
    // เมื่อมี API แล้ว ให้ uncomment บรรทัดต่อไปนี้
    // const platform = this.platform.value;
    // const endpoint = platform === 'line' 
    //   ? `/line/appointments/${this.chatAccountId.value}/${userId}`
    //   : `/meta/appointments/${this.chatAccountId.value}/${userId}`;
    // return this.fetchApi<Appointment[]>(endpoint);
  },

  // Tags - ใช้เฉพาะเมื่อมี API endpoint
  async getTags(userId: string): Promise<Tag[]> {
    // สำหรับตอนนี้ให้ return ข้อมูลเปล่า
    return [];
    // เมื่อมี API แล้ว ให้ uncomment บรรทัดต่อไปนี้
    // const platform = this.platform.value;
    // const endpoint = platform === 'line' 
    //   ? `/line/tags/${this.chatAccountId.value}/${userId}`
    //   : `/meta/tags/${this.chatAccountId.value}/${userId}`;
    // return this.fetchApi<Tag[]>(endpoint);
  },

  // Visible Admins - ใช้เฉพาะเมื่อมี API endpoint
  async getVisibleAdmins(userId: string): Promise<VisibleAdmin[]> {
    // สำหรับตอนนี้ให้ return ข้อมูลเปล่า
    return [];
    // เมื่อมี API แล้ว ให้ uncomment บรรทัดต่อไปนี้
    // const platform = this.platform.value;
    // const endpoint = platform === 'line' 
    //   ? `/line/visibility/${this.chatAccountId.value}/${userId}`
    //   : `/meta/visibility/${this.chatAccountId.value}/${userId}`;
    // return this.fetchApi<VisibleAdmin[]>(endpoint);
  }
};