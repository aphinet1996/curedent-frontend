<script setup lang="ts">
definePageMeta({
  layout: false
})

import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import TableAdmin from '~/components/manage/admin/TableAdmin.vue'
import FormAddAdmin from '~/components/manage/admin/FormAddAdmin.vue'

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
        Add
      </button>
    </template>

    <TableAdmin />

    <FormAddAdmin :show="showForm" @close="showForm = false" @submit="handleSubmit" />
  </NuxtLayout>
</template>