<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Table from '~/components/Table.vue'
import Pagination from '~/components/Pagination.vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '~/stores/patient'
import { useI18n } from '#imports'
import type { ApiPatient, PatientTableRow } from '~/types/patient'

const router = useRouter()
const patientStore = usePatientStore()
const { locale } = useI18n()

const goToPatientDetail = (row: PatientTableRow) => {
  router.push(`/opd/detail/${row.id}`)
}

// Transform API patient data for display in table
const transformedPatients = computed<PatientTableRow[]>(() => {
  return patientStore.getPatients.map((patient: ApiPatient) => ({
    id: patient.id,
    name: patient.fullName,
    tel: patient.phone,
    age: `${patient.age} `,
    gender: patient.gender,
    contact: patient.phone,
    originalData: patient
  }))
})

const columns = [
    { key: 'name', label: 'Name - Surname', align: 'left' as const },
    { key: 'tel', label: 'Tel', align: 'left' as const },
    { key: 'age', label: 'Age', align: 'center' as const },
    { key: 'gender', label: 'Gender', align: 'center' as const },
    { key: 'contact', label: 'Contact', align: 'center' as const }
]

// Pagination
const currentPage = computed({
  get: () => patientStore.getPagination.page,
  set: (value) => {
    handlePageChange(value)
  }
})

const handlePageChange = async (page: number) => {
  await patientStore.fetchPatients({
    page,
    limit: patientStore.getPagination.limit,
    lang: locale.value
  })
}

// Watch for locale changes and refetch data
watch(locale, async (newLocale) => {
  console.log('Locale changed to:', newLocale)
  await patientStore.setLanguageAndRefetch(newLocale as 'th' | 'en')
}, { immediate: false })

// Initialize data on component mount
onMounted(async () => {
  // Set initial language
  patientStore.currentLanguage = locale.value as 'th' | 'en'
  
  // Fetch initial data
  await patientStore.fetchPatients({
    page: 1,
    limit: 10,
    lang: locale.value
  })
})

// Loading and error states
const isLoading = computed(() => patientStore.getLoading)
const error = computed(() => patientStore.getError)
const pagination = computed(() => patientStore.getPagination)
</script>

<template>
    <div class="space-y-4">
        <!-- Error message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ error }}
        </div>

        <!-- Loading spinner -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
            <Icon icon="mdi:loading" class="w-8 h-8 animate-spin text-blue-500" />
            <span class="ml-2 text-gray-600">Loading patients...</span>
        </div>

        <!-- Table -->
        <Table 
            v-else
            :columns="columns" 
            :rows="transformedPatients" 
            @row-click="goToPatientDetail"
        >
            <template #contact="{ row }">
                <div class="flex items-center gap-2 justify-center">
                    <!-- Show WhatsApp icon if phone exists -->
                    <Icon 
                        icon="ic:baseline-whatsapp" 
                        class="w-5 h-5 text-green-500" 
                        v-if="row.originalData.phone" 
                        :title="`WhatsApp: ${row.originalData.phone}`"
                    />
                    <!-- You can add more contact types based on additional patient data -->
                    <!-- <Icon icon="ri:facebook-fill" class="w-5 h-5 text-blue-600" v-if="row.originalData.facebook" /> -->
                </div>
            </template>
        </Table>

        <!-- Pagination -->
        <Pagination 
            :current-page="pagination.page" 
            :page-size="pagination.limit" 
            :total-items="pagination.total"
            @update:page="handlePageChange" 
        />
    </div>
</template>