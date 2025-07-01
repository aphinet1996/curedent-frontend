<script setup lang="ts">
definePageMeta({
  layout: false
})
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import CardPatientOPD from '~/components/opd/TablePatientOPD.vue';
import FormAddNewPatient from '~/components/chat/FormAddNewPatient.vue';

const showForm = ref(false)

const handleSubmitForm = (patient: any) => {
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
    <div>
      <CardPatientOPD />
    </div>

    <FormAddNewPatient :show="showForm" @close="showForm= false" @submit="handleSubmitForm" />
  </NuxtLayout>
</template>