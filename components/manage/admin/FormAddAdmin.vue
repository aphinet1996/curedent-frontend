<script setup lang="ts">
import { ref, reactive } from 'vue'
import Modal from '~/components/Modal.vue'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'submit'])

const form = reactive({
    name: '',
    photo: null as File | null,
    type: '',
    productCode: '',
    brand: ''
})

const roles = ['Super Admin', 'Admin']

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target?.files?.[0]) {
        form.photo = target.files[0]
    }
}

const handleSubmit = () => {
    emit('submit', { ...form })
    resetForm()
}

const resetForm = () => {
    form.name = ''
    form.photo = null
    form.type = ''
    form.productCode = ''
    form.brand = ''
}
</script>

<template>
    <Modal :show="props.show" :title="$t('manage.admin.form.add.title')" @close="emit('close')">
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('manage.admin.form.add.upload_photo') }}</label>
                <input type="file" class="w-full border rounded px-3 py-2 text-sm" @change="onFileChange" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('manage.admin.form.add.user_name') }}</label>
                <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Type Name..." />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t('manage.admin.form.add.user_role') }}</label>
                <select v-model="form.type" class="w-full border rounded px-3 py-2 text-sm">
                    <option disabled value="">Choose Role</option>
                    <option v-for="r in roles" :key="r">{{ r }}</option>
                </select>
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