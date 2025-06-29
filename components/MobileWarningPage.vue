<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="max-w-md w-full text-center">
        
        <!-- Logo -->
        <div class="mb-8">
          <img 
            src="/logo.png" 
            alt="Logo" 
            class="w-16 h-16 mx-auto mb-6 object-contain"
          >
        </div>

        <!-- Mobile View -->
        <div v-if="isMobile" class="space-y-6">
          <div>
            <div class="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              ยังไม่รองรับมือถือ
            </h1>
            
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              เว็บไซต์นี้ยังไม่รองรับการใช้งานบนมือถือ<br>
              กรุณาเข้าใช้งานผ่านคอมพิวเตอร์
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">ทางเลือก</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span class="text-gray-600 dark:text-gray-300 text-sm">เปิดผ่านคอมพิวเตอร์</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                <span class="text-gray-600 dark:text-gray-300 text-sm">ใช้แท็บเล็ตในโหมดแนวนอน</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span class="text-gray-600 dark:text-gray-300 text-sm">รออัพเดทในอนาคต</span>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            หากมีข้อสงสัย กรุณาติดต่อทีมงาน
          </p>
        </div>

        <!-- Desktop View -->
        <div v-else class="space-y-6">
          <div>
            <div class="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h1 class="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
              ยินดีต้อนรับ
            </h1>
            
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              อุปกรณ์ของคุณรองรับการใช้งานเว็บไซต์ได้เต็มรูปแบบ
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">เริ่มต้นใช้งาน</h3>
            <div class="space-y-3">
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                เข้าสู่ระบบ
              </button>
              <button class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                สำรวจเพิ่มเติม
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            กำลังพัฒนาให้รองรับทุกอุปกรณ์
          </p>
        </div>

        <!-- Footer -->
        <div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-400 dark:text-gray-500">
            © 2025 CURECONNECT CO., LTD.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Device detection composable
const { isMobile } = useDeviceDetection()

// SEO Meta
useHead({
  title: 'Mobile Not Supported - Your Website',
  meta: [
    {
      name: 'description',
      content: 'Our website is optimized for desktop and tablet devices. Please access from a computer for the best experience.'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  ]
})
</script>

<style scoped>
/* Smooth transitions only */
button {
  transition: all 0.2s ease;
}

/* Simple hover effects */
button:active {
  transform: translateY(1px);
}
</style>