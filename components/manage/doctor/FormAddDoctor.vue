<!-- <script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import Modal from '~/components/Modal.vue'
import { useDoctorStore } from '~/stores/doctor'
import { useAlertStore } from '~/stores/components/alert'
import { useCookie } from 'nuxt/app'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'submit'])

// Initialize stores
const doctorStore = useDoctorStore()
const alertStore = useAlertStore()

const form = reactive({
  name: '',
  surname: '',
  nickname: '',
  gender: 'male',
  nationality: 'thai',
  birthday: '',
  address: '',
  photo: null as File | null,
  specialty: '',
  branch: '',
  timetable: {} as Record<string, { start: string, end: string }[]>
})

const isLoading = ref(false)
const branches = ['Silom Complex']
const specialties = ['Prosthodontists', 'Orthodontists']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
]

const selectedDays = ref<string[]>([])
const timeRanges = reactive<Record<string, { start: string, end: string }[]>>({})
const tempRange = reactive<Record<string, { start: string; end: string }>>({})
const activeInputDay = ref<string | null>(null)

const onFileChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  if (target?.files?.[0]) {
    form.photo = target.files[0]
  }
}

const toggleDay = (day: string): void => {
  if (selectedDays.value.includes(day)) {
    selectedDays.value = selectedDays.value.filter(d => d !== day)
    delete timeRanges[day]
    delete tempRange[day]
    if (activeInputDay.value === day) activeInputDay.value = null
  } else {
    selectedDays.value.push(day)
    timeRanges[day] = []
    tempRange[day] = { start: '', end: '' }
  }
}

const isTempValid = (day: string): boolean => {
  const temp = tempRange[day]
  return !!(temp?.start && temp?.end && temp.start < temp.end)
}

const addTimeRangeFromTemp = (day: string): void => {
  if (!isTempValid(day)) return
  timeRanges[day].push({ ...tempRange[day] })
  tempRange[day] = { start: '', end: '' }
}

const removeTimeRange = (day: string, index: number): void => {
  timeRanges[day].splice(index, 1)
}

// Format timetable for API
const formatTimetableForAPI = (): Array<{ day: string; time: string[] }> => {
  const timetable: Array<{ day: string; time: string[] }> = [];

  for (const [day, ranges] of Object.entries(timeRanges)) {
    if (ranges.length > 0) {
      const times: string[] = [];
      ranges.forEach(range => {
        const start = parseInt(range.start.split(':')[0]);
        const end = parseInt(range.end.split(':')[0]);

        for (let hour = start; hour < end; hour++) {
          times.push(`${hour.toString().padStart(2, '0')}:00`);
        }
      });

      if (times.length > 0) {
        timetable.push({
          day: day.toLowerCase(),
          time: times
        });
      }
    }
  }

  console.log('Formatted timetable:', timetable); // Debug
  return timetable;
};

// Get branch ID (you might need to fetch this from an API or store)
const getBranchId = (branchName: string): string => {
  const branchMap: Record<string, string> = {
    'Silom Complex': '6826bce1edca368932d61a47', // Replace with actual IDs
  }
  return branchMap[branchName] || ''
}

const handleSubmit = async (): Promise<void> => {
  if (!form.name.trim() || !form.surname.trim() || !form.specialty || !form.branch) {
    alertStore.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'ข้อมูลไม่ครบ')
    return
  }

  isLoading.value = true

  try {
    // สร้าง branches array
    const branches = [{
      branchId: getBranchId(form.branch),
      timetable: formatTimetableForAPI()
    }]

    // สร้าง FormData
    const formData = new FormData()

    // Add photo if exists
    if (form.photo) {
      formData.append('photo', form.photo)
    } else {
      formData.append('photo', '') // Empty string for no photo
    }

    // Add basic info
    formData.append('name', form.name.trim())
    formData.append('surname', form.surname.trim())
    formData.append('nickname', form.nickname.trim() || form.name.trim())
    formData.append('gender', form.gender)
    formData.append('nationality', form.nationality)
    formData.append('birthday', form.birthday || '1990-01-01')
    formData.append('address', form.address.trim() || 'ไม่ระบุ')
    formData.append('specialty', form.specialty)

    // Add clinic ID
    const clinicId = useCookie('clinic_id').value || ''
    formData.append('clinicId', clinicId)

    // วิธีใหม่: ส่ง branches แต่ละ field แยกกัน
    branches.forEach((branch, index) => {
      formData.append(`branches[${index}][branchId]`, branch.branchId)

      branch.timetable.forEach((schedule, scheduleIndex) => {
        formData.append(`branches[${index}][timetable][${scheduleIndex}][day]`, schedule.day)
        schedule.time.forEach((time, timeIndex) => {
          formData.append(`branches[${index}][timetable][${scheduleIndex}][time][${timeIndex}]`, time)
        })
      })
    })

    // เรียกใช้ store function ที่รับ FormData
    const newDoctor = await doctorStore.createDoctor(formData)

    if (newDoctor) {
      alertStore.success(`เพิ่มหมอ "${newDoctor.fullName}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      emit('submit', newDoctor)
      resetForm()
      emit('close')
    }
  } catch (err: any) {
    console.error('Error creating doctor:', err)
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลหมอ', 'เกิดข้อผิดพลาด')
  } finally {
    isLoading.value = false
  }
}

const resetForm = (): void => {
  form.name = ''
  form.surname = ''
  form.nickname = ''
  form.gender = 'male'
  form.nationality = 'thai'
  form.birthday = ''
  form.address = ''
  form.specialty = ''
  form.branch = ''
  form.photo = null
  selectedDays.value = []
  Object.keys(timeRanges).forEach(key => delete timeRanges[key])
  Object.keys(tempRange).forEach(key => delete tempRange[key])
  activeInputDay.value = null

  // Reset file input
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const onClickOutside = (e: MouseEvent): void => {
  const target = e.target as HTMLElement
  if (!target.closest('.time-row')) {
    activeInputDay.value = null
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <Modal :show="props.show" title="Add Doctor" widthClass="max-w-4xl" @close="emit('close')">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-[800px]">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
          <input type="file" accept="image/*"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="onFileChange" />
          <p class="text-xs text-gray-500 mt-1">รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name <span class="text-red-500">*</span>
            </label>
            <input v-model="form.name" type="text"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ชื่อ" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Surname <span class="text-red-500">*</span>
            </label>
            <input v-model="form.surname" type="text"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="นามสกุล" required />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
          <input v-model="form.nickname" type="text"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ชื่อเล่น" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select v-model="form.gender"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="gender in genders" :key="gender.value" :value="gender.value">
                {{ gender.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <input v-model="form.nationality" type="text"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="สัญชาติ" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
          <input v-model="form.birthday" type="date"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea v-model="form.address"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"
            placeholder="ที่อยู่"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Specialty <span class="text-red-500">*</span>
          </label>
          <select v-model="form.specialty"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required>
            <option disabled value="">Choose</option>
            <option v-for="s in specialties" :key="s">{{ s }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Branch <span class="text-red-500">*</span>
          </label>
          <div class="space-y-2">
            <label v-for="b in branches" :key="b" class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="form.branch" :value="b" class="form-radio text-blue-600 focus:ring-blue-500"
                required />
              <span class="text-sm">{{ b }}</span>
            </label>
          </div>
        </div>
      </div>

      <div v-if="form.branch">
        <label class="block text-sm font-medium text-gray-700 mb-2">Timetable</label>
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div v-for="day in days" :key="day" class="time-row">
            <div class="flex items-center gap-2">
              <input type="checkbox" :checked="selectedDays.includes(day)" @change="() => toggleDay(day)"
                class="text-blue-600 focus:ring-blue-500" />
              <div class="w-[90px] text-sm font-medium text-gray-800">{{ day }}</div>

              <div
                class="flex-1 border rounded px-3 py-2 text-sm flex flex-wrap items-center gap-2 bg-white cursor-pointer transition-colors duration-200"
                :class="{
                  'bg-gray-50 cursor-not-allowed': !selectedDays.includes(day),
                  'hover:bg-gray-50': selectedDays.includes(day)
                }" @click="selectedDays.includes(day) && (activeInputDay = day)">
                <template v-if="timeRanges[day]?.length">
                  <div v-for="(range, idx) in timeRanges[day]" :key="idx"
                    class="bg-blue-100 text-blue-800 px-2 py-1 rounded-sm flex items-center gap-1 text-xs">
                    {{ range.start }} - {{ range.end }}
                    <button @click.stop="removeTimeRange(day, idx)"
                      class="text-red-500 hover:text-red-700 ml-1 font-bold" title="Remove time range">
                      &times;
                    </button>
                  </div>
                </template>
                <span v-else class="text-gray-400 text-xs">
                  {{ selectedDays.includes(day) ? 'Click to add time' : 'Select day first' }}
                </span>
              </div>
            </div>

            <div v-if="activeInputDay === day && selectedDays.includes(day)"
              class="ml-[121px] mt-2 p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-2">
                <input type="time" v-model="tempRange[day].start"
                  class="border rounded px-2 py-1 text-sm w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span class="text-gray-500">-</span>
                <input type="time" v-model="tempRange[day].end"
                  class="border rounded px-2 py-1 text-sm w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button @click="addTimeRangeFromTemp(day)"
                  class="px-3 py-1 text-sm rounded transition-colors duration-200" :class="isTempValid(day)
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'" :disabled="!isTempValid(day)">
                  Add
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Select start and end time, then click Add</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex items-center justify-center py-16 text-gray-400">
        <div class="text-center">
          <div class="text-4xl mb-2">📅</div>
          <p class="text-sm">Select a branch to set up timetable</p>
        </div>
      </div>

      <div class="col-span-1 md:col-span-2 flex justify-end gap-2 mt-6 pt-4">
        <button @click="emit('close')"
          class="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          :disabled="isLoading">
          Cancel
        </button>
        <button @click="handleSubmit"
          class="px-4 py-2 rounded text-sm text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2 transition-colors duration-200"
          :disabled="isLoading">
          <span v-if="isLoading" class="inline-block">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </span>
          {{ isLoading ? 'Adding...' : 'Add Doctor' }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
input[type='time']::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
}

input[type='file']::-webkit-file-upload-button {
  background: transparent;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

input[type='file']::-webkit-file-upload-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Custom radio button styling */
.form-radio {
  width: 1rem;
  height: 1rem;
}

/* Scrollbar styling for timetable */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> -->

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import Modal from '~/components/Modal.vue'
import { useDoctorStore } from '~/stores/doctor'
import { useBranchStore } from '~/stores/branch'
import { useAlertStore } from '~/stores/components/alert'
import { useCookie } from 'nuxt/app'
import { COLOR_PALETTE } from '~/types/doctor' // Import จาก types แทน

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'submit'])

// Initialize stores
const doctorStore = useDoctorStore()
const branchStore = useBranchStore()
const alertStore = useAlertStore()

// Stepper state
const currentStep = ref(1)
const totalSteps = 4

const form = reactive({
  name: '',
  surname: '',
  nickname: '',
  gender: 'male',
  nationality: 'thai',
  birthday: '',
  address: '',
  photo: null as File | null,
  specialty: '',
  selectedBranches: [] as string[], // Array of branch IDs
  color: '#3B82F6', // Default blue color
  timetables: {} as Record<string, { start: string, end: string }[]> // branchId -> time ranges
})

const isLoading = ref(false)
const specialties = ['Prosthodontists', 'Orthodontists']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
]

// ใช้ COLOR_PALETTE จาก types แทน
const colorPalette = COLOR_PALETTE

// Timetable management for each branch
const selectedDays = reactive<Record<string, string[]>>({})
const timeRanges = reactive<Record<string, Record<string, { start: string, end: string }[]>>>({})
const tempRange = reactive<Record<string, Record<string, { start: string; end: string }>>>({})
const activeInputDay = reactive<Record<string, string | null>>({})

const previewImage = ref<string | null>(null)

// Computed properties
const isStep1Valid = computed(() => {
  return form.name.trim() && form.surname.trim() && form.specialty
})

const isStep2Valid = computed(() => {
  return form.selectedBranches.length > 0
})

const isStep3Valid = computed(() => {
  // At least one branch should have some schedule
  return form.selectedBranches.some(branchId => {
    const branchTimeRanges = timeRanges[branchId] || {}
    return Object.values(branchTimeRanges).some(ranges => ranges.length > 0)
  })
})

const selectedBranchesData = computed(() => {
  return branchStore.getBranches.filter(branch => form.selectedBranches.includes(branch.id))
})

const stepTitles = [
  'Personal Information',
  'Branch & Color',
  'Schedule Setup',
  'Review & Confirm'
]

const stepIcons = [
  'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
]

// Load branches on mount
onMounted(async () => {
  await branchStore.fetchBranches()
})

const onFileChange = (e: Event): void => {
  const target = e.target as HTMLInputElement
  if (target?.files?.[0]) {
    form.photo = target.files[0]
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(target.files[0])
  }
}

const removeImage = (): void => {
  form.photo = null
  previewImage.value = null
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const selectColor = (color: string): void => {
  form.color = color
}

const toggleBranch = (branchId: string): void => {
  const index = form.selectedBranches.indexOf(branchId)
  if (index > -1) {
    // Remove branch
    form.selectedBranches.splice(index, 1)
    // Clean up timetable data for this branch
    delete selectedDays[branchId]
    delete timeRanges[branchId]
    delete tempRange[branchId]
    delete activeInputDay[branchId]
  } else {
    // Add branch
    form.selectedBranches.push(branchId)
    // Initialize timetable data for this branch
    selectedDays[branchId] = []
    timeRanges[branchId] = {}
    tempRange[branchId] = {}
    activeInputDay[branchId] = null
  }
}

const toggleDay = (branchId: string, day: string): void => {
  if (!selectedDays[branchId]) selectedDays[branchId] = []
  if (!timeRanges[branchId]) timeRanges[branchId] = {}
  if (!tempRange[branchId]) tempRange[branchId] = {}

  if (selectedDays[branchId].includes(day)) {
    selectedDays[branchId] = selectedDays[branchId].filter(d => d !== day)
    delete timeRanges[branchId][day]
    delete tempRange[branchId][day]
    if (activeInputDay[branchId] === day) activeInputDay[branchId] = null
  } else {
    selectedDays[branchId].push(day)
    timeRanges[branchId][day] = []
    tempRange[branchId][day] = { start: '', end: '' }
  }
}

const isTempValid = (branchId: string, day: string): boolean => {
  const temp = tempRange[branchId]?.[day]
  return !!(temp?.start && temp?.end && temp.start < temp.end)
}

const addTimeRangeFromTemp = (branchId: string, day: string): void => {
  if (!isTempValid(branchId, day)) return
  if (!timeRanges[branchId][day]) timeRanges[branchId][day] = []
  timeRanges[branchId][day].push({ ...tempRange[branchId][day] })
  tempRange[branchId][day] = { start: '', end: '' }
}

const removeTimeRange = (branchId: string, day: string, index: number): void => {
  timeRanges[branchId][day].splice(index, 1)
}

// Step navigation
const nextStep = (): void => {
  if (currentStep.value === 1 && !isStep1Valid.value) {
    alertStore.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'ข้อมูลไม่ครบ')
    return
  }
  if (currentStep.value === 2 && !isStep2Valid.value) {
    alertStore.error('กรุณาเลือกอย่างน้อย 1 สาขา', 'ข้อมูลไม่ครบ')
    return
  }
  if (currentStep.value === 3 && !isStep3Valid.value) {
    alertStore.error('กรุณาตั้งค่าตารางเวลาให้อย่างน้อย 1 สาขา', 'ข้อมูลไม่ครบ')
    return
  }
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const goToStep = (step: number): void => {
  if (step === 1) {
    currentStep.value = 1
  } else if (step === 2 && isStep1Valid.value) {
    currentStep.value = 2
  } else if (step === 3 && isStep1Valid.value && isStep2Valid.value) {
    currentStep.value = 3
  } else if (step === 4 && isStep1Valid.value && isStep2Valid.value && isStep3Valid.value) {
    currentStep.value = 4
  }
}

// Format timetable for API
const formatTimetableForAPI = (branchId: string): Array<{ day: string; time: string[] }> => {
  const timetable: Array<{ day: string; time: string[] }> = []
  const branchTimeRanges = timeRanges[branchId] || {}
  
  for (const [day, ranges] of Object.entries(branchTimeRanges)) {
    if (ranges.length > 0) {
      const times: string[] = []
      ranges.forEach(range => {
        const start = parseInt(range.start.split(':')[0])
        const end = parseInt(range.end.split(':')[0])
        
        for (let hour = start; hour < end; hour++) {
          times.push(`${hour.toString().padStart(2, '0')}:00`)
        }
      })
      
      if (times.length > 0) {
        timetable.push({
          day: day.toLowerCase(),
          time: times
        })
      }
    }
  }
  
  return timetable
}

// Get branch ID mapping for API
const getBranchId = (branchId: string): string => {
  return branchId // Since we're already using the actual branch IDs from the store
}

const handleSubmit = async (): Promise<void> => {
  if (!isStep1Valid.value || !isStep2Valid.value || !isStep3Valid.value) {
    alertStore.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'ข้อมูลไม่ครบ')
    return
  }

  isLoading.value = true

  try {
    // สร้าง branches array
    const branches = form.selectedBranches.map(branchId => ({
      branchId: getBranchId(branchId),
      timetable: formatTimetableForAPI(branchId)
    }))

    // สร้าง FormData
    const formData = new FormData()
    
    // Add photo if exists
    if (form.photo) {
      formData.append('photo', form.photo)
    } else {
      formData.append('photo', '') // Empty string for no photo
    }
    
    // Add basic info
    formData.append('name', form.name.trim())
    formData.append('surname', form.surname.trim())
    formData.append('nickname', form.nickname.trim() || form.name.trim())
    formData.append('gender', form.gender)
    formData.append('nationality', form.nationality)
    formData.append('birthday', form.birthday || '1990-01-01')
    formData.append('address', form.address.trim() || 'ไม่ระบุ')
    formData.append('specialty', form.specialty)
    formData.append('color', form.color) // Add color to form data
    
    // Add clinic ID
    const clinicId = useCookie('clinic_id').value || ''
    formData.append('clinicId', clinicId)
    
    // ส่ง branches แต่ละ field แยกกัน
    branches.forEach((branch, index) => {
      formData.append(`branches[${index}][branchId]`, branch.branchId)
      
      branch.timetable.forEach((schedule, scheduleIndex) => {
        formData.append(`branches[${index}][timetable][${scheduleIndex}][day]`, schedule.day)
        schedule.time.forEach((time, timeIndex) => {
          formData.append(`branches[${index}][timetable][${scheduleIndex}][time][${timeIndex}]`, time)
        })
      })
    })

    // เรียกใช้ store function ที่รับ FormData
    const newDoctor = await doctorStore.createDoctor(formData)
    
    if (newDoctor) {
      alertStore.success(`เพิ่มหมอ "${newDoctor.fullName}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      emit('submit', newDoctor)
      resetForm()
      emit('close')
    }
  } catch (err: any) {
    console.error('Error creating doctor:', err)
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลหมอ', 'เกิดข้อผิดพลาด')
  } finally {
    isLoading.value = false
  }
}

const resetForm = (): void => {
  currentStep.value = 1
  form.name = ''
  form.surname = ''
  form.nickname = ''
  form.gender = 'male'
  form.nationality = 'thai'
  form.birthday = ''
  form.address = ''
  form.specialty = ''
  form.selectedBranches = []
  form.photo = null
  form.color = '#3B82F6'
  
  Object.keys(selectedDays).forEach(key => delete selectedDays[key])
  Object.keys(timeRanges).forEach(key => delete timeRanges[key])
  Object.keys(tempRange).forEach(key => delete tempRange[key])
  Object.keys(activeInputDay).forEach(key => delete activeInputDay[key])
  
  previewImage.value = null

  // Reset file input
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const onClickOutside = (e: MouseEvent): void => {
  const target = e.target as HTMLElement
  if (!target.closest('.time-row')) {
    Object.keys(activeInputDay).forEach(key => {
      activeInputDay[key] = null
    })
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <Modal :show="props.show" title="Add New Doctor" widthClass="max-w-5xl" @close="emit('close')">
    <div class="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-2xl">
      
      <!-- Stepper Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between relative">
          <!-- Progress Line -->
          <div class="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
            <div class="h-full bg-blue-500 transition-all duration-500"
              :style="{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }"></div>
          </div>
          
          <!-- Steps -->
          <div v-for="(title, index) in stepTitles" :key="index" 
            class="flex flex-col items-center relative z-10 cursor-pointer"
            @click="goToStep(index + 1)">
            
            <!-- Step Circle -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white"
              :class="{
                'border-blue-500 bg-blue-500 text-white': currentStep === index + 1,
                'border-green-500 bg-green-500 text-white': currentStep > index + 1,
                'border-gray-300 text-gray-500': currentStep < index + 1
              }">
              <svg v-if="currentStep > index + 1" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stepIcons[index]"></path>
              </svg>
            </div>
            
            <!-- Step Title -->
            <div class="mt-3 text-center">
              <p class="text-sm font-medium"
                :class="{
                  'text-blue-600': currentStep === index + 1,
                  'text-green-600': currentStep > index + 1,
                  'text-gray-500': currentStep < index + 1
                }">
                {{ title }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="min-h-[500px]">
        
        <!-- Step 1: Personal Information -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Personal Information</h3>
            <p class="text-gray-600">Fill in the doctor's basic details and specialty</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Photo Upload -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Profile Photo</label>
              
              <div v-if="previewImage" class="relative mb-4">
                <img :src="previewImage" alt="Preview" class="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg">
                <button @click="removeImage" 
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">
                  ×
                </button>
              </div>
              
              <label class="relative block w-full">
                <input type="file" accept="image/*" @change="onFileChange" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                  <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p class="text-sm text-gray-600">
                    <span class="font-medium text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </label>
            </div>

            <!-- Basic Info -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span class="text-red-500">*</span>
                  </label>
                  <input v-model="form.name" type="text"
                    class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Enter first name" required />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span class="text-red-500">*</span>
                  </label>
                  <input v-model="form.surname" type="text"
                    class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Enter last name" required />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nickname</label>
                <input v-model="form.nickname" type="text"
                  class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  placeholder="Enter nickname" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select v-model="form.gender"
                    class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                    <option v-for="gender in genders" :key="gender.value" :value="gender.value">
                      {{ gender.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                  <input v-model="form.nationality" type="text"
                    class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder="Enter nationality" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Birthday</label>
                <input v-model="form.birthday" type="date"
                  class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea v-model="form.address"
                  class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                  rows="3" placeholder="Enter address"></textarea>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Specialty <span class="text-red-500">*</span>
                </label>
                <select v-model="form.specialty"
                  class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  required>
                  <option disabled value="">Choose Specialty</option>
                  <option v-for="s in specialties" :key="s">{{ s }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Branch & Color -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Branch & Color Selection</h3>
            <p class="text-gray-600">Select branches and choose theme color</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Branch Selection -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <label class="block text-sm font-semibold text-gray-700 mb-4">
                Select Branches <span class="text-red-500">*</span>
              </label>
              
              <div v-if="branchStore.getLoading" class="text-center py-8">
                <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-500 mt-2">Loading branches...</p>
              </div>

              <div v-else-if="branchStore.getBranches.length === 0" class="text-center py-8">
                <p class="text-gray-500">No branches available</p>
              </div>

              <div v-else class="space-y-3 max-h-72 overflow-y-auto">
                <label v-for="branch in branchStore.getBranches" :key="branch.id" 
                  class="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  :class="{ 'border-blue-500 bg-blue-50': form.selectedBranches.includes(branch.id) }">
                  <input type="checkbox" 
                    :checked="form.selectedBranches.includes(branch.id)"
                    @change="toggleBranch(branch.id)"
                    class="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1" />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-700 block">{{ branch.name }}</span>
                    <span class="text-xs text-gray-500">{{ branch.address }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Color Selection -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <label class="block text-sm font-semibold text-gray-700 mb-4">
                Choose Theme Color
              </label>
              <div class="grid grid-cols-4 gap-4">
                <div
                  v-for="color in colorPalette"
                  :key="color.value"
                  @click="selectColor(color.value)"
                  class="w-full aspect-square rounded-xl cursor-pointer relative transition-transform duration-200 shadow-md hover:scale-105"
                  :style="{
                    background: `linear-gradient(to bottom right, ${color.start}, ${color.end})`,
                    border: form.color === color.value ? `3px solid ${color.value}` : '2px solid transparent'
                  }"
                >
                  <!-- Tick icon -->
                  <div
                    v-if="form.color === color.value"
                    class="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                  >
                    <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                <p class="text-xs text-gray-600">
                  Selected Color: <span class="font-medium" :style="{ color: form.color }">{{ form.color }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Schedule Setup -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Schedule Setup</h3>
            <p class="text-gray-600">Configure working hours for each selected branch</p>
          </div>

          <div v-if="form.selectedBranches.length === 0" class="text-center py-8">
            <div class="text-6xl mb-4">📅</div>
            <p class="text-gray-500 font-medium">No branches selected</p>
            <p class="text-sm text-gray-400 mt-1">Please go back and select at least one branch</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="branchId in form.selectedBranches" :key="branchId" 
              class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: form.color }"></div>
                <h4 class="text-lg font-semibold text-gray-800">
                  {{ selectedBranchesData.find(b => b.id === branchId)?.name }}
                </h4>
              </div>

              <div class="space-y-4 max-h-80 overflow-y-auto">
                <div v-for="day in days" :key="`${branchId}-${day}`" class="time-row">
                  <div class="flex items-center gap-3 mb-2">
                    <input type="checkbox" 
                      :checked="selectedDays[branchId]?.includes(day)"
                      @change="() => toggleDay(branchId, day)"
                      class="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded" />
                    <div class="w-20 text-sm font-semibold text-gray-800">{{ day }}</div>

                    <div
                      class="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm flex flex-wrap items-center gap-2 bg-white cursor-pointer transition-all duration-200"
                      :class="{
                        'bg-gray-50 cursor-not-allowed border-gray-200': !selectedDays[branchId]?.includes(day),
                        'hover:border-blue-300': selectedDays[branchId]?.includes(day)
                      }" 
                      @click="selectedDays[branchId]?.includes(day) && (activeInputDay[branchId] = day)">
                      <template v-if="timeRanges[branchId]?.[day]?.length">
                        <div v-for="(range, idx) in timeRanges[branchId][day]" :key="idx"
                          class="px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium"
                          :style="{ 
                            backgroundColor: form.color + '20', 
                            color: form.color,
                            border: `1px solid ${form.color}40`
                          }">
                          {{ range.start }} - {{ range.end }}
                          <button @click.stop="removeTimeRange(branchId, day, idx)"
                            class="hover:opacity-70 ml-1 font-bold" title="Remove time range">
                            ×
                          </button>
                        </div>
                      </template>
                      <span v-else class="text-gray-400 text-xs">
                        {{ selectedDays[branchId]?.includes(day) ? 'Click to add time' : 'Select day first' }}
                      </span>
                    </div>
                  </div>

                  <!-- Time Picker -->
                  <div v-if="activeInputDay[branchId] === day && selectedDays[branchId]?.includes(day)"
                    class="ml-6 mt-2 p-4 bg-gray-50 rounded-lg border-l-4"
                    :style="{ borderColor: form.color }">
                    <div class="flex items-center gap-3">
                      <input type="time" 
                        v-model="tempRange[branchId][day].start"
                        class="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" />
                      <span class="text-gray-500 font-medium">to</span>
                      <input type="time" 
                        v-model="tempRange[branchId][day].end"
                        class="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" />
                      <button @click="addTimeRangeFromTemp(branchId, day)"
                        class="px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200" 
                        :class="isTempValid(branchId, day)
                          ? 'text-white hover:opacity-90 shadow-lg'
                          : 'text-gray-400 bg-gray-200 cursor-not-allowed'"
                        :style="isTempValid(branchId, day) ? { backgroundColor: form.color } : {}"
                        :disabled="!isTempValid(branchId, day)">
                        Add Time
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">Select start and end time, then click Add Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Review & Confirm -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Review & Confirm</h3>
            <p class="text-gray-600">Please review all information before adding the doctor</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Personal Info Summary -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Personal Information
              </h4>
              
              <div class="space-y-3">
                <div v-if="previewImage" class="flex justify-center mb-4">
                  <img :src="previewImage" alt="Preview" class="w-16 h-16 rounded-full object-cover border-2 border-gray-200">
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">Name:</span>
                    <p class="font-medium">{{ form.name }} {{ form.surname }}</p>
                  </div>
                  <div v-if="form.nickname">
                    <span class="text-gray-500">Nickname:</span>
                    <p class="font-medium">{{ form.nickname }}</p>
                  </div>
                  <div>
                    <span class="text-gray-500">Gender:</span>
                    <p class="font-medium">{{ genders.find(g => g.value === form.gender)?.label }}</p>
                  </div>
                  <div>
                    <span class="text-gray-500">Nationality:</span>
                    <p class="font-medium">{{ form.nationality || 'Not specified' }}</p>
                  </div>
                  <div v-if="form.birthday">
                    <span class="text-gray-500">Birthday:</span>
                    <p class="font-medium">{{ new Date(form.birthday).toLocaleDateString() }}</p>
                  </div>
                  <div>
                    <span class="text-gray-500">Specialty:</span>
                    <p class="font-medium text-blue-600">{{ form.specialty }}</p>
                  </div>
                </div>
                
                <div v-if="form.address" class="pt-2 border-t border-gray-200">
                  <span class="text-gray-500 text-sm">Address:</span>
                  <p class="font-medium text-sm">{{ form.address }}</p>
                </div>
              </div>
            </div>

            <!-- Branch & Settings Summary -->
            <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Branch & Settings
              </h4>
              
              <div class="space-y-4">
                <!-- Theme Color -->
                <div>
                  <span class="text-gray-500 text-sm">Theme Color:</span>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="w-6 h-6 rounded-full border-2 border-gray-200" :style="{ backgroundColor: form.color }"></div>
                    <span class="font-medium text-sm">{{ form.color }}</span>
                  </div>
                </div>
                
                <!-- Selected Branches with Schedule -->
                <div>
                  <span class="text-gray-500 text-sm">Selected Branches ({{ form.selectedBranches.length }}):</span>
                  <div class="mt-2 space-y-3">
                    <div v-for="branch in selectedBranchesData" :key="branch.id" 
                      class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p class="font-medium text-sm text-gray-800 mb-2">{{ branch.name }}</p>
                      <p class="text-xs text-gray-500 mb-2">{{ branch.address }}</p>
                      
                      <!-- Schedule Summary -->
                      <div v-if="timeRanges[branch.id]" class="mt-2">
                        <span class="text-xs text-gray-400">Schedule:</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                          <template v-for="(ranges, day) in timeRanges[branch.id]" :key="day">
                            <div v-if="ranges.length > 0" 
                              class="px-2 py-1 text-xs rounded-md"
                              :style="{ 
                                backgroundColor: form.color + '20',
                                color: form.color,
                                border: `1px solid ${form.color}40`
                              }">
                              {{ day.substring(0, 3) }}: {{ ranges.map(r => `${r.start}-${r.end}`).join(', ') }}
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button v-if="currentStep > 1" @click="prevStep"
          class="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Previous
        </button>
        <div v-else></div>

        <div class="flex gap-3">
          <button @click="emit('close')"
            class="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            :disabled="isLoading">
            Cancel
          </button>
          
          <button v-if="currentStep < totalSteps" @click="nextStep"
            class="px-6 py-3 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
            :disabled="(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid) || (currentStep === 3 && !isStep3Valid)">
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <button v-else @click="handleSubmit"
            class="px-8 py-3 rounded-xl text-sm font-medium text-white bg-green-500 hover:bg-green-600 shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none flex items-center gap-3"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            :disabled="isLoading">
            <span v-if="isLoading" class="inline-block">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </span>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {{ isLoading ? 'Adding Doctor...' : 'Add Doctor' }}
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* Smooth animations */
* {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar */
.max-h-64::-webkit-scrollbar,
.max-h-80::-webkit-scrollbar,
.max-h-72::-webkit-scrollbar {
  width: 6px;
}

.max-h-64::-webkit-scrollbar-track,
.max-h-80::-webkit-scrollbar-track,
.max-h-72::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 3px;
}

.max-h-64::-webkit-scrollbar-thumb,
.max-h-80::-webkit-scrollbar-thumb,
.max-h-72::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-64::-webkit-scrollbar-thumb:hover,
.max-h-80::-webkit-scrollbar-thumb:hover,
.max-h-72::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* File input styling */
input[type='file']::-webkit-file-upload-button {
  background: transparent;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

/* Time input styling */
input[type='time']::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

/* Focus states */
input:focus, select:focus, textarea:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Hover effects */
.cursor-pointer:hover {
  transform: translateY(-1px);
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Gradient backgrounds */
.bg-gradient-to-br {
  background-attachment: fixed;
}

/* Step progress animation */
.transition-all {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Color palette hover effect */
.group:hover > div {
  transform: scale(1.1);
}
</style>