// import type { LoginCredentials, RegisterCredentials, AuthResponse } from '~/types/auth';

// async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
//   const token = useCookie('auth_token').value;
  
//   const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/refresh-token'];
//   const isAuthEndpoint = authEndpoints.some(endpoint => url.includes(endpoint));
  
//   if (!token && !isAuthEndpoint) {
//     throw new Error('Authentication required');
//   }

//   const config = useRuntimeConfig();
//   const baseUrl = config.public.apiBaseUrl;
  
//   if (!baseUrl) {
//     throw new Error('API Base URL is not configured. Please check your environment variables.');
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
//       return await $fetch<T>(`${baseUrl}${url}`, mergedOptions);
//     } catch (error: any) {
//       console.error(`API Error (${url}):`, error);
      
//       // Handle 401 errors specifically
//       if (error.response?.status === 401 && !isAuthEndpoint) {
//         // Try to refresh token
//         const authStore = useAuthStore();
//         const refreshSuccess = await authStore.refreshAuthToken();
        
//         if (refreshSuccess && attempt === 1) {
//           // Retry the original request with new token
//           const newToken = useCookie('auth_token').value;
//           mergedOptions.headers.Authorization = `Bearer ${newToken}`;
//           continue;
//         } else {
//           // Refresh failed or this is a retry, redirect to login
//           authStore.handleAuthExpired();
//           throw new Error('Session expired. Please log in again.');
//         }
//       }
      
//       if (attempt === retries || error.response?.status < 500) {
//         if (error.response?.status === 403) {
//           throw new Error('Forbidden: You do not have permission');
//         } else if (error.response?.status === 404) {
//           throw new Error('Resource not found');
//         } else {
//           // Extract error message from response
//           const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch data';
//           throw new Error(errorMessage);
//         }
//       }
      
//       await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
//     }
//   }
//   throw new Error('Max retries reached');
// }

// export const authService = {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     return await apiFetch<AuthResponse>('/auth/login', {
//       method: 'POST',
//       body: credentials
//     });
//   },

//   async register(credentials: RegisterCredentials): Promise<AuthResponse> {
//     return await apiFetch<AuthResponse>('/auth/register', {
//       method: 'POST',
//       body: credentials
//     });
//   },

//   async forgotPassword(email: string): Promise<void> {
//     await apiFetch<void>('/auth/forgot-password', {
//       method: 'POST',
//       body: { email }
//     });
//   },

//   async logout(): Promise<void> {
//     await apiFetch<void>('/auth/logout', {
//       method: 'POST'
//     });
//   },

//   async refreshToken(refreshToken: string): Promise<AuthResponse> {
//     return await apiFetch<AuthResponse>('/auth/refresh-token', {
//       method: 'POST',
//       body: { refreshToken }
//     });
//   },

//   async getMe(): Promise<{ status: string; data: { user: any } }> {
//     return await apiFetch<{ status: string; data: { user: any } }>('/auth/profile', {
//       method: 'GET'
//     });
//   },
// };

// services/auth.ts - อัพเดต auth service
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '~/types/auth';
import { authenticatedRequest, publicRequest } from '~/utils/api';

export const authService = {
  // Public endpoints - ไม่ต้องการ auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await publicRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return await publicRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: credentials
    });
  },

  async forgotPassword(email: string): Promise<void> {
    await publicRequest<void>('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return await publicRequest<AuthResponse>('/auth/refresh-token', {
      method: 'POST',
      body: { refreshToken }
    });
  },

  // Protected endpoints - ต้องการ auth
  async logout(): Promise<void> {
    await authenticatedRequest<void>('/auth/logout', {
      method: 'POST'
    });
  },

  async getMe(): Promise<{ status: string; data: { user: any } }> {
    return await authenticatedRequest<{ status: string; data: { user: any } }>('/auth/profile', {
      method: 'GET'
    });
  },
};