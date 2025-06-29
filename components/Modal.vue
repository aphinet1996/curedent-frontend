<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  show: boolean
  title?: string
  icon?: string
  widthClass?: string
  fullscreen?: boolean
}>()

const emit = defineEmits(['close'])

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        :class="[
          'bg-white rounded-xl shadow-lg transition-all',
          fullscreen ? 'w-full h-full max-w-none' : 'w-full',
          fullscreen ? 'rounded-none' : 'rounded-xl',
          widthClass ?? 'max-w-md',
          'p-6'
        ]"
      >
        <div class="mb-4 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <Icon v-if="props.icon" :icon="props.icon" class="w-5 h-5 text-blue-600" />
            <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="overflow-auto max-h-[80vh]">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>