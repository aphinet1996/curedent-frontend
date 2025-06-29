<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useBranchStore } from '~/stores/branch';
import { useAlertStore } from '~/stores/components/alert';
import type { Branch } from '~/types/branch';
import CardConfirmation from '../../CardConfirmation.vue';

// Initialize store
const branchStore = useBranchStore();
const alertStore = useAlertStore();
const branches = ref<Branch[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const showConfirmation = ref(false);
const branchToDelete = ref<{ id: string, name: string } | null>(null);

// Define emits
const emit = defineEmits(['openAddForm', 'openEditForm']);

// Fetch branches method that can be called directly
const fetchBranches = async () => {
  isLoading.value = true;

  try {
    // Fetch branches from the API
    await branchStore.fetchBranches();
    branches.value = branchStore.branches || [];
    error.value = null;
  } catch (err) {
    console.error('Error fetching branches:', err);
    error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูลสาขา';
    alertStore.error('เกิดข้อผิดพลาดในการดึงข้อมูลสาขา', 'การเชื่อมต่อล้มเหลว');
  } finally {
    isLoading.value = false;
  }
};

// Fetch branches on component mount
onMounted(fetchBranches);

// Watch branchStore.branches for any changes to update the local branches
watch(() => branchStore.branches, (newBranches) => {
  branches.value = newBranches || [];
}, { deep: true });

// Delete branch
const startDelete = (branch: Branch) => {
  branchToDelete.value = {
    id: branch.id,
    name: branch.name
  };
  showConfirmation.value = true;
};

const confirmDelete = async () => {
  if (!branchToDelete.value) return;

  isLoading.value = true;

  try {
    // Call the delete action from the store
    const success = await branchStore.deleteBranch(branchToDelete.value.id);

    if (success) {
      // Update the local branches array
      branches.value = branches.value.filter(b => b.id !== branchToDelete.value?.id);
      alertStore.success(`ลบสาขา "${branchToDelete.value.name}" สำเร็จ`, 'ลบข้อมูลสำเร็จ');
    } else {
      error.value = 'ไม่สามารถลบสาขาได้';
      alertStore.error('ไม่สามารถลบสาขาได้ กรุณาลองใหม่อีกครั้ง', 'เกิดข้อผิดพลาด');
    }
  } catch (err) {
    console.error('Error removing branch:', err);
    error.value = 'เกิดข้อผิดพลาดในการลบสาขา';
    alertStore.error('เกิดข้อผิดพลาดในการลบสาขา', 'เกิดข้อผิดพลาด');
  } finally {
    isLoading.value = false;
    showConfirmation.value = false;
    branchToDelete.value = null;
  }
};

const cancelDelete = () => {
  showConfirmation.value = false;
  branchToDelete.value = null;
};

// Toggle branch selection
const toggleSelection = (branch: Branch) => {
  branch.selected = !branch.selected;
  branchStore.toggleBranchSelection(branch.id);
};
</script>

<template>
  <div class="space-y-3">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p class="mt-3 text-gray-500 text-sm">กำลังโหลดข้อมูล...</p>
      </div>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:alert-circle" class="w-5 h-5 text-red-500" />
        <p class="font-medium">{{ error }}</p>
      </div>
      <button class="mt-2 text-sm text-red-600 hover:text-red-800 underline" @click="fetchBranches">
        ลองใหม่อีกครั้ง
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="branches.length === 0" class="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
      <Icon icon="mdi:store-off" class="w-16 h-16 text-gray-300 mx-auto mb-3" />
      <h3 class="text-gray-700 font-medium mb-1">ยังไม่มีข้อมูล</h3>
      <p class="text-gray-500 text-sm">ไม่พบข้อมูลสาขาในระบบ</p>
      <button
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm inline-flex items-center gap-1 hover:bg-blue-600 transition-colors"
        @click="$emit('openAddForm')">
        <Icon icon="mdi:plus" class="w-4 h-4" />
        เพิ่มสาขาใหม่
      </button>
    </div>

    <!-- Branch cards -->
    <div v-else v-for="branch in branches" :key="branch.id" :class="[
      'bg-white p-4 rounded-xl shadow-sm border flex justify-between items-start gap-4 relative hover:border-blue-200 transition-colors',
      branch.selected ? 'bg-blue-50 border-blue-200' : 'border-gray-100'
    ]" @click="toggleSelection(branch)">
      <!-- Left Info -->
      <div class="flex items-start gap-3 max-w-[60%]">
        <div
          class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
          <span v-if="!branch.photo" class="text-gray-400 text-lg font-medium">{{ branch.name.charAt(0) }}</span>
          <img v-else :src="branch.photo" alt="Branch logo" class="w-full h-full object-cover" />
        </div>
        <div class="space-y-1 min-w-0">
          <div :class="['font-semibold text-sm truncate', branch.selected ? 'text-blue-600' : 'text-gray-800']"
            :title="branch.name">
            {{ branch.name }}
          </div>
          <div class="text-xs text-gray-500 flex items-center gap-1">
            <Icon icon="mdi:map-marker" class="w-4 h-4 shrink-0 text-gray-400" />
            <span class="truncate" :title="branch.address || branch.fullAddress">
              {{ branch.address || branch.fullAddress }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right Info -->
      <div class="text-right text-xs text-gray-600 space-y-1.5 ml-auto mr-14">
        <div class="flex items-center justify-end gap-1">
          <Icon icon="mdi:calendar-month" class="w-4 h-4 text-gray-400" />
          <span class="font-medium">เข้าร่วมเมื่อ:</span>
          {{ branch.dateJoined || new Date(branch.createdAt).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }) }}
        </div>
        <div class="flex items-center justify-end gap-1">
          <Icon icon="mdi:currency-usd" class="w-4 h-4 text-gray-400" />
          <span class="font-medium">รายได้ 3 เดือนล่าสุด:</span>
          ฿{{ (branch.revenue || 0).toLocaleString() }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        <!-- Edit Button -->
        <button @click.stop="emit('openEditForm', branch.id)"
          class="text-gray-400 hover:text-blue-500 p-2 rounded-md hover:bg-blue-50 transition-colors" title="แก้ไขสาขา">
          <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
        </button>

        <!-- Delete Button -->
        <button @click.stop="startDelete(branch)"
          class="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-red-50 transition-colors" title="ลบสาขา">
          <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Confirmation dialog -->
    <CardConfirmation
      :show="showConfirmation"
      title="ยืนยันการลบสาขา"
      :message="branchToDelete ? `คุณต้องการลบสาขา '${branchToDelete.name}' หรือไม่?` : 'คุณต้องการลบสาขานี้หรือไม่?'"
      confirm-text="ลบสาขา"
      confirm-icon="mdi:trash-can-outline"
      icon="mdi:alert"
      icon-class="text-red-500"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    >
      <p class="text-sm text-gray-500 mb-3">การดำเนินการนี้ไม่สามารถย้อนกลับได้ และข้อมูลทั้งหมดของสาขานี้จะถูกลบออกจากระบบ</p>
    </CardConfirmation>
  </div>
</template>