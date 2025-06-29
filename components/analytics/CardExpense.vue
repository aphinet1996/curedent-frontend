<script setup lang="ts">
// import { ClientOnly } from '#components'
import Card from '~/components/Card.vue'

const labels = ['02/09', '03/09', '04/09', '05/09', '06/09', '07/09', '08/09']
const series = [
  {
    name: 'DF',
    data: [2000, 3000, 4000, 2500, 2000, 0, 5000]
  },
  {
    name: 'HR',
    data: [500, 1000, 800, 1000, 500, 0, 800]
  },
  {
    name: 'Material',
    data: [2500, 2000, 3000, 2000, 1000, 0, 1200]
  },
  {
    name: 'Equipment',
    data: [1000, 2000, 3000, 0, 2000, 4000, 0]
  }
]

const colors = ['#8b5cf6', '#10b981', '#f97316', '#e5e7eb']

const chartOptions = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 3,
      columnWidth: '40%'
    }
  },
  stroke: {
    width: 0
  },
  xaxis: {
    categories: labels,
    labels: {
      style: { fontSize: '12px' }
    }
  },
  yaxis: {
    labels: {
      formatter: val => val.toFixed(0)
    }
  },
  colors,
  legend: {
    show: false
  },
  tooltip: {
    y: {
      formatter: val => `${val.toLocaleString()}`
    }
  },
  grid: {
    strokeDashArray: 4
  },
  dataLabels: {
    enabled: false
  }
}
</script>

<template>
  <Card class="bg-white">
    <!-- Header -->
    <div class="flex justify-between items-start mb-2">
      <h2 class="font-semibold text-lg md:text-sm">Expense</h2>
      <div class="flex gap-4 text-sm flex-wrap">
        <div class="flex items-center gap-1" v-for="(s, i) in series" :key="s.name">
          <div :style="{ backgroundColor: colors[i] }" class="w-3 h-3 rounded-full"></div>
          <span class="text-sm md:text-xs">{{ s.name }}</span>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="h-[240px]">
      <ClientOnly>
        <apexchart type="bar" height="80%" :options="chartOptions" :series="series" />
      </ClientOnly>
    </div>

    <!-- Footer -->
    <div class="flex justify-between mt-4 text-sm">
      <span class="text-gray-500 md:text-xs">Weekly Spendings</span>
      <span class="font-semibold text-black md:text-xs">
        350,000.00 / <span class="text-indigo-500 md:text-xs">640,000.00</span>
      </span>
    </div>
  </Card>
</template>