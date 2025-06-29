<script setup lang="ts">
import { onMounted } from 'vue'
import { useFlowbite } from '~/composables/useFlowbite'
import { Icon } from '@iconify/vue'
import Sidebar from '~/components/Sidebar.vue'
import Search from '~/components/Search.vue'
import LanguageSwitch from '~/components/DropdownLanguage.vue'
import NavPill from '~/components/NavPill.vue'
// import navItems from '~/mock/navItems'
import navItems from '~/mock/navItems.json'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { locale } = useI18n()

const currentNav = computed(() => {
  // ตัด locale ออกจาก path เช่น "/en/manage/stock" => "/manage/stock"
  const pathWithoutLocale = route.path.replace(`/${locale.value}`, '')
  return navItems.find(item => item.path === pathWithoutLocale)
})

onMounted(() => {
    useFlowbite(({ initFlowbite }) => {
        initFlowbite()
    })
})
</script>

<template>
    <div class="flex h-screen">
        <!-- Sidebar -->
        <Sidebar />

        <!-- Right side -->
        <div class="flex-1 relative flex flex-col bg-gray-50">
            <!-- Topbar -->
            <header class="h-16 flex items-center px-4">
                <div class="flex-1">
                    <Search />
                </div>
                <div class="ml-4">
                    <LanguageSwitch />
                </div>
            </header>

            <!-- Content -->
            <main class="flex-1 p-6 overflow-auto space-y-4">
                <!-- Header -->
                <div class="flex items-center gap-2 text-xl font-semibold text-gray-800">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="material-symbols:folder-managed" class="w-6 h-6 text-blue-600" />
                    </div>
                    Manage
                </div>

                <!-- NavPill -->
                <NavPill />

                <!-- Sub Header -->
                <div class="flex items-center gap-2 text-lg text-gray-800" v-if="currentNav">
                    <Icon :icon="currentNav.icon" class="w-6 h-6 text-gray-800" />
                    {{ currentNav.label }}
                    <slot name="subheader-right" />
                </div>

                <!-- Page Content -->
                <slot />
            </main>
        </div>
    </div>
</template>