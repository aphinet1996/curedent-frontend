<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import Modal from '~/components/Modal.vue'
import { useAssistantStore } from '~/stores/assistant'
import { useAlertStore } from '~/stores/components/alert'
import { useCookie } from 'nuxt/app'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'submit'])

// Initialize stores
const assistantStore = useAssistantStore()
const alertStore = useAlertStore()

const form = reactive({
  name: '',
  surname: '',
  nickname: '',
  gender: 'male',
  nationality: 'ไทย',
  birthday: '',
  address: '',
  photo: null as File | null,
  employmentType: 'fullTime',
  branch: '',
  timetable: {} as Record<string, { start: string, end: string }[]>
})

const isLoading = ref(false)
const branches = ['Silom Complex']
const employmentTypes = [
  { value: 'fullTime', label: 'Full Time' },
  { value: 'partTime', label: 'Part Time' },
  { value: 'contract', label: 'Contract' }
]
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
  if (!form.name.trim() || !form.surname.trim() || !form.employmentType || !form.branch) {
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
    formData.append('employmentType', form.employmentType)
    
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
    const newAssistant = await assistantStore.createAssistant(formData)
    
    if (newAssistant) {
      alertStore.success(`เพิ่มผู้ช่วย "${newAssistant.fullName}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      emit('submit', newAssistant)
      resetForm()
      emit('close')
    }
  } catch (err: any) {
    console.error('Error creating assistant:', err)
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ช่วย', 'เกิดข้อผิดพลาด')
  } finally {
    isLoading.value = false
  }
}

const resetForm = (): void => {
  form.name = ''
  form.surname = ''
  form.nickname = ''
  form.gender = 'male'
  form.nationality = 'ไทย'
  form.birthday = ''
  form.address = ''
  form.employmentType = 'fullTime'
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
  <Modal :show="props.show" title="Add Assistant" widthClass="max-w-4xl" @close="emit('close')">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-[800px]">
      <!-- Left Column -->
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
            Employment Type <span class="text-red-500">*</span>
          </label>
          <select v-model="form.employmentType"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required>
            <option disabled value="">Choose Employment Type</option>
            <option v-for="type in employmentTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
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

      <!-- Right Column - Timetable -->
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

            <!-- Time Picker -->
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

      <!-- Empty state for timetable -->
      <div v-else class="flex items-center justify-center py-16 text-gray-400">
        <div class="text-center">
          <div class="text-4xl mb-2">📅</div>
          <p class="text-sm">Select a branch to set up timetable</p>
        </div>
      </div>

      <!-- Footer -->
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
          {{ isLoading ? 'Adding...' : 'Add Assistant' }}
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
</style>