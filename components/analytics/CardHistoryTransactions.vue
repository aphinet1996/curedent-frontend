<script setup lang="ts">
import Card from '~/components/Card.vue'
import { Icon } from '@iconify/vue'

// ข้อมูล mock
const transactions = [
  {
    icon: 'mdi:arrow-down-bold-circle',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Installment',
    date: 'Apr 25, 23 | 13.43 PM',
    amount: '+ $874',
    amountColor: 'text-green-500'
  },
  {
    icon: 'mdi:swap-horizontal-bold',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    title: 'Buy toothbrush (100 pcs.)',
    date: 'Apr 25, 23',
    amount: '- $2490',
    amountColor: 'text-red-500'
  },
  {
    icon: 'mdi:arrow-down-bold-circle',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    title: 'Buy toothbrush (100 pcs.)',
    date: 'Apr 25, 23',
    amount: '+ $126',
    amountColor: 'text-green-500'
  }
]
</script>

<template>
  <Card class="bg-white">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-lg md:text-sm">History Transactions</h2>
      <a href="#" class="text-sm text-blue-500 hover:underline">View all</a>
    </div>

    <div class="space-y-4">
      <div
        v-for="(item, index) in transactions"
        :key="index"
        class="flex items-start justify-between"
      >
        <!-- Left section -->
        <div class="flex items-start gap-3">
          <div :class="['p-2 rounded-full', item.iconBg]">
            <Icon :icon="item.icon" :class="[item.iconColor, 'w-5 h-5']" />
          </div>
          <div>
            <div class="font-semibold text-sm text-gray-900">{{ item.title }}</div>
            <div class="text-xs text-gray-500">{{ item.date }}</div>
          </div>
        </div>

        <!-- Right section -->
        <div :class="['text-sm font-semibold', item.amountColor]">
          {{ item.amount }}
        </div>
      </div>
    </div>
  </Card>
</template>