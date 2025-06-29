<!-- <script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import FormAdjustStock from '~/components/manage/stock/FormAdjustStock.vue'

const showModal = ref(false)

const product = {
  name: 'ToothBrush (Blue)',
  code: 'H09-111',
  brand: 'CURAPROX',
  remaining: 4,
  image: 'https://curaprox-image-mock.com/brush.jpg'
}

const handleSubmit = (data: { quantity: number; type: string }) => {
  console.log('Submitted:', data)
}
</script>

<template>
  <div class="rounded-xl shadow p-4 bg-white w-full max-w-xs">
    <img :src="product.image" alt="Product Image" class="rounded-lg w-full h-40 object-cover mb-3" />
    <div class="font-medium text-base text-gray-800 mb-2">{{ product.name }}</div>

    <div class="text-sm text-gray-600 flex items-center gap-2">
      <Icon icon="material-symbols:folder" class="w-4 h-4" /> Product Code: <span class="font-medium">{{ product.code }}</span>
    </div>
    <div class="text-sm text-gray-600 flex items-center gap-2 mt-1">
      <Icon icon="mdi:tag" class="w-4 h-4" /> Brand: <span class="font-medium">{{ product.brand }}</span>
    </div>
    <div class="text-sm text-gray-600 flex items-center gap-2 mt-1">
      <Icon icon="material-symbols:inventory-2-outline" class="w-4 h-4" /> Remaining: <span class="font-medium">{{ product.remaining }}</span>
    </div>

    <div class="flex justify-end mt-3">
      <button @click="showModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
        <Icon icon="mdi:plus" class="w-4 h-4" /> Adjust
      </button>
    </div>

    <FormAdjustStock
      :show="showModal"
      :count="product.remaining"
      type="internal"
      @close="showModal = false"
      @submit="handleSubmit"
    />
  </div>
</template> -->

<script setup lang="ts">
import { ref, computed } from 'vue'
import CardProduct from '~/components/CardProduct.vue'
import Pagination from '~/components/Pagination.vue'

type ProductType = 'internal' | 'external'

interface Product {
  name: string
  code: string
  brand: string
  remaining: number
  image: string
  type: ProductType
}

const internalProducts = ref<Product[]>([
  {
    name: 'ToothBrush (Blue)',
    code: 'H09-111',
    brand: 'CURAPROX',
    remaining: 4,
    image: 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image',
    type: 'internal'
  },
  {
    name: 'ToothPaste',
    code: 'H09-112',
    brand: 'Colgate',
    remaining: 10,
    image: 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image',
    type: 'internal'
  }
])

const currentPage = ref(1)
const pageSize = 4

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return internalProducts.value.slice(start, start + pageSize)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <CardProduct
        v-for="(item, index) in paginatedData"
        :key="index"
        :product="item"
        @submit="(data) => console.log('Internal submit:', data)"
      />
    </div>
    <Pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total-items="internalProducts.length"
      @update:page="handlePageChange"
    />
  </div>
</template>