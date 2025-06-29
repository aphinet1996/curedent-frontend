<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface ButtonProps {
  label?: string
  icon?: string
  buttonType?: 'button' | 'submit' | 'reset'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  iconOnly?: boolean
  disabled?: boolean
  fullWidth?: boolean
  customClasses?: string
  customStyle?: Record<string, any>
}

// กำหนด props ด้วย interface แบบ TypeScript
const props = withDefaults(defineProps<ButtonProps>(), {
  label: '',
  icon: '',
  buttonType: 'button',
  size: 'md',
  variant: 'primary',
  iconOnly: false,
  disabled: false,
  fullWidth: false,
  customClasses: '',
  customStyle: () => ({})
})

const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition focus:outline-none'

const sizeClass = {
  xs: 'px-1.5 py-1 text-xs',
  sm: 'px-2.5 py-1 text-sm',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

const variantClass = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100'
}

// Define emits if needed
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button 
    :type="buttonType" 
    :disabled="disabled" 
    :class="[
      baseClass,
      sizeClass[size],
      variantClass[variant],
      iconOnly ? 'p-2' : '',
      fullWidth ? 'w-full' : '',
      customClasses
    ]" 
    :style="customStyle"
    @click="(event) => emit('click', event)"
  >
    <Icon v-if="icon" :icon="icon" class="w-4 h-4" />
    <span v-if="label && !iconOnly" :class="[icon ? 'ml-2' : '']">{{ label }}</span>
    <slot />
  </button>
</template>