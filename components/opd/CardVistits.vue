<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Card from '../Card.vue'
import CardVisit from '../CardVisit.vue'
import ModalVisitAdd from './ModalVisitAdd.vue'
import Button from '../Button.vue';
import { useAppointmentStore } from '~/stores/appointment'
import type { ApiAppointment } from '~/types/appointment'

interface CardVisitsProps {
  patientId?: string
  customClass?: string
  showAddButton?: boolean
  title?: string
  maxHeight?: string
}

const props = withDefaults(defineProps<CardVisitsProps>(), {
  patientId: '',
  customClass: '',
  showAddButton: true,
  title: 'Visits',
  maxHeight: '400px'
})

const emit = defineEmits<{
  (e: 'visitAdded', appointment: ApiAppointment): void
  (e: 'visitUpdated', appointment: ApiAppointment): void
  (e: 'visitDeleted', appointmentId: string): void
}>()

const appointmentStore = useAppointmentStore()
const showForm = ref(false)

const currentPatientAppointments = computed(() => {
  if (!props.patientId) return []
  return appointmentStore.getPatientAppointments(props.patientId)
})

const loading = computed(() => appointmentStore.getLoadingPatientAppointments)
const error = computed(() => appointmentStore.getPatientAppointmentsError)

const upcomingAppointments = computed(() => {
  if (!props.patientId) return []
  return appointmentStore.getPatientUpcomingAppointments(props.patientId)
})

const pastAppointments = computed(() => {
  if (!props.patientId) return []
  return appointmentStore.getPatientPastAppointments(props.patientId)
})

const hasAppointments = computed(() => currentPatientAppointments.value.length > 0)

const fetchAppointments = async () => {
  if (!props.patientId) return

  try {
    await appointmentStore.fetchPatientAppointments(props.patientId)
  } catch (error) {
    console.error('Failed to fetch patient appointments:', error)
  }
}

const handleSubmit = async (data: any) => {
  console.log('Submitted:', data)
  showForm.value = false

  if (props.patientId) {
    await fetchAppointments()
  }
}

const handleAppointmentUpdate = async (appointment: ApiAppointment) => {
  emit('visitUpdated', appointment)
  // Refresh appointments after update
  if (props.patientId) {
    await fetchAppointments()
  }
}

const handleAppointmentDelete = async (appointmentId: string) => {
  emit('visitDeleted', appointmentId)
  // Refresh appointments after delete
  if (props.patientId) {
    await fetchAppointments()
  }
}

const refreshAppointments = async () => {
  appointmentStore.clearPatientAppointmentsError()
  await fetchAppointments()
}

watch(() => props.patientId, async (newPatientId) => {
  if (newPatientId) {
    appointmentStore.setCurrentPatientId(newPatientId)
    await fetchAppointments()
  }
}, { immediate: true })

onMounted(async () => {
  if (props.patientId) {
    appointmentStore.setCurrentPatientId(props.patientId)
    await fetchAppointments()
  }
})
</script>

<template>
  <Card :icon="'mdi:calendar-clock'" :title="title" :customClasses="`w-full overflow-hidden ${customClass}`">
    <template #headerRight>
      <div class="flex items-center gap-2">
        <button @click="refreshAppointments" :disabled="loading"
          class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50" title="Refresh">
          <Icon :icon="loading ? 'eos-icons:loading' : 'mdi:refresh'"
            :class="['w-4 h-4', { 'animate-spin': loading }]" />
        </button>

        <Button v-if="showAddButton && patientId" icon="mdi:add" label="Add" size="xs" @click="showForm = true" />
      </div>
    </template>

    <div :style="{ maxHeight }" class="overflow-auto">
      <div v-if="loading" class="flex justify-center items-center py-6">
        <Icon icon="eos-icons:loading" class="w-6 h-6 text-blue-500 animate-spin" />
        <span class="ml-2 text-sm text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>

      <div v-else-if="error" class="text-red-500 text-sm py-4">
        <div class="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
          <div class="flex items-center">
            <Icon icon="mdi:alert-circle" class="w-5 h-5 mr-2" />
            <span>{{ error }}</span>
          </div>
          <button @click="appointmentStore.clearPatientAppointmentsError()"
            class="text-red-700 hover:text-red-900 focus:outline-none">
            <Icon icon="mdi:close" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-else-if="!patientId" class="text-gray-500 text-center py-6">
        <Icon icon="mdi:account-question" class="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p class="text-sm">เลือกผู้ป่วยเพื่อดูการนัดหมาย</p>
      </div>

      <div v-else-if="hasAppointments" class="space-y-3">
        <div v-if="upcomingAppointments.length > 0">
          <h4 class="text-xs font-medium text-gray-700 mb-2 px-1">การนัดหมายถัดไป</h4>
          <div class="space-y-2">
            <CardVisit v-for="appointment in upcomingAppointments" :key="appointment.id" :appointment="appointment"
              class="mb-2 last:mb-0" @update="handleAppointmentUpdate" @delete="handleAppointmentDelete" />
          </div>
        </div>

        <div v-if="upcomingAppointments.length > 0 && pastAppointments.length > 0"
          class="border-t border-gray-200 my-3">
        </div>

        <div v-if="pastAppointments.length > 0">
          <div class="space-y-2">
            <CardVisit v-for="appointment in pastAppointments.slice(0, 5)" :key="appointment.id"
              :appointment="appointment" class="mb-2 last:mb-0" :show-actions="false" @update="handleAppointmentUpdate"
              @delete="handleAppointmentDelete" />
          </div>

          <div v-if="pastAppointments.length > 5" class="text-center pt-2">
            <span class="text-xs text-gray-500">
              และอีก {{ pastAppointments.length - 5 }} รายการ
            </span>
          </div>
        </div>
      </div>

      <div v-else class="text-gray-500 text-center py-6">
        <Icon icon="mdi:calendar-blank" class="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p class="text-sm mb-2">ไม่พบประวัติการนัดหมาย</p>
        <button v-if="showAddButton && patientId" @click="showForm = true"
          class="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Icon icon="mdi:plus" class="w-3 h-3 mr-1" />
          เพิ่มการนัดหมายใหม่
        </button>
      </div>
    </div>

    <ModalVisitAdd v-if="patientId" :show="showForm" :patient-id="patientId" @close="showForm = false"
      @submit="handleSubmit" />
  </Card>
</template>

<style scoped>
.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
  border-radius: 2px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #CBD5E0;
  border-radius: 2px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #A0AEC0;
}
</style>