export default defineNuxtPlugin(() => {
    const authStore = useAuthStore();
    
    // Global error handler
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      // Check if it's an auth error
      if (error?.message?.includes('Session expired') || 
          error?.message?.includes('Authentication required')) {
        authStore.handleAuthExpired();
      }
    });
  });