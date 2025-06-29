<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '~/stores/chat'
import { Icon } from '@iconify/vue'

const chatStore = useChatStore()
const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadProgress = ref(0)

const openFileDialog = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const onFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  const file = input.files[0]
  if (!file) return
  
  isUploading.value = true
  uploadProgress.value = 0
  
  try {
    // จำลองการอัปโหลด (ในระบบจริงจะใช้ API จริง)
    const simulateUpload = () => {
      const interval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
          clearInterval(interval)
          finishUpload(file)
        }
      }, 200)
    }
    
    const finishUpload = async (file: File) => {
      try {
        await chatStore.uploadAndSendFile(file)
        // รีเซ็ต input file เพื่อให้ผู้ใช้สามารถเลือกไฟล์เดิมซ้ำได้
        if (fileInputRef.value) fileInputRef.value.value = ''
      } finally {
        isUploading.value = false
        uploadProgress.value = 0
      }
    }
    
    simulateUpload()
  } catch (error) {
    console.error('Error uploading file:', error)
    isUploading.value = false
    uploadProgress.value = 0
  }
}
</script>

<template>
  <div class="relative">
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      @change="onFileSelected"
      :disabled="!chatStore.activeUser || isUploading"
    />
    
    <button 
      @click="openFileDialog" 
      class="p-2 rounded bg-gray-200 hover:bg-gray-100"
      :disabled="!chatStore.activeUser || isUploading"
    >
      <Icon v-if="!isUploading" icon="clarity:paperclip-line" class="w-5 h-5 text-blue-500" />
      <Icon v-else icon="eos-icons:loading" class="w-5 h-5 text-blue-500 animate-spin" />
    </button>
    
    <!-- แสดง progress bar ระหว่างอัปโหลด -->
    <div v-if="isUploading" class="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg p-3 z-10 w-64">
      <div class="text-sm mb-2">กำลังอัปโหลดไฟล์...</div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-500 h-2.5 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
    </div>
  </div>
</template>