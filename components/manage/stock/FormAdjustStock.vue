<!-- components/FormAdjustStock.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '~/components/Modal.vue'

const props = defineProps<{
    show: boolean
    count: number
    type: 'internal' | 'external'
}>()

const emit = defineEmits(['close', 'submit'])

const quantity = ref(props.count)

watch(() => props.count, (val) => {
    quantity.value = val
})

const handleSubmit = () => {
    emit('submit', { quantity: quantity.value, type: props.type })
    emit('close')
}
</script>

<template>
    <Modal :show="show" :title="$t('manage.stock.form.adjust.title')" @close="emit('close')">
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('manage.stock.form.adjust.quantity') }}</label>
                <input v-model="quantity" type="number" class="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div class="flex justify-end gap-2">
                <button @click="emit('close')" class="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-100">
                    {{ $t('button.cancel') }}</button>
                <button @click="handleSubmit"
                    class="px-4 py-2 rounded text-sm text-white bg-blue-500 hover:bg-blue-600">
                    {{ $t('button.confirm') }}</button>
            </div>
        </div>
    </Modal>
</template>