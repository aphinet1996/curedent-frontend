<script setup lang="ts">
import { ref } from 'vue'
import Card from '~/components/Card.vue'

const series = [
  {
    name: 'CURRENT PROFIT',
    data: [25000, 22000, 18000, 68000, 55000, 78000, 90000, 220342.76]
  },
  {
    name: 'POTENTIAL PROFIT',
    data: [30000, 28000, 45000, 55000, 60000, 72000, 82000, 250035.5]
  }
]

const chartOptions = {
  chart: {
    type: 'area',
    height: 320,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  xaxis: {
    categories: ['DEC 22', 'JAN 23', 'FEB 23', 'MAR 23', 'APR 23', 'MAY 23', 'JUN 23', 'JUL 23'],
    labels: {
      style: { fontSize: '12px', colors: '#9CA3AF' }
    }
  },
  yaxis: {
    labels: {
      formatter: (val: number) => val.toLocaleString(),
      style: { fontSize: '12px', colors: '#9CA3AF' }
    }
  },
  colors: ['#10b981', '#3b82f6'],
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    labels: {
      colors: ['#111827']
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100]
    }
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy'
    },
    y: {
      formatter: (val: number) => `${val.toLocaleString()}`
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
    <h2 class="text-sm font-semibold text-gray-700 mb-2">PROFIT</h2>
    <ClientOnly>
      <apexchart type="area" height="320" :options="chartOptions" :series="series" />
    </ClientOnly>
    <div class="text-xs text-gray-400 mt-2">MONTH</div>
  </Card>
</template>
