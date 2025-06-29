// plugins/socket.client.ts
import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const socketUrl = config.public.apiBaseUrl || 'http://localhost:3001'
  
  // สร้าง socket instance
  const socket: Socket = io(socketUrl, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling']
  })
  
  // Auto connect เมื่อ client-side ready
  if (process.client) {
    socket.connect()
  }
  
  // Cleanup เมื่อ page unload
  if (process.client) {
    window.addEventListener('beforeunload', () => {
      socket.disconnect()
    })
  }
  
  return {
    provide: {
      socket
    }
  }
})

// ✅ Type declarations ที่ถูกต้องสำหรับ Nuxt 3
declare module '#app' {
  interface NuxtApp {
    $socket: Socket
  }
}

// ✅ ใช้ 'vue' แทน '@vue/runtime-core'
declare module 'vue' {
  interface ComponentCustomProperties {
    $socket: Socket
  }
}