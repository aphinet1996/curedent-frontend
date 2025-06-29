<!-- <script setup lang="ts">
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

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-7 rounded-lg flex flex-col h-full :h-10">
                    <CardTreatmentDetail />
                </div>

                <div class="col-span-12 lg:col-span-5 flex flex-col space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex lg:h-65 2xl:h-[350px]">
                            <CardTreatmentHistory />
                        </div>
                        <div class="flex lg:h-65 2xl:h-[350px]">
                            <CardVistits />
                        </div>
                    </div>
                    <div class="flex lg:h-70 2xl:h-[320px]">
                        <CardPayment />
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template> -->

<script setup lang="ts">
definePageMeta({
    layout: false
})

import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import CardPatientDetail from '~/components/opd/CardPatientDetail.vue'
import CardTreatmentHistory from '~/components/opd/CardTreatmentHistory.vue'
import CardVisits from '~/components/opd/CardVistits.vue'
import CardPayment from '~/components/opd/CardPayment.vue'
import CardTreatmentDetail from '~/components/opd/CardTreatmentDetail.vue'

const route = useRoute()
const showForm = ref(false)

const patientId = computed(() => {
    return Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
})

console.log('Patient ID from route:', patientId.value)

const handleAppointmentAdded = (appointment: any) => {
    console.log('New appointment added:', appointment)
}

const handleAppointmentUpdated = (appointment: any) => {
    console.log('Appointment updated:', appointment)
}

const handleAppointmentDeleted = (appointmentId: string) => {
    console.log('Appointment deleted:', appointmentId)
}
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
            <CardPatientDetail :patient-id="patientId" />

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 lg:col-span-7 rounded-lg flex flex-col h-full">
                    <CardTreatmentDetail :patient-id="patientId" />
                </div>

                <div class="col-span-12 lg:col-span-5 flex flex-col space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex lg:h-65 2xl:h-[350px]">
                            <CardTreatmentHistory :patient-id="patientId" />
                        </div>
                        <div class="flex lg:h-65 2xl:h-[350px]">
                            <CardVisits 
                                :patient-id="patientId"
                                :show-add-button="true"
                                @visit-added="handleAppointmentAdded"
                                @visit-updated="handleAppointmentUpdated"
                                @visit-deleted="handleAppointmentDeleted"
                            />
                        </div>
                    </div>
                    <div class="flex lg:h-70 2xl:h-[320px]">
                        <!-- ส่ง patientId เข้าไปใน CardPayment ด้วย ถ้าจำเป็น -->
                        <CardPayment :patient-id="patientId" />
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>