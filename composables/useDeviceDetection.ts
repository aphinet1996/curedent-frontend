export const useDeviceDetection = () => {
    const isMobile = ref<boolean>(false)
    
    const checkMobileDevice = (): boolean => {
      if (typeof window === 'undefined') return false
      
      const userAgent = window.navigator.userAgent.toLowerCase()
      const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'windows phone', 'mobile'
      ]
      
      const isMobileUserAgent = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      )
      const isMobileScreen = window.innerWidth <= 768
      
      return isMobileUserAgent || isMobileScreen
    }
  
    const handleResize = (): void => {
      isMobile.value = checkMobileDevice()
    }
  
    onMounted(() => {
      isMobile.value = checkMobileDevice()
      window.addEventListener('resize', handleResize)
    })
  
    onUnmounted(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    })
  
    return {
      isMobile: readonly(isMobile)
    }
  }