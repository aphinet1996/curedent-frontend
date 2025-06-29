<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  customClasses: { type: String, default: '' },
  customStyle: { type: Object as () => Record<string, any>, default: () => ({}) }
})
</script>

<template>
  <div :class="['bg-white rounded-lg shadow p-4', customClasses]" :style="customStyle">
    <div class="flex items-center justify-between mb-3" v-if="icon || title || $slots.headerRight">
      <div class="flex items-center gap-2" v-if="icon || title">
        <Icon v-if="icon" :icon="icon" class="w-5 h-5 text-blue-600" />
        <h2 v-if="title" class="text-base text-gray-800 xl:text-[12px] 2xl:text-sm">{{ title }}</h2>
      </div>

      <div v-if="$slots.headerRight">
        <slot name="headerRight" />
      </div>
    </div>

    <slot />
  </div>
</template>