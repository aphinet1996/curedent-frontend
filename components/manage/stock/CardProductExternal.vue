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
    image: 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image'
}

const handleSubmit = (data: { quantity: number; type: string }) => {
    console.log('Submitted:', data)
}
</script>

<template>
    <div class="rounded-xl shadow p-4 bg-white w-full max-w-[250px] space-y-3">
        <img :src="product.image" alt="Product Image" class="rounded-lg w-full h-56 object-cover" />
        <div class="flex items-start justify-between gap-3">
            <div class="font-medium text-sm text-gray-800 truncate w-4/5" :title="product.name">
                {{ product.name }}
            </div>
            <button @click="showModal = true"
                class="bg-blue-500 hover:bg-blue-600 text-white px-1.5 py-1.5 rounded-lg text-sm flex items-center gap-1">
                <Icon icon="mdi:add" class="w-4 h-4" />
            </button>
        </div>

        <div class="space-y-1 text-xs text-gray-600">
            <div class="flex items-center gap-2">
                <Icon icon="material-symbols:folder" class="w-4 h-4" />
                <span>Product Code:</span>
                <span class="font-medium">{{ product.code }}</span>
            </div>
            <div class="flex items-center gap-2">
                <Icon icon="mdi:tag" class="w-4 h-4" />
                <span>Brand:</span>
                <span class="font-medium">{{ product.brand }}</span>
            </div>
            <div class="flex items-center gap-2">
                <Icon icon="material-symbols:inventory-2-outline" class="w-4 h-4" />
                <span>Remaining:</span>
                <span class="font-medium">{{ product.remaining }}</span>
            </div>
        </div>

        <FormAdjustStock :show="showModal" :count="product.remaining" type="external" @close="showModal = false"
            @submit="handleSubmit" />
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

const externalProducts = ref<Product[]>([
  {
    name: 'ToothBrush (Blue)',
    code: 'H09-111',
    brand: 'CURAPROX',
    remaining: 4,
    image: 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image',
    type: 'external'
  },
  {
    name: 'ToothPaste',
    code: 'H09-112',
    brand: 'Colgate',
    remaining: 10,
    image: 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image',
    type: 'external'
  },
  {
    name: 'ToothPaste',
    code: 'H09-112',
    brand: 'Colgate',
    remaining: 10,
    image: 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image',
    type: 'external'
  },
  {
    name: 'ToothPaste',
    code: 'H09-112',
    brand: 'Colgate',
    remaining: 10,
    image: 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image',
    type: 'external'
  },
  {
    name: 'ToothPaste',
    code: 'H09-112',
    brand: 'Colgate',
    remaining: 10,
    image: 'https://dummyimage.com/300x300/cccccc/000000&text=No+Image',
    type: 'external'
  },
])

const currentPage = ref(1)
const pageSize = 4

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return externalProducts.value.slice(start, start + pageSize)
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
        @submit="(data) => console.log('External submit:', data)"
      />
    </div>
    <Pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total-items="externalProducts.length"
      @update:page="handlePageChange"
    />
  </div>
</template>