<script setup lang="ts">
definePageMeta({
  layout: false
})
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import CardBranch from '~/components/manage/branch/CardBranch.vue';
import FormAddBranch from '~/components/manage/branch/FormAddBranch.vue';
import type { Branch } from '~/types/branch';

// Modal state
const showModal = ref(false);
const modalMode = ref<'add' | 'edit'>('add');
const selectedBranchId = ref<string>('');

// Handle open add form
const handleOpenAddForm = () => {
  modalMode.value = 'add';
  selectedBranchId.value = '';
  showModal.value = true;
};

// Handle open edit form
const handleOpenEditForm = (branchId: string) => {
  console.log('Opening edit form for branch ID:', branchId);
  selectedBranchId.value = branchId;
  modalMode.value = 'edit';
  showModal.value = true;
};

// Handle form submit
const handleFormSubmit = (branch: Branch) => {
};
</script>

<template>
  <NuxtLayout name="manage">
    <template #subheader-right>
      <button class="ml-2 rounded-lg flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
        @click="handleOpenAddForm">
        <Icon icon="mdi:add" class="w-4 h-4" />
        Add
      </button>
    </template>

    <CardBranch @open-add-form="handleOpenAddForm" @open-edit-form="handleOpenEditForm" />

    <FormAddBranch :show="showModal" :mode="modalMode" :branchId="selectedBranchId" @close="showModal = false"
      @submit="handleFormSubmit" />
  </NuxtLayout>
</template>