<script setup lang="ts">
import Card from '~/components/Card.vue'
import { ref, computed } from 'vue'

interface EquipmentItem {
    name: string
    price: number
    unit?: string
    diff?: number
    color: string
}

const summary = {
    title: 'Equipment Cost',
    value: 250035.5,
    diff: 3.4,
}

const items: EquipmentItem[] = [
    { name: 'Excavator', price: 2500, unit: '250 pcs.', color: '#6366f1' },
    { name: 'Syringe', price: 3600, unit: '75 pcs.', color: '#a78bfa' },
    { name: 'Tweezers', price: 2500, diff: 11.4, color: '#facc15' },
    { name: 'Dental Nippers', price: 1100, unit: '250 pcs.', color: '#6366f1' },
    { name: 'Mouth Mirror', price: 2300, unit: '50 pcs.', color: '#a78bfa' },
    { name: 'IntraOral Cameras', price: 2300, diff: 11.4, color: '#facc15' },
    { name: 'Periodontal scaler', price: 5400, unit: '250 pcs.', color: '#6366f1' },
    { name: 'X-ray', price: 24000, diff: 11.4, color: '#facc15' },
    { name: 'Apex locator', price: 2300, diff: 11.4, color: '#facc15' },
]

const currentPage = ref(1)
const itemsPerPage = 9

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return items.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(items.length / itemsPerPage))
</script>

<template>
    <Card class="bg-white space-y-4">
        <!-- Header -->
        <div>
            <div class="text-gray-600 font-medium">{{ summary.title }}</div>
            <div class="flex items-center gap-2 mt-1">
                <div class="text-2xl font-bold">{{ summary.value.toLocaleString() }}</div>
                <div class="text-xs inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-600">
                    +{{ summary.diff.toFixed(1) }}%
                </div>
            </div>
        </div>

        <!-- Color Bar -->
        <div class="flex gap-2">
            <div v-for="(item, index) in items.slice(0, 6)" :key="index" class="h-1 w-full rounded-full"
                :style="{ backgroundColor: item.color }" />
        </div>

        <!-- Item Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            <div v-for="(item, index) in paginatedItems" :key="index" class="rounded-md border border-gray-100 p-3">
                <div class="flex items-center gap-2 text-sm">
                    <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.color }" />
                    {{ item.name }}
                </div>
                <div class="mt-1 text-lg font-bold">{{ item.price.toLocaleString() }}.-</div>
                <div v-if="item.unit" class="text-xs bg-green-100 text-green-600 inline-block px-2 py-0.5 rounded mt-1">
                    {{ item.unit }}
                </div>
                <div v-else-if="item.diff"
                    class="text-xs bg-green-100 text-green-600 inline-block px-2 py-0.5 rounded mt-1">
                    +{{ item.diff.toFixed(1) }}%
                </div>
            </div>
        </div>

        <!-- Pagination Dots -->
        <div class="flex justify-center gap-2 mt-2">
            <button v-for="page in totalPages" :key="page" class="w-3 h-3 rounded-full"
                :class="page === currentPage ? 'bg-blue-500' : 'bg-gray-300'" @click="currentPage = page"></button>
        </div>
    </Card>
</template>
