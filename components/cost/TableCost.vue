<!-- <script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import Card from '../Card.vue';

interface Equipment {
  date: string
  time: string
  deliveryDate: string
  code: string
  name: string
  price: string
  amount: string
  type: string
}

const sortBy = ref<keyof Equipment>('name')
const sortAsc = ref(true)

const equipmentList = ref<Equipment[]>([
  { date: '06/08/2023', time: '11.38 AM', deliveryDate: '06/08/2023', code: 'H09-111', name: 'CURAPROX', price: '10,000.-', amount: '10,000 pcs.', type: 'Recurring' },
  { date: '06/08/2023', time: '11.32 AM', deliveryDate: '06/08/2023', code: 'H09-111', name: 'CURAPROX', price: '150.-', amount: '5,000 pcs.', type: 'One-time' },
  { date: '06/08/2023', time: '11.32 AM', deliveryDate: '06/08/2023', code: 'H09-111', name: 'CURAPROX', price: '150.-', amount: '150 pcs.', type: 'One-time' },
  { date: '06/08/2023', time: '11.32 AM', deliveryDate: '06/08/2023', code: 'H09-111', name: 'CURAPROX', price: '150.-', amount: '150.-', type: 'One-time' },
  { date: '06/08/2023', time: '11.32 AM', deliveryDate: '06/08/2023', code: 'H09-111', name: 'CURAPROX', price: '10,000.-', amount: '10,000.-', type: 'One-time' },
  { date: '06/08/2023', time: '11.32 AM', deliveryDate: '06/08/2023', code: 'H09-111', name: 'CURAPROX', price: '800.-', amount: '800.-', type: 'One-time' },
  { date: '06/08/2023', time: '11.32 AM', deliveryDate: '06/08/2023', code: 'H09-111', name: 'CURAPROX', price: '60,000.-', amount: '60,000.-', type: 'One-time' },
])

const sortedEquipments = computed(() => {
  return [...equipmentList.value].sort((a, b) => {
    const valA = a[sortBy.value]
    const valB = b[sortBy.value]
    return sortAsc.value
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA)
  })
})

const handleSort = (key: keyof Equipment) => {
  if (sortBy.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortBy.value = key
    sortAsc.value = true
  }
}

const getSortIcon = (key: keyof Equipment) => {
  if (sortBy.value === key) {
    return sortAsc.value ? 'mdi:chevron-up' : 'mdi:chevron-down'
  }
  return 'mdi:chevron-up-down'
}
</script>

<template>
  <Card class="relative overflow-x-auto bg-white">
    <table class="w-full text-sm text-left text-gray-700">
      <thead class="text-xs uppercase bg-gray-50 font-semibold">
        <tr>
          <th @click="handleSort('date')" class="px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-1">DATE <Icon :icon="getSortIcon('date')" class="w-4 h-4" /></div>
          </th>
          <th @click="handleSort('time')" class="px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-1">TIME <Icon :icon="getSortIcon('time')" class="w-4 h-4" /></div>
          </th>
          <th @click="handleSort('deliveryDate')" class="px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-1">DELIVERY DATE <Icon :icon="getSortIcon('deliveryDate')" class="w-4 h-4" /></div>
          </th>
          <th @click="handleSort('code')" class="px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-1">PRODUCT CODE <Icon :icon="getSortIcon('code')" class="w-4 h-4" /></div>
          </th>
          <th @click="handleSort('name')" class="px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-1">PRODUCT NAME <Icon :icon="getSortIcon('name')" class="w-4 h-4" /></div>
          </th>
          <th @click="handleSort('price')" class="px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-1">PRICE <Icon :icon="getSortIcon('price')" class="w-4 h-4" /></div>
          </th>
          <th @click="handleSort('amount')" class="px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-1">AMOUNT <Icon :icon="getSortIcon('amount')" class="w-4 h-4" /></div>
          </th>
          <th @click="handleSort('type')" class="px-4 py-3 cursor-pointer">
            <div class="flex items-center gap-1">TYPE <Icon :icon="getSortIcon('type')" class="w-4 h-4" /></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedEquipments" :key="index" class="bg-white border-b hover:bg-gray-50">
          <td class="px-4 py-3">{{ item.date }}</td>
          <td class="px-4 py-3">{{ item.time }}</td>
          <td class="px-4 py-3">{{ item.deliveryDate }}</td>
          <td class="px-4 py-3">{{ item.code }}</td>
          <td class="px-4 py-3">{{ item.name }}</td>
          <td class="px-4 py-3">{{ item.price }}</td>
          <td class="px-4 py-3">{{ item.amount }}</td>
          <td class="px-4 py-3">{{ item.type }}</td>
        </tr>
      </tbody>
    </table>
  </Card>
</template> -->

<script setup lang="ts">
import Table from '~/components/TableSort.vue'

const columns = [
  { label: 'Date', key: 'date' },
  { label: 'Time', key: 'time' },
  { label: 'Delivery Date', key: 'deliveryDate' },
  { label: 'Product Code', key: 'code' },
  { label: 'Product Name', key: 'name' },
  { label: 'Price', key: 'price' },
  { label: 'Amount', key: 'amount' },
  { label: 'Type', key: 'type' }
]

const data = [
  { date: '06/08/2023', time: '11.38 AM', deliveryDate: '06/08/2023', code: 'H09-111', name: 'CURAPROX', price: '10,000.-', amount: '10,000 pcs.', type: 'Recurring' },
  { date: '06/08/2023', time: '11.32 AM', deliveryDate: '06/08/2023', code: 'H09-112', name: 'BRUSHER', price: '150.-', amount: '5,000 pcs.', type: 'One-time' },
]
</script>

<template>
  <Table :columns="columns" :rows="data" />
</template>