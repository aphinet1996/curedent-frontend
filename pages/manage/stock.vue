<!-- <script setup lang="ts">
definePageMeta({
    layout: false
})
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import CardProductExternal from '~/components/manage/stock/CardProductExternal.vue'
import FormAddStock from '~/components/manage/stock/FormAddStock.vue'

const showForm = ref(false)

const handleSubmit = (data: any) => {
  console.log('Submitted:', data)
  showForm.value = false
}
</script>

<template>
    <NuxtLayout name="manage">
        <template #subheader-right>
            <button
                class="ml-2 rounded-lg flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
                @click="showForm = true">
                <Icon icon="mdi:add" class="w-4 h-4" />
                Add
            </button>
        </template>
        <CardProductExternal />

        <FormAddStock :show="showForm" @close="showForm= false" @submit="handleSubmit"/>
    </NuxtLayout>
</template> -->

<script setup lang="ts">
definePageMeta({
  layout: false
})

import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import CardProductExternal from '~/components/manage/stock/CardProductExternal.vue'
import CardProductInternal from '~/components/manage/stock/CardProductInternal.vue'
import FormAddStock from '~/components/manage/stock/FormAddStock.vue'

const showForm = ref(false)

const handleSubmit = (data: any) => {
  console.log('Submitted:', data)
  showForm.value = false
}
</script>

<template>
  <NuxtLayout name="manage">
    <template #subheader-right>
      <button class="ml-2 rounded-lg flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
        @click="showForm = true">
        <Icon icon="mdi:add" class="w-4 h-4" />
        {{ $t('button.add') }}
      </button>
    </template>

    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2 text-lg   text-gray-700">
        <Icon icon="prime:box" class="w-5 h-5" />
        ขายหน้าร้าน
      </div>
      <CardProductExternal />
    </div>

    <div>
      <div class="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-700">
        <Icon icon="prime:box" class="w-5 h-5" />
        อุปกรณ์ใช้ภายในคลินิก
      </div>
      <CardProductInternal />
    </div>

    <FormAddStock :show="showForm" @close="showForm = false" @submit="handleSubmit" />
  </NuxtLayout>
</template>