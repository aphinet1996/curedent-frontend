<script setup lang="ts">
import { onMounted } from 'vue'
import { useFlowbite } from '~/composables/useFlowbite'
import { Icon } from '@iconify/vue'
import Sidebar from '~/components/Sidebar.vue'
import Search from '~/components/Search.vue'
import LanguageSwitch from '~/components/DropdownLanguage.vue'
// import menuItems from '~/mock/menus.json';
import menuItems from '~/mock/menus'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useChatStore } from '~/stores/chat'

const route = useRoute()
const chatStore = useChatStore()
const { locale } = useI18n()

const currentMenu = computed(() => {
  const pathWithoutLocale = route.path.replace(`/${locale.value}`, '')

  return menuItems.find(item => {
    return pathWithoutLocale === item.to || pathWithoutLocale.startsWith(item.to + '/')
  })
})

onMounted(() => {
    useFlowbite(({ initFlowbite }) => {
        initFlowbite()
    }),
    chatStore.setupSocketConnection()
})

onBeforeUnmount(() => {
  // ทำความสะอาดเมื่อ unmount
  chatStore.cleanupSocketConnection()
})
</script>

<template>
    <div class="flex h-screen">
    <!-- <div class="flex w-full max-w-screen overflow-hidden"> -->
        <Sidebar />
        <div class="flex-1 relative flex flex-col bg-gray-50">
            <header class="h-16 flex items-center px-4">
                <div class="flex-1">
                    <Search />
                </div>
                <div class="ml-4">
                    <LanguageSwitch />
                </div>
            </header>
            <main class="flex-1 p-6 overflow-auto space-y-4">
            <!-- <main class="flex-1 overflow-x-hidden"> -->
                <!-- <NuxtPage /> -->
                <div class="flex items-center gap-2 text-lg text-gray-800" v-if="currentMenu">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon :icon="currentMenu.iconHeader" class="w-6 h-6 text-blue-600" />
                    </div>
                    {{ currentMenu.label }}
                    <slot name="subheader-right" />
                </div>
                <slot />
            </main>
        </div>
    </div>
</template>