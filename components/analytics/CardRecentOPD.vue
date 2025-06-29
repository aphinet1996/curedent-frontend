<script setup lang="ts">
import Card from '~/components/Card.vue'
import { Icon } from '@iconify/vue'

// mock data
const opdList = [
  {
    icon: 'mdi:arrow-down-bold-circle',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Necrotizing Ulcerative Stomatitis',
    hn: '#12293289274',
    date: 'Apr 25, 23',
    status: 'Done'
  },
  {
    icon: 'mdi:swap-horizontal-bold',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    title: 'Necrotizing Ulcerative Stomatitis',
    hn: '#12293289274',
    date: 'Apr 25, 23',
    status: 'Done'
  },
  {
    icon: 'mdi:arrow-down-bold-circle',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    title: 'Necrotizing Ulcerative Stomatitis',
    hn: '#12293289274',
    date: 'Apr 25, 23',
    status: 'Done'
  }
]
</script>

<template>
  <Card class="bg-white">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-lg md:text-sm">Recent OPD</h2>
      <a href="#" class="text-sm text-blue-500 hover:underline">View all</a>
    </div>

    <div class="space-y-4">
      <div v-for="(item, index) in opdList" :key="index" class="flex items-center justify-between">
        <!-- Left -->
        <div class="flex items-start gap-3">
          <div :class="['p-2 rounded-full', item.iconBg]">
            <Icon :icon="item.icon" :class="[item.iconColor, 'w-5 h-5']" />
          </div>
          <div>
            <div class="font-semibold text-sm text-gray-900">{{ item.title }}</div>
            <div class="text-xs text-gray-500">HN {{ item.hn }} | {{ item.date }}</div>
          </div>
        </div>

        <!-- Right -->
        <div class="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Icon icon="mdi:check-circle-outline" class="w-4 h-4" />
          <span>{{ item.status }}</span>
        </div>
      </div>
    </div>
  </Card>
</template>