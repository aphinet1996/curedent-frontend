<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import Button from '~/components/Button.vue'

const props = defineProps<{
  show: boolean
}>()

const dateInput = ref<HTMLInputElement | null>(null)

const openDatepicker = () => {
  dateInput.value?.showPicker?.() // รองรับเบราว์เซอร์ที่ support
  // fallback: dateInput.value?.focus()
}

const emit = defineEmits(['close'])

const selectedDate = ref('')
const selectedTreatment = ref('')
const totalAmount = ref('10,000.-')
const selectedDF = ref('Necrotizing Ulcerative St..')
const selectedPaymentType = ref('')

const close = () => emit('close')

const confirm = () => {
  console.log({
    selectedDate: selectedDate.value,
    selectedTreatment: selectedTreatment.value,
    totalAmount: totalAmount.value,
    selectedDF: selectedDF.value,
    selectedPaymentType: selectedPaymentType.value,
  })
  close()
}
</script>

<template>
  <Modal :show="props.show" title="Payment" icon="formkit:dollar" @close="emit('close')" widthClass="max-w-sm">
    <form @submit.prevent="confirm" class="w-full">
      <!-- Form Section -->
      <div class="space-y-6">
        <!-- Date -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Date</label>
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

        <!-- Treatment -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Treatment</label>
          <select v-model="selectedTreatment" class="form-select w-full rounded-lg bg-gray-100 border border-gray-300">
            <option disabled value="">Select Treatment</option>
            <option>Cleaning</option>
            <option>Filling</option>
          </select>
        </div>

        <!-- Amount + DF -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm text-gray-700 mb-1">Total Amount</label>
            <input type="text" v-model="totalAmount" class="form-input w-full rounded-lg bg-gray-100 border border-gray-300" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">DF</label>
            <input type="text" v-model="selectedDF" class="form-input w-full rounded-lg bg-gray-100 border border-gray-300" />
          </div>
        </div>

        <!-- Payment Type -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">Payment Type</label>
          <select v-model="selectedPaymentType" class="form-select w-full rounded-lg bg-gray-100 border border-gray-300">
            <option disabled value="">Select Payment Type</option>
            <option>Cash</option>
            <option>Credit Card</option>
            <option>Transfer</option>
          </select>
        </div>

        <!-- Confirm Button -->
        <Button
          label="Confirm"
          type="submit"
          :disabled="!selectedDate || !selectedTreatment || !selectedPaymentType"
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
</style>