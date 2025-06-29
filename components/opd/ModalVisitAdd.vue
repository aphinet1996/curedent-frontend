<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import Button from '~/components/Button.vue'

const props = defineProps<{
  show: boolean
}>()

const dateInput = ref<HTMLInputElement | null>(null)
const timeInput = ref<HTMLInputElement | null>(null)

const openDatepicker = () => {
  dateInput.value?.showPicker?.()
}

const openTimepicker = () => {
  timeInput.value?.showPicker?.()
}

const emit = defineEmits(['close'])

const selectedTreatment = ref('')
const selectedDate = ref('')
const selectedTime = ref('')
const selectedDuration = ref('')
const selectedDoctor = ref('Dr.Somchai')

const close = () => emit('close')

const confirm = () => {
  console.log({
    selectedTreatment: selectedTreatment.value,
    selectedDate: selectedDate.value,
    selectedTime: selectedTime.value,
    selectedDuration: selectedDuration.value,
    selectedDoctor: selectedDoctor.value,
  })
  close()
}
</script>

<template>
  <Modal :show="props.show" title="Visits" icon="lsicon:work-order-appointment-outline" @close="emit('close')" widthClass="max-w-sm">
    <form @submit.prevent="confirm" class="w-full">
      <!-- Form Section -->
      <div class="space-y-6">
        <!-- Treatment -->
        <div>
            <label class="block text-sm text-gray-700 mb-1">Treatment Visit</label>
            <select v-model="selectedTreatment" class="form-select w-full rounded-lg bg-gray-100 border border-gray-300">
                <option disabled value="">Select Treatment</option>
                <option>Cleaning</option>
                <option>Filling</option>
            </select>
        </div>

        <!-- Date -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Next Visit</label>
          <div class="relative">
            <input
                ref="dateInput"
                type="date"
                v-model="selectedDate"
                class="form-input w-full pr-10 hide-calendar-icon rounded-lg bg-gray-100 border border-gray-300"
                placeholder="Select Date"
            />
            <button
            type="button"
            @click="openDatepicker"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <Icon icon="mdi:calendar" class="w-5 h-5" />
          </button>
          </div>
        </div>

        <!-- Time -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Time</label>
          <div class="relative">
            <input
                ref="timeInput"
                type="time"
                v-model="selectedTime"
                class="form-input w-full pr-10 hide-time-icon rounded-lg bg-gray-100 border border-gray-300"
                placeholder="Select Time"
            />
            <button
            type="button"
            @click="openTimepicker"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <Icon icon="mdi:clock-outline" class="w-5 h-5" />
          </button>
          </div>
        </div>

        <!-- Duration -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Duration</label>
          <select v-model="selectedDuration" class="form-select w-full rounded-lg bg-gray-100 border border-gray-300">
            <option disabled value="">Select Duration</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        <!-- Doctor -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Doctor</label>
          <select v-model="selectedDoctor" class="form-select w-full rounded-lg bg-gray-100 border border-gray-300">
            <option disabled value="">Select Doctor</option>
            <option>Dr.Somchai</option>
            <option>Dr.Siriporn</option>
            <option>Dr.Niran</option>
          </select>
        </div> 

        <!-- Confirm Button -->
        <Button
          label="Confirm"
          type="submit"
          :disabled="!selectedDate || !selectedTime || !selectedDuration || !selectedTreatment || !selectedDoctor"
          variant="primary"
          size="lg"
          fullWidth
        />
      </div>
    </form>
  </Modal>
</template>

<style>
/* Chrome, Edge, Brave */
.hide-calendar-icon::-webkit-calendar-picker-indicator {
    opacity: 0;
    display: none;
}

.hide-time-icon::-webkit-calendar-picker-indicator {
    opacity: 0;
    display: none;
}
</style>