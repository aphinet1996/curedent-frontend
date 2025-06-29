<!-- <script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import menuItems from '~/mock/menus.json'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const openSubmenus = ref<string[]>([])
const route = useRoute()
const { locale } = useI18n()

const pathWithoutLocale = computed(() => {
  const regex = new RegExp(`^/${locale.value}(/|$)`)
  return route.path.replace(regex, '/')
})

function toggleSub(label: string) {
  if (openSubmenus.value.includes(label)) {
    openSubmenus.value = openSubmenus.value.filter(l => l !== label)
  } else {
    openSubmenus.value.push(label)
  }
}

function isOpen(label: string) {
  return openSubmenus.value.includes(label)
}

function isActiveRoute(path: string | undefined) {
  if (!path) return false
  return pathWithoutLocale.value === path || pathWithoutLocale.value.startsWith(path + '/')
}

function shouldShowSubmenu(item: any) {
  if (isOpen(item.label)) return true
  if (item.children && Array.isArray(item.children)) {
    return item.children.some((child: any) => isActiveRoute(child.to))
  }
  return false
}
</script>

<template>
  <aside class="w-64 bg-white h-screen px-4 py-6">

    <div class="flex justify-center mb-10">
      <img src="/logo.png" class="h-12" alt="Curedent Logo" />
    </div>

    <nav class="space-y-2">
      <div v-for="item in menuItems" :key="item.label">
        <NuxtLink v-if="!item.children" :to="item.to" class="flex items-center gap-3 px-3 py-2 rounded-md relative"
          :class="{
            'bg-blue-50 text-blue-600': isActiveRoute(item.to),
            'text-gray-500 hover:bg-gray-100': !isActiveRoute(item.to)
          }">
          <span v-if="isActiveRoute(item.to)" class="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r"></span>
          <Icon :icon="item.icon" class="w-5 h-5" />
          <span class="text-sm font-medium text-gray-500">{{ item.label }}</span>
        </NuxtLink>

        <div v-else>
          <div class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
            <Icon :icon="item.icon" class="w-5 h-5 text-gray-700" />

            <NuxtLink :to="item.to" class="flex-1 text-sm font-medium text-gray-800">
              {{ item.label }}
            </NuxtLink>

            <button @click.stop="toggleSub(item.label)" class="ml-auto">
              <Icon :icon="isOpen(item.label) ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                class="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <transition name="fade">
            <div v-if="item.children && shouldShowSubmenu(item)" class="ml-6 mt-1 bg-gray-50 rounded-md px-3 py-2">
              <NuxtLink v-for="child in item.children" :key="child.label" :to="child.to" class="block py-1 text-sm"
                :class="{
                  'text-blue-600 font-medium bg-blue-50 rounded': isActiveRoute(child.to),
                  'text-gray-600 hover:text-blue-600': !isActiveRoute(child.to)
                }">
                {{ child.label }}
              </NuxtLink>
            </div>
          </transition>
        </div>
      </div>
    </nav>
  </aside>
</template> -->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import menuItems from '~/mock/menus.json'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'

const openSubmenus = ref<string[]>([])
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { locale } = useI18n()

const pathWithoutLocale = computed(() => {
  const regex = new RegExp(`^/${locale.value}(/|$)`)
  return route.path.replace(regex, '/')
})

function toggleSub(label: string) {
  if (openSubmenus.value.includes(label)) {
    openSubmenus.value = openSubmenus.value.filter(l => l !== label)
  } else {
    openSubmenus.value.push(label)
  }
}

function isOpen(label: string) {
  return openSubmenus.value.includes(label)
}

function isActiveRoute(path: string | undefined) {
  if (!path) return false
  return pathWithoutLocale.value === path || pathWithoutLocale.value.startsWith(path + '/')
}

function shouldShowSubmenu(item: any) {
  if (isOpen(item.label)) return true
  if (item.children && Array.isArray(item.children)) {
    return item.children.some((child: any) => isActiveRoute(child.to))
  }
  return false
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="flex flex-col w-64 bg-white h-screen px-4 py-6">

    <!-- Logo -->
    <div class="flex justify-center mb-10">
      <img src="/logo.png" class="h-12" alt="Curedent Logo" />
    </div>

    <!-- Menu -->
    <nav class="space-y-2 flex-1">
      <div v-for="item in menuItems" :key="item.label">

        <!-- Logout Item -->
        <button
          v-if="item.label === 'Log Out'"
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Icon :icon="item.icon" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ item.label }}</span>
        </button>

        <!-- Single Link -->
        <NuxtLink
          v-else-if="!item.children"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-md relative"
          :class="{
            'bg-blue-50 text-blue-600': isActiveRoute(item.to),
            'text-gray-500 hover:bg-gray-100': !isActiveRoute(item.to)
          }"
        >
          <span
            v-if="isActiveRoute(item.to)"
            class="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r"
          ></span>
          <Icon :icon="item.icon" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ item.label }}</span>
        </NuxtLink>

        <!-- Link with Submenu -->
        <div v-else>
          <div
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <Icon :icon="item.icon" class="w-5 h-5 text-gray-700" />
            <NuxtLink
              :to="item.to"
              class="flex-1 text-sm font-medium text-gray-800"
            >
              {{ item.label }}
            </NuxtLink>
            <button @click.stop="toggleSub(item.label)" class="ml-auto">
              <Icon
                :icon="isOpen(item.label) ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                class="w-4 h-4 text-gray-500"
              />
            </button>
          </div>
          <transition name="fade">
            <div
              v-if="item.children && shouldShowSubmenu(item)"
              class="ml-6 mt-1 bg-gray-50 rounded-md px-3 py-2"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.label"
                :to="child.to"
                class="block py-1 text-sm"
                :class="{
                  'text-blue-600 font-medium bg-blue-50 rounded': isActiveRoute(child.to),
                  'text-gray-600 hover:text-blue-600': !isActiveRoute(child.to)
                }"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </transition>
        </div>
      </div>
    </nav>
  </aside>
</template>