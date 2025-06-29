<!-- <script setup lang="ts">
// ver 2
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '~/stores/chat'

// ใช้ Pinia store แทนการจัดการข้อมูลในคอมโพเนนต์
const chatStore = useChatStore()
const isSocketConnected = computed(() => chatStore.isSocketConnected)
// โหลดข้อมูลเมื่อคอมโพเนนต์ถูกโหลด
onMounted(async () => {
  if (chatStore.users.length === 0) {
    await chatStore.fetchChatList()
  }
})

// ฟังก์ชันเลือกผู้ใช้ที่กำลังแชท
const setActive = (userId: string) => {
  chatStore.setActiveUser(userId)
}

// ฟังก์ชันแสดงวันที่หรือเวลาล่าสุด
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  
  // หากเป็นวันนี้ ให้แสดงเฉพาะเวลา
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  }
  
  // หากเป็นภายในสัปดาห์นี้ ให้แสดงชื่อวัน
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (daysDiff < 7) {
    return date.toLocaleDateString('th-TH', { weekday: 'short' })
  }
  
  // เป็นวันอื่นให้แสดงวันที่
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}
</script>

<template>
    <div class="w-64 bg-white rounded-xl shadow-sm overflow-y-auto max-h-screen">
        <div class="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
            <div class="text-base font-semibold text-gray-700">Line Chat</div>
            <div v-if="isSocketConnected" class="text-xs text-green-500 flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Connected
            </div>
            <div v-else class="text-xs text-red-500 flex items-center">
                <span class="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                Offline
            </div>
        </div>
        <ul>
            <li v-for="user in chatStore.users" :key="user.userId" @click="setActive(user.userId)" :class="[
                'cursor-pointer px-4 py-3 flex items-center gap-3 transition-all',
                user.active ? 'bg-blue-50' : 'hover:bg-gray-50'
            ]">
                <div
                    class="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-white text-sm">
                    <img v-if="user.pictureUrl" :src="user.pictureUrl" alt="avatar" class="w-full h-full object-cover" />
                    <span v-else><Icon icon="mynaui:user-solid" class="w-5 h-5 text-gray-500" /></span>
                </div>

                <div class="flex-1 min-w-0 text-sm">
                    <div class="flex items-center justify-between">
                        <div :class="['font-medium truncate mr-1', user.active ? 'text-blue-700' : 'text-gray-800']">
                            {{ user.displayName }}
                        </div>
                        <div class="text-xs text-gray-500 whitespace-nowrap">{{ formatTime(user.timestamp) }}</div>
                    </div>
                    
                    <div class="flex text-xs text-gray-500 truncate">
                        <span v-if="user.source === 'admin'" class="text-gray-400 mr-1">คุณ:</span>
                        {{ user.lastMessage }}
                    </div>
                    
                    <div class="flex items-center mt-1">
                        <div v-if="user.source === 'user'" class="flex items-center text-xs text-red-500">
                            <span class="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                            <span>ยังไม่ได้อ่าน</span>
                        </div>
                        <div v-else class="flex items-center text-xs text-gray-400">
                            <Icon icon="heroicons:check" class="w-3 h-3 mr-1" />
                            <span>ส่งแล้ว</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        
        <div v-if="chatStore.loading.users" class="text-center py-4">
            <div class="text-sm text-gray-500">กำลังโหลดข้อมูล...</div>
        </div>
        
        <div v-if="!chatStore.loading.users && chatStore.users.length === 0" class="text-center py-4">
            <div class="text-sm text-gray-500">ไม่พบข้อมูลการแชท</div>
        </div>
        
        <div v-if="chatStore.error" class="text-center py-4">
            <div class="text-sm text-red-500">{{ chatStore.error }}</div>
        </div>
    </div>
</template> -->

<script setup lang="ts">
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '~/stores/chat'

// ใช้ Pinia store แทนการจัดการข้อมูลในคอมโพเนนต์
const chatStore = useChatStore()
const isSocketConnected = computed(() => chatStore.isSocketConnected)

// โหลดข้อมูลเมื่อคอมโพเนนต์ถูกโหลด
onMounted(async () => {
  // ตรวจสอบว่ามีผู้ใช้ทั้งหมดหรือไม่
  if (Object.values(chatStore.usersMap).flat().length === 0) {
    await chatStore.fetchChatList()
  }
})

// ใช้ getter allUsers ที่เราเพิ่มเข้าไป
const allUsers = computed(() => chatStore.allUsers)

// ฟังก์ชันเลือกผู้ใช้ที่กำลังแชท
const setActive = (userId: string) => {
  chatStore.setActiveUser(userId)
}

// ฟังก์ชันแสดงวันที่หรือเวลาล่าสุด
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  
  // หากเป็นวันนี้ ให้แสดงเฉพาะเวลา
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  }
  
  // หากเป็นภายในสัปดาห์นี้ ให้แสดงชื่อวัน
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (daysDiff < 7) {
    return date.toLocaleDateString('th-TH', { weekday: 'short' })
  }
  
  // เป็นวันอื่นให้แสดงวันที่
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

// ตรวจสอบแพลตฟอร์มปัจจุบัน
const currentPlatform = computed(() => chatStore.currentPlatform)

// ไอคอนสำหรับแพลตฟอร์มต่างๆ (ใช้ไอคอนมาตรฐานที่มีอยู่แล้ว)
const getPlatformIcon = (platform: string | undefined) => {
  if (platform === 'facebook') {
    return 'raphael:facebook'  // ไอคอนข้อความจาก Heroicons
  } else {
    return 'fa-brands:line'  // ไอคอนแชทจาก Heroicons
  }
}

// สีของไอคอนแพลตฟอร์ม
const getPlatformColor = (platform: string | undefined) => {
  return platform === 'facebook' ? 'text-blue-600' : 'text-green-600'
}

// กรองผู้ใช้
const showAllPlatforms = ref(true) // เพิ่มตัวแปรควบคุมการแสดงผล

// รายการผู้ใช้ที่จะแสดง
const displayUsers = computed(() => {
  if (showAllPlatforms.value) {
    return allUsers.value // แสดงผู้ใช้ทั้งหมด
  } else {
    // แสดงเฉพาะผู้ใช้ของแพลตฟอร์มปัจจุบัน
    return allUsers.value.filter(user => user.platform === currentPlatform.value)
  }
})

// สลับระหว่างการแสดงทั้งหมด vs. เฉพาะแพลตฟอร์มปัจจุบัน
const toggleDisplay = () => {
  showAllPlatforms.value = !showAllPlatforms.value
}
</script>

<template>
  <div class="w-64 bg-white rounded-xl shadow-sm overflow-y-auto max-h-screen">
    <div class="sticky top-0 bg-white border-b px-4 py-3">
      <!-- เพิ่มส่วนหัวพร้อมปุ่มสลับการแสดงผล -->
      <div class="flex justify-between items-center mb-2">
        <div class="text-base font-semibold text-gray-800">
          แชททั้งหมด
        </div>
        <div v-if="isSocketConnected" class="text-xs text-green-500 flex items-center">
          <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Connected
        </div>
        <div v-else class="text-xs text-red-500 flex items-center">
          <span class="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          Offline
        </div>
      </div>
      
      <!-- ปุ่มสำหรับกรองผู้ใช้ (ทั้งหมด/เฉพาะแพลตฟอร์ม) -->
      <div class="flex space-x-2 text-xs">
        <button 
          @click="toggleDisplay" 
          :class="[
            'px-2 py-1 rounded-md flex items-center',
            showAllPlatforms ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-500'
          ]"
        >
          <Icon icon="heroicons:users" class="w-3 h-3 mr-1" />
          ทั้งหมด
        </button>
        <button 
          @click="() => { showAllPlatforms = false; }" 
          :class="[
            'px-2 py-1 rounded-md flex items-center',
            !showAllPlatforms ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-500'
          ]"
        >
          <Icon :icon="getPlatformIcon(currentPlatform)" class="w-3 h-3 mr-1" />
          {{ currentPlatform === 'facebook' ? 'Facebook' : 'Line' }}
        </button>
      </div>
    </div>
    
    <ul>
      <li v-for="user in displayUsers" :key="user.userId" @click="setActive(user.userId)" :class="[
        'cursor-pointer px-4 py-3 flex items-center gap-3 transition-all',
        user.active ? 'bg-blue-50' : 'hover:bg-gray-50'
      ]">
        <div
          class="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-white text-sm">
          <img v-if="user.pictureUrl" :src="user.pictureUrl" alt="avatar" class="w-full h-full object-cover" />
          <span v-else><Icon icon="mynaui:user-solid" class="w-5 h-5 text-gray-500" /></span>
        </div>

        <div class="flex-1 min-w-0 text-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="['font-medium truncate mr-1', user.active ? 'text-blue-700' : 'text-gray-800']">
                {{ user.displayName }}
              </div>
              <!-- ไอคอนแพลตฟอร์มหลังชื่อ -->
              <Icon :icon="getPlatformIcon(user.platform)" 
                   :class="getPlatformColor(user.platform)" 
                   class="w-4 h-4 ml-1" />
            </div>
            <div class="text-xs text-gray-500 whitespace-nowrap">
              {{ formatTime(user.timestamp) }}
            </div>
          </div>
          
          <div class="flex text-xs text-gray-500 truncate">
            <span v-if="user.source === 'admin'" class="text-gray-400 mr-1">คุณ:</span>
            {{ user.lastMessage }}
          </div>
          
          <div class="flex items-center mt-1">
            <div v-if="user.source === 'user'" class="flex items-center text-xs text-red-500">
              <span class="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
              <span>ยังไม่ได้อ่าน</span>
            </div>
            <div v-else class="flex items-center text-xs text-gray-400">
              <Icon icon="heroicons:check" class="w-3 h-3 mr-1" />
              <span>ส่งแล้ว</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    
    <div v-if="chatStore.loading.users" class="text-center py-4">
      <div class="text-sm text-gray-500">กำลังโหลดข้อมูล...</div>
    </div>
    
    <div v-if="!chatStore.loading.users && displayUsers.length === 0" class="text-center py-4">
      <div class="text-sm text-gray-500">ไม่พบข้อมูลการแชท</div>
    </div>
    
    <div v-if="chatStore.error" class="text-center py-4">
      <div class="text-sm text-red-500">{{ chatStore.error }}</div>
    </div>
  </div>
</template>