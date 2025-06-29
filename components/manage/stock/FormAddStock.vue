<script setup lang="ts">
import { ref, reactive } from 'vue'
import Modal from '~/components/Modal.vue'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'submit'])

const form = reactive({
    name: '',
    photo: null as File | null,
    type: '',
    remaining: 0,
    productCode: '',
    brand: ''
})

const types = ['Internal', 'External']

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target?.files?.[0]) {
        form.photo = target.files[0]
    }
}

const increase = () => form.remaining++
const decrease = () => {
    if (form.remaining > 0) form.remaining--
}

const handleSubmit = () => {
    emit('submit', { ...form })
    resetForm()
}

const resetForm = () => {
    form.name = ''
    form.photo = null
    form.type = ''
    form.remaining = 0
    form.productCode = ''
    form.brand = ''
}
</script>

<template>
    <Modal :show="props.show" :title="$t('manage.stock.form.add.title')" @close="emit('close')">
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('manage.stock.form.add.upload_photo') }}</label>
                <input type="file" class="w-full border rounded px-3 py-2 text-sm" @change="onFileChange" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('manage.stock.form.add.product_name') }}</label>
                <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Type Name..." />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('manage.stock.form.add.product_type') }}</label>
                <select v-model="form.type" class="w-full border rounded px-3 py-2 text-sm">
                    <option disabled value="">Choose Type</option>
                    <option v-for="t in types" :key="t">{{ t }}</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{
                    $t('manage.stock.form.add.remain') }}</label>
                <div class="flex items-center gap-3 border rounded px-3 py-2">
                    <button @click="decrease" class="text-lg text-gray-600">-</button>
                    <span class="text-sm w-6 text-center">{{ form.remaining }}</span>
                    <button @click="increase" class="text-lg text-gray-600">+</button>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ $t('manage.stock.form.add.product_code') }}</label>
                    <input v-model="form.productCode" type="text" class="w-full border rounded px-3 py-2 text-sm"
                        placeholder="Type here ..." />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ $t('manage.stock.form.add.product_brand') }}</label>
                    <input v-model="form.brand" type="text" class="w-full border rounded px-3 py-2 text-sm"
                        placeholder="Type here ..." />
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <button @click="emit('close')"
                    class="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-100">{{ $t('button.cancel') }}</button>
                <button @click="handleSubmit"
                    class="px-4 py-2 rounded text-sm text-white bg-blue-500 hover:bg-blue-600">{{ $t('button.add') }}</button>
            </div>
        </div>
    </Modal>
</template>

<style scoped>
input[type='file']::-webkit-file-upload-button {
    background: transparent;
    border: none;
    font-weight: 500;
}
</style>