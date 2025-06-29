<!-- <script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

interface PaymentItem {
    label: string
    children?: string[]
}

const payments = ref<PaymentItem[]>([
    { label: 'Installment 2 months' },
    { label: 'Installment 6 months' },
    { label: 'Installment 10 months' },
    {
        label: 'Credit Card',
        children: ['Mastercard', 'Visa']
    },
    { label: 'Scan QR Code' },
    { label: 'Cash' }
])

const removeItem = (index: number) => {
    payments.value.splice(index, 1)
}

const addItem = () => {
    // Mock เพิ่มใหม่
    payments.value.push({ label: 'New Payment Option' })
}
</script>

<template>
    <div class="bg-white p-4 rounded-xl shadow-sm">
        <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold text-gray-800">Payment Type</h3>
            <button @click="addItem"
                class="flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                <Icon icon="mdi:plus" class="w-4 h-4" />
                Add
            </button>
        </div>

        <ul class="divide-y">
            <li v-for="(item, index) in payments" :key="index" class="py-2 flex justify-between items-start">
                <div>
                    <div class="text-sm text-gray-800">{{ item.label }}</div>
                    <ul v-if="item.children" class="list-disc list-inside text-gray-500 text-sm mt-1">
                        <li v-for="(child, i) in item.children" :key="i">{{ child }}</li>
                    </ul>
                </div>
                <button @click="removeItem(index)" class="text-gray-400 hover:text-red-500">
                    <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
                </button>
            </li>
        </ul>
    </div>
</template> -->

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'

interface PaymentItem {
  label: string
  children?: string[]
}

const payments = ref<PaymentItem[]>([
  { label: 'Installment 3 months' },
  { label: 'Installment 6 months' },
  { label: 'Installment 10 months' },
  { label: 'Credit Card', children: ['Mastercard', 'Visa'] },
  { label: 'Scan QR Code' },
  { label: 'Cash' }
])

const showModal = ref(false)
const newLabel = ref('')

const removeItem = (index: number) => {
  payments.value.splice(index, 1)
}

const addItem = () => {
  const label = newLabel.value.trim()
  if (label) {
    payments.value.push({ label })
    newLabel.value = ''
    showModal.value = false
  }
}
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-sm">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold text-gray-800">Payment Type</h3>
      <button @click="showModal = true"
        class="flex rounded-lg items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">
        <Icon icon="mdi:add" class="w-4 h-4" />
        Add
      </button>
    </div>

    <ul class=" divide-y divide-gray-200">
      <li v-for="(item, index) in payments" :key="index" class="py-2 flex justify-between items-start">
        <div>
          <div class="text-sm text-gray-800">{{ item.label }}</div>
          <ul v-if="item.children" class="list-disc list-inside text-gray-500 text-sm mt-1">
            <li v-for="(child, i) in item.children" :key="i">{{ child }}</li>
          </ul>
        </div>
        <button @click="removeItem(index)" class="text-gray-400 hover:text-red-500">
          <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
        </button>
      </li>
    </ul>

    <!-- Modal for Adding -->
    <Modal :show="showModal" title="Add Payment Type" @close="showModal = false">
      <div class="space-y-4">
        <input v-model="newLabel" type="text" placeholder="Type here..."
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200" />
        <div class="flex justify-end gap-2">
          <button @click="showModal = false"
            class="text-sm px-4 py-1.5 rounded-lg border border-gray-400 text-gray-500 hover:bg-gray-100">
            Cancel
          </button>
          <button @click="addItem"
            class="text-sm px-4 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Add
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>