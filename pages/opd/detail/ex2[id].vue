<script setup lang="ts">
definePageMeta({
    layout: false
})
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import CardPatientDetail from '~/components/opd/CardPatientDetail.vue'
import CardTreatmentHistory from '~/components/opd/CardTreatmentHistory.vue'
import CardVistits from '~/components/opd/CardVistits.vue'
import CardPayment from '~/components/opd/CardPayment.vue'
import CardTreatmentDetail from '~/components/opd/CardTreatmentDetail.vue'

const route = useRoute()
const id = route.params.id

const showForm = ref(false)
</script>

<template>
    <NuxtLayout name="main">
        <template #subheader-right>
            <button
                class="ml-2 rounded-lg flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
                @click="showForm = true">
                <Icon icon="mdi:add" class="w-4 h-4" />
                {{ $t('button.create') }}
            </button>
            <button
                class="ml-2 rounded-lg flex items-center gap-1 text-sm border border-blue-600 hover:bg-blue-600 text-blue-600 px-3 py-1"
                @click="showForm = true">
                <Icon icon="proicons:pdf-2" class="w-4 h-4 text-blue-600" />
                Download PDF
            </button>
        </template>
        <div class="space-y-4">
            <CardPatientDetail />
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div class="flex lg:h-65 2xl:h-[170px]">
                    <CardTreatmentHistory />
                  </div>
                  <div class="flex lg:h-65 2xl:h-[170px]">
                    <CardVistits />
                  </div>
                  <div class="flex lg:h-65 2xl:h-[350px]">
                    <CardPayment />
                  </div>
              </div>
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-12 rounded-lg flex flex-col h-full">
                    <CardTreatmentDetail />
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>