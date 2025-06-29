<script setup lang="ts">
definePageMeta({
  layout: 'main'
})
import { Icon } from '@iconify/vue'
import ChartProfit from '~/components/revenue/ChartProfit.vue'
import CardProfit from '~/components/revenue/CardProfit.vue'
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-2 py-2 space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-2 text-xl font-semibold text-gray-800">
      <Icon icon="tdesign:chart-analytics" class="w-6 h-6 text-blue-600" />
      Revenue Overview
    </div>

    <!-- Profit Analytics Chart & Summary -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Chart -->
      <div class="xl:col-span-2 lg:col-span-1">
        <ChartProfit />
      </div>

      <!-- Profit Summary Cards -->
      <!-- <div class="h-full w-full"> -->
      <div class="h-full w-full max-w-md xl:max-w-none">
        <CardProfit />
      </div>
    </div>

    <!-- Footer -->
    <div class="text-xs text-gray-400 mt-6 flex justify-between">
      <span>Duration: Dec 2022 - Present</span>
      <span>Updated: 10 July 2023, 11:13 AM</span>
    </div>
  </div>
</template>