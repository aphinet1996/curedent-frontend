<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { onMounted, onUnmounted } from 'vue';
import Card from '~/components/Card.vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'คุณแน่ใจหรือไม่?' },
  message: { type: String, default: 'คุณต้องการดำเนินการนี้หรือไม่' },
  confirmText: { type: String, default: 'ยืนยัน' },
  cancelText: { type: String, default: 'ยกเลิก' },
  confirmIcon: { type: String, default: 'mdi:check' },
  cancelIcon: { type: String, default: 'mdi:close' },
  confirmButtonClass: { type: String, default: 'bg-red-500 hover:bg-red-600' },
  cancelButtonClass: { type: String, default: 'bg-gray-400 hover:bg-gray-500' },
  icon: { type: String, default: 'mdi:alert-circle' },
  iconClass: { type: String, default: 'text-red-500' },
  widthClass: { type: String, default: 'max-w-md' },
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};

// ESC key handler
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    handleCancel();
  }
};

onMounted(() => window.addEventListener('keydown', handleEsc));
onUnmounted(() => window.removeEventListener('keydown', handleEsc));
</script>

<template>
  <ClientOnly>
    <Teleport to="body" :disabled="!show">
      <div v-if="show" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <Card :custom-classes="'overflow-hidden'">
          <template #headerRight>
          </template>
          
          <div class="p-2">
            <!-- Header with icon and message -->
            <div class="flex items-start mb-4">
              <div :class="['rounded-full p-2 mr-3', iconClass.includes('bg-') ? iconClass : 'bg-red-50']">
                <Icon :icon="icon" :class="['w-6 h-6', !iconClass.includes('bg-') ? iconClass : 'text-red-500']" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
              </div>
            </div>

            <!-- Slot for additional content -->
            <div v-if="$slots.default" class="overflow-auto max-h-[60vh]">
              <slot></slot>
            </div>

            <!-- Action buttons -->
            <div class="mt-5 flex justify-end gap-2">
              <button @click="handleCancel"
                :class="['inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500', cancelButtonClass]">
                <Icon v-if="cancelIcon" :icon="cancelIcon" class="w-4 h-4 mr-1.5" />
                {{ cancelText }}
              </button>
              <button @click="handleConfirm"
                :class="['inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500', confirmButtonClass]">
                <Icon v-if="confirmIcon" :icon="confirmIcon" class="w-4 h-4 mr-1.5" />
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Teleport>
    
    <!-- Fallback สำหรับแสดงขณะ Client-side ยังไม่พร้อม -->
    <template #fallback>
      <!-- ไม่จำเป็นต้องแสดงอะไรในที่นี้ เนื่องจากเป็น modal -->
    </template>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>