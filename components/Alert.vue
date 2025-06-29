<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useAlertStore } from '~/stores/components/alert';

const alertStore = useAlertStore();
const alerts = computed(() => alertStore.alerts);

// สีของ alert ตามประเภท
const alertColors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-500'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-500'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500'
  }
};

// คำนวณการแสดงผลตามประเภท
const getAlertStyle = (type: string = 'info') => {
  const alertType = type as keyof typeof alertColors;
  return alertColors[alertType] || alertColors.info;
};

// ปิด alert
const closeAlert = (id: string) => {
  alertStore.hide(id);
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end max-w-xs sm:max-w-sm w-full">
      <TransitionGroup name="alert">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="[
            'rounded-lg p-4 border shadow-sm w-full max-w-sm flex items-start gap-3',
            getAlertStyle(alert.type).bg,
            getAlertStyle(alert.type).border,
            getAlertStyle(alert.type).text
          ]"
        >
          <!-- Icon -->
          <div :class="['flex-shrink-0 mt-0.5', getAlertStyle(alert.type).icon]">
            <Icon :icon="alert.icon || 'mdi:information'" class="w-5 h-5" />
          </div>
          
          <!-- Content -->
          <div class="flex-1">
            <h3 v-if="alert.title" class="font-medium mb-1">{{ alert.title }}</h3>
            <p class="text-sm">{{ alert.message }}</p>
          </div>
          
          <!-- Close button -->
          <button 
            @click="closeAlert(alert.id as string)" 
            class="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <Icon icon="mdi:close" class="w-5 h-5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}
.alert-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.alert-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>