<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import { useDiagnosisStore } from '~/stores/diagnosis'
import { useAlertStore } from '~/stores/components/alert'
import CardConfirmation from '~/components/CardConfirmation.vue'
import { diagnosisService } from '~/services/diagnosis'

// Initialize stores
const diagnosisStore = useDiagnosisStore()
const alertStore = useAlertStore()

// UI state
const showSort = ref(false)
const showModal = ref(false)
const showEditModal = ref(false)
const newDiagnosis = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

// Edit state
const editingDiagnosis = ref<{id: string, name: string} | null>(null)
const editName = ref('')

// Confirmation dialog state
const showConfirmation = ref(false)
const diagnosisToDelete = ref<{id: string, name: string} | null>(null)

// Fetch diagnoses on component mount
onMounted(async () => {
  await fetchDiagnoses()
})

// Fetch diagnoses from API
const fetchDiagnoses = async () => {
  isLoading.value = true;
  
  try {
    const response = await diagnosisService.getDiagnoses();
    
    if (response && response.status === 'success') {
      await diagnosisStore.fetchDiagnoses();
      error.value = null;
    } else {
      error.value = 'ไม่สามารถดึงข้อมูลได้';
      alertStore.error('ไม่สามารถดึงข้อมูลได้', 'การเชื่อมต่อล้มเหลว');
    }
  } catch (err: any) {
    console.error('Error fetching diagnoses:', err);
    error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'การเชื่อมต่อล้มเหลว');
  } finally {
    isLoading.value = false;
  }
};

// Start delete diagnosis process
const startDelete = (diagnosis: { id: string, name: string }) => {
  diagnosisToDelete.value = diagnosis;
  showConfirmation.value = true;
};

// Confirm delete diagnosis
const confirmDelete = async () => {
  if (!diagnosisToDelete.value) return;
  
  isLoading.value = true;
  
  try {
    const response = await diagnosisService.deleteDiagnosis(diagnosisToDelete.value.id);
    
    if (response && response.status === 'success') {
      // Remove from local state
      if (diagnosisStore.diagnoses) {
        diagnosisStore.diagnoses = diagnosisStore.diagnoses.filter(
          d => d.id !== diagnosisToDelete.value?.id
        );
      }
      
      alertStore.success(`ลบ "${diagnosisToDelete.value.name}" สำเร็จ`, 'ลบข้อมูลสำเร็จ');
    } else {
      error.value = 'ไม่สามารถลบข้อมูลได้';
      alertStore.error('ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error deleting diagnosis:', err);
    error.value = 'เกิดข้อผิดพลาดในการลบข้อมูล';
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
    showConfirmation.value = false;
    diagnosisToDelete.value = null;
  }
};

// Cancel delete
const cancelDelete = () => {
  showConfirmation.value = false;
  diagnosisToDelete.value = null;
};

// Sort diagnoses A-Z
const sortAZ = () => {
  diagnosisStore.sortDiagnosesAZ();
  showSort.value = false;
};

// Sort diagnoses Z-A (reverse)
const sortByCategories = () => {
  diagnosisStore.sortDiagnosesZA();
  showSort.value = false;
};

// Save new diagnosis
const saveNewDiagnosis = async () => {
  if (newDiagnosis.value.trim()) {
    isLoading.value = true;
    
    try {
      const response = await diagnosisService.createDiagnosis(newDiagnosis.value.trim());
      
      if (response && response.status === 'success') {
        // Update local state by re-fetching the diagnoses or adding the new one
        await diagnosisStore.fetchDiagnoses();
        
        alertStore.success(`เพิ่ม "${response.data.diagnosis.name}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ');
        newDiagnosis.value = '';
        showModal.value = false;
      } else {
        alertStore.error('ไม่สามารถเพิ่มข้อมูลได้', 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      console.error('Error creating diagnosis:', err);
      alertStore.error(err.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'เกิดข้อผิดพลาด');
    } finally {
      isLoading.value = false;
    }
  }
};

// Start edit diagnosis process
const startEdit = async (diagnosis: { id: string, name: string }) => {
  isLoading.value = true;
  
  try {
    // Get the latest data from API
    const response = await diagnosisService.getDiagnosisById(diagnosis.id);
    
    if (response && response.status === 'success') {
      editingDiagnosis.value = response.data.diagnosis;
      editName.value = response.data.diagnosis.name;
      showEditModal.value = true;
    } else {
      alertStore.error('ไม่สามารถดึงข้อมูลได้', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error fetching diagnosis details:', err);
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
  }
};

// Save edited diagnosis
const saveEditDiagnosis = async () => {
  if (!editingDiagnosis.value || !editName.value.trim()) return;
  
  isLoading.value = true;
  
  try {
    const response = await diagnosisService.updateDiagnosis(
      editingDiagnosis.value.id, 
      editName.value.trim()
    );
    
    if (response && response.status === 'success') {
      // Update local state by re-fetching or updating locally
      await diagnosisStore.fetchDiagnoses();
      
      alertStore.success(`แก้ไข "${response.data.diagnosis.name}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ');
      closeEditModal();
    } else {
      alertStore.error('ไม่สามารถแก้ไขข้อมูลได้', 'เกิดข้อผิดพลาด');
    }
  } catch (err: any) {
    console.error('Error updating diagnosis:', err);
    alertStore.error(err.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
  }
};

// Close edit modal and reset states
const closeEditModal = () => {
  showEditModal.value = false;
  editingDiagnosis.value = null;
  editName.value = '';
};
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm relative">
    <!-- Header -->
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold text-gray-800">Diagnosis</h3>
        <div class="relative">
          <button
            class="text-xs text-blue-600 border border-blue-300 px-2 py-1 rounded-full hover:bg-blue-100"
            @click="showSort = !showSort"
          >
            sort by
            <Icon icon="mdi:chevron-up" class="inline w-4 h-4 ml-1" />
          </button>

          <!-- Dropdown -->
          <div v-if="showSort" class="absolute z-10 mt-1 bg-white shadow-md rounded-md p-3 w-44 text-sm">
            <div class="text-gray-400 text-center text-xs mb-2">Sort By</div>
            <button
              class="w-full bg-blue-100 text-blue-700 px-2 py-1 rounded mb-2 hover:bg-blue-200"
              @click="sortAZ"
            >
              A - Z
            </button>
            <button
              class="w-full bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
              @click="sortByCategories"
            >
              Z - A
            </button>
          </div>
        </div>
      </div>

      <!-- Open Modal -->
      <button
        @click="showModal = true"
        class="flex rounded-lg items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
      >
        <Icon icon="mdi:add" class="w-4 h-4" />
        Add
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="diagnosisStore.isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:alert-circle" class="w-5 h-5 text-red-500" />
        <p class="font-medium">{{ error }}</p>
      </div>
      <button class="mt-2 text-sm text-red-600 hover:text-red-800 underline" @click="fetchDiagnoses">
        ลองใหม่อีกครั้ง
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="diagnosisStore.diagnoses.length === 0" class="py-8 text-center">
      <Icon icon="mdi:file-document-outline" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
      <h3 class="text-gray-700 font-medium mb-1">ยังไม่มีข้อมูล</h3>
      <p class="text-gray-500 text-sm">ไม่พบข้อมูล Diagnosis ในระบบ</p>
    </div>

    <!-- Diagnosis List -->
    <ul v-else class="divide-y divide-gray-200">
      <li
        v-for="diagnosis in diagnosisStore.diagnoses"
        :key="diagnosis.id"
        class="py-2 flex justify-between items-center text-sm text-gray-800"
      >
        <span class="break-words">{{ diagnosis.name }}</span>
        <div class="flex items-center gap-2">
          <!-- Edit Button -->
          <button
            @click="startEdit({ id: diagnosis.id, name: diagnosis.name })"
            class="text-gray-400 hover:text-blue-500"
            title="แก้ไข"
          >
            <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
          </button>
          
          <!-- Delete Button -->
          <button
            @click="startDelete({ id: diagnosis.id, name: diagnosis.name })"
            class="text-gray-400 hover:text-red-500"
            title="ลบ"
          >
            <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
          </button>
        </div>
      </li>
    </ul>
  </div>

  <!-- Add Modal -->
  <Modal :show="showModal" title="Add New Diagnosis" @close="showModal = false">
    <div class="space-y-3">
      <input
        v-model="newDiagnosis"
        type="text"
        class="w-full border rounded-md px-3 py-2 text-sm "
        placeholder="Enter diagnosis name"
        @keyup.enter="saveNewDiagnosis"
      />
      <div class="flex justify-end gap-2 mt-2">
        <button @click="showModal = false" 
          class="px-3 py-1 rounded-lg border border-gray-400 text-sm text-gray-600 hover:underline"
          :disabled="isLoading">
          Cancel
        </button>
        <button @click="saveNewDiagnosis" 
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
  <Modal :show="showEditModal" title="Edit Diagnosis" @close="closeEditModal">
    <div class="space-y-3">
      <input
        v-model="editName"
        type="text"
        class="w-full border rounded-md px-3 py-2 text-sm"
        placeholder="Enter diagnosis name"
        @keyup.enter="saveEditDiagnosis"
      />
      <div class="flex justify-end gap-2 mt-2">
        <button @click="closeEditModal" 
          class="px-3 py-1 rounded-lg border border-gray-400 text-sm text-gray-600 hover:underline"
          :disabled="isLoading">
          Cancel
        </button>
        <button @click="saveEditDiagnosis" 
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
    title="ยืนยันการลบ Diagnosis"
    :message="diagnosisToDelete ? `คุณต้องการลบ '${diagnosisToDelete.name}' หรือไม่?` : 'คุณต้องการลบรายการนี้หรือไม่?'"
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