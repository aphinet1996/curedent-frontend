export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()
    
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/forgot-password']
    
    // Check if route requires authentication
    const requiresAuth = !publicRoutes.includes(to.path)
    
    if (requiresAuth && !authStore.isLoggedIn) {
      // Clear any existing auth data
      authStore.clearAuthData()
      
      // Redirect to login
      return navigateTo('/login')
    }
  })