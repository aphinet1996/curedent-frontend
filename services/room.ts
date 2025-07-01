// // services/room.ts
// import { useCookie } from 'nuxt/app';
// import type { RoomType, Room, RoomParams, CreateRoomRequest, UpdateRoomRequest } from '~/types/room';

// // Generic API response type
// export interface ApiResponse<T> {
//   status: string;
//   data: T;
//   results?: number;
//   pagination?: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

// // Base API URL
// const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL;

// /**
//  * Custom fetch function with default options and error handling
//  */
// async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
//   const token = useCookie('auth_token').value;

//   // Don't check token for auth endpoints
//   const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/refresh-token'];
//   const isAuthEndpoint = authEndpoints.some(endpoint => url.includes(endpoint));

//   if (!token && !isAuthEndpoint) {
//     throw new Error('Authentication required');
//   }

//   const defaultOptions = {
//     headers: {
//       'Authorization': token ? `Bearer ${token}` : '',
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include' as const,
//   };

//   const mergedOptions = {
//     ...defaultOptions,
//     ...options,
//     headers: {
//       ...defaultOptions.headers,
//       ...(options.headers || {}),
//     },
//   };

//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       return await $fetch<T>(`${BASE_URL}${url}`, mergedOptions);
//     } catch (error: any) {
//       console.error(`API Error (${url}):`, error);

//       if (attempt === retries || error.response?.status < 500) {
//         if (error.response?.status === 401 && !isAuthEndpoint) {
//           throw new Error('Session expired. Please log in again.');
//         } else if (error.response?.status === 403) {
//           throw new Error('Forbidden: You do not have permission');
//         } else if (error.response?.status === 404) {
//           throw new Error('Resource not found');
//         } else {
//           throw new Error(error.message || 'Failed to fetch data');
//         }
//       }

//       await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
//     }
//   }
//   throw new Error('Max retries reached');
// }

// export const roomService = {
//   /**
//    * Get all room types
//    */
//   async getRoomTypes(): Promise<ApiResponse<{ roomTypes: RoomType[] }>> {
//     return await apiFetch<ApiResponse<{ roomTypes: RoomType[] }>>('/rooms/types', {
//       method: 'GET',
//     });
//   },

//   /**
//    * Get all rooms with optional filtering
//    */
//   async getRooms(params?: RoomParams): Promise<ApiResponse<{ rooms: Room[] }>> {
//     return await apiFetch<ApiResponse<{ rooms: Room[] }>>('/rooms', {
//       method: 'GET',
//       params,
//     });
//   },

//   /**
//    * Get a specific room by ID
//    */
//   async getRoomById(id: string): Promise<ApiResponse<{ room: Room }>> {
//     return await apiFetch<ApiResponse<{ room: Room }>>(`/rooms/${id}`, {
//       method: 'GET',
//     });
//   },

//   /**
//    * Create a new room
//    */
//   async createRoom(roomData: CreateRoomRequest): Promise<ApiResponse<{ room: Room }>> {
//     return await apiFetch<ApiResponse<{ room: Room }>>('/rooms', {
//       method: 'POST',
//       body: roomData,
//     });
//   },

//   /**
//    * Update an existing room
//    */
//   async updateRoom(id: string, roomData: UpdateRoomRequest): Promise<ApiResponse<{ room: Room }>> {
//     return await apiFetch<ApiResponse<{ room: Room }>>(`/rooms/${id}`, {
//       method: 'PUT',
//       body: roomData,
//     });
//   },

//   /**
//    * Delete a room
//    */
//   async deleteRoom(id: string): Promise<ApiResponse<null>> {
//     return await apiFetch<ApiResponse<null>>(`/rooms/${id}`, {
//       method: 'DELETE',
//     });
//   }
// };

import { useCookie } from 'nuxt/app';
import type { RoomType, Room, RoomParams, CreateRoomRequest, UpdateRoomRequest } from '~/types/room';
import { authenticatedRequest, type ApiResponse } from '~/utils/api';

export const roomService = {
  /**
   * Get all room types
   */
  async getRoomTypes(): Promise<ApiResponse<{ roomTypes: RoomType[] }>> {
    return await authenticatedRequest<ApiResponse<{ roomTypes: RoomType[] }>>('/rooms/types', {
      method: 'GET',
    });
  },

  /**
   * Get all rooms with optional filtering
   */
  async getRooms(params?: RoomParams): Promise<ApiResponse<{ rooms: Room[] }>> {
    return await authenticatedRequest<ApiResponse<{ rooms: Room[] }>>('/rooms', {
      method: 'GET',
      params,
    });
  },

  /**
   * Get a specific room by ID
   */
  async getRoomById(id: string): Promise<ApiResponse<{ room: Room }>> {
    return await authenticatedRequest<ApiResponse<{ room: Room }>>(`/rooms/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new room
   */
  async createRoom(roomData: CreateRoomRequest): Promise<ApiResponse<{ room: Room }>> {
    return await authenticatedRequest<ApiResponse<{ room: Room }>>('/rooms', {
      method: 'POST',
      body: roomData,
    });
  },

  /**
   * Update an existing room
   */
  async updateRoom(id: string, roomData: UpdateRoomRequest): Promise<ApiResponse<{ room: Room }>> {
    return await authenticatedRequest<ApiResponse<{ room: Room }>>(`/rooms/${id}`, {
      method: 'PUT',
      body: roomData,
    });
  },

  /**
   * Delete a room
   */
  async deleteRoom(id: string): Promise<ApiResponse<null>> {
    return await authenticatedRequest<ApiResponse<null>>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }
};