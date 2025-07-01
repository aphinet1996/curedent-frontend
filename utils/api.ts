// utils/api.ts
export interface ApiResponse<T> {
    status: string;
    data: T;
    results?: number;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  /**
   * Base API fetch function
   */
  export async function apiRequest<T>(
    url: string, 
    options: any = {}, 
    retries = 3,
    requireAuth = true
  ): Promise<T> {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBaseUrl;
    
    // Debug: แสดง baseUrl
    console.log('🔍 Base URL from config:', baseUrl);
    console.log('🔍 Full URL will be:', `${baseUrl}${url}`);
    
    if (!baseUrl) {
      console.error('❌ API Base URL is not configured!');
      console.log('💡 Please check:');
      console.log('   1. .env file exists in root directory');
      console.log('   2. NUXT_PUBLIC_API_BASE_URL is set');
      console.log('   3. nuxt.config.ts has runtimeConfig setup');
      throw new Error('API Base URL is not configured. Please check your environment variables.');
    }
  
    const token = useCookie('auth_token').value;
    
    if (requireAuth && !token) {
      throw new Error('Authentication required');
    }
  
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
  
    const defaultOptions = {
      headers,
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
        console.log(`🚀 Making API request to: ${baseUrl}${url}`);
        return await $fetch<T>(`${baseUrl}${url}`, mergedOptions);
      } catch (error: any) {
        console.error(`❌ API Error (${url}):`, error);
        
        if (error.response?.status === 401 && requireAuth) {
          const isAuthEndpoint = url.includes('/auth/');
          
          if (!isAuthEndpoint) {
            const authStore = useAuthStore();
            const refreshSuccess = await authStore.refreshAuthToken();
            
            if (refreshSuccess && attempt === 1) {
              const newToken = useCookie('auth_token').value;
              mergedOptions.headers.Authorization = `Bearer ${newToken}`;
              continue;
            } else {
              authStore.handleAuthExpired();
              throw new Error('Session expired. Please log in again.');
            }
          }
        }
        
        if (attempt === retries || error.response?.status < 500) {
          if (error.response?.status === 403) {
            throw new Error('Forbidden: You do not have permission');
          } else if (error.response?.status === 404) {
            throw new Error('Resource not found');
          } else {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch data';
            throw new Error(errorMessage);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error('Max retries reached');
  }
  
  /**
   * API request for authenticated routes (default)
   */
  export function authenticatedRequest<T>(url: string, options: any = {}, retries = 3): Promise<T> {
    return apiRequest<T>(url, options, retries, true);
  }
  
  /**
   * API request for public routes (no auth required)
   */
  export function publicRequest<T>(url: string, options: any = {}, retries = 3): Promise<T> {
    return apiRequest<T>(url, options, retries, false);
  }