<script setup lang="ts">
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Card from '../Card.vue'
import Button from '../Button.vue';
import CardAppointment from '../CardAppointment.vue';
import ModalTreatmentAdd from './ModalTreatmentAdd.vue';
import { useAppointmentStore } from '~/stores/appointment';

const appointmentStore = useAppointmentStore()

const showForm = ref(false)
const handleSubmit = (data: any) => {
  console.log('Submitted:', data)
  showForm.value = false
}

const handleAddAppointment = () => {
  console.log('Add new appointment')
}

const handleEditAppointment = (appointment: Appointment) => {
  console.log('Edit appointment:', appointment)
}

onMounted(() => {
  appointmentStore.fetchAppointments()
})
</script>

<template>
  <Card :icon="'mi:document'" :title="'Treatment History'" :customClasses="'w-full overflow-auto'">
    <template #headerRight>
      <Button icon="mdi:add" label="Add" size="xs" @click="showForm = true" />
    </template>
    
    <div v-if="appointmentStore.loading" class="flex justify-center items-center py-6">
      <Icon icon="eos-icons:loading" class="w-6 h-6 text-blue-500 animate-spin" />
    </div>
    
    <div v-else-if="appointmentStore.error" class="text-red-500 text-sm py-2">
      <Icon icon="mdi:alert-circle" class="w-5 h-5 inline-block mr-1" />
      {{ appointmentStore.error }}
    </div>
    
    <div v-else class="space-y-3">
      <template v-if="appointmentStore.appointments.length > 0">
        <CardAppointment 
          v-for="appointment in appointmentStore.appointments" 
          :key="appointment.id"
          :appointment="appointment"
          class="mb-3 last:mb-0"
          @edit="handleEditAppointment"
        />
      </template>
      <div v-else class="text-gray-500 text-center py-6">
        ไม่พบประวัติการรักษา
      </div>
    </div>
  </Card>
  <ModalTreatmentAdd :show="showForm" @close="showForm = false" @submit="handleSubmit" />
</template>