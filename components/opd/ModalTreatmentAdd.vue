<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import Button from '~/components/Button.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const selectedTreatment = ref('')
const selectedDoctor = ref('')
const selectedNotes = ref('')

const close = () => emit('close')

const confirm = () => {
  console.log({
    selectedTreatment: selectedTreatment.value,
    selectedDoctor: selectedDoctor.value,
    selectedNotes: selectedNotes.value,
  })
  close()
}
</script>

<template>
  <Modal :show="props.show" title="Treatment" icon="mdi:tooth-outline" @close="emit('close')" widthClass="max-w-sm">
    <form @submit.prevent="confirm" class="w-full">
      <div class="space-y-6">
        <div>
          <label class="block text-sm text-gray-700 mb-1">Treatment</label>
          <select v-model="selectedTreatment" class="form-select w-full rounded-lg bg-gray-100 border border-gray-300">
            <option disabled value="">Select Treatment</option>
            <option>Cleaning</option>
            <option>Filling</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-700 mb-1">Doctor</label>
          <select v-model="selectedDoctor" class="form-select w-full rounded-lg bg-gray-100 border border-gray-300">
            <option disabled value="">Select Doctor</option>
            <option>Cash</option>
            <option>Credit Card</option>
            <option>Transfer</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-700 mb-1">Notes</label>
          <div class="relative">
            <input type="text" v-model="selectedNotes"
              class="form-input w-full pr-10 hide-calendar-icon rounded-lg bg-gray-100 border border-gray-300"
              placeholder="Notes" />

          </div>
        </div>

        <Button label="Confirm" type="submit" :disabled="!selectedTreatment || !selectedDoctor" variant="primary"
          size="lg" fullWidth />
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
</style>