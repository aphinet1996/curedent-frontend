<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import InputModal from '~/components/InputModal.vue'
import { useDrugStore } from '~/stores/drug'
import { useBranchStore } from '~/stores/branch'
import { useAlertStore } from '~/stores/components/alert'
import type { 
  DrugFormData, 
  DrugOptionCategory,
  CreateDrugRequest,
  MultilingualOption
} from '~/types/drug'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'submit'])

// Stores
const drugStore = useDrugStore()
const branchStore = useBranchStore()
const alertStore = useAlertStore()

// State
const currentStep = ref(1)
const totalSteps = 4
const isSubmitting = ref(false)
const errorMessage = ref('')

// InputModal state
const showInputModal = ref(false)
const inputModalConfig = ref({
  title: '',
  message: '',
  placeholder: '',
  category: '' as DrugOptionCategory
})

// Show label settings modal
const showLabelModal = ref(false)

// Get options from store with display values
const displayOptions = computed(() => drugStore.getDisplayOptions)
const isLoadingOptions = computed(() => drugStore.getLoadingOptions)

// Form data (for UI display)
const form = reactive<DrugFormData>({
  // Basic Info
  branchId: '',
  category: '',
  subcategory: '',
  code: '',
  name: '',
  
  // Multilingual fields (current language display)
  scientificName: '',
  printName: '',
  indications: '',
  unit: '',
  instruction: '',
  timing: '',
  usage: '',
  
  // Additional info
  description: '',
  dosage: '',
  sellPrice: '',
  buyPrice: ''
})

// Stepper configuration
const steps = [
  { 
    number: 1, 
    title: 'ข้อมูลพื้นฐาน', 
    description: 'รหัสยา ชื่อยา และหมวดหมู่',
    icon: 'mdi:pill'
  },
  { 
    number: 2, 
    title: 'ข้อมูลทางวิทยาศาสตร์', 
    description: 'ชื่อทางวิทยาศาสตร์ และข้อบ่งใช้',
    icon: 'mdi:flask'
  },
  { 
    number: 3, 
    title: 'การใช้งานและราคา', 
    description: 'วิธีใช้ ขนาด และราคา',
    icon: 'mdi:currency-usd'
  },
  { 
    number: 4, 
    title: 'สรุปข้อมูล', 
    description: 'ตรวจสอบข้อมูลก่อนบันทึก',
    icon: 'mdi:check-circle'
  }
]

// Option categories configurations
const optionConfigs = {
  category: {
    title: 'เพิ่มหมวดหมู่ยาใหม่',
    message: 'กรุณากรอกหมวดหมู่ยาที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น ยาปฏิชีวนะ/Antibiotics'
  },
  subcategory: {
    title: 'เพิ่มหมวดหมู่ย่อยใหม่',
    message: 'กรุณากรอกหมวดหมู่ย่อยที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น เพนิซิลลิน/Penicillin'
  },
  unit: {
    title: 'เพิ่มหน่วยใหม่',
    message: 'กรุณากรอกหน่วยที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น เม็ด/Tablet, มิลลิลิตร/ml'
  },
  instruction: {
    title: 'เพิ่มวิธีใช้ใหม่',
    message: 'กรุณากรอกวิธีใช้ที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น รับประทาน/Oral, ฉีด/Injection'
  },
  timing: {
    title: 'เพิ่มเวลาใช้ใหม่',
    message: 'กรุณากรอกเวลาใช้ที่ต้องการเพิ่ม (ไทย/อังกฤษ):',
    placeholder: 'เช่น วันละ 3 ครั้ง/3 times daily'
  }
}

// Helper function to find multilingual option by display value
function findMultilingualOption(category: keyof typeof displayOptions.value, displayValue: string): MultilingualOption | null {
  return drugStore.findOptionByDisplayValue(
    drugStore.getDrugOptions[category as keyof typeof drugStore.getDrugOptions] as MultilingualOption[], 
    displayValue
  )
}

// Helper function to convert form data to create request
function convertFormToCreateRequest(): CreateDrugRequest {
  // Helper function to get multilingual option or create default
  const getMultilingualOption = (category: keyof typeof displayOptions.value, value: string): MultilingualOption => {
    const option = findMultilingualOption(category, value)
    if (option) return option
    
    // Default fallback if not found
    return { th: value, en: value }
  }

  return {
    branchId: form.branchId,
    category: getMultilingualOption('categories', form.category),
    subcategory: getMultilingualOption('subcategories', form.subcategory),
    code: form.code,
    name: form.name,
    scientificName: {
      th: form.scientificName,
      en: form.scientificName
    },
    printName: form.printName ? {
      th: form.printName,
      en: form.printName
    } : undefined,
    indications: form.indications ? {
      th: form.indications,
      en: form.indications
    } : undefined,
    description: form.description || undefined,
    dosage: form.dosage || undefined,
    unit: getMultilingualOption('units', form.unit),
    instruction: form.instruction ? getMultilingualOption('instructions', form.instruction) : undefined,
    timing: form.timing ? getMultilingualOption('timings', form.timing) : undefined,
    usage: form.usage ? {
      th: form.usage,
      en: form.usage
    } : undefined,
    sellPrice: typeof form.sellPrice === 'string' ? parseFloat(form.sellPrice) : form.sellPrice,
    buyPrice: form.buyPrice ? (typeof form.buyPrice === 'string' ? parseFloat(form.buyPrice) : form.buyPrice) : undefined
  }
}

// Watch for modal show/hide
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm()
    fetchAllOptions()
    fetchBranches()
  }
})

// Computed
const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.branchId && form.code && form.name && 
             form.category && form.subcategory
    case 2:
      return form.scientificName && form.unit
    case 3:
      return form.sellPrice
    case 4:
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
    await drugStore.fetchAllDrugOptions()
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

// InputModal methods
const openAddOptionModal = (category: DrugOptionCategory) => {
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
    
    const result = await drugStore.createDrugOption(
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

const handleSubmit = async () => {
  if (!canGoNext.value && !isLastStep.value) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const drugData = convertFormToCreateRequest()
    
    const result = await drugStore.createDrug(drugData)
    
    if (result) {
      alertStore.success(`เพิ่มยา "${form.name}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
      emit('submit', result)
      resetForm()
      emit('close')
    } else {
      errorMessage.value = 'ไม่สามารถเพิ่มยาได้'
      alertStore.error('ไม่สามารถเพิ่มยาได้ กรุณาลองอีกครั้ง', 'เกิดข้อผิดพลาด')
    }
  } catch (error: any) {
    console.error('Error creating drug:', error)
    errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการเพิ่มยา'
    alertStore.error(error.message || 'เกิดข้อผิดพลาดในการเพิ่มยา', 'เกิดข้อผิดพลาด')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  currentStep.value = 1
  errorMessage.value = ''
  
  // Reset form data
  Object.assign(form, {
    branchId: '',
    category: '',
    subcategory: '',
    code: '',
    name: '',
    scientificName: '',
    printName: '',
    indications: '',
    unit: '',
    instruction: '',
    timing: '',
    usage: '',
    description: '',
    dosage: '',
    sellPrice: '',
    buyPrice: ''
  })
}

// Initialize on mount
onMounted(() => {
  if (props.show) {
    fetchAllOptions()
    fetchBranches()
  }
})
</script>

<template>
  <Modal 
    :show="props.show" 
    title="เพิ่มยาใหม่" 
    widthClass="max-w-4xl"
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
              <div class="text-xs text-gray-500 mt-1 max-w-28">
                {{ step.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingOptions" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p class="ml-3 text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <!-- Step Content -->
      <div v-show="!isLoadingOptions" class="min-h-[400px]">
        <!-- Step 1: Basic Info -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800 mb-4">ข้อมูลพื้นฐาน</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Branch -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                สาขา <span class="text-red-500">*</span>
              </label>
              <select v-model="form.branchId" class="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option value="">เลือกสาขา</option>
                <option v-for="branch in branchStore.branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }}
                </option>
              </select>
            </div>

            <!-- Drug Code -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                รหัสยา <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.code" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="เช่น D001, PARA500" 
              />
            </div>

            <!-- Drug Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ชื่อยา <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.name" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="เช่น พาราเซตามอล" 
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                หมวดหมู่ยา <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <select v-model="form.category" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกหมวดหมู่ยา</option>
                  <option v-for="option in displayOptions.categories" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('category')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มหมวดหมู่ยาใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Subcategory -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                หมวดหมู่ย่อย <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <select v-model="form.subcategory" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกหมวดหมู่ย่อย</option>
                  <option v-for="option in displayOptions.subcategories" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('subcategory')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มหมวดหมู่ย่อยใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Scientific Info -->
        <div v-if="currentStep === 2" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">ข้อมูลทางวิทยาศาสตร์</h3>
          
          <div class="grid grid-cols-1 gap-4">
            <!-- Scientific Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ชื่อทางวิทยาศาสตร์ <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.scientificName" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="เช่น Paracetamol, Acetaminophen" 
              />
              <p class="text-xs text-gray-500 mt-1">
                สามารถตั้งค่าฉลากยาเป็นภาษาอื่นๆ ได้ภายหลัง
              </p>
            </div>

            <!-- Print Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ชื่อสำหรับพิมพ์
              </label>
              <input 
                v-model="form.printName" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="ชื่อที่จะปรากฏในฉลากยา" 
              />
            </div>

            <!-- Unit -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                หน่วย <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-2">
                <select v-model="form.unit" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกหน่วย</option>
                  <option v-for="option in displayOptions.units" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('unit')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มหน่วยใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Indications -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ข้อบ่งใช้
              </label>
              <textarea 
                v-model="form.indications" 
                rows="3"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="บรรยายการใช้งานของยานี้ เช่น บรรเทาปวด ลดไข้" 
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                รายละเอียดเพิ่มเติม
              </label>
              <textarea 
                v-model="form.description" 
                rows="2"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="รายละเอียดหรือหมายเหตุเพิ่มเติม" 
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Usage & Price -->
        <div v-if="currentStep === 3" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">การใช้งานและราคา</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Dosage -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ขนาด/ปริมาณ
              </label>
              <input 
                v-model="form.dosage" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="เช่น 500mg, 10ml" 
              />
            </div>

            <!-- Instruction -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                วิธีใช้
              </label>
              <div class="flex gap-2">
                <select v-model="form.instruction" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกวิธีใช้</option>
                  <option v-for="option in displayOptions.instructions" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('instruction')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มวิธีใช้ใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Timing -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                เวลาใช้
              </label>
              <div class="flex gap-2">
                <select v-model="form.timing" class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                  <option value="">เลือกเวลาใช้</option>
                  <option v-for="option in displayOptions.timings" :key="option.value" :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
                <button 
                  @click="openAddOptionModal('timing')"
                  class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  title="เพิ่มเวลาใช้ใหม่"
                >
                  <Icon icon="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Usage Instructions -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                คำแนะนำการใช้
              </label>
              <input 
                v-model="form.usage" 
                type="text" 
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="เช่น รับประทานหลังอาหาร" 
              />
            </div>

            <!-- Sell Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ราคาขาย <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.sellPrice" 
                type="number" 
                step="0.01"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="0.00" 
              />
            </div>

            <!-- Buy Price -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ราคาซื้อ
              </label>
              <input 
                v-model="form.buyPrice" 
                type="number" 
                step="0.01"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm" 
                placeholder="0.00" 
              />
            </div>
          </div>
        </div>

        <!-- Step 4: Summary -->
        <div v-if="currentStep === 4" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">สรุปข้อมูลยา</h3>
          
          <div class="bg-gray-50 p-6 rounded-lg space-y-4">
            <!-- Basic Info -->
            <div>
              <h4 class="font-medium text-gray-800 mb-2">ข้อมูลพื้นฐาน</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div><span class="font-medium">รหัสยา:</span> {{ form.code }}</div>
                <div><span class="font-medium">ชื่อยา:</span> {{ form.name }}</div>
                <div><span class="font-medium">หมวดหมู่:</span> {{ form.category }}</div>
                <div><span class="font-medium">หมวดหมู่ย่อย:</span> {{ form.subcategory }}</div>
                <!-- <div><span class="font-medium">สาขา:</span> {{ branchStore.getBranchNameById(form.branchId) }}</div> -->
              </div>
            </div>

            <!-- Scientific Info -->
            <div>
              <h4 class="font-medium text-gray-800 mb-2">ข้อมูลทางวิทยาศาสตร์</h4>
              <div class="text-sm space-y-1">
                <div><span class="font-medium">ชื่อทางวิทยาศาสตร์:</span> {{ form.scientificName }}</div>
                <div v-if="form.printName"><span class="font-medium">ชื่อสำหรับพิมพ์:</span> {{ form.printName }}</div>
                <div><span class="font-medium">หน่วย:</span> {{ form.unit }}</div>
                <div v-if="form.indications"><span class="font-medium">ข้อบ่งใช้:</span> {{ form.indications }}</div>
                <div v-if="form.description"><span class="font-medium">รายละเอียด:</span> {{ form.description }}</div>
              </div>
            </div>

            <!-- Usage & Price -->
            <div>
              <h4 class="font-medium text-gray-800 mb-2">การใช้งานและราคา</h4>
              <div class="text-sm space-y-1">
                <div v-if="form.dosage"><span class="font-medium">ขนาด:</span> {{ form.dosage }}</div>
                <div v-if="form.instruction"><span class="font-medium">วิธีใช้:</span> {{ form.instruction }}</div>
                <div v-if="form.timing"><span class="font-medium">เวลาใช้:</span> {{ form.timing }}</div>
                <div v-if="form.usage"><span class="font-medium">คำแนะนำ:</span> {{ form.usage }}</div>
                <div><span class="font-medium">ราคาขาย:</span> {{ typeof form.sellPrice === 'number' ? form.sellPrice.toFixed(2) : form.sellPrice }} บาท</div>
                <div v-if="form.buyPrice"><span class="font-medium">ราคาซื้อ:</span> {{ typeof form.buyPrice === 'number' ? form.buyPrice.toFixed(2) : form.buyPrice }} บาท</div>
              </div>
            </div>
          </div>

          <!-- Label Settings Note -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-start gap-3">
              <Icon icon="mdi:information" class="w-5 h-5 text-blue-600 mt-0.5" />
              <div class="text-sm text-blue-800">
                <p class="font-medium mb-1">การตั้งค่าฉลากยา</p>
                <p>หลังจากบันทึกยาแล้ว สามารถเข้าไปตั้งค่าฉลากยาเป็นภาษาอื่นๆ ได้ในหน้ารายละเอียดยา</p>
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
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>