<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Column {
    key: string
    label: string
    type?: 'text' | 'icon'
    icon?: string
    width?: string
    wrap?: boolean
}

interface Props {
    columns: Column[]
    rows: Record<string, any>[]
    rowsPerPage?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['action'])

const sortBy = ref<string>('')
const sortAsc = ref(true)
const currentPage = ref(1)
const rowsPerPage = computed(() => props.rowsPerPage || 10)

const sortedRows = computed(() => {
    const sorted = [...props.rows]
    if (sortBy.value) {
        sorted.sort((a, b) => {
            const valA = a[sortBy.value]
            const valB = b[sortBy.value]
            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA)
            } else if (typeof valA === 'number' && typeof valB === 'number') {
                return sortAsc.value ? valA - valB : valB - valA
            }
            return 0
        })
    }
    return sorted
})

const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value
    return sortedRows.value.slice(start, start + rowsPerPage.value)
})

const pageCount = computed(() => Math.ceil(props.rows.length / rowsPerPage.value))

const handleSort = (key: string) => {
    if (sortBy.value === key) {
        sortAsc.value = !sortAsc.value
    } else {
        sortBy.value = key
        sortAsc.value = true
    }
}

const getSortIcon = (key: string) => {
    if (sortBy.value === key) {
        return sortAsc.value ? 'mdi:chevron-up' : 'mdi:chevron-down'
    }
    return 'mdi:chevron-up-down'
}
</script>

<template>
    <div class="relative overflow-x-auto rounded-xl shadow-sm bg-white">
        <table class="w-full table-fixed text-sm text-left text-gray-700">
            <thead class="text-xs bg-gray-50 font-semibold">
                <tr>
                    <th v-for="col in columns" :key="col.key" @click="col.type !== 'icon' && handleSort(col.key)"
                        class="px-4 py-3 cursor-pointer"
                        :style="{ width: col.width || 'auto', maxWidth: col.width || 'auto' }">
                        <div class="flex items-center gap-1" v-if="col.type !== 'icon'">
                            {{ col.label }}
                            <Icon :icon="getSortIcon(col.key)" class="w-4 h-4" />
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in paginatedRows" :key="index"
                    class="bg-white border-y border-gray-200 hover:bg-gray-50">
                    <td v-for="col in columns" :key="col.key" class="px-4 py-3 align-top" :class="[
                        col.type === 'icon' ? '' :
                            col.wrap ? 'break-words whitespace-normal' : 'truncate whitespace-nowrap overflow-hidden'
                    ]" :style="{ width: col.width || 'auto', maxWidth: col.width || 'auto' }">
                        <template v-if="col.type === 'icon'">
                            <button @click="$emit('action', { key: col.key, row })"
                                class="text-gray-300 hover:text-gray-600">
                                <template v-if="col.icon">
                                    <Icon :icon="col.icon" class="w-5 h-5" />
                                </template>
                            </button>
                        </template>
                        <template v-else>
                            {{ row[col.key] }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="pageCount > 1" class="flex justify-end items-center gap-2 text-sm text-gray-600 px-4 py-3">
            <button @click="currentPage--" :disabled="currentPage === 1" class="px-2 py-1 disabled:opacity-50">
                Prev
            </button>
            <span>Page {{ currentPage }} of {{ pageCount }}</span>
            <button @click="currentPage++" :disabled="currentPage === pageCount" class="px-2 py-1 disabled:opacity-50">
                Next
            </button>
        </div>
    </div>
</template>