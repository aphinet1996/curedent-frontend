<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

interface Row {
  [key: string]: any
}

const props = defineProps<{
  columns: Column[]
  rows: Row[]
}>()

const emit = defineEmits<{
  (e: 'row-click', row: any): void
}>()

// Group rows by first letter of `name` (or firstName)
const groupedRows = computed(() => {
  const map: Record<string, Row[]> = {}
  props.rows.forEach(row => {
    const firstLetter = (row.name || row.firstName)?.charAt(0).toUpperCase() || '#'
    if (!map[firstLetter]) map[firstLetter] = []
    map[firstLetter].push(row)
  })

  return Object.keys(map)
    .sort()
    .map(letter => ({ letter, items: map[letter] }))
})
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full text-sm text-left">
      <!-- Table Head -->
      <thead class="bg-gray-50 text-gray-600 font-semibold sticky top-0 z-10">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              'px-4 py-3 border-b border-gray-200',
              col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
            ]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <template v-for="group in groupedRows" :key="group.letter">
          <!-- Group Label -->
          <tr class="bg-gray-100 text-xs text-gray-500 uppercase">
            <td :colspan="columns.length" class="px-4 py-2 font-bold">
              {{ group.letter }}
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-for="(row, rowIndex) in group.items"
            :key="rowIndex"
            class="border-t border-gray-200 hover:bg-gray-50 transition"
            @click="$emit('row-click', row)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                'px-4 py-3',
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
              ]"
            >
              <slot :name="col.key" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>