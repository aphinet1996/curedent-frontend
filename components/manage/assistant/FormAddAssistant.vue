<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import { useAssistantStore } from '~/stores/assistant'
import { useBranchStore } from '~/stores/branch'
import { useAlertStore } from '~/stores/components/alert'
import { useCookie } from 'nuxt/app'

const props = defineProps<{
  show: boolean;
  mode?: 'add' | 'edit';
  assistantId?: string;
}>()
const emit = defineEmits(['close', 'submit'])

const assistantStore = useAssistantStore()
const branchStore = useBranchStore()
const alertStore = useAlertStore()

const currentStep = ref(1)
const totalSteps = 3
const isLoading = ref(false)

const form = reactive({
  name: '',
  surname: '',
  nickname: '',
  gender: 'male' as 'male' | 'female',
  nationality: 'ไทย',
  birthday: '',
  address: '',
  photo: null as File | null,
  employmentType: 'fullTime' as 'fullTime' | 'partTime' | 'contract',
  branchId: '',
  timetable: {} as Record<string, { start: string, end: string }[]>
})

const branches = computed(() => branchStore.getBranches || [])
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
const previewImage = ref<string | null>(null)

const isStep1Valid = computed(() => {
  return form.name.trim() && form.surname.trim() && form.employmentType
})

const isStep2Valid = computed(() => {
  return form.branchId && Object.values(timeRanges).some(ranges => ranges.length > 0)
})

const stepTitles = [
  'Personal Information',
  'Branch & Schedule',
  'Review & Confirm'
]

const stepIcons = [
  'heroicons:user-20-solid',
  'heroicons:calendar-days-20-solid',
  'heroicons:check-circle-20-solid'
]

onMounted(async () => {
  console.log('FormAddAssistant mounted, loading branches...')
  try {
    if (branches.value.length === 0) {
      await branchStore.fetchBranches()
      console.log('Branches loaded:', branches.value)
    }
  } catch (error) {
    console.error('Error loading branches:', error)
    alertStore.error('ไม่สามารถโหลดข้อมูลสาขาได้', 'เกิดข้อผิดพลาด')
  }
})

watch(() => props.show, (newVal) => {
  if (newVal && props.mode === 'edit' && props.assistantId) {
    // Load assistant data when modal is shown in edit mode
    loadAssistantData(props.assistantId)
  } else if (newVal && props.mode === 'add') {
    // Reset form for add mode
    resetForm()
  }
})

// Load assistant data for editing
const loadAssistantData = async (id: string) => {
  isLoading.value = true
  try {
    const assistant = await assistantStore.fetchAssistantById(id)
    if (assistant) {
      // Populate form with assistant data
      form.name = assistant.name
      form.surname = assistant.surname
      form.nickname = assistant.nickname || ''
      form.gender = assistant.gender as 'male' | 'female'
      form.nationality = assistant.nationality
      form.birthday = assistant.birthday ? assistant.birthday.split('T')[0] : ''
      form.address = assistant.address || ''
      form.employmentType = assistant.employmentType as 'fullTime' | 'partTime' | 'contract'

      // Handle branches and timetable
      if (assistant.branches && assistant.branches.length > 0) {
        const branch = assistant.branches[0]
        form.branchId = branch.branchId

        // Load timetable data
        if (branch.timetable && branch.timetable.length > 0) {
          selectedDays.value = []
          // Clear existing data
          Object.keys(timeRanges).forEach(key => delete timeRanges[key])
          Object.keys(tempRange).forEach(key => delete tempRange[key])

          branch.timetable.forEach(schedule => {
            const day = schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1) // Capitalize
            selectedDays.value.push(day)

            if (schedule.time && schedule.time.length > 0) {
              // Convert times back to ranges
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

                timeRanges[day] = ranges
                tempRange[day] = { start: '', end: '' }
              }
            }
          })
        }
      }

      // Handle photo if exists
      if (assistant.photo) {
        previewImage.value = assistant.photo
      }

      currentStep.value = 1
    } else {
      alertStore.error('ไม่พบข้อมูลผู้ช่วย', 'เกิดข้อผิดพลาด')
    }
  } catch (error: any) {
    console.error('Error loading assistant data:', error)
    alertStore.error(error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ช่วย', 'เกิดข้อผิดพลาด')
  } finally {
    isLoading.value = false
  }
}

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

// Step navigation
const nextStep = (): void => {
  if (currentStep.value === 1 && !isStep1Valid.value) {
    alertStore.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'ข้อมูลไม่ครบ')
    return
  }
  if (currentStep.value === 2 && !isStep2Valid.value) {
    alertStore.error('กรุณาเลือกสาขาและตั้งค่าตารางเวลา', 'ข้อมูลไม่ครบ')
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
  }
}

// Format timetable for API
const formatTimetableForAPI = (): Array<{ day: string; time: string[] }> => {
  const timetable: Array<{ day: string; time: string[] }> = []

  for (const [day, ranges] of Object.entries(timeRanges)) {
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

// Helper functions
const getSelectedBranchName = (): string => {
  if (!form.branchId) return 'ไม่ได้เลือกสาขา'
  const branch = branches.value.find(b => b.id === form.branchId)
  return branch?.name || 'ไม่พบข้อมูลสาขา'
}

const handleSubmit = async (): Promise<void> => {
  if (!isStep1Valid.value || !isStep2Valid.value) {
    alertStore.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'ข้อมูลไม่ครบ')
    return
  }

  // ตรวจสอบ branchId
  if (!form.branchId) {
    alertStore.error('กรุณาเลือกสาขา', 'ข้อมูลไม่ครบ')
    return
  }

  isLoading.value = true
  console.log('Submitting with branchId:', form.branchId)

  try {
    let result

    // สร้าง branches data โดยใช้ branchId ที่เลือก
    const branches = [{
      branchId: form.branchId, // ใช้ branchId จาก form โดยตรง
      timetable: formatTimetableForAPI()
    }]

    console.log('Branches data:', branches)

    if (props.mode === 'edit' && props.assistantId) {
      // Edit mode - สร้าง FormData
      const formData = new FormData()

      // Add photo if exists (ใหม่หรือเก่า)
      if (form.photo instanceof File) {
        formData.append('photo', form.photo)
      } else if (previewImage.value && !form.photo) {
        // ถ้ามีภาพเก่าแต่ไม่ได้เปลี่ยนภาพใหม่
        formData.append('photo', '') // ส่งเป็น empty string เพื่อรักษาภาพเก่า
      } else {
        formData.append('photo', '')
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

      console.log('Sending FormData for edit mode with branchId:', form.branchId)

      result = await assistantStore.updateAssistant(props.assistantId, formData)

      if (result) {
        alertStore.success(`แก้ไขผู้ช่วย "${result.fullName || form.name + ' ' + form.surname}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      }
    } else {
      // Add mode
      const formData = new FormData()

      // Add photo if exists
      if (form.photo) {
        formData.append('photo', form.photo)
      } else {
        formData.append('photo', '')
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

      console.log('Sending FormData for create mode with branchId:', form.branchId)

      result = await assistantStore.createAssistant(formData)

      if (result) {
        alertStore.success(`เพิ่มผู้ช่วย "${result.fullName}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      }
    }

    if (result) {
      emit('submit', result)
      resetForm()
      emit('close')
    }
  } catch (err: any) {
    console.error('Error submitting assistant:', err)
    const action = props.mode === 'edit' ? 'แก้ไข' : 'เพิ่ม'
    alertStore.error(err.message || `เกิดข้อผิดพลาดในการ${action}ข้อมูลผู้ช่วย`, 'เกิดข้อผิดพลาด')
  } finally {
    isLoading.value = false
  }
}

const resetForm = (): void => {
  currentStep.value = 1
  form.name = ''
  form.surname = ''
  form.nickname = ''
  form.gender = 'male' as 'male' | 'female'
  form.nationality = 'ไทย'
  form.birthday = ''
  form.address = ''
  form.employmentType = 'fullTime' as 'fullTime' | 'partTime' | 'contract'
  form.branchId = '' // เปลี่ยนจาก branch เป็น branchId
  form.photo = null
  selectedDays.value = []
  Object.keys(timeRanges).forEach(key => delete timeRanges[key])
  Object.keys(tempRange).forEach(key => delete tempRange[key])
  activeInputDay.value = null
  previewImage.value = null

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
  <Modal :show="props.show" :title="props.mode === 'edit' ? 'แก้ไขผู้ช่วย' : 'Add New Assistant'" widthClass="max-w-5xl"
    @close="emit('close')">
    <div class="bg-gradient-to-br from-green-50 via-white to-blue-50 p-6 rounded-2xl">

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">
          {{ props.mode === 'edit' ? 'กำลังโหลดข้อมูลผู้ช่วย...' : 'กำลังโหลด...' }}
        </span>
      </div>

      <!-- Content (Hidden during loading) -->
      <div v-show="!isLoading">

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
              class="flex flex-col items-center relative z-10 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
              @click="goToStep(index + 1)">

              <!-- Step Circle -->
              <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                :class="{
                  'border-blue-500 bg-blue-500 text-white': currentStep === index + 1,
                  'border-green-500 bg-green-500 text-white': currentStep > index + 1,
                  'border-gray-300 text-gray-500 bg-white': currentStep < index + 1
                }">
                <Icon v-if="currentStep > index + 1" icon="heroicons:check-20-solid" class="w-5 h-5" />
                <Icon v-else :icon="stepIcons[index]" class="w-5 h-5" />
              </div>

              <!-- Step Title -->
              <div class="mt-3 text-center">
                <p class="text-sm font-medium transition-colors duration-200" :class="{
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
              <p class="text-gray-600">Fill in the assistant's basic details and employment information</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Photo Upload -->
              <div
                class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl">
                <label class="block text-sm font-semibold text-gray-700 mb-3">Profile Photo</label>

                <div v-if="previewImage" class="relative mb-4">
                  <img :src="previewImage" alt="Preview"
                    class="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg">
                  <button @click="removeImage"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200">
                    ×
                  </button>
                </div>

                <label class="relative block w-full">
                  <input type="file" accept="image/*" @change="onFileChange"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer file-input" />
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-200 cursor-pointer">
                    <Icon icon="heroicons:cloud-arrow-up-20-solid" class="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p class="text-sm text-gray-600">
                      <span class="font-medium text-green-600">Click to upload</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </label>
              </div>

              <!-- Basic Info -->
              <div
                class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-4 transition-all duration-200 hover:shadow-xl">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.name" type="text"
                      class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:-translate-y-0.5 focus:shadow-lg"
                      placeholder="Enter first name" required />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.surname" type="text"
                      class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:-translate-y-0.5 focus:shadow-lg"
                      placeholder="Enter last name" required />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Nickname</label>
                  <input v-model="form.nickname" type="text"
                    class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:-translate-y-0.5 focus:shadow-lg"
                    placeholder="Enter nickname" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <select v-model="form.gender"
                      class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:-translate-y-0.5 focus:shadow-lg">
                      <option v-for="gender in genders" :key="gender.value" :value="gender.value">
                        {{ gender.label }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nationality</label>
                    <input v-model="form.nationality" type="text"
                      class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:-translate-y-0.5 focus:shadow-lg"
                      placeholder="Enter nationality" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Birthday</label>
                  <input v-model="form.birthday" type="date"
                    class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:-translate-y-0.5 focus:shadow-lg time-input" />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea v-model="form.address"
                    class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:-translate-y-0.5 focus:shadow-lg"
                    rows="3" placeholder="Enter address"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Employment Type <span class="text-red-500">*</span>
                  </label>
                  <select v-model="form.employmentType"
                    class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:-translate-y-0.5 focus:shadow-lg"
                    required>
                    <option disabled value="">Choose Employment Type</option>
                    <option v-for="type in employmentTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Branch & Schedule -->
          <div v-if="currentStep === 2" class="space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Branch & Schedule Setup</h3>
              <p class="text-gray-600">Select branch and configure working hours</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Branch Selection -->
              <div
                class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl">
                <label class="block text-sm font-semibold text-gray-700 mb-4">
                  Select Branch <span class="text-red-500">*</span>
                </label>

                <!-- Loading branches -->
                <div v-if="branchStore.isLoading" class="flex items-center justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span class="ml-2 text-gray-600">กำลังโหลดสาขา...</span>
                </div>

                <!-- No branches -->
                <div v-else-if="branches.length === 0" class="text-center py-8 text-gray-500">
                  <Icon icon="heroicons:building-office-20-solid" class="mx-auto h-12 w-12 mb-2" />
                  <p>ไม่พบข้อมูลสาขา</p>
                </div>

                <!-- Branches list -->
                <div v-else class="space-y-3">
                  <label v-for="branch in branches" :key="branch.id"
                    class="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:-translate-y-0.5"
                    :class="{ 'border-green-500 bg-green-50': form.branchId === branch.id }">
                    <input type="radio" v-model="form.branchId" :value="branch.id"
                      class="w-4 h-4 text-green-600 focus:ring-green-500" required />
                    <div class="flex-1">
                      <span class="text-sm font-medium text-gray-700 block">{{ branch.name }}</span>
                      <span class="text-xs text-gray-500">{{ branch.province }}</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Timetable -->
              <div
                class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl">
                <label class="block text-sm font-semibold text-gray-700 mb-4">Working Hours</label>

                <div v-if="!form.branchId" class="flex items-center justify-center py-16 text-gray-400">
                  <div class="text-center">
                    <Icon icon="heroicons:calendar-days-20-solid" class="mx-auto h-12 w-12 mb-2" />
                    <p class="text-sm">Select a branch first</p>
                  </div>
                </div>

                <div v-else class="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                  <div v-for="day in days" :key="day" class="time-row">
                    <div class="flex items-center gap-3 mb-2">
                      <input type="checkbox" :checked="selectedDays.includes(day)" @change="() => toggleDay(day)"
                        class="w-4 h-4 text-green-600 focus:ring-green-500 rounded" />
                      <div class="w-20 text-sm font-semibold text-gray-800">{{ day }}</div>

                      <div
                        class="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm flex flex-wrap items-center gap-2 bg-white cursor-pointer transition-all duration-200"
                        :class="{
                          'bg-gray-50 cursor-not-allowed border-gray-200': !selectedDays.includes(day),
                          'hover:border-green-300': selectedDays.includes(day)
                        }" @click="selectedDays.includes(day) && (activeInputDay = day)">
                        <template v-if="timeRanges[day]?.length">
                          <div v-for="(range, idx) in timeRanges[day]" :key="idx"
                            class="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium border border-green-300">
                            {{ range.start }} - {{ range.end }}
                            <button @click.stop="removeTimeRange(day, idx)"
                              class="hover:opacity-70 ml-1 font-bold transition-opacity duration-150"
                              title="Remove time range">
                              ×
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
                      class="ml-6 mt-2 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div class="flex items-center gap-3">
                        <input type="time" v-model="tempRange[day].start"
                          class="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-28 transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 time-input" />
                        <span class="text-gray-500 font-medium">to</span>
                        <input type="time" v-model="tempRange[day].end"
                          class="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm w-28 transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 time-input" />
                        <button @click="addTimeRangeFromTemp(day)"
                          class="px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200" :class="isTempValid(day)
                            ? 'text-white bg-green-500 hover:bg-green-600 shadow-lg hover:-translate-y-0.5'
                            : 'text-gray-400 bg-gray-200 cursor-not-allowed'" :disabled="!isTempValid(day)">
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

          <!-- Step 3: Review & Confirm -->
          <div v-if="currentStep === 3" class="space-y-6">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Review & Confirm</h3>
              <p class="text-gray-600">
                {{ props.mode === 'edit'
                  ? 'ตรวจสอบการเปลี่ยนแปลงข้อมูลก่อนบันทึก'
                  : 'Please review all information before adding the assistant'
                }}
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Personal Info Summary -->
              <div
                class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon icon="heroicons:user-20-solid" class="w-5 h-5 text-green-500" />
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
                      <span class="text-gray-500">Employment:</span>
                      <p class="font-medium text-green-600">{{employmentTypes.find(e => e.value ===
                        form.employmentType)?.label}}
                      </p>
                    </div>
                  </div>

                  <div v-if="form.address" class="pt-2 border-t border-gray-200">
                    <span class="text-gray-500 text-sm">Address:</span>
                    <p class="font-medium text-sm">{{ form.address }}</p>
                  </div>
                </div>
              </div>

              <!-- Branch & Schedule Summary -->
              <div
                class="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon icon="heroicons:calendar-days-20-solid" class="w-5 h-5 text-blue-500" />
                  Branch & Schedule
                </h4>

                <div class="space-y-4">
                  <!-- Selected Branch -->
                  <div>
                    <span class="text-gray-500 text-sm">Branch:</span>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p class="font-medium text-sm text-gray-800">{{ getSelectedBranchName() }}</p>
                      <p class="text-xs text-gray-500">ID: {{ form.branchId || 'Not selected' }}</p>
                    </div>
                  </div>

                  <!-- Schedule Summary -->
                  <div v-if="Object.keys(timeRanges).length > 0">
                    <span class="text-gray-500 text-sm">Working Schedule:</span>
                    <div class="mt-2 space-y-2">
                      <template v-for="(ranges, day) in timeRanges" :key="day">
                        <div v-if="ranges.length > 0"
                          class="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                          <span class="text-sm font-medium text-gray-700">{{ day }}</span>
                          <div class="flex flex-wrap gap-1">
                            <span v-for="range in ranges" :key="`${range.start}-${range.end}`"
                              class="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800 border border-green-300">
                              {{ range.start }} - {{ range.end }}
                            </span>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>

                  <div v-else class="text-center py-8 text-gray-400">
                    <Icon icon="heroicons:calendar-days-20-solid" class="mx-auto h-12 w-12 mb-2" />
                    <p class="text-sm">No schedule set</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button v-if="currentStep > 1" @click="prevStep"
            class="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2">
            <Icon icon="heroicons:chevron-left-20-solid" class="w-4 h-4" />
            Previous
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <button @click="emit('close')"
              class="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 hover:shadow-md"
              :disabled="isLoading">
              Cancel
            </button>

            <button v-if="currentStep < totalSteps" @click="nextStep"
              class="px-6 py-3 rounded-xl text-sm font-medium text-white bg-green-500 transition-all duration-200 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2"
              :disabled="(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)">
              Next
              <Icon icon="heroicons:chevron-right-20-solid" class="w-4 h-4" />
            </button>

            <button v-else @click="handleSubmit"
              class="px-8 py-3 rounded-xl text-sm font-medium text-white bg-blue-500 shadow-lg transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:scale-105 disabled:hover:transform-none flex items-center gap-3"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }" :disabled="isLoading">
              <span v-if="isLoading" class="inline-block">
                <Icon icon="eos-icons:loading" class="w-4 h-4" />
              </span>
              <Icon v-else icon="heroicons:plus-20-solid" class="w-4 h-4" />
              {{ isLoading
                ? (props.mode === 'edit' ? 'กำลังแก้ไข...' : 'Adding Assistant...')
                : (props.mode === 'edit' ? 'บันทึกการแก้ไข' : 'Add Assistant')
              }}
            </button>
          </div>
        </div>
      </div> <!-- End Content Wrapper -->
    </div>
  </Modal>
</template>

<style scoped>
/* Custom scrollbar - ต้องใช้ CSS */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* File input styling - ต้องใช้ CSS */
.file-input::-webkit-file-upload-button {
  background: transparent;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

/* Time input styling - ต้องใช้ CSS */
.time-input::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

/* Background attachment - ต้องใช้ CSS */
.bg-gradient-to-br {
  background-attachment: fixed;
}
</style>