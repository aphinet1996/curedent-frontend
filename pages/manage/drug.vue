<script setup lang="ts">
definePageMeta({
    layout: false
})
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import FormAddNewDrug from '~/components/manage/drug/FormAddNewDrug.vue';
import TableDrug from '~/components/manage/drug/TableDrug.vue';
import type { ApiDrug } from '~/types/drug';

const showModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const selectedDrugId = ref<string>('')

const handleOpenAddForm = () => {
    modalMode.value = 'add';
    selectedDrugId.value = '';
    showModal.value = true;
};

const handleOpenEditForm = (drug: ApiDrug) => {
    console.log('Opening edit form for drug:', drug)
    selectedDrugId.value = drug.id || (drug as any)._id
    modalMode.value = 'edit'
    showModal.value = true
}

</script>

<template>
    <NuxtLayout name="manage">
        <template #subheader-right>
            <button
                class="ml-2 rounded-lg flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
                @click="showModal = true">
                <Icon icon="mdi:add" class="w-4 h-4" />
                Add
            </button>
        </template>

        <TableDrug @edit="handleOpenEditForm" />

        <FormAddNewDrug :show="showModal" :mode="modalMode" :drugId="selectedDrugId" @close="showModal = false" />
    </NuxtLayout>
</template>