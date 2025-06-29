<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n, useSwitchLocalePath } from '#imports'

const isLangOpen = ref(false)
function toggleLangDropdown() {
    isLangOpen.value = !isLangOpen.value
}

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() =>
    locales.value.filter((i) => i.code !== locale.value)
)
</script>
<template>
    <div class="relative">
        <button @click="toggleLangDropdown"
            class="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <Icon icon="mdi:web" class="w-4 h-4 text-gray-500" />
            <span class="text-gray-700">{{ locale.toUpperCase() }}</span>
            <Icon :icon="isLangOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-4 h-4 text-gray-500" />
        </button>

        <transition name="fade">
            <div v-if="isLangOpen"
                class="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg py-1 z-50">
                <NuxtLink v-for="l in availableLocales" :key="l.code" :to="switchLocalePath(l.code)"
                    class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    :class="{ 'text-blue-600': locale === l.code }" @click="isLangOpen = false">
                    {{ l.code.toUpperCase() }}
                </NuxtLink>
            </div>
        </transition>
    </div>
</template>