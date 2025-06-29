<script setup lang="ts">
definePageMeta({
  layout: 'main'
})
import { Icon } from '@iconify/vue'
import CardDailyIncome from '~/components/cost/CardDailyIncome.vue'
import CardDailyExpense from '~/components/cost/CardDailyExpense.vue'
import CardEquipment from '~/components/cost/CardEquipment.vue'
import TableCost from '~/components/cost/TableCost.vue'
</script>

<template>
  <div class="max-w-screen-3xl mx-auto px-2 py-2">
    <div class="flex items-center gap-2 text-xl font-semibold text-gray-800">
      <Icon icon="streamline:dollar-coin" class="w-6 h-6 text-blue-600" />
      Cost
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 h-[calc(100vh-150px)]">
      
      <!-- Left: Table -->
      <div class="overflow-y-auto">
        <TableCost />
      </div>

      <!-- Right: Summary Cards -->
      <div class="flex flex-col gap-4 h-full">
        <!-- Top: Income & Expense -->
        <div class="grid grid-cols-2 gap-4">
          <CardDailyIncome />
          <CardDailyExpense />
        </div>

        <!-- Bottom: Equipment -->
        <div class="flex-1 overflow-y-auto">
          <CardEquipment />
        </div>
      </div>
      
    </div>
  </div>
</template>