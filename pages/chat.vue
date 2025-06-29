<script setup lang="ts">
definePageMeta({
  layout: false
})
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import CardChatGroup from '~/components/chat/CardChatGroup.vue'
import CardChatBoard from '~/components/chat/CardChatBoard.vue'
import CardChatProfile from '~/components/chat/CardChatProfile.vue'
import FormAddNewPatient from '~/components/chat/FormAddNewPatient.vue'

const showForm = ref(false)
const handleSubmit = (data: any) => {
  console.log('Submitted:', data)
  showForm.value = false
}
</script>

<template>
  <NuxtLayout name="main">
    <template #subheader-right>
      <button class="ml-2 rounded-lg flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
        @click="showForm = true">
        <Icon icon="mdi:add" class="w-4 h-4" />
        {{ $t('button.create') }}
      </button>
    </template>
    <!-- Layout แชท -->
    <div class="flex h-[calc(90vh-6rem)] gap-4 overflow-hidden">
      <!-- Sidebar: รายชื่อ -->
      <div class="w-64 flex-shrink-0">
        <CardChatGroup />
      </div>

      <!-- Chat Board -->
      <div class="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
        <CardChatBoard />
      </div>

      <!-- Profile ด้านขวา -->
      <div class="w-80 flex-shrink-0">
        <CardChatProfile />
      </div>
    </div>
    <FormAddNewPatient :show="showForm" @close="showForm = false" @submit="handleSubmit" />
  </NuxtLayout>
</template>