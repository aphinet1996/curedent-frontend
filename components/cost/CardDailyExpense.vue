<script setup lang="ts">
import { ref } from 'vue'

const expense = ref(220342.76)
const date = ref('02 / 09 /2023')

const chartOptions = {
    chart: {
        id: 'daily-expense',
        type: 'area',
        height: 160,
        sparkline: { enabled: true },
        toolbar: { show: false }
    },
    colors: ['#ef4444'],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.05,
            stops: [0, 90, 100]
        }
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    tooltip: {
        x: { format: 'dd MMM HH:mm' },
        y: {
            formatter: (val: number) => `$${val.toLocaleString()}`
        },
        marker: { show: false },
        custom: ({ series, dataPointIndex }: any) => {
            const value = series[0][dataPointIndex]
            return `
        <div class='px-3 py-2 rounded-lg shadow text-xs bg-white text-black'>
          <div class='mb-1'>29 July 00:00</div>
          <div class='font-semibold'>${value.toLocaleString()}</div>
          <div class='text-red-500 bg-red-100 inline-block px-1 rounded ml-1'>▼ 3.4%</div>
        </div>`
        }
    },
    xaxis: { labels: { show: false } },
    yaxis: { show: false }
}

const chartSeries = [
    {
        name: 'Expense',
        data: [100, 200, 180, 250, 300, 220, 150]
    }
]
</script>

<template>
    <div class="bg-white rounded-2xl p-4 w-full shadow-sm">
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm text-gray-500">Daily Expense</h3>
            <span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">{{ date }}</span>
        </div>
        <div class="text-2xl font-semibold text-gray-800 mb-1">
            {{ expense.toLocaleString() }}
        </div>
        <apexchart type="area" height="160" :options="chartOptions" :series="chartSeries" />
    </div>
</template>
