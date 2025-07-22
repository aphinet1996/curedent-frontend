<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import Card from '~/components/Card.vue'
import { Icon } from '@iconify/vue'
import { useAssistantStore } from '~/stores/assistant'
import { useCookie } from 'nuxt/app'
import { 
  getFormattedScheduleShort, 
  getFormattedScheduleDetailed, 
  isComplexSchedule
} from '~/utils/scheduleFormatter'
import FormAddAssistant from '~/components/manage/assistant/FormAddAssistant.vue'

const assistantStore = useAssistantStore()

const isRetrying = ref(false)
const expandedSchedules = ref<Set<string>>(new Set())

const showEditModal = ref(false)
const editingAssistantId = ref<string | undefined>(undefined)

const authToken = useCookie('auth_token')

const assistants = computed(() => assistantStore.assistants)
const isLoading = computed(() => assistantStore.isLoading)
const error = computed(() => assistantStore.error)

const loadAssistants = async (retryCount = 0) => {
  console.log('Loading assistants, attempt:', retryCount + 1)

  try {
    if (!authToken.value) {
      console.warn('No auth token found, waiting...')
      if (retryCount < 3) {
        setTimeout(() => loadAssistants(retryCount + 1), 1000)
        return
      }
      throw new Error('Authentication required')
    }

    await assistantStore.fetchAssistants()
    console.log('Assistants loaded successfully:', assistants.value.length)
  } catch (err: any) {
    console.error('Error loading assistants:', err)

    if (retryCount < 2) {
      setTimeout(() => loadAssistants(retryCount + 1), 2000)
    }
  }
}

onMounted(async () => {
  console.log('Component mounted')
  await nextTick()

  setTimeout(() => {
    loadAssistants()
  }, 100)
})

const handleRetry = async () => {
  isRetrying.value = true
  await loadAssistants()
  isRetrying.value = false
}

const hasPhoto = (assistant: any) => {
  return assistant.photo && assistant.photo.trim() !== ''
}

const handleImageError = (event: Event, assistant: any) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'

  const iconContainer = img.nextElementSibling as HTMLElement
  if (iconContainer) {
    iconContainer.style.display = 'flex'
  }
}

const handleEditAssistant = (assistantId: string) => {
  editingAssistantId.value = assistantId
  showEditModal.value = true
}

const handleEditModalClose = () => {
  showEditModal.value = false
  editingAssistantId.value = undefined
}

const handleEditSubmit = (updatedAssistant: any) => {
  loadAssistants()
  handleEditModalClose()
}

const getFormattedSchedule = (assistant: any) => {
  return getFormattedScheduleShort(assistant)
}

const getDetailedSchedule = (assistant: any) => {
  return getFormattedScheduleDetailed(assistant)
}

const isScheduleComplex = (assistant: any) => {
  return isComplexSchedule(assistant)
}

const toggleScheduleExpansion = (assistantId: string) => {
  const newSet = new Set(expandedSchedules.value)
  if (newSet.has(assistantId)) {
    newSet.delete(assistantId)
  } else {
    newSet.add(assistantId)
  }
  expandedSchedules.value = newSet
}

const isScheduleExpanded = (assistantId: string) => {
  return expandedSchedules.value.has(assistantId)
}

const getPrimaryBranch = (assistant: any) => {
  if (!assistant.branches || assistant.branches.length === 0) {
    return 'ไม่ระบุสาขา'
  }

  return assistant.branches[0].name || 'สาขาหลัก'
}

const getEmploymentTypeDisplay = (employmentType: string) => {
  const displayMap = {
    'fullTime': 'Full Time',
    'partTime': 'Part Time',
    'contract': 'Contract'
  }
  return displayMap[employmentType as keyof typeof displayMap] || employmentType
}

const getEmploymentTypeColor = (employmentType: string) => {
  const colorMap = {
    'fullTime': 'text-green-600',
    'partTime': 'text-blue-600',
    'contract': 'text-orange-600'
  }
  return colorMap[employmentType as keyof typeof colorMap] || 'text-gray-600'
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
    <div v-else-if="assistants.length === 0" class="py-16 text-center bg-white rounded-xl shadow shadow-gray-200">
      <Icon icon="mdi:account-tie" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
      <h3 class="text-gray-700 font-medium mb-1">ยังไม่มีข้อมูลผู้ช่วย</h3>
      <p class="text-gray-500 text-sm">ไม่พบข้อมูลผู้ช่วยในระบบ</p>
    </div>

    <!-- Assistants Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card v-for="assistant in assistants" :key="assistant.id" 
        class="p-0 overflow-hidden bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">

        <!-- Photo Container -->
        <div class="relative w-full h-48 rounded-t-xl overflow-hidden bg-gray-200">
          <!-- Show image if photo exists -->
          <img v-if="hasPhoto(assistant)" :src="assistant.photo" :alt="`${assistant.fullName}`"
            class="w-full h-full object-cover" @error="handleImageError($event, assistant)" loading="lazy" />

          <!-- Show icon if no photo or image failed to load -->
          <div v-if="!hasPhoto(assistant)" class="w-full h-full flex items-center justify-center">
            <Icon icon="iconoir:user" class="w-20 h-20 text-gray-400" />
          </div>

          <!-- Fallback icon (hidden by default, shown when image fails) -->
          <div v-if="hasPhoto(assistant)"
            class="w-full h-full absolute inset-0 flex items-center justify-center bg-gray-200" 
            style="display: none;">
            <Icon icon="iconoir:user" class="w-20 h-20 text-gray-400" />
          </div>

          <div class="absolute top-3 left-3">
            <div :class="[
              'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm border',
              getEmploymentTypeColor(assistant.employmentType) === 'text-green-600' 
                ? 'bg-green-100/80 text-green-700 border-green-200'
                : getEmploymentTypeColor(assistant.employmentType) === 'text-blue-600'
                ? 'bg-blue-100/80 text-blue-700 border-blue-200'
                : 'bg-orange-100/80 text-orange-700 border-orange-200'
            ]">
              <Icon icon="iconoir:briefcase" class="w-3 h-3" />
              {{ getEmploymentTypeDisplay(assistant.employmentType) }}
            </div>
          </div>

          <div class="absolute top-3 right-3">
            <div :class="[
              'px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm border',
              assistant.isActive 
                ? 'bg-green-100/80 text-green-700 border-green-200' 
                : 'bg-red-100/80 text-red-700 border-red-200'
            ]">
              <div :class="[
                'w-1.5 h-1.5 rounded-full',
                assistant.isActive ? 'bg-green-500' : 'bg-red-500'
              ]" />
              {{ assistant.isActive ? 'Available' : 'Unavailable' }}
            </div>
          </div>

        </div>

        <!-- Content -->
        <div class="p-4 space-y-3">
          <!-- Name and Nickname -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 leading-tight">{{ assistant.fullName }}</h3>
            <p v-if="assistant.nickname && assistant.nickname !== assistant.name" 
               class="text-sm text-gray-500 mt-0.5">{{ assistant.nickname }}</p>
          </div>

          <!-- Schedule Information -->
          <div class="bg-blue-50 rounded-lg p-3 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-start gap-2 flex-1">
                <Icon icon="heroicons:calendar-days-20-solid" class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 whitespace-pre-line leading-relaxed">
                    {{ getFormattedSchedule(assistant) }}
                  </div>
                </div>
              </div>
              
              <!-- Expand Button for Complex Schedules -->
              <button 
                v-if="isScheduleComplex(assistant)"
                @click="toggleScheduleExpansion(assistant.id)"
                class="flex-shrink-0 p-1 rounded-md hover:bg-blue-100 transition-colors duration-200"
                :title="isScheduleExpanded(assistant.id) ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดเพิ่มเติม'"
              >
                <Icon 
                  :icon="isScheduleExpanded(assistant.id) ? 'heroicons:chevron-up-20-solid' : 'heroicons:chevron-down-20-solid'" 
                  class="w-4 h-4 text-blue-600" 
                />
              </button>
            </div>

            <!-- Expanded Schedule Details -->
            <div 
              v-if="isScheduleExpanded(assistant.id) && isScheduleComplex(assistant)"
              class="mt-3 pt-3 border-t border-blue-200 space-y-2"
            >
              <div class="text-xs font-medium text-blue-800 mb-2">รายละเอียดตารางเวลา:</div>
              <div 
                v-for="(schedule, index) in getDetailedSchedule(assistant)" 
                :key="index"
                class="flex items-center justify-between bg-white rounded-md p-2 text-xs"
              >
                <span class="font-medium text-gray-700">{{ schedule.dayRange }}</span>
                <span class="text-blue-600">{{ schedule.timeRange }}</span>
              </div>
            </div>
            
          </div>

          <!-- Branch Information -->
          <div class="flex items-center gap-1.5 text-sm text-gray-600">
            <Icon icon="heroicons:map-pin-20-solid" class="w-4 h-4 text-gray-400" />
            <span class="truncate">{{ getPrimaryBranch(assistant) }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
            <button
              @click="handleEditAssistant(assistant.id)"
              class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <Icon icon="heroicons:pencil-square-20-solid" class="w-4 h-4" />
              แก้ไข
            </button>
            <button
              class="flex items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors duration-200"
              title="ดูรายละเอียดเพิ่มเติม"
            >
              <Icon icon="heroicons:eye-20-solid" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>

    <!-- Edit Assistant Modal -->
    <FormAddAssistant
      :show="showEditModal"
      mode="edit"
      :assistantId="editingAssistantId"
      @close="handleEditModalClose"
      @submit="handleEditSubmit"
    />
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