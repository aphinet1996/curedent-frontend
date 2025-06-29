<script setup lang="ts">
import { computed } from 'vue'
import Card from '~/components/Card.vue'

const props = defineProps({
  label: String,
  value: [String, Number],
  difference: [String, Number, null],
  highlightColor: { type: String, default: '' },
  customClasses: { type: String, default: '' },
  customStyle: { type: Object as () => Record<string, any>, default: () => ({}) }
})

// const differenceNumber = computed(() => {
//   if (props.difference === null) return 0
//   return typeof props.difference === 'string' ? parseFloat(props.difference) : props.difference
// })

const differenceNumber = computed(() => {
  if (props.difference === null || props.difference === undefined) return 0
  return typeof props.difference === 'string'
    ? parseFloat(props.difference)
    : props.difference
})

const hasDifference = computed(() => props.difference !== null && props.difference !== undefined)

const formatDifference = computed(() => Math.abs(differenceNumber.value).toFixed(2))
// const formatDifference = computed(() => Math.abs(differenceNumber.value ?? 0).toFixed(2))

const differenceClass = computed(() => {
  if (!hasDifference.value) return ''
  if (differenceNumber.value > 0) return 'bg-green-100 text-green-600'
  if (differenceNumber.value < 0) return 'bg-red-100 text-red-600'
  return 'bg-gray-100 text-gray-600'
})
</script>

<template>
  <Card :customClasses="`relative bg-white pl-4 pr-4 py-3 md:py-4 lg:py-6 ${customClasses}`" :customStyle="customStyle">
    <!-- Left Strip -->
    <div v-if="highlightColor" class="absolute top-0 left-0 w-1 h-full rounded-l"
         :style="{ backgroundColor: highlightColor }" />

    <!-- Badge -->
    <div v-if="hasDifference"
         class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] md:text-xs px-1.5 py-0.5 md:px-1 md:py-1 rounded-sm flex items-center shadow"
         :class="differenceClass">
      <span v-if="differenceNumber > 0">▲</span>
      <span v-else-if="differenceNumber < 0">▼</span>
      <span class="ml-1">{{ formatDifference }}%</span>
    </div>

    <!-- Content -->
    <div class="text-xs md:text-xs text-gray-500">{{ label }}</div>
    <div class="text-xl md:text-sm font-bold mt-1 break-words">{{ value }}</div>
  </Card>
</template>