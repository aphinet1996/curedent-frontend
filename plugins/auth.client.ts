export default defineNuxtPlugin(() => {
    const authStore = useAuthStore();
    
    // Initialize auth when plugin loads
    authStore.initAuth();
    
    // Optional: Check auth status periodically
    setInterval(() => {
      if (authStore.isLoggedIn) {
        authStore.checkAuthStatus();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  });