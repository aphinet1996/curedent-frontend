<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import { useTreatmentStore } from '~/stores/treatment'
import { useAlertStore } from '~/stores/components/alert'
import CardConfirmation from '~/components/CardConfirmation.vue'
import { treatmentService } from '~/services/treatment'

// Initialize stores
const treatmentStore = useTreatmentStore()
const alertStore = useAlertStore()

// UI state
const showSort = ref(false)
const showModal = ref(false)
const showEditModal = ref(false)
const newTitle = ref('')
const newPrice = ref<number | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Edit state
const editingTreatment = ref<{id: string, name: string, price: number} | null>(null)
const editName = ref('')
const editPrice = ref<number | null>(null)

// Confirmation dialog state
const showConfirmation = ref(false)
const treatmentToDelete = ref<{id: string, name: string} | null>(null)

// Fetch treatments on component mount
onMounted(async () => {
  await fetchTreatments()
})

// Fetch treatments from API
const fetchTreatments = async () => {
  isLoading.value = true;
  
  try {
    const response = await treatmentService.getTreatments();
    
    if (response && response.status === 'success') {
      await treatmentStore.fetchTreatments();
      error.value = null;
    } else {
      error.value = 'ไม่สามารถดึงข้อมูลได้';
      alertStore.error('ไม่สามารถดึงข้อมูลได้', 'การเชื่อมต่อล้มเหลว');
    }
  } catch (err: any) {
    console.error('Error fetching treatments:', err);
    error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'การเชื่อมต่อล้มเหลว');
  } finally {
    isLoading.value = false;
  }
};

// Start delete treatment process
const startDelete = (treatment: { id: string, name: string }) => {
  treatmentToDelete.value = treatment;
  showConfirmation.value = true;
};

// Confirm delete treatment
const confirmDelete = async () => {
  if (!treatmentToDelete.value) return;
  
  isLoading.value = true;
  
  try {
    const response = await treatmentService.deleteTreatment(treatmentToDelete.value.id);
    
    if (response && response.status === 'success') {
      // Remove from local state
      if (treatmentStore.treatments) {
        treatmentStore.treatments = treatmentStore.treatments.filter(
          t => t.id !== treatmentToDelete.value?.id
        );
      }
      
      alertStore.success(`ลบ "${treatmentToDelete.value.name}" สำเร็จ`, 'ลบข้อมูลสำเร็จ');
    } else {
      error.value = 'ไม่สามารถลบข้อมูลได้';
      alertStore.error('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error deleting treatment:', err);
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล';
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
    showConfirmation.value = false;
    treatmentToDelete.value = null;
  }
};

// Cancel delete
const cancelDelete = () => {
  showConfirmation.value = false;
  treatmentToDelete.value = null;
};

// Sort treatments A-Z
const sortAZ = () => {
  treatmentStore.sortTreatmentsAZ();
  showSort.value = false;
};

// Sort by price high to low
const sortPriceHighLow = () => {
  treatmentStore.sortTreatmentsPriceHighLow();
  showSort.value = false;
};

// Sort by price low to high
const sortPriceLowHigh = () => {
  treatmentStore.sortTreatmentsPriceLowHigh();
  showSort.value = false;
};

// Save new treatment
const saveNewTreatment = async () => {
  if (newTitle.value.trim() && newPrice.value !== null) {
    isLoading.value = true;
    
    try {
      const response = await treatmentService.createTreatment(newTitle.value.trim(), newPrice.value);
      
      if (response && response.status === 'success') {
        // Update local state by re-fetching the treatments or adding the new one
        await treatmentStore.fetchTreatments();
        
        alertStore.success(`เพิ่ม "${response.data.treatment.name}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ');
        newTitle.value = '';
        newPrice.value = null;
        showModal.value = false;
      } else {
        alertStore.error('ไม่สามารถเพิ่มข้อมูลได้', 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      console.error('Error creating treatment:', err);
      alertStore.error(err.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'เกิดข้อผิดพลาด');
    } finally {
      isLoading.value = false;
    }
  }
};

// Start edit treatment process
const startEdit = async (treatment: { id: string, name: string, price: number }) => {
  isLoading.value = true;
  
  try {
    // Get the latest data from API
    const response = await treatmentService.getTreatmentById(treatment.id);
    
    if (response && response.status === 'success') {
      editingTreatment.value = response.data.treatment;
      editName.value = response.data.treatment.name;
      editPrice.value = response.data.treatment.price;
      showEditModal.value = true;
    } else {
      alertStore.error('ไม่สามารถดึงข้อมูลได้', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error fetching treatment details:', err);
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
  }
};

// Save edited treatment
const saveEditTreatment = async () => {
  if (!editingTreatment.value || !editName.value.trim() || editPrice.value === null) return;
  
  isLoading.value = true;
  
  try {
    const response = await treatmentService.updateTreatment(
      editingTreatment.value.id, 
      editName.value.trim(),
      editPrice.value
    );
    
    if (response && response.status === 'success') {
      // Update local state by re-fetching or updating locally
      await treatmentStore.fetchTreatments();
      
      alertStore.success(`แก้ไข "${response.data.treatment.name}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ');
      closeEditModal();
    } else {
      alertStore.error('ไม่สามารถแก้ไขข้อมูลได้', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error updating treatment:', err);
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
  }
};

// Close edit modal and reset states
const closeEditModal = () => {
  showEditModal.value = false;
  editingTreatment.value = null;
  editName.value = '';
  editPrice.value = null;
};
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm relative max-h-[calc(100vh-200px)] flex flex-col">
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold text-gray-800">Treatment</h3>
        <div class="relative">
          <button
            class="text-xs text-blue-600 border border-blue-300 px-2 py-1 rounded-full hover:bg-blue-100"
            @click="showSort = !showSort"
          >
            sort by
            <Icon icon="mdi:chevron-up" class="inline w-4 h-4 ml-1" />
          </button>

          <div v-if="showSort" class="absolute z-10 mt-1 bg-white shadow-md rounded-md p-3 w-48 text-sm">
            <div class="text-gray-400 text-center text-xs mb-2">Sort By</div>
            <button class="w-full bg-blue-100 text-blue-700 px-2 py-1 rounded mb-2 hover:bg-blue-200" @click="sortAZ">
              A - Z
            </button>
            <button class="w-full bg-gray-100 text-gray-700 px-2 py-1 rounded mb-2 hover:bg-gray-200" @click="sortPriceHighLow">
              Price High to Low
            </button>
            <button class="w-full bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200" @click="sortPriceLowHigh">
              Price Low to High
            </button>
          </div>
        </div>
      </div>

      <button @click="showModal = true"
        class="flex rounded-lg items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">
        <Icon icon="mdi:add" class="w-4 h-4" />
        Add
      </button>
    </div>

    <div v-if="treatmentStore.isLoading || isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error || treatmentStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:alert-circle" class="w-5 h-5 text-red-500" />
        <p class="font-medium">{{ error || treatmentStore.error }}</p>
      </div>
      <button class="mt-2 text-sm text-red-600 hover:text-red-800 underline" @click="fetchTreatments">
        ลองใหม่อีกครั้ง
      </button>
    </div>
    
    <div v-else-if="treatmentStore.treatments.length === 0" class="py-8 text-center">
      <Icon icon="mdi:file-document-outline" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
      <h3 class="text-gray-700 font-medium mb-1">ยังไม่มีข้อมูล</h3>
      <p class="text-gray-500 text-sm">ไม่พบข้อมูล Treatment ในระบบ</p>
    </div>

    <div v-else class="overflow-y-auto pr-2 flex-1">
      <ul class="divide-y divide-gray-200">
        <li v-for="item in treatmentStore.treatments" :key="item.id"
          class="py-2 flex justify-between items-start text-sm text-gray-800">
          <div>
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-gray-500">Price: {{ item.price.toLocaleString() }} baht</div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="startEdit({ id: item.id, name: item.name, price: item.price })"
              class="text-gray-400 hover:text-blue-500"
              title="แก้ไข"
            >
              <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
            </button>
            
            <button 
              @click="startDelete({ id: item.id, name: item.name })"
              class="text-gray-400 hover:text-red-500" 
              title="ลบ"
            >
              <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <Modal :show="showModal" title="Add New Treatment" @close="showModal = false">
    <div class="space-y-3">
      <input
        v-model="newTitle"
        type="text"
        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter treatment name"
      />
      <input
        v-model.number="newPrice"
        type="number"
        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter price"
      />
      <div class="flex justify-end gap-2 mt-2">
        <button @click="showModal = false" 
          class="px-3 py-1 rounded-lg border border-gray-400 text-sm text-gray-600 hover:underline"
          :disabled="isLoading">
          Cancel
        </button>
        <button @click="saveNewTreatment" 
          class="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-1"
          :disabled="isLoading">
          <span v-if="isLoading" class="inline-block">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Adding...' : 'Add' }}
        </button>
      </div>
    </div>
  </Modal>
  
  <Modal :show="showEditModal" title="Edit Treatment" @close="closeEditModal">
    <div class="space-y-3">
      <input
        v-model="editName"
        type="text"
        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter treatment name"
      />
      <input
        v-model.number="editPrice"
        type="number"
        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter price"
      />
      <div class="flex justify-end gap-2 mt-2">
        <button @click="closeEditModal" 
          class="px-3 py-1 rounded-lg border border-gray-400 text-sm text-gray-600 hover:underline"
          :disabled="isLoading">
          Cancel
        </button>
        <button @click="saveEditTreatment" 
          class="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-1"
          :disabled="isLoading">
          <span v-if="isLoading" class="inline-block">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </Modal>
  
  <CardConfirmation
    :show="showConfirmation"
    title="ยืนยันการลบ Treatment"
    :message="treatmentToDelete ? `คุณต้องการลบ '${treatmentToDelete.name}' หรือไม่?` : 'คุณต้องการลบรายการนี้หรือไม่?'"
    confirm-text="ลบรายการ" 
    confirm-icon="mdi:trash-can-outline"
    icon="mdi:alert"
    icon-class="text-red-500"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  >
    <p class="text-sm text-gray-500 mb-3">การดำเนินการนี้ไม่สามารถย้อนกลับได้ และข้อมูลทั้งหมดของรายการนี้จะถูกลบออกจากระบบ</p>
  </CardConfirmation>
</template> -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import { useTreatmentStore } from '~/stores/treatment'
import { useAlertStore } from '~/stores/components/alert'
import CardConfirmation from '~/components/CardConfirmation.vue'
import type { CreateTreatmentRequest, UpdateTreatmentRequest, Fee } from '~/types/treatment'

// Initialize stores
const treatmentStore = useTreatmentStore()
const alertStore = useAlertStore()

// UI state
const showSort = ref(false)
const showModal = ref(false)
const showEditModal = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Add new treatment form data
const newTreatmentForm = ref<CreateTreatmentRequest>({
  name: '',
  price: 0,
  includeVat: true,
  doctorFee: {
    amount: 0,
    type: 'percentage'
  },
  assistantFee: {
    amount: 0,
    type: 'percentage'
  },
  clinicId: ''
})

// Edit treatment form data
const editTreatmentForm = ref<UpdateTreatmentRequest>({
  name: '',
  price: 0,
  includeVat: true,
  doctorFee: {
    amount: 0,
    type: 'percentage'
  },
  assistantFee: {
    amount: 0,
    type: 'percentage'
  },
  clinicId: ''
})

const editingTreatmentId = ref<string | null>(null)

// Confirmation dialog state
const showConfirmation = ref(false)
const treatmentToDelete = ref<{id: string, name: string} | null>(null)

// Fetch treatments on component mount
onMounted(async () => {
  await fetchTreatments()
})

// Reset form data
const resetNewForm = () => {
  newTreatmentForm.value = {
    name: '',
    price: 0,
    includeVat: true,
    doctorFee: {
      amount: 0,
      type: 'percentage'
    },
    assistantFee: {
      amount: 0,
      type: 'percentage'
    },
    clinicId: ''
  }
}

const resetEditForm = () => {
  editTreatmentForm.value = {
    name: '',
    price: 0,
    includeVat: true,
    doctorFee: {
      amount: 0,
      type: 'percentage'
    },
    assistantFee: {
      amount: 0,
      type: 'percentage'
    },
    clinicId: ''
  }
  editingTreatmentId.value = null
}

// Fetch treatments from API
const fetchTreatments = async () => {
  isLoading.value = true;
  
  try {
    await treatmentStore.fetchTreatments();
    error.value = null;
  } catch (err: any) {
    console.error('Error fetching treatments:', err);
    error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'การเชื่อมต่อล้มเหลว');
  } finally {
    isLoading.value = false;
  }
};

// Start delete treatment process
const startDelete = (treatment: { id: string, name: string }) => {
  treatmentToDelete.value = treatment;
  showConfirmation.value = true;
};

// Confirm delete treatment
const confirmDelete = async () => {
  if (!treatmentToDelete.value) return;
  
  isLoading.value = true;
  
  try {
    const success = await treatmentStore.deleteTreatment(treatmentToDelete.value.id);
    
    if (success) {
      alertStore.success(`ลบ "${treatmentToDelete.value.name}" สำเร็จ`, 'ลบข้อมูลสำเร็จ');
    } else {
      error.value = 'ไม่สามารถลบข้อมูลได้';
      alertStore.error('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error deleting treatment:', err);
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล';
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
    showConfirmation.value = false;
    treatmentToDelete.value = null;
  }
};

// Cancel delete
const cancelDelete = () => {
  showConfirmation.value = false;
  treatmentToDelete.value = null;
};

// Sort treatments A-Z
const sortAZ = () => {
  treatmentStore.sortTreatmentsAZ();
  showSort.value = false;
};

// Sort by price high to low
const sortPriceHighLow = () => {
  treatmentStore.sortTreatmentsPriceHighLow();
  showSort.value = false;
};

// Sort by price low to high
const sortPriceLowHigh = () => {
  treatmentStore.sortTreatmentsPriceLowHigh();
  showSort.value = false;
};

// Save new treatment
const saveNewTreatment = async () => {
  if (!newTreatmentForm.value.name.trim() || newTreatmentForm.value.price <= 0) {
    alertStore.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'ข้อมูลไม่ครบถ้วน');
    return;
  }

  isLoading.value = true;
  
  try {
    const result = await treatmentStore.createTreatment(newTreatmentForm.value);
    
    if (result) {
      alertStore.success(`เพิ่ม "${result.name}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ');
      resetNewForm();
      showModal.value = false;
    } else {
      alertStore.error('ไม่สามารถเพิ่มข้อมูลได้', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error creating treatment:', err);
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
  }
};

// Start edit treatment process
const startEdit = (treatment: any) => {
  editingTreatmentId.value = treatment.id;
  editTreatmentForm.value = {
    name: treatment.name,
    price: treatment.price,
    includeVat: treatment.includeVat || true,
    doctorFee: treatment.doctorFee || { amount: 0, type: 'percentage' },
    assistantFee: treatment.assistantFee || { amount: 0, type: 'percentage' },
    clinicId: treatment.clinicId
  };
  showEditModal.value = true;
};

// Save edited treatment
const saveEditTreatment = async () => {
  if (!editingTreatmentId.value || !editTreatmentForm.value.name.trim() || editTreatmentForm.value.price <= 0) {
    alertStore.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'ข้อมูลไม่ครบถ้วน');
    return;
  }
  
  isLoading.value = true;
  
  try {
    const result = await treatmentStore.updateTreatment(editingTreatmentId.value, editTreatmentForm.value);
    
    if (result) {
      alertStore.success(`แก้ไข "${result.name}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ');
      closeEditModal();
    } else {
      alertStore.error('ไม่สามารถแก้ไขข้อมูลได้', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error updating treatment:', err);
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
  }
};

// Close edit modal and reset states
const closeEditModal = () => {
  showEditModal.value = false;
  resetEditForm();
};

// Close add modal and reset form
const closeAddModal = () => {
  showModal.value = false;
  resetNewForm();
};

// Calculate display price with VAT
const calculateDisplayPrice = (price: number, includeVat: boolean) => {
  if (includeVat) {
    return price * 1.07;
  }
  return price;
};

// Format fee display
const formatFee = (fee: Fee) => {
  if (fee.type === 'percentage') {
    return `${fee.amount}%`;
  }
  return `${fee.amount.toLocaleString()} บาท`;
};
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm relative max-h-[calc(100vh-200px)] flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold text-gray-800">Treatment</h3>
        <div class="relative">
          <button
            class="text-xs text-blue-600 border border-blue-300 px-2 py-1 rounded-full hover:bg-blue-100"
            @click="showSort = !showSort"
          >
            sort by
            <Icon icon="mdi:chevron-up" class="inline w-4 h-4 ml-1" />
          </button>

          <!-- Sort Dropdown -->
          <div v-if="showSort" class="absolute z-10 mt-1 bg-white shadow-md rounded-md p-3 w-48 text-sm">
            <div class="text-gray-400 text-center text-xs mb-2">Sort By</div>
            <button class="w-full bg-blue-100 text-blue-700 px-2 py-1 rounded mb-2 hover:bg-blue-200" @click="sortAZ">
              A - Z
            </button>
            <button class="w-full bg-gray-100 text-gray-700 px-2 py-1 rounded mb-2 hover:bg-gray-200" @click="sortPriceHighLow">
              Price High to Low
            </button>
            <button class="w-full bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200" @click="sortPriceLowHigh">
              Price Low to High
            </button>
          </div>
        </div>
      </div>

      <button @click="showModal = true"
        class="flex rounded-lg items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">
        <Icon icon="mdi:add" class="w-4 h-4" />
        Add
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="treatmentStore.isLoading || isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error || treatmentStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:alert-circle" class="w-5 h-5 text-red-500" />
        <p class="font-medium">{{ error || treatmentStore.error }}</p>
      </div>
      <button class="mt-2 text-sm text-red-600 hover:text-red-800 underline" @click="fetchTreatments">
        ลองใหม่อีกครั้ง
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="treatmentStore.treatments.length === 0" class="py-8 text-center">
      <Icon icon="mdi:file-document-outline" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
      <h3 class="text-gray-700 font-medium mb-1">ยังไม่มีข้อมูล</h3>
      <p class="text-gray-500 text-sm">ไม่พบข้อมูล Treatment ในระบบ</p>
    </div>

    <!-- Scrollable List -->
    <div v-else class="overflow-y-auto pr-2 flex-1">
      <ul class="divide-y divide-gray-200">
        <li v-for="item in treatmentStore.treatments" :key="item.id"
          class="py-3 flex justify-between items-start text-sm text-gray-800">
          <div class="flex-1">
            <div class="font-medium text-gray-900">{{ item.name }}</div>
            <div class="text-gray-600 mt-1">
              <div>Price: {{ item.price.toLocaleString() }} บาท 
                <span v-if="item.includeVat" class="text-xs text-green-600">(รวม VAT 7%)</span>
                <span v-else class="text-xs text-red-600">(ไม่รวม VAT)</span>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                <span>Doctor Fee: {{ formatFee(item.doctorFee) }}</span>
                <span class="mx-2">•</span>
                <span>Assistant Fee: {{ formatFee(item.assistantFee) }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 ml-4">
            <!-- Edit Button -->
            <button
              @click="startEdit(item)"
              class="text-gray-400 hover:text-blue-500"
              title="แก้ไข"
            >
              <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
            </button>
            
            <!-- Delete Button -->
            <button 
              @click="startDelete({ id: item.id, name: item.name })"
              class="text-gray-400 hover:text-red-500" 
              title="ลบ"
            >
              <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- Add Modal -->
  <Modal :show="showModal" title="Add New Treatment" @close="closeAddModal">
    <div class="space-y-4">
      <!-- Treatment Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Treatment Name</label>
        <input
          v-model="newTreatmentForm.name"
          type="text"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter treatment name"
        />
      </div>

      <!-- Price -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Price (บาท)</label>
        <input
          v-model.number="newTreatmentForm.price"
          type="number"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter price"
          min="0"
        />
      </div>

      <!-- Include VAT Toggle -->
      <div>
        <label class="flex items-center space-x-3">
          <input
            v-model="newTreatmentForm.includeVat"
            type="checkbox"
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span class="text-sm font-medium text-gray-700">รวม VAT 7%</span>
        </label>
      </div>

      <!-- Doctor Fee -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Doctor Fee</label>
        <div class="flex gap-2">
          <input
            v-model.number="newTreatmentForm.doctorFee.amount"
            type="number"
            class="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
            min="0"
          />
          <select
            v-model="newTreatmentForm.doctorFee.type"
            class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">เปอร์เซ็นต์ (%)</option>
            <option value="fixed">จำนวนเงิน (บาท)</option>
          </select>
        </div>
      </div>

      <!-- Assistant Fee -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Assistant Fee</label>
        <div class="flex gap-2">
          <input
            v-model.number="newTreatmentForm.assistantFee.amount"
            type="number"
            class="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
            min="0"
          />
          <select
            v-model="newTreatmentForm.assistantFee.type"
            class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">เปอร์เซ็นต์ (%)</option>
            <option value="fixed">จำนวนเงิน (บาท)</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button @click="closeAddModal" 
          class="px-3 py-1 rounded-lg border border-gray-400 text-sm text-gray-600 hover:underline"
          :disabled="isLoading">
          Cancel
        </button>
        <button @click="saveNewTreatment" 
          class="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-1"
          :disabled="isLoading">
          <span v-if="isLoading" class="inline-block">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Adding...' : 'Add' }}
        </button>
      </div>
    </div>
  </Modal>
  
  <!-- Edit Modal -->
  <Modal :show="showEditModal" title="Edit Treatment" @close="closeEditModal">
    <div class="space-y-4">
      <!-- Treatment Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Treatment Name</label>
        <input
          v-model="editTreatmentForm.name"
          type="text"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter treatment name"
        />
      </div>

      <!-- Price -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Price (บาท)</label>
        <input
          v-model.number="editTreatmentForm.price"
          type="number"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter price"
          min="0"
        />
      </div>

      <!-- Include VAT Toggle -->
      <div>
        <label class="flex items-center space-x-3">
          <input
            v-model="editTreatmentForm.includeVat"
            type="checkbox"
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span class="text-sm font-medium text-gray-700">รวม VAT 7%</span>
        </label>
      </div>

      <!-- Doctor Fee -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Doctor Fee</label>
        <div class="flex gap-2">
          <input
            v-model.number="editTreatmentForm.doctorFee.amount"
            type="number"
            class="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
            min="0"
          />
          <select
            v-model="editTreatmentForm.doctorFee.type"
            class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">เปอร์เซ็นต์ (%)</option>
            <option value="fixed">จำนวนเงิน (บาท)</option>
          </select>
        </div>
      </div>

      <!-- Assistant Fee -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Assistant Fee</label>
        <div class="flex gap-2">
          <input
            v-model.number="editTreatmentForm.assistantFee.amount"
            type="number"
            class="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
            min="0"
          />
          <select
            v-model="editTreatmentForm.assistantFee.type"
            class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">เปอร์เซ็นต์ (%)</option>
            <option value="fixed">จำนวนเงิน (บาท)</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button @click="closeEditModal" 
          class="px-3 py-1 rounded-lg border border-gray-400 text-sm text-gray-600 hover:underline"
          :disabled="isLoading">
          Cancel
        </button>
        <button @click="saveEditTreatment" 
          class="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-1"
          :disabled="isLoading">
          <span v-if="isLoading" class="inline-block">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isLoading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </Modal>
  
  <!-- Confirmation dialog -->
  <CardConfirmation
    :show="showConfirmation"
    title="ยืนยันการลบ Treatment"
    :message="treatmentToDelete ? `คุณต้องการลบ '${treatmentToDelete.name}' หรือไม่?` : 'คุณต้องการลบรายการนี้หรือไม่?'"
    confirm-text="ลบรายการ" 
    confirm-icon="mdi:trash-can-outline"
    icon="mdi:alert"
    icon-class="text-red-500"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  >
    <p class="text-sm text-gray-500 mb-3">การดำเนินการนี้ไม่สามารถย้อนกลับได้ และข้อมูลทั้งหมดของรายการนี้จะถูกลบออกจากระบบ</p>
  </CardConfirmation>
</template>