// import { defineStore } from 'pinia';
// import { chatService } from '~/services/chat';
// import type { ChatUser, ChatMessage, UserProfile, Appointment, Tag, VisibleAdmin } from '~/types/chat';
// import { Socket } from 'socket.io-client';

// export const useChatStore = defineStore('chat', {
//   state: () => ({
//     users: [] as ChatUser[],
//     activeUserId: null as string | null,

//     messages: [] as ChatMessage[],

//     userProfile: null as UserProfile | null,
//     appointments: [] as Appointment[],
//     tags: [] as Tag[],
//     visibleAdmins: [] as VisibleAdmin[],

//     loading: {
//       users: false,
//       messages: false,
//       profile: false,
//       appointments: false,
//       tags: false,
//       visibleAdmins: false
//     },
//     error: null as string | null,

//     sending: false,

//     socket: null as Socket | null,
//     isSocketConnected: false,
//     pendingMessages: new Set<string>()
//   }),

//   getters: {
//     activeUser: (state) => state.users.find(user => user.userId === state.activeUserId) || null,

//     sortedMessages: (state) => {
//       return [...state.messages].sort((a, b) => {
//         const dateA = new Date(a.timestamp).getTime();
//         const dateB = new Date(b.timestamp).getTime();
//         return dateA - dateB;
//       });
//     },

//     currentAppointment: (state) => {
//       if (!state.appointments.length) return null;
//       return state.appointments[0];
//     }
//   },

//   actions: {
//     async fetchChatList() {
//       this.loading.users = true;
//       this.error = null;

//       try {
//         this.users = await chatService.getChatList();

//         if (this.activeUserId) {
//           this.users.forEach(user => {
//             user.active = user.userId === this.activeUserId;
//           });
//         }
//       } catch (error: any) {
//         this.error = error.message || 'ไม่สามารถดึงข้อมูลรายการแชทได้';
//       } finally {
//         this.loading.users = false;
//       }
//     },

//     async fetchMessages() {
//       if (!this.activeUserId) return;

//       this.loading.messages = true;
//       this.error = null;

//       try {
//         this.messages = await chatService.getMessages(this.activeUserId);
//       } catch (error: any) {
//         this.error = error.message || 'ไม่สามารถดึงข้อมูลข้อความได้';
//       } finally {
//         this.loading.messages = false;
//       }
//     },

//     async sendMessage(text: string) {
//       if (!this.activeUserId || !text.trim()) return false;

//       this.error = null;
//       this.sending = true;

//       try {
//         // สร้าง ID ชั่วคราวสำหรับข้อความ
//         const tempId = `temp-${Date.now()}`;

//         // เพิ่มข้อความลงในสถานะก่อนส่ง API (เพื่อการตอบสนองที่เร็ว)
//         const newMessage: ChatMessage = {
//           _id: tempId,
//           chatAccountId: chatService.chatAccountId.value,
//           senderId: this.activeUserId,
//           text: text,
//           source: 'admin',
//           messageType: 'text',
//           timestamp: new Date().toISOString(),
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString()
//         };

//         this.messages.push(newMessage);
//         this.pendingMessages.add(tempId); // เพิ่มเข้าไปในรายการข้อความที่รอ

//         // อัพเดต UI ของรายการแชท
//         const userIndex = this.users.findIndex(u => u.userId === this.activeUserId);
//         if (userIndex !== -1) {
//           this.users[userIndex].lastMessage = text;
//           this.users[userIndex].timestamp = new Date().toISOString();
//           this.users[userIndex].source = 'admin';
//         }

//         // ส่งข้อความผ่าน API
//         const response = await chatService.sendMessage(this.activeUserId, text);

//         if (!response.success) {
//           throw new Error('ส่งข้อความไม่สำเร็จ');
//         }

//         return true;
//       } catch (error: any) {
//         this.error = error.message || 'ไม่สามารถส่งข้อความได้';
//         return false;
//       } finally {
//         this.sending = false;
//       }
//     },

//     async uploadAndSendFile(file: File) {
//       if (!this.activeUserId || !file) return false;

//       this.error = null;
//       this.sending = true;

//       try {
//         const response = await chatService.uploadFile(file, this.activeUserId);

//         if (response.success) {
//           return true;
//         } else {
//           throw new Error('ส่งไฟล์ไม่สำเร็จ');
//         }
//       } catch (error: any) {
//         this.error = error.message || 'ไม่สามารถส่งไฟล์ได้';
//         return false;
//       } finally {
//         this.sending = false;
//       }
//     },

//     async fetchUserProfile() {
//       if (!this.activeUserId) return;

//       this.loading.profile = true;
//       this.error = null;

//       try {
//         this.userProfile = await chatService.getUserProfile(this.activeUserId);
//       } catch (error: any) {
//         this.error = error.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้';
//       } finally {
//         this.loading.profile = false;
//       }
//     },

//     // Appointments
//     async fetchAppointments() {
//       if (!this.activeUserId) return;

//       this.loading.appointments = true;
//       this.error = null;

//       try {
//         this.appointments = await chatService.getAppointments(this.activeUserId);
//       } catch (error: any) {
//         this.appointments = [];
//       } finally {
//         this.loading.appointments = false;
//       }
//     },

//     // Tags
//     async fetchTags() {
//       if (!this.activeUserId) return;

//       this.loading.tags = true;
//       this.error = null;

//       try {
//         this.tags = await chatService.getTags(this.activeUserId);
//       } catch (error: any) {
//         this.tags = [];
//       } finally {
//         this.loading.tags = false;
//       }
//     },

//     // Visible Admins
//     async fetchVisibleAdmins() {
//       if (!this.activeUserId) return;

//       this.loading.visibleAdmins = true;
//       this.error = null;

//       try {
//         this.visibleAdmins = await chatService.getVisibleAdmins(this.activeUserId);
//       } catch (error: any) {
//         this.visibleAdmins = [];
//       } finally {
//         this.loading.visibleAdmins = false;
//       }
//     },

//     setupSocketConnection() {
//       const nuxtApp = useNuxtApp()
//       const socket = nuxtApp.$socket

//       if (!socket) {
//         console.error('Socket is not available')
//         return
//       }

//       // เก็บ socket instance ใน state
//       this.socket = socket

//       // ตั้งค่า event listeners
//       socket.on('connect', () => {
//         console.log('Socket connected')
//         this.isSocketConnected = true

//         // เข้าร่วมห้องแชทตาม activeUserId (ถ้ามี)
//         if (this.activeUserId) {
//           this.joinChatRoom()
//         }
//       })

//       socket.on('disconnect', () => {
//         console.log('Socket disconnected')
//         this.isSocketConnected = false
//       })

//       socket.on('newMessage', (message: ChatMessage) => {
//         console.log('New message received via socket:', message);

//         // ตรวจสอบว่าเป็นข้อความสำหรับ user ที่กำลังดูอยู่หรือไม่
//         if (message.senderId === this.activeUserId) {
//           // ตรวจสอบว่าข้อความนี้ซ้ำกับข้อความที่เพิ่งส่งหรือไม่
//           const messageText = message.text;
//           const messageSource = message.source;

//           // ถ้ามีข้อความที่รอและเป็นข้อความจาก admin (ข้อความที่เราเพิ่งส่ง)
//           if (messageSource === 'admin' && this.pendingMessages.size > 0) {
//             // ค้นหาข้อความชั่วคราวที่ตรงกับข้อความจาก WebSocket
//             const tempMessageIndex = this.messages.findIndex(msg =>
//               msg.text === messageText &&
//               msg.source === 'admin' &&
//               msg._id.startsWith('temp-')
//             );

//             if (tempMessageIndex !== -1) {
//               // ถ้าเจอข้อความชั่วคราว ให้แทนที่ด้วยข้อความจริง
//               const tempId = this.messages[tempMessageIndex]._id;
//               this.messages[tempMessageIndex] = message;
//               this.pendingMessages.delete(tempId);
//               return; // ไม่ต้องเพิ่มข้อความใหม่
//             }
//           }

//           // ถ้าไม่มีข้อความชั่วคราวที่ตรงกัน หรือเป็นข้อความจาก user ให้เพิ่มตามปกติ
//           const isDuplicate = this.messages.some(msg => msg._id === message._id);
//           if (!isDuplicate) {
//             this.messages.push(message);

//             // เรียงลำดับข้อความตามเวลา
//             this.messages.sort((a, b) => {
//               return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
//             });
//           }

//           // อัพเดตข้อความล่าสุดใน users list
//           const userIndex = this.users.findIndex(u => u.userId === message.senderId);
//           if (userIndex !== -1) {
//             this.users[userIndex].lastMessage = message.text;
//             this.users[userIndex].timestamp = message.timestamp;
//             this.users[userIndex].source = message.source as any;
//           }
//         } else {
//           // จัดการข้อความจาก user อื่นเหมือนเดิม
//         }
//       })

//       // const userIndex = this.users.findIndex(u => u.userId === message.senderId);
//       // if (userIndex !== -1) {
//       //   this.users[userIndex].lastMessage = message.text;
//       //   this.users[userIndex].timestamp = message.timestamp;
//       //   this.users[userIndex].source = message.source as any;

//       // เริ่มเชื่อมต่อ socket
//       if (!socket.connected) {
//         socket.connect()
//       }
//     },

//     joinChatRoom() {
//       if (!this.socket || !this.activeUserId || !this.isSocketConnected) {
//         console.warn('Cannot join room: Socket not connected or no active user');
//         return;
//       }

//       // ใช้ chatAccountId จาก chatService
//       const chatAccountId = chatService.chatAccountId.value
//       const senderId = this.activeUserId

//       console.log(`Joining room for: ${chatAccountId}:${senderId}`)
//       this.socket.emit('joinRoom', { chatAccountId, senderId })

//       this.socket.once('joinRoom', (response) => {
//         if (response && response.success) {
//           console.log('Successfully joined room:', response.room);
//         } else {
//           console.error('Failed to join room:', response ? response.error : 'Unknown error');
//         }
//       });
//     },

//     setActiveUser(userId: string) {
//       this.activeUserId = userId

//       this.users.forEach(user => {
//         user.active = user.userId === userId
//       })

//       // เรียกใช้ methods เดิม
//       this.fetchMessages()
//       this.fetchUserProfile()
//       this.fetchAppointments()
//       this.fetchTags()
//       this.fetchVisibleAdmins()

//       // เพิ่มการเข้าร่วมห้องแชท
//       this.joinChatRoom()
//     },

//     cleanupSocketConnection() {
//       if (this.socket) {
//         // ลบ event listeners ที่ไม่ต้องการแล้ว
//         this.socket.off('connect')
//         this.socket.off('disconnect')
//         this.socket.off('newMessage')

//         // ตัดการเชื่อมต่อ socket ถ้าต้องการ
//         // this.socket.disconnect()
//       }
//     }

//   }
// });

import { defineStore } from 'pinia';
import { chatService } from '~/services/chat';
import type { ChatUser, ChatMessage, UserProfile, Appointment, Tag, VisibleAdmin, FacebookTemplate } from '~/types/chat';
import { Socket } from 'socket.io-client';

export const useChatStore = defineStore('chat', {
  state: () => ({
    // เปลี่ยนจาก users array เดียวเป็น object ที่แยกตามแพลตฟอร์ม
    usersMap: {
      line: [] as ChatUser[],
      facebook: [] as ChatUser[]
    },
    activeUserId: null as string | null,

    messages: [] as ChatMessage[],

    userProfile: null as UserProfile | null,
    appointments: [] as Appointment[],
    tags: [] as Tag[],
    visibleAdmins: [] as VisibleAdmin[],

    loading: {
      users: false,
      messages: false,
      profile: false,
      appointments: false,
      tags: false,
      visibleAdmins: false,
      moreMessages: false,
    },
    error: null as string | null,

    sending: false,

    socket: null as Socket | null,
    isSocketConnected: false,
    pendingMessages: new Set<string>(),
    hasMoreMessages: true,

    // เพิ่ม state สำหรับ platform
    currentPlatform: computed(() => chatService.platform.value)
  }),

  getters: {
    // เพิ่ม getter สำหรับรวมผู้ใช้จากทุกแพลตฟอร์ม
    allUsers: (state) => {
      return [...state.usersMap.line, ...state.usersMap.facebook].sort((a, b) => {
        // เรียงตามเวลาล่าสุด
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    },

    activeUser: (state) => {
      // ค้นหาในทั้งสองแพลตฟอร์ม
      const lineUser = state.usersMap.line.find(user => user.userId === state.activeUserId);
      const fbUser = state.usersMap.facebook.find(user => user.userId === state.activeUserId);
      return lineUser || fbUser || null;
    },

    sortedMessages: (state) => {
      return [...state.messages].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateA - dateB;
      });
    },

    currentAppointment: (state) => {
      if (!state.appointments.length) return null;
      return state.appointments[0];
    },

    // เพิ่ม getters สำหรับตรวจสอบประเภทของแพลตฟอร์ม
    isLine: (state) => state.currentPlatform === 'line',
    isFacebook: (state) => state.currentPlatform === 'facebook'
  },

  actions: {
    // เพิ่ม action สำหรับเปลี่ยนแพลตฟอร์ม
    switchPlatform(platform: 'line' | 'facebook') {
      chatService.setPlatform(platform);

      // โหลดข้อมูลใหม่ถ้าจำเป็น (แต่ไม่ต้องรีเซ็ตข้อมูลเก่าแล้ว)
      if (
        (platform === 'line' && this.usersMap.line.length === 0) ||
        (platform === 'facebook' && this.usersMap.facebook.length === 0)
      ) {
        this.fetchChatListForPlatform(platform);
      }
    },

    // แยกการโหลดข้อมูลสำหรับแต่ละแพลตฟอร์ม
    async fetchChatListForPlatform(platform: 'line' | 'facebook') {
      // จำแพลตฟอร์มปัจจุบันไว้
      const currentPlatform = chatService.platform.value;
      
      // ตั้งค่าแพลตฟอร์มตามที่ต้องการ
      chatService.setPlatform(platform);
      
      try {
        const users = await chatService.getChatList();
        
        // กำหนดแพลตฟอร์มให้กับผู้ใช้แต่ละคน
        users.forEach(user => {
          user.platform = platform;
          if (this.activeUserId) {
            user.active = user.userId === this.activeUserId;
          }
        });
        
        // บันทึกลง state
        this.usersMap[platform] = users;
      } catch (error: any) {
        this.error = error.message || `ไม่สามารถดึงข้อมูลรายการแชทจาก ${platform} ได้`;
      } finally {
        // คืนค่าแพลตฟอร์มกลับไปเป็นค่าเดิม
        chatService.setPlatform(currentPlatform as 'line' | 'facebook');
      }
    },

    async fetchChatList() {
      this.loading.users = true;
      this.error = null;

      try {
        // จำแพลตฟอร์มปัจจุบันไว้
        const currentPlatform = chatService.platform.value;
        
        // ดึงข้อมูลจาก Line
        chatService.setPlatform('line');
        const lineUsers = await chatService.getChatList();
        
        // ดึงข้อมูลจาก Facebook
        chatService.setPlatform('facebook');
        const fbUsers = await chatService.getChatList();
        
        // คืนค่าแพลตฟอร์มกลับไปเป็นค่าเดิม
        chatService.setPlatform(currentPlatform as 'line' | 'facebook');
        
        // กำหนดแพลตฟอร์มให้กับผู้ใช้แต่ละคน
        lineUsers.forEach(user => {
          user.platform = 'line';
          if (this.activeUserId) {
            user.active = user.userId === this.activeUserId;
          }
        });
        
        fbUsers.forEach(user => {
          user.platform = 'facebook';
          if (this.activeUserId) {
            user.active = user.userId === this.activeUserId;
          }
        });
        
        // บันทึกลง state
        this.usersMap.line = lineUsers;
        this.usersMap.facebook = fbUsers;
      } catch (error: any) {
        this.error = error.message || 'ไม่สามารถดึงข้อมูลรายการแชทได้';
      } finally {
        this.loading.users = false;
      }
    },

    async fetchMessages() {
      if (!this.activeUserId) return;

      this.loading.messages = true;
      this.error = null;

      try {
        this.messages = await chatService.getMessages(this.activeUserId);

        // เพิ่ม platform ให้กับข้อความแต่ละข้อความ
        this.messages.forEach(message => {
          message.platform = this.currentPlatform as 'line' | 'facebook';
        });
        
        // รีเซ็ตตัวแปรสำหรับ pagination
        this.hasMoreMessages = this.messages.length >= 20; // สมมติว่า limit คือ 20
      } catch (error: any) {
        this.error = error.message || 'ไม่สามารถดึงข้อมูลข้อความได้';
      } finally {
        this.loading.messages = false;
      }
    },
    
    // เพิ่มฟังก์ชันสำหรับโหลดข้อความเพิ่มเติม
    async loadMoreMessages() {
      if (!this.activeUserId || this.loading.moreMessages || !this.hasMoreMessages) return;
      
      if (this.messages.length === 0) {
        return this.fetchMessages();
      }
      
      this.loading.moreMessages = true;
      
      try {
        // หาข้อความเก่าที่สุด
        const oldestMessage = [...this.messages]
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];
        
        if (!oldestMessage) return;
        
        // สร้าง params สำหรับ API call
        const params = {
          before: oldestMessage.timestamp,
          limit: 20
        };
        
        // เรียกใช้ chatService.getMessages แบบมี params
        const olderMessages = await chatService.getMessages(this.activeUserId, params);
        
        if (olderMessages.length > 0) {
          // เพิ่ม platform ให้กับข้อความเก่า
          olderMessages.forEach(message => {
            message.platform = this.currentPlatform as 'line' | 'facebook';
          });
          
          // รวมข้อความเก่าเข้ากับข้อความที่มีอยู่
          this.messages = [...olderMessages, ...this.messages];
          
          // ตรวจสอบว่ายังมีข้อความเก่ากว่านี้อีกหรือไม่
          this.hasMoreMessages = olderMessages.length === 20; // สมมติว่า limit คือ 20
        } else {
          this.hasMoreMessages = false;
        }
      } catch (error: any) {
        this.error = error.message || 'ไม่สามารถโหลดข้อความเพิ่มเติมได้';
      } finally {
        this.loading.moreMessages = false;
      }
    },

    async sendMessage(text: string) {
      if (!this.activeUserId || !text.trim()) return false;

      this.error = null;
      this.sending = true;

      try {
        // สร้าง ID ชั่วคราวสำหรับข้อความ
        const tempId = `temp-${Date.now()}`;

        // เพิ่มข้อความลงในสถานะก่อนส่ง API (เพื่อการตอบสนองที่เร็ว)
        const newMessage: ChatMessage = {
          _id: tempId,
          chatAccountId: chatService.chatAccountId.value,
          senderId: this.activeUserId,
          text: text,
          source: 'admin',
          messageType: 'text',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          platform: this.currentPlatform as 'line' | 'facebook',
          status: 'sending' // เพิ่มสถานะการส่ง
        };

        this.messages.push(newMessage);
        this.pendingMessages.add(tempId); // เพิ่มเข้าไปในรายการข้อความที่รอ

        // อัพเดต UI ของรายการแชท
        this.updateUserLastMessage(this.activeUserId, text, 'admin');

        // ส่งข้อความผ่าน API
        const response = await chatService.sendMessage(this.activeUserId, text);

        if (!response.success) {
          throw new Error('ส่งข้อความไม่สำเร็จ');
        }
        
        // อัพเดตสถานะข้อความเป็น 'sent'
        const messageIndex = this.messages.findIndex(msg => msg._id === tempId);
        if (messageIndex !== -1) {
          this.messages[messageIndex].status = 'sent';
          if (response.messageId) {
            this.messages[messageIndex].messageId = response.messageId;
          }
        }

        return true;
      } catch (error: any) {
        // อัพเดตสถานะข้อความที่กำลังส่งเป็น 'failed'
        const messageIndex = this.messages.findIndex(msg => 
          msg.senderId === this.activeUserId && 
          msg._id.startsWith('temp-') && 
          msg.status === 'sending'
        );
        
        if (messageIndex !== -1) {
          this.messages[messageIndex].status = 'failed';
        }
        
        this.error = error.message || 'ไม่สามารถส่งข้อความได้';
        return false;
      } finally {
        this.sending = false;
      }
    },

    // เพิ่ม action สำหรับส่งเทมเพลตของ Facebook
    async sendTemplateMessage(template: FacebookTemplate) {
      if (!this.activeUserId || this.currentPlatform !== 'facebook') return false;

      this.error = null;
      this.sending = true;

      try {
        // สร้าง ID ชั่วคราวสำหรับข้อความ
        const tempId = `temp-${Date.now()}`;

        // สร้างคำอธิบายเทมเพลตสำหรับแสดงในแชท
        let templateDescription = 'เทมเพลต';
        if (template.payload?.template_type === 'button') {
          templateDescription = `ข้อความพร้อมปุ่ม: ${template.payload.text}`;
        } else if (template.payload?.template_type === 'generic') {
          templateDescription = `การ์ด ${template.payload.elements?.length || 0} รายการ`;
        }

        // เพิ่มข้อความลงในสถานะก่อนส่ง API
        const newMessage: ChatMessage = {
          _id: tempId,
          chatAccountId: chatService.chatAccountId.value,
          senderId: this.activeUserId,
          text: `[TEMPLATE] ${templateDescription}`,
          source: 'admin',
          messageType: 'template',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          platform: 'facebook',
          templateType: template.payload?.template_type,
          templateData: template,
          status: 'sending'
        };

        this.messages.push(newMessage);
        this.pendingMessages.add(tempId);

        // อัพเดต UI ของรายการแชท
        this.updateUserLastMessage(this.activeUserId, `[TEMPLATE] ${templateDescription}`, 'admin');

        // ส่งเทมเพลตผ่าน API
        const response = await chatService.sendTemplate(this.activeUserId, template);

        if (!response.success) {
          throw new Error('ส่งเทมเพลตไม่สำเร็จ');
        }
        
        // อัพเดตสถานะข้อความเป็น 'sent'
        const messageIndex = this.messages.findIndex(msg => msg._id === tempId);
        if (messageIndex !== -1) {
          this.messages[messageIndex].status = 'sent';
          if (response.messageId) {
            this.messages[messageIndex].messageId = response.messageId;
          }
        }

        return true;
      } catch (error: any) {
        // อัพเดตสถานะข้อความที่กำลังส่งเป็น 'failed'
        const messageIndex = this.messages.findIndex(msg => 
          msg.senderId === this.activeUserId && 
          msg._id.startsWith('temp-') && 
          msg.status === 'sending'
        );
        
        if (messageIndex !== -1) {
          this.messages[messageIndex].status = 'failed';
        }
        
        this.error = error.message || 'ไม่สามารถส่งเทมเพลตได้';
        return false;
      } finally {
        this.sending = false;
      }
    },

    async uploadAndSendFile(file: File, caption?: string) {
      if (!this.activeUserId || !file) return false;

      this.error = null;
      this.sending = true;

      try {
        // สร้าง ID ชั่วคราวสำหรับข้อความ
        const tempId = `temp-${Date.now()}`;

        // กำหนดประเภทข้อความตามประเภทไฟล์
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');

        let messageType: 'image' | 'file' | 'video' | 'audio' = 'file';
        if (isImage) messageType = 'image';
        if (isVideo) messageType = 'video';
        if (isAudio) messageType = 'audio';

        // สร้างข้อความแสดงประเภทไฟล์
        const fileTypeText = isImage ? '[รูปภาพ]' :
          isVideo ? '[วิดีโอ]' :
            isAudio ? '[เสียง]' : `[ไฟล์] ${file.name}`;

        // รวมคำอธิบายไฟล์ (ถ้ามี)
        const displayText = caption ? `${fileTypeText} - ${caption}` : fileTypeText;

        // เพิ่มข้อความลงในสถานะก่อนส่ง API
        const newMessage: ChatMessage = {
          _id: tempId,
          chatAccountId: chatService.chatAccountId.value,
          senderId: this.activeUserId,
          text: displayText,
          source: 'admin',
          messageType,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          platform: this.currentPlatform as 'line' | 'facebook',
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          status: 'sending'
        };

        this.messages.push(newMessage);
        this.pendingMessages.add(tempId);

        // อัพเดต UI ของรายการแชท
        this.updateUserLastMessage(this.activeUserId, displayText, 'admin');

        // ส่งไฟล์ผ่าน API พร้อม caption (ถ้ามี)
        const response = await chatService.uploadFile(file, this.activeUserId, caption);

        if (!response.success) {
          throw new Error('ส่งไฟล์ไม่สำเร็จ');
        }
        
        // อัพเดตสถานะข้อความและเพิ่ม URL ของไฟล์
        const messageIndex = this.messages.findIndex(msg => msg._id === tempId);
        if (messageIndex !== -1) {
          this.messages[messageIndex].status = 'sent';
          if (response.messageId) {
            this.messages[messageIndex].messageId = response.messageId;
          }
          if (response.fileUrl) {
            this.messages[messageIndex].fileUrl = response.fileUrl;
          }
        }

        return true;
      } catch (error: any) {
        // อัพเดตสถานะข้อความที่กำลังส่งเป็น 'failed'
        const messageIndex = this.messages.findIndex(msg => 
          msg.senderId === this.activeUserId && 
          msg._id.startsWith('temp-') && 
          msg.status === 'sending'
        );
        
        if (messageIndex !== -1) {
          this.messages[messageIndex].status = 'failed';
        }
        
        this.error = error.message || 'ไม่สามารถส่งไฟล์ได้';
        return false;
      } finally {
        this.sending = false;
      }
    },
    
    // Helper function สำหรับอัพเดตข้อความล่าสุดของผู้ใช้
    updateUserLastMessage(userId: string, text: string, source: 'user' | 'admin') {
      // หาผู้ใช้ในทั้งสองแพลตฟอร์ม
      const platforms = ['line', 'facebook'] as const;
      
      for (const platform of platforms) {
        const userIndex = this.usersMap[platform].findIndex(u => u.userId === userId);
        if (userIndex !== -1) {
          this.usersMap[platform][userIndex].lastMessage = text;
          this.usersMap[platform][userIndex].timestamp = new Date().toISOString();
          this.usersMap[platform][userIndex].source = source;
        }
      }
    },

    async fetchUserProfile() {
      if (!this.activeUserId) return;

      this.loading.profile = true;
      this.error = null;

      try {
        this.userProfile = await chatService.getUserProfile(this.activeUserId);

        // ตรวจสอบว่ามีการกำหนด platform หรือไม่
        if (this.userProfile && !this.userProfile.platform) {
          this.userProfile.platform = this.currentPlatform as 'line' | 'facebook';
        }
      } catch (error: any) {
        this.error = error.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้';
      } finally {
        this.loading.profile = false;
      }
    },

    // Appointments
    async fetchAppointments() {
      if (!this.activeUserId) return;

      this.loading.appointments = true;
      this.error = null;

      try {
        this.appointments = await chatService.getAppointments(this.activeUserId);
      } catch (error: any) {
        this.appointments = [];
      } finally {
        this.loading.appointments = false;
      }
    },

    // Tags
    async fetchTags() {
      if (!this.activeUserId) return;

      this.loading.tags = true;
      this.error = null;

      try {
        this.tags = await chatService.getTags(this.activeUserId);
      } catch (error: any) {
        this.tags = [];
      } finally {
        this.loading.tags = false;
      }
    },

    // Visible Admins
    async fetchVisibleAdmins() {
      if (!this.activeUserId) return;

      this.loading.visibleAdmins = true;
      this.error = null;

      try {
        this.visibleAdmins = await chatService.getVisibleAdmins(this.activeUserId);
      } catch (error: any) {
        this.visibleAdmins = [];
      } finally {
        this.loading.visibleAdmins = false;
      }
    },

    setupSocketConnection() {
      const nuxtApp = useNuxtApp()
      const socket = nuxtApp.$socket

      if (!socket) {
        console.error('Socket is not available')
        return
      }

      // เก็บ socket instance ใน state
      this.socket = socket

      // ตั้งค่า event listeners
      socket.on('connect', () => {
        console.log('Socket connected')
        this.isSocketConnected = true

        // เข้าร่วมห้องแชทตาม activeUserId (ถ้ามี)
        if (this.activeUserId) {
          this.joinChatRoom()
        }
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected')
        this.isSocketConnected = false
      })

      socket.on('newMessage', (message: ChatMessage) => {
        console.log('New message received via socket:', message);

        // เพิ่ม platform ให้กับข้อความใหม่ถ้าไม่มี
        if (!message.platform) {
          message.platform = this.currentPlatform as 'line' | 'facebook';
        }

        // ตรวจสอบว่าเป็นข้อความสำหรับ user ที่กำลังดูอยู่หรือไม่
        if (message.senderId === this.activeUserId) {
          // ตรวจสอบว่าข้อความนี้ซ้ำกับข้อความที่เพิ่งส่งหรือไม่
          const messageText = message.text;
          const messageSource = message.source;

          // ถ้ามีข้อความที่รอและเป็นข้อความจาก admin (ข้อความที่เราเพิ่งส่ง)
          if (messageSource === 'admin' && this.pendingMessages.size > 0) {
            // ค้นหาข้อความชั่วคราวที่ตรงกับข้อความจาก WebSocket
            const tempMessageIndex = this.messages.findIndex(msg =>
              msg.text === messageText &&
              msg.source === 'admin' &&
              msg._id.startsWith('temp-')
            );

            if (tempMessageIndex !== -1) {
              // ถ้าเจอข้อความชั่วคราว ให้แทนที่ด้วยข้อความจริง
              const tempId = this.messages[tempMessageIndex]._id;
              this.messages[tempMessageIndex] = message;
              this.pendingMessages.delete(tempId);
              return; // ไม่ต้องเพิ่มข้อความใหม่
            }
          }

          // ถ้าไม่มีข้อความชั่วคราวที่ตรงกัน หรือเป็นข้อความจาก user ให้เพิ่มตามปกติ
          const isDuplicate = this.messages.some(msg => msg._id === message._id);
          if (!isDuplicate) {
            this.messages.push(message);

            // เรียงลำดับข้อความตามเวลา
            this.messages.sort((a, b) => {
              return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });
          }

          // อัพเดตข้อความล่าสุดใน users list
          this.updateUserLastMessage(message.senderId, message.text, message.source as any);
        } else {
          // อัพเดตข้อความล่าสุดของ user อื่นๆ ในรายการแชท
          this.updateUserLastMessage(message.senderId, message.text, message.source as any);
        }
      })

      // เริ่มเชื่อมต่อ socket
      if (!socket.connected) {
        socket.connect()
      }
    },

    joinChatRoom() {
      if (!this.socket || !this.activeUserId || !this.isSocketConnected) {
        console.warn('Cannot join room: Socket not connected or no active user');
        return;
      }

      // ใช้ chatAccountId จาก chatService
      const chatAccountId = chatService.chatAccountId.value
      const senderId = this.activeUserId
      const platform = this.currentPlatform  // เพิ่ม platform เพื่อส่งไปยัง socket server

      console.log(`Joining room for: ${chatAccountId}:${senderId} (${platform})`)
      this.socket.emit('joinRoom', { chatAccountId, senderId, platform })

      this.socket.once('joinRoom', (response) => {
        if (response && response.success) {
          console.log('Successfully joined room:', response.room);
        } else {
          console.error('Failed to join room:', response ? response.error : 'Unknown error');
        }
      });
    },

    setActiveUser(userId: string) {
      this.activeUserId = userId;
      
      // อัปเดตสถานะ active ของผู้ใช้ทุกคนในทุกแพลตฟอร์ม
      Object.values(this.usersMap).forEach(platformUsers => {
        platformUsers.forEach(user => {
          user.active = user.userId === userId;
        });
      });
      
      // ตรวจสอบว่าผู้ใช้นี้อยู่ในแพลตฟอร์มไหน และปรับ currentPlatform ไปยังแพลตฟอร์มนั้น
      const fbUser = this.usersMap.facebook.find(u => u.userId === userId);
      const lineUser = this.usersMap.line.find(u => u.userId === userId);
      
      if (fbUser) {
        chatService.setPlatform('facebook');
      } else if (lineUser) {
        chatService.setPlatform('line');
      }
      
      // เรียกใช้ methods เดิม
      this.fetchMessages();
      this.fetchUserProfile();
      this.fetchAppointments();
      this.fetchTags();
      this.fetchVisibleAdmins();
      
      // เพิ่มการเข้าร่วมห้องแชท
      this.joinChatRoom();
    },

    cleanupSocketConnection() {
      if (this.socket) {
        // ลบ event listeners ที่ไม่ต้องการแล้ว
        this.socket.off('connect')
        this.socket.off('disconnect')
        this.socket.off('newMessage')

        // ตัดการเชื่อมต่อ socket ถ้าต้องการ
        // this.socket.disconnect()
      }
    },
    
// ฟังก์ชันสำหรับการจัดการกับข้อความใหม่จาก socket
handleNewSocketMessage(message: ChatMessage) {
  // เพิ่ม platform ให้กับข้อความใหม่ถ้าไม่มี
  if (!message.platform) {
    message.platform = this.currentPlatform as 'line' | 'facebook';
  }

  // ตรวจสอบว่าเป็นข้อความจากผู้ใช้ที่กำลังดูอยู่หรือไม่
  if (message.senderId === this.activeUserId) {
    // ตรวจสอบว่าข้อความนี้ซ้ำกับข้อความที่มีอยู่แล้วหรือไม่
    const isDuplicate = this.messages.some(msg => msg._id === message._id);
    
    if (!isDuplicate) {
      // ตรวจสอบว่าเป็นข้อความที่เรากำลังรอการยืนยันหรือไม่
      if (message.source === 'admin' && this.pendingMessages.size > 0) {
        const pendingIndex = this.messages.findIndex(msg => 
          msg.text === message.text && 
          msg.source === 'admin' && 
          msg._id.startsWith('temp-')
        );
        
        if (pendingIndex !== -1) {
          // แทนที่ข้อความที่รอด้วยข้อความจริง
          const tempId = this.messages[pendingIndex]._id;
          this.messages[pendingIndex] = message;
          this.pendingMessages.delete(tempId);
          return;
        }
      }
      
      // เพิ่มข้อความใหม่และเรียงลำดับตามเวลา
      this.messages.push(message);
      this.messages.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
    }
  }
  
  // อัพเดตข้อความล่าสุดในรายการผู้ใช้ (ไม่ว่าจะเป็นผู้ใช้ที่กำลังดูอยู่หรือไม่)
  this.updateUserLastMessage(message.senderId, message.text, message.source as any);
}
}
});