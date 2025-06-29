<script setup lang="ts">
import { ref } from 'vue'

const chartOptions = ref({
    chart: {
        type: 'area',
        height: 160,
        toolbar: { show: false },
        zoom: { enabled: false },
        sparkline: { enabled: true }
    },
    stroke: {
        curve: 'smooth',
        width: 2
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
        x: { format: 'dd MMM yyyy' },
        y: {
            formatter: (val: number) => `$${val.toFixed(2)}`
        }
    },
    xaxis: {
        categories: ['01', '02', '03', '04', '05', '06', '07'],
        labels: { show: false },
        axisTicks: { show: false },
        axisBorder: { show: false }
    },
    yaxis: {
        show: false
    },
    grid: { show: false }
})

const chartSeries = ref([
    {
        name: 'Daily Income',
        data: [200, 100, 250, 250, 200, 300, 400]
    }
])

const income = ref(220342.76)
const date = ref('02 / 09 /2023')
</script>

<template>
    <div class="bg-white rounded-xl shadow p-4 w-full">
        <div class="flex justify-between items-center text-sm text-gray-500 font-medium mb-1">
            <span>Daily Income</span>
            <span class="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-semibold">{{ date }}</span>
        </div>
        <div class="text-2xl font-semibold text-gray-900 mb-2">{{ income.toLocaleString() }}</div>
        <apexchart height="160" type="area" :options="chartOptions" :series="chartSeries" />
    </div>
</template>
