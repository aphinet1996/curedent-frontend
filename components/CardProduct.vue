<!-- <script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import FormAdjustStock from '~/components/manage/stock/FormAdjustStock.vue'

interface Props {
  product: {
    name: string
    code: string
    brand: string
    remaining: number
    image: string
  }
  type: 'internal' | 'external'
}

const props = defineProps<Props>()
const showModal = ref(false)

const handleSubmit = (data: { quantity: number; type: string }) => {
  console.log('Submitted:', data)
  showModal.value = false
}
</script>

<template>
  <div class="rounded-xl shadow p-4 bg-white w-full max-w-[250px] space-y-3">
    <img :src="props.product.image" alt="Product Image" class="rounded-lg w-full h-56 object-cover" />

    <div class="flex items-start justify-between gap-3">
      <div class="font-medium text-sm text-gray-800 truncate w-4/5" :title="props.product.name">
        {{ props.product.name }}
      </div>
      <button
        @click="showModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white px-1.5 py-1.5 rounded-lg text-sm flex items-center gap-1"
      >
        <Icon icon="mdi:add" class="w-4 h-4" />
      </button>
    </div>

    <div class="space-y-1 text-xs text-gray-600">
      <div class="flex items-center gap-2">
        <Icon icon="material-symbols:folder" class="w-4 h-4" />
        <span>Product Code:</span>
        <span class="font-medium">{{ props.product.code }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Icon icon="mdi:tag" class="w-4 h-4" />
        <span>Brand:</span>
        <span class="font-medium">{{ props.product.brand }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Icon icon="material-symbols:inventory-2-outline" class="w-4 h-4" />
        <span>Remaining:</span>
        <span class="font-medium">{{ props.product.remaining }}</span>
      </div>
    </div>

    <FormAdjustStock
      :show="showModal"
      :count="props.product.remaining"
      :type="props.type"
      @close="showModal = false"
      @submit="handleSubmit"
    />
  </div>
</template> -->

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import FormAdjustStock from '~/components/manage/stock/FormAdjustStock.vue'

defineProps<{
  product: {
    name: string
    code: string
    brand: string
    remaining: number
    image: string
    type: 'internal' | 'external'
  }
}>()

const showModal = ref(false)

const emit = defineEmits(['submit'])

const handleSubmit = (data: { quantity: number; type: string }) => {
  emit('submit', data)
  showModal.value = false
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
        <Icon icon="prime:folder" class="w-4 h-4" />
        <span>{{ $t('manage.stock.box_product_code') }}:</span>
        <span class="font-medium">{{ product.code }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Icon icon="prime:tag" class="w-4 h-4" />
        <span>{{ $t('manage.stock.box_product_brand') }}:</span>
        <span class="font-medium">{{ product.brand }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Icon icon="prime:box" class="w-4 h-4" />
        <span>{{ $t('manage.stock.box_product_remain') }}:</span>
        <span class="font-medium">{{ product.remaining }}</span>
      </div>
    </div>

    <FormAdjustStock
      :show="showModal"
      :count="product.remaining"
      :type="product.type"
      @close="showModal = false"
      @submit="handleSubmit"
    />
  </div>
</template>

