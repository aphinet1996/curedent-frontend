<script setup lang="ts">
import Card from '~/components/Card.vue'

const incomes = [
  { label: 'Braces / Invisalign Full', value: '224,092.-', percent: 80, color: '#3b82f6' },     // blue-500
  { label: 'Necrotizing Ulcerative Stomatitis', value: '224,092.-', percent: 60, color: '#f87171' }, // red-400
  { label: 'Teeth Whitenings', value: '224,092.-', percent: 45, color: '#facc15' },             // yellow-400
  { label: 'Extractions', value: '224,092.-', percent: 50, color: '#8b5cf6' },                  // purple-500
  { label: 'Fillings', value: '224,092.-', percent: 90, color: '#22d3ee' },                     // cyan-400
  { label: 'Root Canal', value: '224,092.-', percent: 40, color: '#fda4af' }                    // pink-300
]
</script>

<template>
  <Card class="h-full w-full bg-white">
    <h2 class="text-lg font-semibold mb-4 md:text-sm">Income</h2>

    <div class="space-y-4">
      <div v-for="item in incomes" :key="item.label">
        <!-- Top row: label + value -->
        <div class="flex justify-between items-center mb-1">
          <div class="text-sm font-medium text-gray-800">{{ item.label }}</div>
          <div class="text-sm font-semibold text-gray-700">{{ item.value }}</div>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-gray-100 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full"
            :style="{
              width: item.percent + '%',
              backgroundColor: item.color
            }"
          />
        </div>
      </div>
    </div>
  </Card>
</template>