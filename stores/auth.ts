import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { authService } from '~/services/auth';
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '~/types/auth';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const refreshTimer = ref<NodeJS.Timeout | null>(null);

  // Cookie options
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const
  };

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      const response = await authService.login(credentials);
      setAuthData(response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      const response = await authService.register(credentials);
      setAuthData(response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function forgotPassword(email: string) {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    const localePath = useLocalePath()
    try {
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      clearAuthData();
      // await navigateTo('/login');
      await navigateTo(localePath('login'), { replace: true });
    }
  }

  async function refreshAuthToken(): Promise<boolean> {
    const refreshToken = useCookie('refresh_token').value;
    if (!refreshToken) {
      console.warn('No refresh token available');
      handleAuthExpired();
      return false;
    }
    
    try {
      console.log('Refreshing token...');
      const response = await authService.refreshToken(refreshToken);
      setAuthData(response);
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      handleAuthExpired();
      return false;
    }
  }

  function setAuthData(response: AuthResponse) {
    user.value = response.data.user;
    isAuthenticated.value = true;
    
    // Store auth token in cookies (using accessToken from new response)
    const authToken = useCookie('auth_token', cookieOptions);
    authToken.value = response.data.accessToken;
    
    const refreshTokenCookie = useCookie('refresh_token', cookieOptions);
    refreshTokenCookie.value = response.data.refreshToken;
    
    // Store user info in cookies with new fields
    const userCookie = useCookie('user_id', cookieOptions);
    userCookie.value = response.data.user.id;
    
    const usernameCookie = useCookie('username', cookieOptions);
    usernameCookie.value = response.data.user.username;
    
    const emailCookie = useCookie('email', cookieOptions);
    emailCookie.value = response.data.user.email;
    
    const fullNameCookie = useCookie('fullName', cookieOptions);
    fullNameCookie.value = response.data.user.fullName;
    
    const avatarCookie = useCookie('avatar', cookieOptions);
    avatarCookie.value = response.data.user.avatar || '';
    
    const roleCookie = useCookie('role', cookieOptions);
    roleCookie.value = response.data.user.roles;
    
    const clinicIdCookie = useCookie('clinic_id', cookieOptions);
    clinicIdCookie.value = response.data.user.clinicId;
    
    const branchIdCookie = useCookie('branch_id', cookieOptions);
    branchIdCookie.value = response.data.user.branchId;
    
    const statusCookie = useCookie('status', cookieOptions);
    statusCookie.value = response.data.user.status;
    
    const emailVerifiedCookie = useCookie('email_verified', cookieOptions);
    emailVerifiedCookie.value = response.data.user.emailVerified ? 'true' : 'false';
    
    const phoneVerifiedCookie = useCookie('phone_verified', cookieOptions);
    phoneVerifiedCookie.value = response.data.user.phoneVerified ? 'true' : 'false';
    
    // Store preferences as JSON string
    const preferencesCookie = useCookie('preferences', cookieOptions);
    preferencesCookie.value = JSON.stringify(response.data.user.preferences);
    
    // Store permissions as JSON string
    const permissionsCookie = useCookie('permissions', cookieOptions);
    permissionsCookie.value = JSON.stringify(response.data.user.permissions);
    
    // Set up auto refresh based on expiresIn
    setupAutoRefresh(response.data.expiresIn);
  }

  function clearAuthData() {
    user.value = null;
    isAuthenticated.value = false;
    
    // Clear refresh timer
    if (refreshTimer.value) {
      clearTimeout(refreshTimer.value);
      refreshTimer.value = null;
    }
    
    // Clear all cookies including new ones
    const cookiesToClear = [
      'auth_token', 'refresh_token', 'user_id', 'username', 
      'email', 'fullName', 'avatar', 'role', 'clinic_id', 'branch_id',
      'status', 'email_verified', 'phone_verified', 'preferences', 'permissions'
    ];
    
    cookiesToClear.forEach(name => {
      const cookie = useCookie(name);
      cookie.value = null;
    });
  }

  function setupAutoRefresh(expiresIn?: number) {
    // Clear existing timer
    if (refreshTimer.value) {
      clearTimeout(refreshTimer.value);
    }
    
    // Use expiresIn from response if available, otherwise default to 55 minutes
    const tokenExpiry = expiresIn ? expiresIn * 1000 : 55 * 60 * 1000;
    // Refresh 5 minutes before expiry
    const refreshInterval = tokenExpiry - (5 * 60 * 1000);
    
    refreshTimer.value = setTimeout(async () => {
      console.log('Auto refreshing token...');
      const success = await refreshAuthToken();
      
      if (success) {
        // setupAutoRefresh will be called again in setAuthData
        console.log('Auto refresh completed successfully');
      }
    }, Math.max(refreshInterval, 60000)); // Minimum 1 minute
  }

  function handleAuthExpired() {
    const localePath = useLocalePath();
    console.warn('Authentication expired, redirecting to login...');
    clearAuthData();
    
    // Show notification
    if (process.client) {
      console.error('Your session has expired. Please log in again.');
    }
    
    // navigateTo('/login');
    navigateTo(localePath('login'), { replace: true });
  }

  // Initialize user from cookie on app load
  function initAuth() {
    const authToken = useCookie('auth_token').value;
    const userId = useCookie('user_id').value;
    
    if (authToken && userId) {
      isAuthenticated.value = true;
      
      // Parse preferences and permissions
      let preferences = {
        notifications: { email: true, sms: false, push: true },
        language: 'th',
        timezone: 'Asia/Bangkok'
      };
      
      let permissions: string[] = [];
      
      try {
        const preferencesCookie = useCookie('preferences').value;
        if (preferencesCookie) {
          preferences = JSON.parse(preferencesCookie);
        }
      } catch (e) {
        console.warn('Failed to parse preferences from cookie');
      }
      
      try {
        const permissionsCookie = useCookie('permissions').value;
        if (permissionsCookie) {
          permissions = JSON.parse(permissionsCookie);
        }
      } catch (e) {
        console.warn('Failed to parse permissions from cookie');
      }
      
      // Reconstruct user object from cookies with new fields
      user.value = {
        id: userId,
        username: useCookie('username').value || '',
        email: useCookie('email').value || '',
        fullName: useCookie('fullName').value || '',
        avatar: useCookie('avatar').value || null,
        roles: useCookie('role').value || '',
        clinicId: useCookie('clinic_id').value || '',
        branchId: useCookie('branch_id').value || '',
        status: useCookie('status').value || 'active',
        emailVerified: useCookie('email_verified').value === 'true',
        phoneVerified: useCookie('phone_verified').value === 'true',
        permissions,
        preferences,
        lastLogin: '',
        createdBy: '',
        createdAt: '',
        updatedAt: '',
      };
      
      // Set up auto refresh
      setupAutoRefresh();
    }
  }

  // Check token validity (call this when app becomes active)
  async function checkAuthStatus() {
    if (!isAuthenticated.value) return;
    
    try {
      // Try to make a simple API call to check if token is still valid
      await $fetch(`${process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1'}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${useCookie('auth_token').value}`
        }
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('Token expired, attempting refresh...');
        await refreshAuthToken();
      }
    }
  }

  // Getters
  const getUser = computed(() => user.value);
  const isLoggedIn = computed(() => isAuthenticated.value);

  // Initialize on store creation
  if (process.client) {
    initAuth();
    
    // Check auth status when page becomes visible (e.g., after sleep/inactive)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && isAuthenticated.value) {
        checkAuthStatus();
      }
    });
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    forgotPassword,
    logout,
    refreshAuthToken,
    setAuthData,
    clearAuthData,
    initAuth,
    checkAuthStatus,
    handleAuthExpired,
    getUser,
    isLoggedIn,
  };
});