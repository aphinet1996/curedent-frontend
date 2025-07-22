<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import Modal from '~/components/Modal.vue'
import { Icon } from '@iconify/vue'
import { useDoctorStore } from '~/stores/doctor'
import { useBranchStore } from '~/stores/branch'
import { useAlertStore } from '~/stores/components/alert'
import { useCookie } from 'nuxt/app'
import { COLOR_PALETTE } from '~/types/doctor'
import Stepper from '~/components/Stepper.vue'

const props = defineProps<{
  show: boolean;
  mode?: 'add' | 'edit';
  doctorId?: string;
}>()
const emit = defineEmits(['close', 'submit'])

// Initialize stores
const doctorStore = useDoctorStore()
const branchStore = useBranchStore()
const alertStore = useAlertStore()

// Stepper state
const currentStep = ref(1)
const totalSteps = 4
const isLoading = ref(false)

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
  selectedBranches: [] as string[],
  color: '#3B82F6',
  timetables: {} as Record<string, { start: string, end: string }[]>
})

const specialties = ['Prosthodontists', 'Orthodontists']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
]

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

const stepperSteps = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Basic details and specialty',
    icon: 'heroicons:user-20-solid'
  },
  {
    id: 2,
    title: 'Branch & Color',
    description: 'Select branches and theme',
    icon: 'heroicons:building-office-20-solid'
  },
  {
    id: 3,
    title: 'Schedule Setup',
    description: 'Configure working hours',
    icon: 'heroicons:calendar-days-20-solid'
  },
  {
    id: 4,
    title: 'Review & Confirm',
    description: 'Final review',
    icon: 'heroicons:check-circle-20-solid'
  }
]

// Enhanced step validation with smooth transitions
const getStepValidation = (step: number) => {
  switch (step) {
    case 1: return isStep1Valid.value
    case 2: return isStep1Valid.value && isStep2Valid.value
    case 3: return isStep1Valid.value && isStep2Valid.value && isStep3Valid.value
    case 4: return isStep1Valid.value && isStep2Valid.value && isStep3Valid.value
    default: return false
  }
}

// Handle stepper click with validation
// const handleStepperClick = (step: any, index: number) => {
//   const targetStep = index + 1

//   // Check if we can navigate to this step
//   if (targetStep <= currentStep.value || getStepValidation(targetStep - 1)) {
//     currentStep.value = targetStep
//   } else {
//     // Show gentle error message
//     alertStore.error(
//       `กรุณาเสร็จสิ้นขั้นตอนก่อนหน้าให้เรียบร้อยก่อน`, 
//       'ไม่สามารถข้ามขั้นตอนได้'
//     )
//   }
// }

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

const handleStepperClick = (stepNumber: number, step: any) => {
  goToStep(stepNumber)
}

// Watch for modal show/hide
watch(() => props.show, (newVal) => {
  if (newVal && props.mode === 'edit' && props.doctorId) {
    loadDoctorData(props.doctorId)
  } else if (newVal && props.mode === 'add') {
    resetForm()
  }
})

// Load doctor data for editing
const loadDoctorData = async (id: string) => {
  isLoading.value = true
  try {
    const doctor = await doctorStore.fetchDoctorById(id)
    if (doctor) {
      form.name = doctor.name
      form.surname = doctor.surname
      form.nickname = doctor.nickname || ''
      form.gender = doctor.gender
      form.nationality = doctor.nationality
      form.birthday = doctor.birthday ? doctor.birthday.split('T')[0] : ''
      form.address = doctor.address || ''
      form.specialty = doctor.specialty
      form.color = doctor.color || '#3B82F6'

      // Handle branches and timetable
      if (doctor.branches && doctor.branches.length > 0) {
        form.selectedBranches = doctor.branches.map(branch => branch.branchId)

        // Initialize timetable data for selected branches
        form.selectedBranches.forEach(branchId => {
          selectedDays[branchId] = []
          timeRanges[branchId] = {}
          tempRange[branchId] = {}
          activeInputDay[branchId] = null
        })

        // Load timetable data
        doctor.branches.forEach(branch => {
          const branchId = branch.branchId

          if (branch.timetable && branch.timetable.length > 0) {
            branch.timetable.forEach(schedule => {
              // แปลง date เป็น day name แล้วแปลงเป็น format ที่ต้องการ
              let day = 'Monday'
              if (schedule.date) {
                try {
                  const dateObj = new Date(schedule.date)
                  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
                  day = weekday.charAt(0).toUpperCase() + weekday.slice(1)
                } catch (error) {
                  console.warn('Invalid date format:', schedule.date)
                  day = 'Monday' // fallback
                }
              }

              if (!selectedDays[branchId].includes(day)) {
                selectedDays[branchId].push(day)
              }

              if (schedule.time && schedule.time.length > 0) {
                // Convert times back to ranges (similar to assistant logic)
                const times = schedule.time.sort()
                if (times.length > 0) {
                  const ranges = []
                  let start = parseInt(times[0].split(':')[0])
                  let current = start

                  for (let i = 1; i < times.length; i++) {
                    const hour = parseInt(times[i].split(':')[0])
                    if (hour !== current + 1) {
                      // End of consecutive range
                      ranges.push({
                        start: `${start.toString().padStart(2, '0')}:00`,
                        end: `${(current + 1).toString().padStart(2, '0')}:00`
                      })
                      start = hour
                    }
                    current = hour
                  }
                  // Add final range
                  ranges.push({
                    start: `${start.toString().padStart(2, '0')}:00`,
                    end: `${(current + 1).toString().padStart(2, '0')}:00`
                  })

                  if (!timeRanges[branchId][day]) {
                    timeRanges[branchId][day] = []
                  }
                  timeRanges[branchId][day] = ranges
                  tempRange[branchId][day] = { start: '', end: '' }
                }
              }
            })
          }
        })
      }

      // Handle photo if exists
      if (doctor.photo) {
        previewImage.value = doctor.photo
      }

      currentStep.value = 1
    } else {
      alertStore.error('ไม่พบข้อมูลหมอ', 'เกิดข้อผิดพลาด')
    }
  } catch (error: any) {
    console.error('Error loading doctor data:', error)
    alertStore.error(error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลหมอ', 'เกิดข้อผิดพลาด')
  } finally {
    isLoading.value = false
  }
}

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
    form.selectedBranches.splice(index, 1)
    delete selectedDays[branchId]
    delete timeRanges[branchId]
    delete tempRange[branchId]
    delete activeInputDay[branchId]
  } else {
    form.selectedBranches.push(branchId)
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
  return branchId
}

const handleSubmit = async (): Promise<void> => {
  if (!isStep1Valid.value || !isStep2Valid.value || !isStep3Valid.value) {
    alertStore.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'ข้อมูลไม่ครบ')
    return
  }

  isLoading.value = true

  try {
    let result

    const branches = form.selectedBranches.map(branchId => ({
      branchId: getBranchId(branchId),
      timetable: formatTimetableForAPI(branchId)
    }))

    if (props.mode === 'edit' && props.doctorId) {
      const formData = new FormData()

      if (form.photo instanceof File) {
        formData.append('photo', form.photo)
      } else if (previewImage.value && !form.photo) {
        formData.append('photo', '')
      } else {
        formData.append('photo', '')
      }

      formData.append('name', form.name.trim())
      formData.append('surname', form.surname.trim())
      formData.append('nickname', form.nickname.trim() || form.name.trim())
      formData.append('gender', form.gender)
      formData.append('nationality', form.nationality)
      formData.append('birthday', form.birthday || '1990-01-01')
      formData.append('address', form.address.trim() || 'ไม่ระบุ')
      formData.append('specialty', form.specialty)
      formData.append('color', form.color)

      const clinicId = useCookie('clinic_id').value || ''
      formData.append('clinicId', clinicId)

      branches.forEach((branch, index) => {
        formData.append(`branches[${index}][branchId]`, branch.branchId)

        branch.timetable.forEach((schedule, scheduleIndex) => {
          formData.append(`branches[${index}][timetable][${scheduleIndex}][day]`, schedule.day)
          schedule.time.forEach((time, timeIndex) => {
            formData.append(`branches[${index}][timetable][${scheduleIndex}][time][${timeIndex}]`, time)
          })
        })
      })

      console.log('Sending FormData for edit mode')

      result = await doctorStore.updateDoctor(props.doctorId, formData)

      if (result) {
        alertStore.success(`แก้ไขหมอ "${result.fullName || form.name + ' ' + form.surname}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      }
    } else {
      const formData = new FormData()

      if (form.photo) {
        formData.append('photo', form.photo)
      } else {
        formData.append('photo', '')
      }

      formData.append('name', form.name.trim())
      formData.append('surname', form.surname.trim())
      formData.append('nickname', form.nickname.trim() || form.name.trim())
      formData.append('gender', form.gender)
      formData.append('nationality', form.nationality)
      formData.append('birthday', form.birthday || '1990-01-01')
      formData.append('address', form.address.trim() || 'ไม่ระบุ')
      formData.append('specialty', form.specialty)
      formData.append('color', form.color)

      const clinicId = useCookie('clinic_id').value || ''
      formData.append('clinicId', clinicId)

      branches.forEach((branch, index) => {
        formData.append(`branches[${index}][branchId]`, branch.branchId)

        branch.timetable.forEach((schedule, scheduleIndex) => {
          formData.append(`branches[${index}][timetable][${scheduleIndex}][day]`, schedule.day)
          schedule.time.forEach((time, timeIndex) => {
            formData.append(`branches[${index}][timetable][${scheduleIndex}][time][${timeIndex}]`, time)
          })
        })
      })

      result = await doctorStore.createDoctor(formData)

      if (result) {
        alertStore.success(`เพิ่มหมอ "${result.fullName}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      }
    }

    if (result) {
      emit('submit', result)
      resetForm()
      emit('close')
    }
  } catch (err: any) {
    console.error('Error submitting doctor:', err)
    const action = props.mode === 'edit' ? 'แก้ไข' : 'เพิ่ม'
    alertStore.error(err.message || `เกิดข้อผิดพลาดในการ${action}ข้อมูลหมอ`, 'เกิดข้อผิดพลาด')
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
  <Modal :show="props.show" :title="props.mode === 'edit' ? 'แก้ไขหมอ' : 'Add New Doctor'" widthClass="max-w-5xl"
    @close="emit('close')">
    <div class="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-2xl">

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">
          {{ props.mode === 'edit' ? 'กำลังโหลดข้อมูลหมอ...' : 'กำลังโหลด...' }}
        </span>
      </div>

      <!-- Content (Hidden during loading) -->
      <div v-show="!isLoading">

        <!-- Stepper Header -->
        <div class="mb-8">
          <Stepper :steps="stepperSteps" :current-step="currentStep" :total-steps="totalSteps" :allow-navigation="true"
            theme="blue" :show-titles="true" @step-click="handleStepperClick" />
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
                  <img :src="previewImage" alt="Preview"
                    class="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg">
                  <button @click="removeImage"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">
                    ×
                  </button>
                </div>

                <label class="relative block w-full">
                  <input type="file" accept="image/*" @change="onFileChange"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                    <Icon icon="heroicons:cloud-arrow-up-20-solid" class="mx-auto h-12 w-12 text-gray-400 mb-2" />
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
                  <Icon icon="eos-icons:loading" class="h-8 w-8 text-blue-500 mx-auto animate-spin" />
                  <p class="text-gray-500 mt-2">Loading branches...</p>
                </div>

                <div v-else-if="branchStore.getBranches.length === 0" class="text-center py-8">
                  <p class="text-gray-500">No branches available</p>
                </div>

                <div v-else class="space-y-3 max-h-72 overflow-y-auto">
                  <label v-for="branch in branchStore.getBranches" :key="branch.id"
                    class="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    :class="{ 'border-blue-500 bg-blue-50': form.selectedBranches.includes(branch.id) }">
                    <input type="checkbox" :checked="form.selectedBranches.includes(branch.id)"
                      @change="toggleBranch(branch.id)" class="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1" />
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
                  <div v-for="color in colorPalette" :key="color.value" @click="selectColor(color.value)"
                    class="w-full aspect-square rounded-xl cursor-pointer relative transition-transform duration-200 shadow-md hover:scale-105"
                    :style="{
                      background: `linear-gradient(to bottom right, ${color.start}, ${color.end})`,
                      border: form.color === color.value ? `3px solid ${color.value}` : '2px solid transparent'
                    }">
                    <!-- Tick icon -->
                    <div v-if="form.color === color.value"
                      class="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                      <Icon icon="heroicons:check-20-solid" class="w-3 h-3 text-black" />
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
                    {{selectedBranchesData.find(b => b.id === branchId)?.name}}
                  </h4>
                </div>

                <div class="space-y-4 max-h-80 overflow-y-auto">
                  <div v-for="day in days" :key="`${branchId}-${day}`" class="time-row">
                    <div class="flex items-center gap-3 mb-2">
                      <input type="checkbox" :checked="selectedDays[branchId]?.includes(day)"
                        @change="() => toggleDay(branchId, day)"
                        class="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded" />
                      <div class="w-20 text-sm font-semibold text-gray-800">{{ day }}</div>

                      <div
                        class="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm flex flex-wrap items-center gap-2 bg-white cursor-pointer transition-all duration-200"
                        :class="{
                          'bg-gray-50 cursor-not-allowed border-gray-200': !selectedDays[branchId]?.includes(day),
                          'hover:border-blue-300': selectedDays[branchId]?.includes(day)
                        }" @click="selectedDays[branchId]?.includes(day) && (activeInputDay[branchId] = day)">
                        <template v-if="timeRanges[branchId]?.[day]?.length">
                          <div v-for="(range, idx) in timeRanges[branchId][day]" :key="idx"
                            class="px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium" :style="{
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
                      class="ml-6 mt-2 p-4 bg-gray-50 rounded-lg border-l-4" :style="{ borderColor: form.color }">
                      <div class="flex items-center gap-3">
                        <input type="time" v-model="tempRange[branchId][day].start"
                          class="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" />
                        <span class="text-gray-500 font-medium">to</span>
                        <input type="time" v-model="tempRange[branchId][day].end"
                          class="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" />
                        <button @click="addTimeRangeFromTemp(branchId, day)"
                          class="px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200" :class="isTempValid(branchId, day)
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
              <p class="text-gray-600">
                {{ props.mode === 'edit'
                  ? 'ตรวจสอบการเปลี่ยนแปลงข้อมูลก่อนบันทึก'
                  : 'Please review all information before adding the doctor'
                }}
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Personal Info Summary -->
              <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon icon="heroicons:user-20-solid" class="w-5 h-5 text-blue-500" />
                  Personal Information
                </h4>

                <div class="space-y-3">
                  <div v-if="previewImage" class="flex justify-center mb-4">
                    <img :src="previewImage" alt="Preview"
                      class="w-16 h-16 rounded-full object-cover border-2 border-gray-200">
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
                      <p class="font-medium">{{genders.find(g => g.value === form.gender)?.label}}</p>
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
                  <Icon icon="heroicons:building-office-20-solid" class="w-5 h-5 text-green-500" />
                  Branch & Settings
                </h4>

                <div class="space-y-4">
                  <!-- Theme Color -->
                  <div>
                    <span class="text-gray-500 text-sm">Theme Color:</span>
                    <div class="flex items-center gap-2 mt-1">
                      <div class="w-6 h-6 rounded-full border-2 border-gray-200"
                        :style="{ backgroundColor: form.color }">
                      </div>
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
                              <div v-if="ranges.length > 0" class="px-2 py-1 text-xs rounded-md" :style="{
                                backgroundColor: form.color + '20',
                                color: form.color,
                                border: `1px solid ${form.color}40`
                              }">
                                {{ day.substring(0, 3) }}: {{ranges.map(r => `${r.start}-${r.end}`).join(', ')}}
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
            <Icon icon="heroicons:chevron-left-20-solid" class="w-4 h-4" />
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
              <Icon icon="heroicons:chevron-right-20-solid" class="w-4 h-4" />
            </button>

            <button v-else @click="handleSubmit"
              class="px-8 py-3 rounded-xl text-sm font-medium text-white bg-green-500 hover:bg-green-600 shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none flex items-center gap-3"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }" :disabled="isLoading">
              <Icon v-if="isLoading" icon="eos-icons:loading" class="h-4 w-4 animate-spin" />
              <Icon v-else icon="heroicons:plus-20-solid" class="w-4 h-4" />
              {{ isLoading
                ? (props.mode === 'edit' ? 'กำลังแก้ไข...' : 'Adding Doctor...')
                : (props.mode === 'edit' ? 'บันทึกการแก้ไข' : 'Add Doctor')
              }}
            </button>
          </div>
        </div>
      </div> <!-- End Content Wrapper -->
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
input:focus,
select:focus,
textarea:focus {
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
</style>