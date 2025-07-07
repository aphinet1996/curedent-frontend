<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import TableSort from '~/components/TableSort.vue'
import Modal from '~/components/Modal.vue'
import Pagination from '~/components/Pagination.vue'
import { useDrugStore } from '~/stores/drug'
import { useAlertStore } from '~/stores/components/alert'
import type { ApiDrug, DrugSearchParams } from '~/types/drug'

interface Props {
  searchParams?: DrugSearchParams
  branchId?: string
  showActions?: boolean
  rowsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  rowsPerPage: 10
})

const emit = defineEmits(['edit', 'delete', 'labelConfig', 'refresh'])

// Stores
const drugStore = useDrugStore()
const alertStore = useAlertStore()

// State
const isLoading = ref(false)
const showDeleteModal = ref(false)
const drugToDelete = ref<ApiDrug | null>(null)
const showLabelModal = ref(false)
const drugForLabel = ref<ApiDrug | null>(null)

// Pagination state
const currentPage = ref(1)
const pageSize = ref(props.rowsPerPage)

// Column interface (matching TableSort component)
interface Column {
  key: string
  label: string
  type?: 'text' | 'icon'
  icon?: string
  width?: string
  wrap?: boolean
}

// Table columns configuration
const columns = computed((): Column[] => {
  const baseColumns: Column[] = [
    { 
      label: 'รหัสยา', 
      key: 'drugCode', 
      width: '120px'
    },
    { 
      label: 'ชื่อยา', 
      key: 'drugName', 
      width: '200px',
      wrap: true
    },
    { 
      label: 'ชื่อทางวิทยาศาสตร์', 
      key: 'scientificName', 
      width: '180px',
      wrap: true
    },
    { 
      label: 'หมวดหมู่', 
      key: 'category', 
      width: '140px'
    },
    { 
      label: 'หน่วย', 
      key: 'unit', 
      width: '80px'
    },
    { 
      label: 'ราคาขาย', 
      key: 'sellingPrice', 
      width: '100px'
    },
    { 
      label: 'สถานะ', 
      key: 'status', 
      width: '80px'
    }
  ]

  if (props.showActions) {
    baseColumns.push(
      { 
        label: '', 
        key: 'edit', 
        type: 'icon', 
        icon: 'mdi:pencil',
        width: '50px'
      },
    //   { 
    //     label: '', 
    //     key: 'label', 
    //     type: 'icon', 
    //     icon: 'mdi:tag-outline',
    //     width: '50px'
    //   },
      { 
        label: '', 
        key: 'delete', 
        type: 'icon', 
        icon: 'mdi:delete-outline',
        width: '50px'
      }
    )
  }

  return baseColumns
})

// Transform drugs data for table display
const tableRows = computed(() => {
  const drugs = drugStore.getDrugs
  console.log('tableRows - raw drugs data:', drugs)
  
  return drugs.map((drug, index) => {
    console.log(`Drug ${index}:`, {
      id: drug.id,
      _id: (drug as any)._id,
      drugCode: drug.drugCode,
      drugName: drug.drugName
    })
    
    return {
      drugCode: drug.drugCode,
      drugName: drug.drugName,
      scientificName: drug.scientificName || '-',
      category: drug.category,
      unit: drug.unit,
      sellingPrice: formatPrice(drug.sellingPrice),
      status: drug.isActive 
        ? 'ใช้งาน'
        : 'ไม่ใช้งาน',
      // Store original drug data for actions
      _drug: drug
    }
  })
})

// Computed
const totalDrugs = computed(() => drugStore.getPagination.total || 0)
const isLoadingData = computed(() => drugStore.getLoading)

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

async function fetchDrugs() {
  isLoading.value = true
  try {
    const searchParams = {
      ...props.searchParams,
      page: currentPage.value,
      limit: pageSize.value
    }
    
    if (props.branchId) {
      searchParams.branchId = props.branchId
    }

    await drugStore.fetchDrugs(searchParams)
  } catch (error) {
    console.error('Error fetching drugs:', error)
    alertStore.error('ไม่สามารถโหลดข้อมูลยาได้', 'เกิดข้อผิดพลาด')
  } finally {
    isLoading.value = false
  }
}

// Handle page change
function handlePageChange(page: number) {
  currentPage.value = page
  fetchDrugs()
}

// Reset to first page when search params change
function resetToFirstPage() {
  currentPage.value = 1
  fetchDrugs()
}

function handleAction(event: { key: string; row: any }) {
  const { key, row } = event
  const drug = row._drug as ApiDrug

  // Debug log
  console.log('handleAction - drug data:', drug)
  console.log('drug.id:', drug?.id)
  console.log('drug._id:', (drug as any)?._id)

  if (!drug) {
    console.error('Drug data is missing')
    alertStore.error('ไม่สามารถดำเนินการได้ เนื่องจากข้อมูลยาไม่ครบถ้วน', 'เกิดข้อผิดพลาด')
    return
  }

  switch (key) {
    case 'edit':
      handleEdit(drug)
      break
    case 'label':
      handleLabelConfig(drug)
      break
    case 'delete':
      confirmDelete(drug)
      break
  }
}

function handleEdit(drug: ApiDrug) {
  emit('edit', drug)
}

function handleLabelConfig(drug: ApiDrug) {
  drugForLabel.value = drug
  showLabelModal.value = true
  emit('labelConfig', drug)
}

function confirmDelete(drug: ApiDrug) {
  console.log('confirmDelete - drug:', drug)
  
  // Check if drug has valid ID
  const drugId = drug.id || (drug as any)._id
  if (!drugId) {
    console.error('Drug ID is missing:', drug)
    alertStore.error('ไม่สามารถลบยาได้ เนื่องจากไม่พบรหัสยา', 'เกิดข้อผิดพลาด')
    return
  }

  drugToDelete.value = { ...drug, id: drugId } // Ensure id field exists
  showDeleteModal.value = true
}

async function deleteDrug() {
  if (!drugToDelete.value) return

  const drugId = drugToDelete.value.id || (drugToDelete.value as any)._id
  
  if (!drugId) {
    console.error('Cannot delete drug: ID is missing', drugToDelete.value)
    alertStore.error('ไม่สามารถลบยาได้ เนื่องจากไม่พบรหัสยา', 'เกิดข้อผิดพลาด')
    return
  }

  console.log('Deleting drug with ID:', drugId)

  try {
    const success = await drugStore.deleteDrug(drugId)
    
    if (success) {
      alertStore.success(`ลบยา "${drugToDelete.value.drugName}" สำเร็จ`, 'ลบข้อมูลสำเร็จ')
      emit('delete', drugToDelete.value)
      emit('refresh')
      
      // Refresh current page or go to previous page if current page is empty
      const totalPages = Math.ceil(totalDrugs.value / pageSize.value)
      if (currentPage.value > totalPages && totalPages > 0) {
        currentPage.value = totalPages
      }
      fetchDrugs()
    } else {
      alertStore.error('ไม่สามารถลบยาได้', 'เกิดข้อผิดพลาด')
    }
  } catch (error: any) {
    console.error('Error deleting drug:', error)
    alertStore.error(error.message || 'ไม่สามารถลบยาได้', 'เกิดข้อผิดพลาด')
  } finally {
    showDeleteModal.value = false
    drugToDelete.value = null
  }
}

function closeDeleteModal() {
  showDeleteModal.value = false
  drugToDelete.value = null
}

function closeLabelModal() {
  showLabelModal.value = false
  drugForLabel.value = null
}

async function toggleDrugStatus(drug: ApiDrug) {
  try {
    const updatedDrug = await drugStore.toggleArchiveStatus(drug.id, !drug.isActive)
    
    if (updatedDrug) {
      const status = updatedDrug.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'
      alertStore.success(`${status}ยา "${drug.drugName}" สำเร็จ`, 'อัปเดตสถานะสำเร็จ')
      emit('refresh')
      fetchDrugs()
    }
  } catch (error: any) {
    console.error('Error toggling drug status:', error)
    alertStore.error(error.message || 'ไม่สามารถเปลี่ยนสถานะยาได้', 'เกิดข้อผิดพลาด')
  }
}

// Watch for search params changes
watch(() => props.searchParams, () => {
  resetToFirstPage()
}, { deep: true })

watch(() => props.branchId, () => {
  resetToFirstPage()
})

// Watch for rowsPerPage changes
watch(() => props.rowsPerPage, (newVal) => {
  pageSize.value = newVal
  resetToFirstPage()
})

// Initialize
onMounted(() => {
  fetchDrugs()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Header with summary -->
    <div class="flex justify-between items-center">
      <!-- <div class="text-sm text-gray-600">
        แสดง {{ tableRows.length }} รายการ จากทั้งหมด {{ totalDrugs }} รายการ
        <span v-if="totalDrugs > pageSize" class="text-gray-500">
          (หน้า {{ currentPage }} จาก {{ Math.ceil(totalDrugs / pageSize) }})
        </span>
      </div> -->
      <div v-if="isLoadingData" class="flex items-center gap-2 text-sm text-gray-500">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        กำลังโหลด...
      </div>
    </div>

    <!-- Table -->
    <div v-if="tableRows.length > 0" class="overflow-hidden">
      <TableSort 
        :columns="columns" 
        :rows="tableRows"
        :rows-per-page="pageSize"
        @action="handleAction"
        class="w-full"
      />
    </div>

    <!-- Pagination -->
    <Pagination 
      :current-page="currentPage"
      :page-size="pageSize"
      :total-items="totalDrugs"
      @update:page="handlePageChange"
    />

    <!-- Empty State -->
    <div v-if="!isLoadingData && tableRows.length === 0" 
         class="text-center py-12 bg-white rounded-lg shadow shadow-gray-200">
      <Icon icon="mdi:pill-off" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูลยา</h3>
      <p class="text-gray-500 mb-4">ไม่มียาที่ตรงกับเงื่อนไขการค้นหา</p>
      <!-- <button 
        @click="emit('refresh')"
        class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Icon icon="mdi:refresh" class="w-4 h-4 mr-2" />
        รีเฟรช
      </button> -->
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal 
      :show="showDeleteModal" 
      title="ยืนยันการลบยา"
      @close="closeDeleteModal"
    >
      <div v-if="drugToDelete" class="space-y-4">
        <div class="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
          <Icon icon="mdi:alert-circle" class="w-6 h-6 text-red-500" />
          <div>
            <!-- <h4 class="font-medium text-red-800">คุณแน่ใจหรือไม่?</h4> -->
            <h4 class="font-medium text-red-800">คุณแน่ใจที่จะลบยา {{ drugToDelete.drugName }} ({{ drugToDelete.category }})?</h4>
            <p class="text-sm text-red-600">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
          </div>
        </div>

        <!-- <div v-if="drugToDelete" class="bg-gray-50 p-4 rounded-lg">
          <h5 class="font-medium text-gray-800 mb-2">ข้อมูลยาที่จะลบ:</h5>
          <div class="space-y-1 text-sm text-gray-600">
            <div><span class="font-medium">รหัสยา:</span> {{ drugToDelete.drugCode }}</div>
            <div><span class="font-medium">ชื่อยา:</span> {{ drugToDelete.drugName }}</div>
            <div><span class="font-medium">หมวดหมู่:</span> {{ drugToDelete.category }}</div>
          </div>
        </div> -->

        <div class="flex justify-end gap-3 pt-4">
          <button 
            @click="closeDeleteModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button 
            @click="deleteDrug"
            :disabled="isLoading"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Icon v-if="isLoading" icon="mdi:loading" class="w-4 h-4 animate-spin" />
            <Icon v-else icon="mdi:delete" class="w-4 h-4" />
            {{ isLoading ? 'กำลังลบ...' : 'ลบยา' }}
          </button>
        </div>
      </div>
    </Modal>

    <!-- Label Configuration Modal -->
    <Modal 
      :show="showLabelModal" 
      title="ตั้งค่าฉลากยา"
      widthClass="max-w-2xl"
      @close="closeLabelModal"
    >
      <div class="space-y-4">
        <div v-if="drugForLabel" class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-medium text-blue-800 mb-2">ยาที่เลือก:</h5>
          <div class="space-y-1 text-sm text-blue-600">
            <div><span class="font-medium">รหัสยา:</span> {{ drugForLabel.drugCode }}</div>
            <div><span class="font-medium">ชื่อยา:</span> {{ drugForLabel.drugName }}</div>
            <div><span class="font-medium">ชื่อทางวิทยาศาสตร์:</span> {{ drugForLabel.scientificName || '-' }}</div>
          </div>
        </div>

        <div class="space-y-4">
          <h6 class="font-medium text-gray-800">การตั้งค่าฉลากยาหลายภาษา</h6>
          
          <!-- Language Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เลือกภาษาที่ต้องการแสดง:</label>
            <div class="flex flex-wrap gap-2">
              <label class="flex items-center">
                <input type="checkbox" checked class="mr-2" />
                <span class="text-sm">ไทย</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" />
                <span class="text-sm">English</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" />
                <span class="text-sm">中文</span>
              </label>
            </div>
          </div>

          <!-- Field Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เลือกฟิลด์ที่ต้องการแสดงในฉลาก:</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" checked class="mr-2" />
                <span class="text-sm">ชื่อทางวิทยาศาสตร์</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" checked class="mr-2" />
                <span class="text-sm">ชื่อสำหรับพิมพ์</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" />
                <span class="text-sm">ข้อบ่งใช้</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" />
                <span class="text-sm">วิธีใช้</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" />
                <span class="text-sm">เวลาใช้</span>
              </label>
            </div>
          </div>

          <!-- Custom Translations -->
          <div class="bg-yellow-50 p-4 rounded-lg">
            <div class="flex items-start gap-3">
              <Icon icon="mdi:information" class="w-5 h-5 text-yellow-600 mt-0.5" />
              <div class="text-sm text-yellow-800">
                <p class="font-medium mb-1">การแปลแบบกำหนดเอง</p>
                <p>คุณสามารถปรับแต่งการแปลสำหรับฉลากยาได้ในอนาคต ขณะนี้จะใช้ข้อมูลที่มีอยู่ในระบบ</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button 
            @click="closeLabelModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button 
            @click="closeLabelModal"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Icon icon="mdi:content-save" class="w-4 h-4" />
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>