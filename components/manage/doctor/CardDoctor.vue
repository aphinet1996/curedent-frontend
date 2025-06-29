<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import Card from '~/components/Card.vue'
import { Icon } from '@iconify/vue'
import { useDoctorStore } from '~/stores/doctor'
import { useCookie } from 'nuxt/app'

// Initialize the doctor store
const doctorStore = useDoctorStore()

// Local loading state for retry attempts
const isRetrying = ref(false)

// Check if authentication is ready
const authToken = useCookie('auth_token')

// Use computed to maintain reactivity
const doctors = computed(() => doctorStore.doctors)
const isLoading = computed(() => doctorStore.isLoading)
const error = computed(() => doctorStore.error)

// Fetch doctors with retry logic
const loadDoctors = async (retryCount = 0) => {
  console.log('Loading doctors, attempt:', retryCount + 1)
  
  try {
    // Check if auth token exists
    if (!authToken.value) {
      console.warn('No auth token found, waiting...')
      if (retryCount < 3) {
        setTimeout(() => loadDoctors(retryCount + 1), 1000)
        return
      }
      throw new Error('Authentication required')
    }

    await doctorStore.fetchDoctors()
    console.log('Doctors loaded successfully:', doctors.value.length)
  } catch (err: any) {
    console.error('Error loading doctors:', err)
    
    // Retry up to 3 times
    if (retryCount < 2) {
      setTimeout(() => loadDoctors(retryCount + 1), 2000)
    }
  }
}

// Watch for auth token changes
// watch(authToken, (newToken) => {
//   console.log('Auth token changed:', !!newToken)
//   if (newToken && doctors.value.length === 0 && !isLoading.value) {
//     loadDoctors()
//   }
// }, { immediate: true })

// Load doctors on mount
onMounted(async () => {
  console.log('Component mounted')
  await nextTick()
  
  // Wait a bit for authentication to be ready
  setTimeout(() => {
    loadDoctors()
  }, 100)
})

// Manual retry function
const handleRetry = async () => {
  isRetrying.value = true
  await loadDoctors()
  isRetrying.value = false
}

// Helper function to check if doctor has photo
const hasPhoto = (doctor: any) => {
  return doctor.photo && doctor.photo.trim() !== ''
}


// Handle image load error
const handleImageError = (event: Event, doctor: any) => {
  const img = event.target as HTMLImageElement
  // Hide the image and show icon instead
  img.style.display = 'none'
  
  // Find the icon container and show it
  const iconContainer = img.nextElementSibling as HTMLElement
  if (iconContainer) {
    iconContainer.style.display = 'flex'
  }
}

const getFormattedSchedule = (doctor: any) => {
  if (!doctor.branches || doctor.branches.length === 0) {
    return 'ไม่ระบุตารางเวลา'
  }
  
  const allTimetables = doctor.branches.flatMap((branch: any) => branch.timetable || [])
  
  if (allTimetables.length === 0) {
    return 'ไม่ระบุตารางเวลา'
  }
  
  const firstTimetable = allTimetables[0]
  const day = new Date(firstTimetable.date).toLocaleDateString('en-US', { 
    weekday: 'long'
  })
  const times = firstTimetable.time.join(', ')
  
  return `${day}\n${times}`
}

const getPrimaryBranch = (doctor: any) => {
  if (!doctor.branches || doctor.branches.length === 0) {
    return 'ไม่ระบุสาขา'
  }
  
  return doctor.branches[0].name
}
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading || isRetrying" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">{{ isRetrying ? 'กำลังลองใหม่...' : 'กำลังโหลด...' }}</span>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:alert-circle" class="w-5 h-5 text-red-500" />
        <p class="font-medium">{{ error }}</p>
      </div>
      <button 
        class="mt-2 text-sm text-red-600 hover:text-red-800 underline" 
        @click="handleRetry"
        :disabled="isRetrying"
      >
        {{ isRetrying ? 'กำลังลองใหม่...' : 'ลองใหม่อีกครั้ง' }}
      </button>
    </div>
    
    <!-- No Auth State -->
    <div v-else-if="!authToken" class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:account-alert" class="w-5 h-5 text-yellow-500" />
        <p class="font-medium">กำลังรอการยืนยันตัวตน...</p>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="doctors.length === 0" class="py-16 text-center">
      <Icon icon="mdi:doctor" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
      <h3 class="text-gray-700 font-medium mb-1">ยังไม่มีข้อมูลหมอ</h3>
      <p class="text-gray-500 text-sm">ไม่พบข้อมูลหมอในระบบ</p>
      <button 
        class="mt-3 text-blue-600 hover:text-blue-800 underline text-sm" 
        @click="handleRetry"
      >
        โหลดข้อมูลใหม่
      </button>
    </div>

    <!-- Doctors Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card v-for="doctor in doctors" :key="doctor.id" class="p-0 overflow-hidden bg-white">
        
        <!-- Photo Container -->
        <div class="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
          <!-- Show image if photo exists -->
          <img 
            v-if="hasPhoto(doctor)"
            :src="doctor.photo" 
            :alt="`Dr. ${doctor.fullName}`" 
            class="w-full h-full object-cover" 
            @error="handleImageError($event, doctor)"
            loading="lazy"
          />
          
          <!-- Show icon if no photo or image failed to load -->
          <div 
            v-if="!hasPhoto(doctor)"
            class="w-full h-full flex items-center justify-center bg-gray-100"
          >
            <Icon 
              icon="iconoir:user" 
              class="w-20 h-20 text-gray-400" 
            />
          </div>
          
          <!-- Fallback icon (hidden by default, shown when image fails) -->
          <div 
            v-if="hasPhoto(doctor)"
            class="w-full h-full absolute inset-0 flex items-center justify-center bg-gray-100"
            style="display: none;"
          >
            <Icon 
              icon="iconoir:user" 
              class="w-20 h-20 text-gray-400" 
            />
          </div>
        </div>

        <div class="p-4">
          <h3 class="text-sm font-semibold text-gray-900">{{ doctor.fullName }}</h3>

          <div class="mt-1 flex items-center gap-1 text-sm text-gray-600">
            <Icon icon="iconoir:user" class="w-4 h-4" />
            {{ doctor.specialty }}
          </div>

          <div class="mt-1 flex items-start gap-1 text-sm text-gray-600 whitespace-pre-line">
            <Icon icon="meteor-icons:calendar" class="w-4 h-4 mt-0.5" />
            <span>{{ getFormattedSchedule(doctor) }}</span>
          </div>

          <div class="mt-1 flex items-center gap-1 text-sm text-gray-600">
            <Icon icon="iconoir:map-pin" class="w-4 h-4" />
            {{ getPrimaryBranch(doctor) }}
          </div>

          <!-- Doctor Status -->
          <div class="mt-2 flex items-center gap-1">
            <div 
              :class="[
                'w-2 h-2 rounded-full',
                doctor.isActive ? 'bg-green-500' : 'bg-red-500'
              ]"
            />
            <span 
              :class="[
                'text-xs',
                doctor.isActive ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ doctor.isActive ? 'Available' : 'Unavailable' }}
            </span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>