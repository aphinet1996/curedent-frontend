<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import InputModal from '~/components/InputModal.vue'
import { usePatientStore } from '~/stores/patient'
import { useBranchStore } from '~/stores/branch'
import { useDoctorStore } from '~/stores/doctor'
import { useAssistantStore } from '~/stores/assistant'
import { useAlertStore } from '~/stores/components/alert'
import type { 
  PatientFormData, 
  PatientOptionCategory,
  CreatePatientRequest,
  Address,
  MultilingualOption
} from '~/types/patient'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'submit'])

// Stores
const patientStore = usePatientStore()
const branchStore = useBranchStore()
const doctorStore = useDoctorStore()
const assistantStore = useAssistantStore()
const alertStore = useAlertStore()

// State
const currentStep = ref(1)
const totalSteps = 5
const isSubmitting = ref(false)
const errorMessage = ref('')

// InputModal state
const showInputModal = ref(false)
const inputModalConfig = ref({
  title: '',
  message: '',
  placeholder: '',
  category: '' as PatientOptionCategory
})

// Get options from store with display values
const displayOptions = computed(() => patientStore.getDisplayOptions)
const isLoadingOptions = computed(() => patientStore.getLoadingOptions)

// Get doctor and assistant options
const doctorOptions = computed(() => doctorStore.getDoctorOptions)
const assistantOptions = computed(() => assistantStore.getAssistantOptions)
const isLoadingDoctorOptions = computed(() => doctorStore.getLoadingOptions)
const isLoadingAssistantOptions = computed(() => assistantStore.getLoadingOptions)

// Form data (for UI display)
const form = reactive<PatientFormData>({
  // Step 1: Basic Info
  hn: '',
  nationalId: '',
  titlePrefix: '',
  firstNameTh: '',
  lastNameTh: '',
  firstNameEn: '',
  lastNameEn: '',
  nickname: '',
  gender: '',
  dateOfBirth: '',
  nationality: '',
  patientType: '',
  bloodGroup: '',
  occupation: '',
  medicalRights: '',
  maritalStatus: '',
  referralSource: '',

  // Step 2: Address
  idCardAddress: {
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    zipcode: ''
  },
  currentAddress: {
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    zipcode: ''
  },
  sameAsIdCard: true,

  // Step 3: Contact Info
  phone: '',
  email: '',
  emergencyContact: {
    fullName: '',
    relationship: '',
    address: '',
    phone: ''
  },

  // Step 4: Medical Info
  drugAllergies: ['ไม่มี'],
  chronicDiseases: ['ไม่มี'],
  currentMedications: ['ไม่มี'],
  assistantDoctorId: '',
  primaryDoctorId: '',

  // Additional
  branchId: '',
  notes: ''
})

// Stepper configuration
const steps = [
  { 
    number: 1, 
    title: 'ข้อมูลทั่วไป', 
    description: 'ข้อมูลพื้นฐานของผู้ป่วย',
    icon: 'mdi:account'
  },
  { 
    number: 2, 
    title: 'ที่อยู่', 
    description: 'ที่อยู่ตามบัตรและที่อยู่ปัจจุบัน',
    icon: 'mdi:map-marker'
  },
  { 
    number: 3, 
    title: 'ข้อมูลการติดต่อ', 
    description: 'เบอร์โทรและผู้ติดต่อฉุกเฉิน',
    icon: 'mdi:phone'
  },
  { 
    number: 4, 
    title: 'ข้อมูลทางการแพทย์', 
    description: 'ประวัติการแพ้ยาและโรคประจำตัว',
    icon: 'mdi:medical-bag'
  },
  { 
    number: 5, 
    title: 'สรุปข้อมูล', 
    description: 'ตรวจสอบข้อมูลก่อนบันทึก',
    icon: 'mdi:check-circle'
  }
]

// Option categories configurations
const optionConfigs = {
  titlePrefix: {
    title: 'เพิ่มคำนำหน้าใหม่',
    message: 'กรุณากรอกคำนำหน้าที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น นาย/Mr., นางสาว/Ms.'
  },
  nationality: {
    title: 'เพิ่มสัญชาติใหม่',
    message: 'กรุณากรอกสัญชาติที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น ไทย/Thai, อเมริกัน/American'
  },
  gender: {
    title: 'เพิ่มเพศใหม่',
    message: 'กรุณากรอกเพศที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น ชาย/Male, หญิง/Female'
  },
  patientType: {
    title: 'เพิ่มประเภทผู้ป่วยใหม่',
    message: 'กรุณากรอกประเภทผู้ป่วยที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น ผู้ป่วยทั่วไป/General Patient'
  },
  bloodGroup: {
    title: 'เพิ่มกรุ๊ปเลือดใหม่',
    message: 'กรุณากรอกกรุ๊ปเลือดที่ต้องการเพิ่ม:',
    placeholder: 'เช่น A, B, AB, O'
  },
  occupation: {
    title: 'เพิ่มอาชีพใหม่',
    message: 'กรุณากรอกอาชีพที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น พนักงานบริษัท/Employee'
  },
  medicalRight: {
    title: 'เพิ่มสิทธิการรักษาใหม่',
    message: 'กรุณากรอกสิทธิการรักษาที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น ประกันสังคม/Social Security'
  },
  maritalStatus: {
    title: 'เพิ่มสถานภาพสมรสใหม่',
    message: 'กรุณากรอกสถานภาพสมรสที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น โสด/Single, สมรส/Married'
  },
  referralSource: {
    title: 'เพิ่มแหล่งที่มาใหม่',
    message: 'กรุณากรอกแหล่งที่มาของผู้ป่วยที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น แนะนำจากเพื่อน/Friend Referral'
  }
}

// Helper function to find multilingual option by display value
function findMultilingualOption(category: keyof typeof displayOptions.value, displayValue: string): MultilingualOption | null {
  return patientStore.findOptionByDisplayValue(
    patientStore.getPatientOptions[category as keyof typeof patientStore.getPatientOptions] as MultilingualOption[], 
    displayValue
  )
}

// Helper function to convert form data to create request
function convertFormToCreateRequest(): CreatePatientRequest {
  // Helper function to get multilingual option or create default
  const getMultilingualOption = (category: keyof typeof displayOptions.value, value: string): MultilingualOption => {
    const option = findMultilingualOption(category, value)
    if (option) return option
    
    // Default fallback if not found
    return { th: value, en: value }
  }

  return {
    branchId: form.branchId,
    hn: form.hn,
    nationalId: form.nationalId,
    nationality: getMultilingualOption('nationalities', form.nationality),
    titlePrefix: getMultilingualOption('titlePrefixes', form.titlePrefix),
    firstName: {
      th: form.firstNameTh,
      en: form.firstNameEn || form.firstNameTh
    },
    lastName: {
      th: form.lastNameTh,
      en: form.lastNameEn || form.lastNameTh
    },
    nickname: form.nickname,
    gender: getMultilingualOption('genders', form.gender),
    dateOfBirth: form.dateOfBirth,
    patientType: getMultilingualOption('patientTypes', form.patientType),
    bloodGroup: getMultilingualOption('bloodGroups', form.bloodGroup),
    occupation: getMultilingualOption('occupations', form.occupation),
    medicalRights: getMultilingualOption('medicalRights', form.medicalRights),
    maritalStatus: getMultilingualOption('maritalStatuses', form.maritalStatus),
    referralSource: getMultilingualOption('referralSources', form.referralSource),
    idCardAddress: form.idCardAddress,
    currentAddress: form.currentAddress,
    phone: form.phone,
    email: form.email || '',
    notes: form.notes || '',
    medicalInfo: {
      drugAllergies: form.drugAllergies.filter(item => item.trim()),
      assistantDoctorId: form.assistantDoctorId || '',
      primaryDoctorId: form.primaryDoctorId || '',
      chronicDiseases: form.chronicDiseases.filter(item => item.trim()),
      currentMedications: form.currentMedications.filter(item => item.trim())
    },
    emergencyContact: form.emergencyContact
  }
}

// Watch for modal show/hide
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm()
    fetchAllOptions()
    fetchBranches()
    fetchDoctorAndAssistantOptions()
  }
})

// Watch same address checkbox
watch(() => form.sameAsIdCard, (newVal) => {
  if (newVal) {
    form.currentAddress = { ...form.idCardAddress }
  }
})

// Watch id card address changes
watch(() => form.idCardAddress, (newVal) => {
  if (form.sameAsIdCard) {
    form.currentAddress = { ...newVal }
  }
}, { deep: true })

// Computed
const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.hn && form.nationalId && form.titlePrefix && 
             form.firstNameTh && form.lastNameTh && form.gender && 
             form.dateOfBirth && form.nationality
    case 2:
      return form.idCardAddress.address && form.idCardAddress.subdistrict && 
             form.idCardAddress.district && form.idCardAddress.province && 
             form.idCardAddress.zipcode && form.currentAddress.address
    case 3:
      return form.phone && form.emergencyContact.fullName && 
             form.emergencyContact.phone && form.emergencyContact.relationship
    case 4:
      return true // Medical info is optional
    case 5:
      return true
    default:
      return false
  }
})

const canGoPrev = computed(() => currentStep.value > 1)
const isLastStep = computed(() => currentStep.value === totalSteps)

// Methods
const fetchAllOptions = async () => {
  try {
    await patientStore.fetchAllPatientOptions()
  } catch (error: any) {
    console.error('Error fetching options:', error)
    alertStore.error('ไม่สามารถโหลดข้อมูลตัวเลือกได้', 'เกิดข้อผิดพลาด')
  }
}

const fetchBranches = async () => {
  try {
    await branchStore.fetchBranches()
    // Set default branch if only one exists
    if (branchStore.branches.length === 1) {
      form.branchId = branchStore.branches[0].id
    }
  } catch (error) {
    console.error('Error fetching branches:', error)
  }
}

const fetchDoctorAndAssistantOptions = async () => {
  try {
    await Promise.all([
      doctorStore.fetchDoctorOptions(),
      assistantStore.fetchAssistantOptions()
    ])
  } catch (error: any) {
    console.error('Error fetching doctor/assistant options:', error)
    alertStore.error('ไม่สามารถโหลดข้อมูลแพทย์และผู้ช่วยแพทย์ได้', 'เกิดข้อผิดพลาด')
  }
}

// InputModal methods
const openAddOptionModal = (category: PatientOptionCategory) => {
  const config = optionConfigs[category]
  if (config) {
    inputModalConfig.value = {
      ...config,
      category
    }
    showInputModal.value = true
  }
}

const handleAddNewOption = async (value: string) => {
  if (!value.trim()) return
  
  try {
    // Parse multilingual input (expected format: "thai/english" or just "thai")
    const parts = value.trim().split('/')
    const multilingualOption: MultilingualOption = {
      th: parts[0].trim(),
      en: parts[1]?.trim() || parts[0].trim()
    }
    
    const result = await patientStore.createPatientOption(
      inputModalConfig.value.category, 
      multilingualOption
    )
    
    if (result) {
      alertStore.success(`เพิ่มตัวเลือก "${parts[0]}" สำเร็จ`, 'สำเร็จ')
    } else {
      alertStore.error('ไม่สามารถเพิ่มตัวเลือกใหม่ได้', 'เกิดข้อผิดพลาด')
    }
  } catch (error: any) {
    console.error('Error adding new option:', error)
    alertStore.error('ไม่สามารถเพิ่มตัวเลือกใหม่ได้', 'เกิดข้อผิดพลาด')
  } finally {
    showInputModal.value = false
  }
}

const closeInputModal = () => {
  showInputModal.value = false
}

const nextStep = () => {
  if (canGoNext.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (canGoPrev.value) {
    currentStep.value--
  }
}

const goToStep = (step: number) => {
  if (step >= 1 && step <= totalSteps) {
    currentStep.value = step
  }
}

const addArrayItem = (array: string[], defaultValue = '') => {
  array.push(defaultValue)
}

const removeArrayItem = (array: string[], index: number) => {
  if (array.length > 1) {
    array.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!canGoNext.value && !isLastStep.value) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'
    return
  }

  if (!form.branchId) {
    errorMessage.value = 'กรุณาเลือกสาขา'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const patientData = convertFormToCreateRequest()
    
    const result = await patientStore.createPatient(patientData)
    
    if (result) {
      alertStore.success(`เพิ่มผู้ป่วย "${form.firstNameTh} ${form.lastNameTh}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      emit('submit', result)
      resetForm()
      emit('close')
    } else {
      errorMessage.value = 'ไม่สามารถเพิ่มผู้ป่วยได้'
      alertStore.error('ไม่สามารถเพิ่มผู้ป่วยได้ กรุณาลองอีกครั้ง', 'เกิดข้อผิดพลาด')
    }
  } catch (error: any) {
    console.error('Error creating patient:', error)
    errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ป่วย'
    alertStore.error(error.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ป่วย', 'เกิดข้อผิดพลาด')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  currentStep.value = 1
  errorMessage.value = ''
  
  // Reset form data
  Object.assign(form, {
    hn: '',
    nationalId: '',
    titlePrefix: '',
    firstNameTh: '',
    lastNameTh: '',
    firstNameEn: '',
    lastNameEn: '',
    nickname: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    patientType: '',
    bloodGroup: '',
    occupation: '',
    medicalRights: '',
    maritalStatus: '',
    referralSource: '',
    idCardAddress: {
      address: '',
      subdistrict: '',
      district: '',
      province: '',
      zipcode: ''
    },
    currentAddress: {
      address: '',
      subdistrict: '',
      district: '',
      province: '',
      zipcode: ''
    },
    sameAsIdCard: true,
    phone: '',
    email: '',
    emergencyContact: {
      fullName: '',
      relationship: '',
      address: '',
      phone: ''
    },
    drugAllergies: ['ไม่มี'],
    chronicDiseases: ['ไม่มี'],
    currentMedications: ['ไม่มี'],
    assistantDoctorId: '',
    primaryDoctorId: '',
    branchId: '',
    notes: ''
  })
}

// Initialize on mount
onMounted(() => {
  if (props.show) {
    fetchAllOptions()
    fetchBranches()
    fetchDoctorAndAssistantOptions()
  }
})
</script>

<template>
  <Modal 
    :show="props.show" 
    title="เพิ่มผู้ป่วยใหม่" 
    widthClass="max-w-5xl"
    @close="emit('close')"
  >
    <div class="space-y-6">
      <!-- Stepper Header -->
      <div class="border-b pb-6">
        <div class="flex items-center justify-between">
          <div
            v-for="step in steps"
            :key="step.number"
            class="flex flex-col items-center flex-1"
          >
            <!-- Step Circle -->
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors',
                currentStep >= step.number 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              ]"
              @click="goToStep(step.number)"
              class="cursor-pointer hover:scale-105 transition-transform"
            >
              <Icon v-if="currentStep > step.number" icon="mdi:check" class="w-5 h-5" />
              <Icon v-else :icon="step.icon" class="w-5 h-5" />
            </div>
            
            <!-- Step Info -->
            <div class="text-center mt-2">
              <div 
                :class="[
                  'text-sm font-medium',
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                ]"
              >
                {{ step.title }}
              </div>
              <div class="text-xs text-gray-500 mt-1 max-w-24">
                {{ step.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingOptions || isLoadingDoctorOptions || isLoadingAssistantOptions" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p class="ml-3 text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <!-- Step Content -->
      <div v-show="!isLoadingOptions && !isLoadingDoctorOptions && !isLoadingAssistantOptions" class="min-h-[400px]">
        <!-- Step 1: Basic Info -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800 mb-4">ข้อมูลทั่วไป</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- HN -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                HN <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.hn" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="เช่น HN250601001" 
              />
            </div>

            <!-- National ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                เลขบัตรประชาชน <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.nationalId" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="เลขบัตรประชาชน 13 หลัก" 
                maxlength="13"
              />
            </div>

            <!-- Title Prefix -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                คำนำหน้า <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <select v-model="form.titlePrefix" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกคำนำหน้า</option>
                  <option v-for="option in displayOptions.titlePrefixes" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('titlePrefix')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มคำนำหน้าใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Nationality -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                สัญชาติ <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <select v-model="form.nationality" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกสัญชาติ</option>
                  <option v-for="option in displayOptions.nationalities" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('nationality')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มสัญชาติใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- First Name Thai -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ (ไทย) <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.firstNameTh" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="ชื่อภาษาไทย" 
              />
            </div>

            <!-- Last Name Thai -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                นามสกุล (ไทย) <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.lastNameTh" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="นามสกุลภาษาไทย" 
              />
            </div>

            <!-- First Name English -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ (อังกฤษ)</label>
              <input 
                v-model="form.firstNameEn" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="First Name" 
              />
            </div>

            <!-- Last Name English -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">นามสกุล (อังกฤษ)</label>
              <input 
                v-model="form.lastNameEn" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="Last Name" 
              />
            </div>

            <!-- Nickname -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อเล่น</label>
              <input 
                v-model="form.nickname" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="ชื่อเล่น" 
              />
            </div>

            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                เพศ <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <select v-model="form.gender" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกเพศ</option>
                  <option v-for="option in displayOptions.genders" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('gender')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มเพศใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Date of Birth -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                วันเกิด <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.dateOfBirth" 
                type="date" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
              />
            </div>

            <!-- Patient Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทผู้ป่วย</label>
              <div class="flex gap-2">
                <select v-model="form.patientType" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกประเภทผู้ป่วย</option>
                  <option v-for="option in displayOptions.patientTypes" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('patientType')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มประเภทผู้ป่วยใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Blood Group -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">กรุ๊ปเลือด</label>
              <div class="flex gap-2">
                <select v-model="form.bloodGroup" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกกรุ๊ปเลือด</option>
                  <option v-for="option in displayOptions.bloodGroups" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('bloodGroup')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มกรุ๊ปเลือดใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Occupation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">อาชีพ</label>
              <div class="flex gap-2">
                <select v-model="form.occupation" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกอาชีพ</option>
                  <option v-for="option in displayOptions.occupations" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('occupation')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มอาชีพใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Medical Rights -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">สิทธิการรักษา</label>
              <div class="flex gap-2">
                <select v-model="form.medicalRights" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกสิทธิการรักษา</option>
                  <option v-for="option in displayOptions.medicalRights" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('medicalRight')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มสิทธิการรักษาใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Marital Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">สถานภาพสมรส</label>
              <div class="flex gap-2">
                <select v-model="form.maritalStatus" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกสถานภาพสมรส</option>
                  <option v-for="option in displayOptions.maritalStatuses" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('maritalStatus')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มสถานภาพสมรสใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Referral Source -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">แหล่งที่มา</label>
              <div class="flex gap-2">
                <select v-model="form.referralSource" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกแหล่งที่มา</option>
                  <option v-for="option in displayOptions.referralSources" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('referralSource')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มแหล่งที่มาใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Branch -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                สาขาที่ลงทะเบียน <span class="text-red-500">*</span>
              </label>
              <select v-model="form.branchId" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option value="">เลือกสาขา</option>
                <option v-for="branch in branchStore.branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 2-5 remain the same as in the original component -->
        <!-- I'll continue with the rest of the template... -->
        
        <!-- Step 2: Address -->
        <div v-if="currentStep === 2" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">ที่อยู่</h3>
          
          <!-- ID Card Address -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-3">ที่อยู่ตามบัตรประชาชน</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.idCardAddress.address" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="บ้านเลขที่ ซอย ถนน" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  แขวง/ตำบล <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.idCardAddress.subdistrict" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="แขวง/ตำบล" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  เขต/อำเภอ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.idCardAddress.district" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="เขต/อำเภอ" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  จังหวัด <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.idCardAddress.province" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="จังหวัด" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  รหัสไปรษณีย์ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.idCardAddress.zipcode" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="รหัสไปรษณีย์" 
                  maxlength="5"
                />
              </div>
            </div>
          </div>

          <!-- Same Address Checkbox -->
          <div class="flex items-center gap-2">
            <input 
              v-model="form.sameAsIdCard" 
              type="checkbox" 
              id="sameAsIdCard" 
              class="rounded border-gray-300" 
            />
            <label for="sameAsIdCard" class="text-sm text-gray-700">
              ที่อยู่ปัจจุบันเหมือนกับที่อยู่ตามบัตรประชาชน
            </label>
          </div>

          <!-- Current Address -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-3">ที่อยู่ปัจจุบัน</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.currentAddress.address" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="บ้านเลขที่ ซอย ถนน" 
                  :disabled="form.sameAsIdCard"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  แขวง/ตำบล <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.currentAddress.subdistrict" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="แขวง/ตำบล" 
                  :disabled="form.sameAsIdCard"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  เขต/อำเภอ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.currentAddress.district" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="เขต/อำเภอ" 
                  :disabled="form.sameAsIdCard"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  จังหวัด <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.currentAddress.province" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="จังหวัด" 
                  :disabled="form.sameAsIdCard"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  รหัสไปรษณีย์ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.currentAddress.zipcode" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="รหัสไปรษณีย์" 
                  maxlength="5"
                  :disabled="form.sameAsIdCard"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Contact Info -->
        <div v-if="currentStep === 3" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">ข้อมูลการติดต่อ</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์ <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.phone" 
                type="tel" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="0xx-xxx-xxxx" 
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="example@email.com" 
              />
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-3">ข้อมูลติดต่อฉุกเฉิน</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ-นามสกุล <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.emergencyContact.fullName" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="ชื่อ-นามสกุลผู้ติดต่อฉุกเฉิน" 
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  ความสัมพันธ์ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.emergencyContact.relationship" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="เช่น บิดา มารดา พี่น้อง แฟน" 
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์ <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.emergencyContact.phone" 
                  type="tel" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="0xx-xxx-xxxx" 
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                <input 
                  v-model="form.emergencyContact.address" 
                  type="text" 
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="ที่อยู่ของผู้ติดต่อฉุกเฉิน" 
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Medical Info -->
        <div v-if="currentStep === 4" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">ข้อมูลทางการแพทย์</h3>
          
          <!-- Doctor Information -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Icon icon="mdi:doctor" class="w-5 h-5 text-blue-600" />
              ข้อมูลแพทย์ผู้รักษา
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Primary Doctor -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">แพทย์หลัก</label>
                <select v-model="form.primaryDoctorId" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกแพทย์หลัก</option>
                  <option v-for="doctor in doctorOptions" :key="doctor.id" :value="doctor.id">
                    {{ doctor.value }}
                  </option>
                </select>
              </div>

              <!-- Assistant Doctor -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ผู้ช่วยแพทย์</label>
                <select v-model="form.assistantDoctorId" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกผู้ช่วยแพทย์</option>
                  <option v-for="assistant in assistantOptions" :key="assistant.id" :value="assistant.id">
                    {{ assistant.value }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Drug Allergies -->
          <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Icon icon="mdi:alert-circle" class="w-5 h-5 text-yellow-600" />
              ประวัติการแพ้ยา
            </h4>
            <div class="space-y-2">
              <div 
                v-for="(allergy, index) in form.drugAllergies" 
                :key="index"
                class="flex gap-2"
              >
                <input 
                  v-model="form.drugAllergies[index]" 
                  type="text" 
                  class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="ชื่อยาที่แพ้ (เช่น ไม่มี, Penicillin)" 
                />
                <button 
                  v-if="form.drugAllergies.length > 1"
                  @click="removeArrayItem(form.drugAllergies, index)"
                  class="px-2 py-2 text-red-500 hover:bg-red-100 rounded"
                  title="ลบ"
                >
                  <Icon icon="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>
              <button 
                @click="addArrayItem(form.drugAllergies, '')"
                class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Icon icon="mdi:plus" class="w-4 h-4" />
                เพิ่มยาที่แพ้
              </button>
            </div>
          </div>

          <!-- Chronic Diseases -->
          <div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Icon icon="mdi:heart-pulse" class="w-5 h-5 text-orange-600" />
              โรคประจำตัว
            </h4>
            <div class="space-y-2">
              <div 
                v-for="(disease, index) in form.chronicDiseases" 
                :key="index"
                class="flex gap-2"
              >
                <input 
                  v-model="form.chronicDiseases[index]" 
                  type="text" 
                  class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="โรคประจำตัว (เช่น ไม่มี, เบาหวาน, ความดันโลหิตสูง)" 
                />
                <button 
                  v-if="form.chronicDiseases.length > 1"
                  @click="removeArrayItem(form.chronicDiseases, index)"
                  class="px-2 py-2 text-red-500 hover:bg-red-100 rounded"
                  title="ลบ"
                >
                  <Icon icon="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>
              <button 
                @click="addArrayItem(form.chronicDiseases, '')"
                class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Icon icon="mdi:plus" class="w-4 h-4" />
                เพิ่มโรคประจำตัว
              </button>
            </div>
          </div>

          <!-- Current Medications -->
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <Icon icon="mdi:pill" class="w-5 h-5 text-green-600" />
              ยาที่กินประจำ
            </h4>
            <div class="space-y-2">
              <div 
                v-for="(medication, index) in form.currentMedications" 
                :key="index"
                class="flex gap-2"
              >
                <input 
                  v-model="form.currentMedications[index]" 
                  type="text" 
                  class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" 
                  placeholder="ยาที่กินประจำ (เช่น ไม่มี, ยาลดความดัน)" 
                />
                <button 
                  v-if="form.currentMedications.length > 1"
                  @click="removeArrayItem(form.currentMedications, index)"
                  class="px-2 py-2 text-red-500 hover:bg-red-100 rounded"
                  title="ลบ"
                >
                  <Icon icon="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>
              <button 
                @click="addArrayItem(form.currentMedications, '')"
                class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Icon icon="mdi:plus" class="w-4 h-4" />
                เพิ่มยาที่กินประจำ
              </button>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Icon icon="mdi:note-text" class="w-4 h-4" />
              หมายเหตุเพิ่มเติม
            </label>
            <textarea 
              v-model="form.notes" 
              rows="3"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
              placeholder="หมายเหตุเพิ่มเติมเกี่ยวกับผู้ป่วย..." 
            />
          </div>
        </div>

        <!-- Step 5: Summary -->
        <div v-if="currentStep === 5" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">สรุปข้อมูลผู้ป่วย</h3>
          
          <div class="bg-gray-50 p-6 rounded-lg space-y-4">
            <!-- Basic Info -->
            <div>
              <h4 class="font-medium text-gray-800 mb-2">ข้อมูลทั่วไป</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div><span class="font-medium">HN:</span> {{ form.hn }}</div>
                <div><span class="font-medium">เลขบัตรประชาชน:</span> {{ form.nationalId }}</div>
                <div><span class="font-medium">ชื่อ:</span> {{ form.titlePrefix }} {{ form.firstNameTh }} {{ form.lastNameTh }}</div>
                <div><span class="font-medium">ชื่อเล่น:</span> {{ form.nickname || '-' }}</div>
                <div><span class="font-medium">เพศ:</span> {{ form.gender }}</div>
                <div><span class="font-medium">วันเกิด:</span> {{ form.dateOfBirth }}</div>
                <div><span class="font-medium">สัญชาติ:</span> {{ form.nationality }}</div>
                <div><span class="font-medium">กรุ๊ปเลือด:</span> {{ form.bloodGroup || '-' }}</div>
              </div>
            </div>

            <!-- Address -->
            <div>
              <h4 class="font-medium text-gray-800 mb-2">ที่อยู่</h4>
              <div class="text-sm space-y-1">
                <div>
                  <span class="font-medium">ที่อยู่ตามบัตรประชาชน:</span><br>
                  {{ form.idCardAddress.address }} {{ form.idCardAddress.subdistrict }} 
                  {{ form.idCardAddress.district }} {{ form.idCardAddress.province }} 
                  {{ form.idCardAddress.zipcode }}
                </div>
                <div v-if="!form.sameAsIdCard">
                  <span class="font-medium">ที่อยู่ปัจจุบัน:</span><br>
                  {{ form.currentAddress.address }} {{ form.currentAddress.subdistrict }} 
                  {{ form.currentAddress.district }} {{ form.currentAddress.province }} 
                  {{ form.currentAddress.zipcode }}
                </div>
              </div>
            </div>

            <!-- Contact -->
            <div>
              <h4 class="font-medium text-gray-800 mb-2">ข้อมูลการติดต่อ</h4>
              <div class="text-sm space-y-1">
                <div><span class="font-medium">เบอร์โทร:</span> {{ form.phone }}</div>
                <div><span class="font-medium">อีเมล:</span> {{ form.email || '-' }}</div>
                <div>
                  <span class="font-medium">ติดต่อฉุกเฉิน:</span> 
                  {{ form.emergencyContact.fullName }} ({{ form.emergencyContact.relationship }}) 
                  {{ form.emergencyContact.phone }}
                </div>
              </div>
            </div>

            <!-- Medical -->
            <div>
              <h4 class="font-medium text-gray-800 mb-2">ข้อมูลทางการแพทย์</h4>
              <div class="text-sm space-y-1">
                <div><span class="font-medium">แพทย์หลัก:</span> {{ doctorStore.getDoctorNameById(form.primaryDoctorId) || '-' }}</div>
                <div><span class="font-medium">ผู้ช่วยแพทย์:</span> {{ assistantStore.getAssistantNameById(form.assistantDoctorId) || '-' }}</div>
                <div><span class="font-medium">ยาที่แพ้:</span> {{ form.drugAllergies.join(', ') }}</div>
                <div><span class="font-medium">โรคประจำตัว:</span> {{ form.chronicDiseases.join(', ') }}</div>
                <div><span class="font-medium">ยาที่กินประจำ:</span> {{ form.currentMedications.join(', ') }}</div>
                <div v-if="form.notes"><span class="font-medium">หมายเหตุ:</span> {{ form.notes }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center pt-6 border-t">
        <button 
          @click="prevStep"
          :disabled="!canGoPrev || isSubmitting"
          :class="[
            'px-4 py-2 border rounded-lg text-sm transition-colors',
            canGoPrev && !isSubmitting
              ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          <Icon icon="mdi:chevron-left" class="w-4 h-4 inline mr-1" />
          ก่อนหน้า
        </button>

        <div class="text-sm text-gray-500">
          หน้า {{ currentStep }} จาก {{ totalSteps }}
        </div>

        <button 
          v-if="!isLastStep"
          @click="nextStep"
          :disabled="!canGoNext || isSubmitting"
          :class="[
            'px-4 py-2 rounded-lg text-sm text-white transition-colors',
            canGoNext && !isSubmitting
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
          ]"
        >
          ถัดไป
          <Icon icon="mdi:chevron-right" class="w-4 h-4 inline ml-1" />
        </button>

        <button 
          v-else
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="isSubmitting">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <Icon v-else icon="mdi:content-save" class="w-4 h-4" />
          {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
        </button>
      </div>
    </div>

    <!-- InputModal -->
    <InputModal
      :show="showInputModal"
      :title="inputModalConfig.title"
      :message="inputModalConfig.message"
      :placeholder="inputModalConfig.placeholder"
      @close="closeInputModal"
      @confirm="handleAddNewOption"
    />
  </Modal>
</template>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
}

.disabled {
  background-color: #f9fafb;
  color: #6b7280;
}
</style>