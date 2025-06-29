<!-- <script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const messages = ref([
    { id: 1, text: 'สวัสดีค่ะ', sender: 'user' },
    { id: 2, text: 'สวัสดีครับ มีอะไรให้ช่วยไหมครับ', sender: 'admin' },
    { id: 3, text: 'อยากนัดหมอฟันค่ะ', sender: 'user' },
    { id: 4, text: 'ได้เลยครับ เดี๋ยวผมเช็คคิวให้นะครับ', sender: 'admin' }
])

const newMessage = ref('')

const sendMessage = () => {
    if (!newMessage.value.trim()) return
    messages.value.push({ id: Date.now(), text: newMessage.value, sender: 'admin' })
    newMessage.value = ''
}
</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm">
        <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <div class="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                    class="w-10 h-10 rounded-full object-cover" />
                <div>
                    <div class="font-semibold text-blue-700">Casey Lou</div>
                    <div class="text-xs text-gray-500">HN #1123213124</div>
                    <div class="text-xs text-gray-400 flex">
                        <Icon icon="mynaui:user-solid" class="w-4 h-4 text-gray-500" />
                        Created manually
                    </div>
                </div>
            </div>
            <span class="flex text-xs text-green-700 bg-green-100 px-2 py-1 rounded-lg"> 
                <span class="flex w-2 h-2 me-2 bg-green-500 rounded-full mt-1"></span>
                Active</span>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <div v-for="msg in messages" :key="msg.id" class="flex"
                :class="msg.sender === 'admin' ? 'justify-end' : 'justify-start'">
                <div class="flex items-end gap-2" v-if="msg.sender === 'user'">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                        class="w-8 h-8 rounded-full object-cover" />
                    <div class="bg-gray-100 px-4 py-2 rounded-xl rounded-bl-none text-sm text-gray-800 max-w-xs">
                        {{ msg.text }}
                    </div>
                </div>
                <div class="flex items-end gap-2" v-else>
                    <div class="bg-blue-100 px-4 py-2 rounded-xl rounded-br-none text-sm text-gray-800 max-w-xs">
                        {{ msg.text }}
                    </div>
                    <div class="w-6 h-6 bg-blue-100 rounded-full"></div>
                </div>
            </div>
        </div>

        <div class="border-t border-gray-200 px-4 py-2 flex items-center gap-2">
            <button class="p-2 rounded bg-gray-200 hover:bg-gray-100">
                <Icon icon="clarity:paperclip-line" class="w-5 h-5 text-blue-500" />
            </button>
            <input v-model="newMessage" type="text" placeholder="Type here ..."
                class="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none"
                @keydown.enter="sendMessage" />
            <button @click="sendMessage"
                class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                Send
            </button>
        </div>
    </div>
</template> -->

<!-- <script setup lang="ts">
// ver 2
import { ref, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '~/stores/chat'

const chatStore = useChatStore()
const newMessage = ref('')
const messageRef = ref<HTMLDivElement | null>(null)

// ส่งข้อความใหม่
const sendMessage = async () => {
    if (!newMessage.value.trim() || chatStore.sending) return

    // ส่งข้อความผ่าน Pinia store
    const success = await chatStore.sendMessage(newMessage.value)
    if (success) {
        newMessage.value = ''

        // เลื่อนไปยังข้อความล่าสุด
        setTimeout(() => {
            if (messageRef.value) {
                messageRef.value.scrollTop = messageRef.value.scrollHeight
            }
        }, 100)
    }
}

const socketStatus = computed(() => {
    return chatStore.isSocketConnected ? 'ออนไลน์' : 'ออฟไลน์'
})

const socketStatusClass = computed(() => {
    return chatStore.isSocketConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
})

// โหลดข้อความใหม่เมื่อเปลี่ยนผู้ใช้
watchEffect(() => {
    if (chatStore.activeUserId) {
        chatStore.fetchMessages()
    }
})

// เลื่อนไปยังข้อความล่าสุดเมื่อโหลดข้อความเสร็จ
watchEffect(() => {
    if (!chatStore.loading.messages && messageRef.value) {
        messageRef.value.scrollTop = messageRef.value.scrollHeight
    }
})

// แปลงเวลาเป็นรูปแบบที่อ่านง่าย
const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}
</script> -->

<!-- <script setup lang="ts">
import { ref, watchEffect, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '~/stores/chat'

const chatStore = useChatStore()
const newMessage = ref('')
const messageRef = ref<HTMLDivElement | null>(null)
const isScrolledUp = ref(false)
const isInitialLoad = ref(true) // ✅ เพิ่มตัวแปรนี้

const sendMessage = async () => {
  if (!newMessage.value.trim() || chatStore.sending) return

  const success = await chatStore.sendMessage(newMessage.value)
  if (success) {
    newMessage.value = ''
    isScrolledUp.value = false
    scrollToBottom()
  }
}

const socketStatus = computed(() => chatStore.isSocketConnected ? 'ออนไลน์' : 'ออฟไลน์')
const socketStatusClass = computed(() => chatStore.isSocketConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')

const scrollToBottom = () => {
  nextTick(() => {
    if (messageRef.value) {
      messageRef.value.scrollTop = messageRef.value.scrollHeight
    }
  })
}

const handleScroll = () => {
  if (!messageRef.value) return

  const { scrollTop, scrollHeight, clientHeight } = messageRef.value
  const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100
  isScrolledUp.value = !scrolledToBottom
}

// ✅ เมื่อเปลี่ยนห้องแชท
watchEffect(async () => {
  if (chatStore.activeUserId) {
    isInitialLoad.value = true
    isScrolledUp.value = false
    await chatStore.fetchMessages()
    await nextTick()
  }
})

// ✅ เมื่อข้อความเปลี่ยน
watch(
  () => chatStore.messages.map((m) => m._id),
  async (messages, prevMessages) => {
    // ✅ ถ้าเป็นรอบแรก ให้ scroll และเคลียร์สถานะโหลดครั้งแรก
    if (isInitialLoad.value) {
      isInitialLoad.value = false
      await nextTick()
      scrollToBottom()
      return
    }

    // ✅ ถ้ามีข้อความใหม่ และผู้ใช้ไม่ได้ scroll ขึ้น
    if (messages.length > prevMessages.length && !isScrolledUp.value) {
      await nextTick()
      scrollToBottom()
    }
  }
)

onMounted(() => {
  if (messageRef.value) {
    messageRef.value.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  if (messageRef.value) {
    messageRef.value.removeEventListener('scroll', handleScroll)
  }
})

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm">
        <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <div class="flex items-center gap-3" v-if="chatStore.activeUser">
                <img v-if="chatStore.userProfile?.pictureUrl" :src="chatStore.userProfile.pictureUrl"
                    class="w-10 h-10 rounded-full object-cover" />
                <div v-else class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Icon icon="mynaui:user-solid" class="w-5 h-5 text-gray-500" />
                </div>
                <div>
                    <div class="font-semibold text-blue-700">{{ chatStore.userProfile?.displayName ||
                        chatStore.activeUser.displayName }}</div>
                    <div v-if="chatStore.userProfile?.statusMessage" class="text-xs text-gray-500 line-clamp-1">
                        {{ chatStore.userProfile.statusMessage }}
                    </div>
                    <div class="text-xs text-gray-400 flex items-center">
                        <Icon icon="mdi:line" class="w-4 h-4 text-green-500 mr-1" />
                        Line User
                    </div>
                </div>
            </div>
            <div v-else class="text-gray-500">กรุณาเลือกผู้ใช้เพื่อแชท</div>
        </div>

        <div ref="messageRef" class="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth" @scroll="handleScroll">
            <div v-if="chatStore.loading.messages" class="text-center py-4">
                <div class="text-sm text-gray-500">กำลังโหลดข้อความ...</div>
            </div>

            <button v-if="isScrolledUp && chatStore.messages.length > 0" @click="scrollToBottom"
                class="absolute bottom-22 left-145 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                <Icon icon="mdi:arrow-down" class="w-5 h-5" />
            </button>

            <div v-for="msg in chatStore.sortedMessages" :key="msg._id" class="flex"
                :class="msg.source === 'admin' ? 'justify-end' : 'justify-start'">
                <div class="flex items-end gap-2" v-if="msg.source === 'user'">
                    <img v-if="chatStore.userProfile?.pictureUrl" :src="chatStore.userProfile.pictureUrl"
                        class="w-8 h-8 rounded-full object-cover" />
                    <div v-else class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon icon="mynaui:user-solid" class="w-4 h-4 text-gray-500" />
                    </div>
                    <div class="bg-gray-100 px-4 py-2 rounded-xl rounded-bl-none text-sm text-gray-800 max-w-xs">
                        {{ msg.text }}
                        <div class="text-xs text-gray-400 text-right mt-1">{{ formatTime(msg.timestamp) }}</div>
                    </div>
                </div>
                <div class="flex items-end gap-2" v-else>
                    <div class="bg-blue-100 px-4 py-2 rounded-xl rounded-br-none text-sm text-gray-800 max-w-xs">
                        {{ msg.text }}
                        <div class="text-xs text-gray-400 text-right mt-1">{{ formatTime(msg.timestamp) }}</div>
                    </div>
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon icon="mynaui:user-solid" class="w-3 h-3 text-gray-500" />
                    </div>
                </div>
            </div>

            <div v-if="!chatStore.loading.messages && chatStore.messages.length === 0 && chatStore.activeUser"
                class="text-center py-4">
                <div class="text-sm text-gray-500">ยังไม่มีประวัติการสนทนา</div>
                <div class="text-xs text-gray-400 mt-1">เริ่มต้นการสนทนากับผู้ใช้นี้</div>
            </div>
        </div>

        <div class="border-t border-gray-200 px-4 py-2 flex items-center gap-2">
            <button class="p-2 rounded bg-gray-200 hover:bg-gray-100" :disabled="!chatStore.activeUser">
                <Icon icon="clarity:paperclip-line" class="w-5 h-5 text-blue-500" />
            </button>
            <input v-model="newMessage" type="text" placeholder="พิมพ์ข้อความที่นี่ ..."
                class="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none"
                @keydown.enter="sendMessage" :disabled="!chatStore.activeUser || chatStore.sending" />
            <button @click="sendMessage" :disabled="!chatStore.activeUser || !newMessage.trim() || chatStore.sending"
                class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50">
                <span>ส่ง</span>
                <Icon v-if="!chatStore.sending" icon="material-symbols:send" class="w-4 h-4 ml-1" />
                <Icon v-else icon="eos-icons:loading" class="w-4 h-4 ml-1 animate-spin" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.scroll-smooth {
    scroll-behavior: smooth;
}
</style> -->

<script setup lang="ts">
import { ref, watchEffect, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '~/stores/chat'
import FileUploader from './FileUploader.vue'

const chatStore = useChatStore()
const newMessage = ref('')
const messageRef = ref<HTMLDivElement | null>(null)
const isScrolledUp = ref(false)
const isInitialLoad = ref(true) // ตัวแปรสำหรับตรวจสอบการโหลดครั้งแรก

const sendMessage = async () => {
  if (!newMessage.value.trim() || chatStore.sending) return

  const success = await chatStore.sendMessage(newMessage.value)
  if (success) {
    newMessage.value = ''
    isScrolledUp.value = false
    scrollToBottom()
  }
}

const formatFileSize = (size?: number) => {
  if (!size) return 'ไม่ระบุขนาด'

  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

// เพิ่มฟังก์ชันสำหรับเลือกไอคอนตามประเภทไฟล์
const getFileIcon = (fileType?: string) => {
  if (!fileType) return 'mdi:file-document-outline'

  if (fileType.includes('image')) return 'mdi:file-image-outline'
  if (fileType.includes('video')) return 'mdi:file-video-outline'
  if (fileType.includes('audio')) return 'mdi:file-music-outline'
  if (fileType.includes('pdf')) return 'mdi:file-pdf-outline'
  if (fileType.includes('word') || fileType.includes('document')) return 'mdi:file-word-outline'
  if (fileType.includes('excel') || fileType.includes('sheet')) return 'mdi:file-excel-outline'

  return 'mdi:file-document-outline'
}

const previewImage = ref<string | null>(null)

const openImagePreview = (url: string) => {
  previewImage.value = url
}

const closeImagePreview = () => {
  previewImage.value = null
}

const socketStatus = computed(() => chatStore.isSocketConnected ? 'ออนไลน์' : 'ออฟไลน์')
const socketStatusClass = computed(() => chatStore.isSocketConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')

const scrollToBottom = () => {
  nextTick(() => {
    if (messageRef.value) {
      messageRef.value.scrollTop = messageRef.value.scrollHeight
    }
  })
}

const handleScroll = () => {
  if (!messageRef.value) return

  const { scrollTop, scrollHeight, clientHeight } = messageRef.value
  const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100
  isScrolledUp.value = !scrolledToBottom
}

// เมื่อเปลี่ยนห้องแชท
watchEffect(async () => {
  if (chatStore.activeUserId) {
    isInitialLoad.value = true
    isScrolledUp.value = false
    await chatStore.fetchMessages()
    await nextTick()
  }
})

// เมื่อข้อความเปลี่ยน
watch(
  () => chatStore.messages.map((m) => m._id),
  async (messages, prevMessages) => {
    // ถ้าเป็นรอบแรก ให้ scroll และเคลียร์สถานะโหลดครั้งแรก
    if (isInitialLoad.value) {
      isInitialLoad.value = false
      await nextTick()
      scrollToBottom()
      return
    }

    // ถ้ามีข้อความใหม่ และผู้ใช้ไม่ได้ scroll ขึ้น
    if (messages.length > prevMessages.length && !isScrolledUp.value) {
      await nextTick()
      scrollToBottom()
    }
  }
)

onMounted(() => {
  if (messageRef.value) {
    messageRef.value.addEventListener('scroll', handleScroll)
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  if (messageRef.value) {
    messageRef.value.removeEventListener('scroll', handleScroll)
  }
  document.removeEventListener('click', handleClickOutside)
})

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

// เพิ่มฟังก์ชันสำหรับจัดการกับการโหลดรูปภาพสติกเกอร์ไม่สำเร็จ
const handleStickerError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.onerror = null // ป้องกันการวนลูป
  target.src = '/placeholder-sticker.png' // ให้แสดงรูปแทน
}

const isEmojiPickerOpen = ref(false)
const emojiPickerRef = ref<HTMLElement | null>(null)
const emojiButtonRef = ref<HTMLElement | null>(null)

const toggleEmojiPicker = (e: MouseEvent) => {
  e.stopPropagation() // กัน event click ไปโดน document
  isEmojiPickerOpen.value = !isEmojiPickerOpen.value
}

const handleEmojiSelect = (emoji: { i: string }) => {
  const input = document.querySelector<HTMLInputElement>('input[type="text"]')

  if (input) {
    const startPos = input.selectionStart ?? 0
    const endPos = input.selectionEnd ?? 0

    newMessage.value =
      newMessage.value.substring(0, startPos) +
      emoji.i +
      newMessage.value.substring(endPos)

    nextTick(() => {
      input.focus()
      const newCursorPos = startPos + emoji.i.length
      input.setSelectionRange(newCursorPos, newCursorPos)
    })
  }

  isEmojiPickerOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  
  // ตรวจสอบว่าคลิกอยู่นอก emoji picker และนอกปุ่มที่ใช้เปิด emoji picker
  if (isEmojiPickerOpen.value && 
      emojiPickerRef.value && 
      emojiButtonRef.value && 
      !emojiPickerRef.value.contains(target) && 
      !emojiButtonRef.value.contains(target)) {
    isEmojiPickerOpen.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm">
    <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
      <div class="flex items-center gap-3" v-if="chatStore.activeUser">
        <img v-if="chatStore.userProfile?.pictureUrl" :src="chatStore.userProfile.pictureUrl"
          class="w-10 h-10 rounded-full object-cover" />
        <div v-else class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon icon="mynaui:user-solid" class="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <div class="font-semibold text-blue-700">{{ chatStore.userProfile?.displayName ||
            chatStore.activeUser.displayName }}</div>
          <div v-if="chatStore.userProfile?.statusMessage" class="text-xs text-gray-500 line-clamp-1">
            {{ chatStore.userProfile.statusMessage }}
          </div>
          <div class="text-xs text-gray-400 flex items-center">
            <Icon icon="mdi:line" class="w-4 h-4 text-green-500 mr-1" />
            Line User
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">กรุณาเลือกผู้ใช้เพื่อแชท</div>
    </div>

    <div ref="messageRef" class="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth" @scroll="handleScroll">
      <div v-if="chatStore.loading.messages" class="text-center py-4">
        <div class="text-sm text-gray-500">กำลังโหลดข้อความ...</div>
      </div>

      <button v-if="isScrolledUp && chatStore.messages.length > 0" @click="scrollToBottom"
        class="absolute bottom-22 left-145 bg-blue-500 text-white p-2 rounded-full shadow-lg">
        <Icon icon="mdi:arrow-down" class="w-5 h-5" />
      </button>

      <div v-for="msg in chatStore.sortedMessages" :key="msg._id" class="flex"
        :class="msg.source === 'admin' ? 'justify-end' : 'justify-start'">
        <div class="flex items-end gap-2" v-if="msg.source === 'user'">
          <img v-if="chatStore.userProfile?.pictureUrl" :src="chatStore.userProfile.pictureUrl"
            class="w-8 h-8 rounded-full object-cover" />
          <div v-else class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Icon icon="mynaui:user-solid" class="w-4 h-4 text-gray-500" />
          </div>

          <!-- สติกเกอร์ LINE -->
          <div v-if="msg.messageType === 'sticker'" class="px-2 py-2 max-w-xs">
            <img :src="`https://stickershop.line-scdn.net/stickershop/v1/sticker/${msg.stickerId}/android/sticker.png`"
              class="w-24 h-24 object-contain" @error="handleStickerError" alt="LINE Sticker" />
            <div class="text-xs text-gray-400 text-right mt-1">{{ formatTime(msg.timestamp) }}</div>
          </div>

          <!-- ไฟล์รูปภาพ (จาก user) -->
          <div v-else-if="msg.messageType === 'file' && msg.fileType?.startsWith('image/')"
            class="max-w-xs overflow-hidden">
            <div class="bg-gray-100 rounded-xl rounded-bl-none p-1">
              <img v-if="msg.fileUrl" :src="msg.fileUrl" class="max-w-full h-auto rounded-lg"
                :alt="msg.fileName || 'รูปภาพ'" @click="openImagePreview(msg.fileUrl)" />
              <div class="text-xs text-gray-400 text-right mt-1 px-2">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </div>

          <!-- ไฟล์ทั่วไป (จาก user) -->
          <div v-else-if="msg.messageType === 'file'"
            class="bg-gray-100 px-4 py-3 rounded-xl rounded-bl-none text-sm text-gray-800 max-w-xs">
            <div class="flex items-center gap-2">
              <Icon :icon="getFileIcon(msg.fileType)" class="w-6 h-6 text-blue-500" />
              <div>
                <div class="font-medium">{{ msg.fileName || 'ไฟล์' }}</div>
                <div class="text-xs text-gray-500">{{ formatFileSize(msg.fileSize) }}</div>
              </div>
            </div>
            <a v-if="msg.fileUrl" :href="msg.fileUrl" target="_blank"
              class="mt-2 text-xs text-blue-500 block hover:underline">ดาวน์โหลด</a>
            <div class="text-xs text-gray-400 text-right mt-1">{{ formatTime(msg.timestamp) }}</div>
          </div>

          <!-- ข้อความปกติ -->
          <div v-else class="bg-gray-100 px-4 py-2 rounded-xl rounded-bl-none text-sm text-gray-800 max-w-xs">
            {{ msg.text }}
            <div class="text-xs text-gray-400 text-right mt-1">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>
        <div class="flex items-end gap-2" v-else>
          <!-- สติกเกอร์ LINE (จาก admin) -->
          <div v-if="msg.messageType === 'sticker'" class="px-2 py-2 max-w-xs">
            <img :src="`https://stickershop.line-scdn.net/stickershop/v1/sticker/${msg.stickerId}/android/sticker.png`"
              class="w-24 h-24 object-contain" @error="handleStickerError" alt="LINE Sticker" />
            <div class="text-xs text-gray-400 text-right mt-1">{{ formatTime(msg.timestamp) }}</div>
          </div>

          <div v-else-if="msg.messageType === 'file' && msg.fileType?.startsWith('image/')"
            class="max-w-xs overflow-hidden">
            <div class="bg-blue-100 rounded-xl rounded-br-none p-1">
              <img v-if="msg.fileUrl" :src="msg.fileUrl" class="max-w-full h-auto rounded-lg"
                :alt="msg.fileName || 'รูปภาพ'" @click="openImagePreview(msg.fileUrl)" />
              <div class="text-xs text-gray-400 text-right mt-1 px-2">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </div>

          <!-- ไฟล์ทั่วไป (จาก admin) -->
          <div v-else-if="msg.messageType === 'file'"
            class="bg-blue-100 px-4 py-3 rounded-xl rounded-br-none text-sm text-gray-800 max-w-xs">
            <!-- เหมือนกับโค้ดไฟล์ทั่วไปฝั่ง user แต่เปลี่ยนสีพื้นหลัง -->
          </div>

          <!-- ข้อความปกติ -->
          <div v-else class="bg-blue-100 px-4 py-2 rounded-xl rounded-br-none text-sm text-gray-800 max-w-xs">
            {{ msg.text }}
            <div class="text-xs text-gray-400 text-right mt-1">{{ formatTime(msg.timestamp) }}</div>
          </div>

          <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon icon="mynaui:user-solid" class="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>

      <div v-if="!chatStore.loading.messages && chatStore.messages.length === 0 && chatStore.activeUser"
        class="text-center py-4">
        <div class="text-sm text-gray-500">ยังไม่มีประวัติการสนทนา</div>
        <div class="text-xs text-gray-400 mt-1">เริ่มต้นการสนทนากับผู้ใช้นี้</div>
      </div>
    </div>

    <div class="border-t border-gray-200 px-4 py-2 flex items-center gap-2">
      <FileUploader :disabled="!chatStore.activeUser" />

      <!-- เปลี่ยนเป็นการรวม input และ emoji picker -->
      <div class="flex-1 relative">
        <!-- input -->
        <input
          v-model="newMessage"
          type="text"
          placeholder="พิมพ์ข้อความที่นี่ ..."
          class="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          @keydown.enter="sendMessage"
          :disabled="!chatStore.activeUser || chatStore.sending"
        />
      
        <!-- ปุ่ม emoji อยู่ใน input -->
        <button
          ref="emojiButtonRef"
          @click="toggleEmojiPicker"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition"
          :disabled="!chatStore.activeUser"
          type="button"
        >
          <Icon icon="fluent:emoji-16-regular" class="w-5 h-5 text-gray-400 hover:text-blue-500" />
        </button>
      
        <!-- emoji picker อยู่ด้านล่าง ไม่กระทบปุ่ม -->
        <div
          v-if="isEmojiPickerOpen"
          ref="emojiPickerRef"
          class="absolute bottom-full right-0 mb-2 z-50"
        >
          <NuxtEmojiPicker @select="handleEmojiSelect" :theme="'light'" :hide-search="true" />
        </div>
      </div>

      <button @click="sendMessage" :disabled="!chatStore.activeUser || !newMessage.trim() || chatStore.sending"
        class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50 hover:opacity-90 transition-opacity">
        <span>ส่ง</span>
        <Icon v-if="!chatStore.sending" icon="material-symbols:send" class="w-4 h-4 ml-1" />
        <Icon v-else icon="eos-icons:loading" class="w-4 h-4 ml-1 animate-spin" />
      </button>
    </div>

  </div>
</template>

<style scoped>
.scroll-smooth {
  scroll-behavior: smooth;
}

</style>