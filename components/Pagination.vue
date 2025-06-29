<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  pageSize: number
  totalItems: number
}>()

const emit = defineEmits(['update:page'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const pages = computed(() => {
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(props.currentPage - half, 1)
  let end = Math.min(start + maxVisible - 1, totalPages.value)

  if (end - start < maxVisible - 1) {
    start = Math.max(end - maxVisible + 1, 1)
  }

  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:page', page)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-end justify-end gap-2 mt-4">
    <button
      class="px-3 py-1 text-sm rounded-sm border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-50"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="goToPage(page)"
      class="px-3 py-1 text-sm rounded-md border border-gray-400"
      :class="{
        'bg-blue-500 text-white': page === currentPage,
        'bg-white hover:bg-gray-100': page !== currentPage
      }"
    >
      {{ page }}
    </button>

    <button
      class="px-3 py-1 text-sm rounded-md border border-gray-400 bg-white hover:bg-gray-100 disabled:opacity-50"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>