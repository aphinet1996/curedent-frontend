<script setup lang="ts">
import Card from '~/components/Card.vue'

const treatments = [
  { label: 'Veneers', value: 1125132.5, count: 259, color: '#3b82f6' },
  { label: 'Teeth Whitenings', value: 2007.3, count: 143, color: '#facc15' },
  { label: 'Extractions', value: 1090.7, count: 125, color: '#14b8a6' },
  { label: 'Others', value: 1090.7, count: 89, color: '#f87171' }
]

const totalCount = treatments.reduce((sum, item) => sum + item.count, 0)

const series = treatments.map(t => t.count)
const labels = treatments.map(t => t.label)
const colors = treatments.map(t => t.color)

const chartOptions = {
  chart: {
    type: 'donut'
  },
  labels,
  colors,
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  stroke: {
    width: 0
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name: { show: false },
          value: { show: false },
          total: {
            show: true,
            label: 'Total Treatment',
            fontSize: '14px',
            color: '#999',
            formatter: () => `${totalCount}`
          }
        }
      }
    }
  }
}
</script>

<template>
  <Card class="bg-white">
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div class="text-sm font-semibold md:text-sm">Treatment Type</div>
      <div class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md">02 / 09 / 2023</div>
    </div>

    <!-- Chart + Legend -->
    <div class="flex items-center gap-6 px-10">
      <!-- ✅ Real Donut Chart -->
      <div class="w-36 h-36">
        <ClientOnly>
          <apexchart type="donut" width="100%" height="100%" :series="series" :options="chartOptions" />
        </ClientOnly>
      </div>

      <!-- ✅ Legend แสดง count ไว้ท้ายสุด -->
      <div class="flex-1 space-y-3 text-xs lg:text-sm">
        <div v-for="item in treatments" :key="item.label" class="flex items-start gap-2">
          <!-- จุดสี -->
          <div :style="{ backgroundColor: item.color }" class="w-3 h-3 rounded-full mt-1"></div>

          <!-- เนื้อหา -->
          <div class="flex flex-col">
            <!-- Label + Count -->
            <div class="text-gray-700 font-medium">
              {{ item.label }}
              <span class="text-xs text-gray-400 font-normal">({{ item.count }})</span>
            </div>

            <!-- Value -->
            <div class="text-sm text-black font-semibold">
              {{ item.value.toLocaleString() }} ฿
            </div>
          </div>
        </div>
      </div>

    </div>
  </Card>
</template>