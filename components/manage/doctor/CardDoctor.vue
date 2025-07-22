<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import Card from '~/components/Card.vue'
import { Icon } from '@iconify/vue'
import { useDoctorStore } from '~/stores/doctor'
import { useCookie } from 'nuxt/app'
import {
  getFormattedScheduleShort,
  getFormattedScheduleDetailed,
  isComplexSchedule,
  getFormattedScheduleShortForDoctor
} from '~/utils/scheduleFormatter'
import FormAddDoctor from '~/components/manage/doctor/FormAddDoctor.vue'

// Initialize the doctor store
const doctorStore = useDoctorStore()

// Local loading state for retry attempts
const isRetrying = ref(false)
const expandedSchedules = ref<Set<string>>(new Set())

// Edit modal state
const showEditModal = ref(false)
const editingDoctorId = ref<string | undefined>(undefined)

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

// Load doctors on mount
onMounted(async () => {
  console.log('Component mounted')
  await nextTick()

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
  img.style.display = 'none'

  const iconContainer = img.nextElementSibling as HTMLElement
  if (iconContainer) {
    iconContainer.style.display = 'flex'
  }
}

// ใช้ utility functions จาก scheduleFormatter
const getFormattedSchedule = (doctor: any) => {
  // ใช้ function เดียวกันกับ Assistant (แสดงเวลาจริง)
  return getFormattedScheduleShort(doctor)
}

const getDetailedSchedule = (doctor: any) => {
  return getFormattedScheduleDetailed(doctor)
}

const isScheduleComplex = (doctor: any) => {
  return isComplexSchedule(doctor)
}

const toggleScheduleExpansion = (doctorId: string) => {
  const newSet = new Set(expandedSchedules.value)
  if (newSet.has(doctorId)) {
    newSet.delete(doctorId)
  } else {
    newSet.add(doctorId)
  }
  expandedSchedules.value = newSet
}

const isScheduleExpanded = (doctorId: string) => {
  return expandedSchedules.value.has(doctorId)
}

const getPrimaryBranch = (doctor: any) => {
  if (!doctor.branches || doctor.branches.length === 0) {
    return 'ไม่ระบุสาขา'
  }

  return doctor.branches[0].name || 'สาขาหลัก'
}

// Edit functionality
const handleEditDoctor = (doctorId: string) => {
  editingDoctorId.value = doctorId
  showEditModal.value = true
}

const handleEditModalClose = () => {
  showEditModal.value = false
  editingDoctorId.value = undefined
}

const handleEditSubmit = (updatedDoctor: any) => {
  // รีเฟรชข้อมูล doctors หลังจากแก้ไข
  loadDoctors()
  handleEditModalClose()
}

const handleViewDoctor = (doctor: any) => {
  console.log('View doctor details:', doctor)
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
      <button class="mt-2 text-sm text-red-600 hover:text-red-800 underline" @click="handleRetry"
        :disabled="isRetrying">
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
    <div v-else-if="doctors.length === 0" class="py-16 text-center bg-white rounded-xl shadow shadow-gray-200">
      <Icon icon="mdi:doctor" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
      <h3 class="text-gray-700 font-medium mb-1">ยังไม่มีข้อมูลหมอ</h3>
      <p class="text-gray-500 text-sm">ไม่พบข้อมูลหมอในระบบ</p>
    </div>

    <!-- Doctors Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card v-for="doctor in doctors" :key="doctor.id"
        class="p-0 overflow-hidden bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">

        <!-- Photo Container -->
        <div class="relative w-full h-48 rounded-t-xl overflow-hidden bg-gray-200">
          <!-- Show image if photo exists -->
          <img v-if="hasPhoto(doctor)" :src="doctor.photo" :alt="`Dr. ${doctor.fullName}`"
            class="w-full h-full object-cover" @error="handleImageError($event, doctor)" loading="lazy" />

          <!-- Show icon if no photo or image failed to load -->
          <div v-if="!hasPhoto(doctor)" class="w-full h-full flex items-center justify-center">
            <Icon icon="iconoir:user" class="w-20 h-20 text-gray-400" />
          </div>

          <!-- Fallback icon (hidden by default, shown when image fails) -->
          <div v-if="hasPhoto(doctor)"
            class="w-full h-full absolute inset-0 flex items-center justify-center bg-gray-200"
            style="display: none;">
            <Icon icon="iconoir:user" class="w-20 h-20 text-gray-400" />
          </div>

          <!-- Status Badge (Top Right) -->
          <div class="absolute top-3 right-3">
            <div :class="[
              'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm border',
              doctor.isActive
                ? 'bg-green-100/80 text-green-700 border-green-200'
                : 'bg-red-100/80 text-red-700 border-red-200'
            ]">
              <div :class="[
                'w-1.5 h-1.5 rounded-full',
                doctor.isActive ? 'bg-green-500' : 'bg-red-500'
              ]" />
              {{ doctor.isActive ? 'Available' : 'Unavailable' }}
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-3">
          <!-- Name -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 leading-tight">Dr. {{ doctor.fullName }}</h3>
          </div>

          <!-- Specialty with Icon -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 py-1 rounded-md">
              <Icon icon="heroicons:academic-cap-20-solid" class="w-4 h-4 text-gray-500" />
              <span class="text-sm font-medium">
                {{ doctor.specialty }}
              </span>
            </div>
          </div>

          <!-- Schedule Information -->
          <div class="bg-purple-50 rounded-lg p-3 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-start gap-2 flex-1">
                <Icon icon="heroicons:calendar-days-20-solid" class="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 whitespace-pre-line leading-relaxed">
                    {{ getFormattedSchedule(doctor) }}
                  </div>
                </div>
              </div>

              <!-- Expand Button for Complex Schedules -->
              <button v-if="isScheduleComplex(doctor)" @click="toggleScheduleExpansion(doctor.id)"
                class="flex-shrink-0 p-1 rounded-md hover:bg-purple-100 transition-colors duration-200"
                :title="isScheduleExpanded(doctor.id) ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดเพิ่มเติม'">
                <Icon
                  :icon="isScheduleExpanded(doctor.id) ? 'heroicons:chevron-up-20-solid' : 'heroicons:chevron-down-20-solid'"
                  class="w-4 h-4 text-purple-600" />
              </button>
            </div>

            <!-- Expanded Schedule Details -->
            <div v-if="isScheduleExpanded(doctor.id) && isScheduleComplex(doctor)"
              class="mt-3 pt-3 border-t border-purple-200 space-y-2">
              <div class="text-xs font-medium text-purple-800 mb-2">รายละเอียดตารางเวลา:</div>
              <div v-for="(schedule, index) in getDetailedSchedule(doctor)" :key="index"
                class="flex items-center justify-between bg-white rounded-md p-2 text-xs">
                <span class="font-medium text-gray-700">{{ schedule.dayRange }}</span>
                <span class="text-purple-600">{{ schedule.timeRange }}</span>
              </div>
            </div>
          </div>

          <!-- Branch Information -->
          <div class="flex items-center gap-1.5 text-sm text-gray-600">
            <Icon icon="heroicons:map-pin-20-solid" class="w-4 h-4 text-gray-400" />
            <span class="truncate">{{ getPrimaryBranch(doctor) }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
            <button @click="handleEditDoctor(doctor.id)"
              class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-sm font-medium transition-colors duration-200">
              <Icon icon="heroicons:pencil-square-20-solid" class="w-4 h-4" />
              แก้ไข
            </button>
            <button @click="handleViewDoctor(doctor)"
              class="flex items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors duration-200"
              title="ดูรายละเอียดเพิ่มเติม">
              <Icon icon="heroicons:eye-20-solid" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Edit Doctor Modal -->
    <FormAddDoctor :show="showEditModal" mode="edit" :doctorId="editingDoctorId" @close="handleEditModalClose"
      @submit="handleEditSubmit" />
  </div>
</template>

<style scoped>
/* Custom hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar for schedule text */
.whitespace-pre-line {
  line-height: 1.4;
}

/* Animation for expanded content */
.schedule-expand-enter-active,
.schedule-expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.schedule-expand-enter-from,
.schedule-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.schedule-expand-enter-to,
.schedule-expand-leave-from {
  max-height: 200px;
  opacity: 1;
}
</style>