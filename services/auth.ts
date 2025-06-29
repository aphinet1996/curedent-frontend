// import type { LoginCredentials, RegisterCredentials, AuthResponse } from '~/types/auth';

// // Base API URL
// const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

// /**
//  * Custom fetch function with default options and error handling
//  */
// async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
//   const token = useCookie('auth_token').value;
  
//   // Don't check token for login/register endpoints
//   if (!token && !url.includes('/login') && !url.includes('/register')) {
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
//       if (attempt === retries || error.response?.status < 500) {
//         console.error(`API Error (${url}):`, error.message);
//         if (error.response?.status === 401) {
//           throw new Error('Unauthorized: Please log in again');
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
// };

import type { LoginCredentials, RegisterCredentials, AuthResponse } from '~/types/auth';

// Base API URL
const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

/**
 * Custom fetch function with default options and error handling
 */
async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
  const token = useCookie('auth_token').value;
  
  // Don't check token for auth endpoints
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/refresh-token'];
  const isAuthEndpoint = authEndpoints.some(endpoint => url.includes(endpoint));
  
  if (!token && !isAuthEndpoint) {
    throw new Error('Authentication required');
  }
  
  const defaultOptions = {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as const,
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await $fetch<T>(`${BASE_URL}${url}`, mergedOptions);
    } catch (error: any) {
      console.error(`API Error (${url}):`, error);
      
      // Handle 401 errors specifically
      if (error.response?.status === 401 && !isAuthEndpoint) {
        // Try to refresh token
        const authStore = useAuthStore();
        const refreshSuccess = await authStore.refreshAuthToken();
        
        if (refreshSuccess && attempt === 1) {
          // Retry the original request with new token
          const newToken = useCookie('auth_token').value;
          mergedOptions.headers.Authorization = `Bearer ${newToken}`;
          continue;
        } else {
          // Refresh failed or this is a retry, redirect to login
          authStore.handleAuthExpired();
          throw new Error('Session expired. Please log in again.');
        }
      }
      
      if (attempt === retries || error.response?.status < 500) {
        if (error.response?.status === 403) {
          throw new Error('Forbidden: You do not have permission');
        } else if (error.response?.status === 404) {
          throw new Error('Resource not found');
        } else {
          // Extract error message from response
          const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch data';
          throw new Error(errorMessage);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error('Max retries reached');
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: credentials
    });
  },

  async forgotPassword(email: string): Promise<void> {
    await apiFetch<void>('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });
  },

  async logout(): Promise<void> {
    await apiFetch<void>('/auth/logout', {
      method: 'POST'
    });
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return await apiFetch<AuthResponse>('/auth/refresh-token', {
      method: 'POST',
      body: { refreshToken }
    });
  },

  async getMe(): Promise<{ status: string; data: { user: any } }> {
    return await apiFetch<{ status: string; data: { user: any } }>('/auth/profile', {
      method: 'GET'
    });
  },
};