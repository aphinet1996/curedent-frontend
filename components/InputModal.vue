<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import Modal from './Modal.vue'

interface Props {
    show: boolean
    title: string
    message: string
    placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: ''
})

const emit = defineEmits<{
    close: []
    confirm: [value: string]
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement>()

// Focus input when modal opens
watch(() => props.show, async (newVal) => {
    if (newVal) {
        inputValue.value = ''
        await nextTick()
        inputRef.value?.focus()
    }
})

const handleClose = () => {
    inputValue.value = ''
    emit('close')
}

const handleConfirm = () => {
    if (inputValue.value.trim()) {
        emit('confirm', inputValue.value.trim())
        inputValue.value = ''
    }
}
</script>

<template>
    <Modal :show="show" :title="title" widthClass="max-w-md" @close="handleClose">
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ message }}
                </label>
                <input ref="inputRef" v-model="inputValue" type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :placeholder="placeholder" @keyup.enter="handleConfirm" @keyup.escape="handleClose" />
            </div>

            <div class="flex justify-end gap-2">
                <button @click="handleClose"
                    class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm">
                    ยกเลิก
                </button>
                <button @click="handleConfirm" :disabled="!inputValue.trim()"
                    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm disabled:opacity-50">
                    เพิ่ม
                </button>
            </div>
        </div>
    </Modal>
</template>