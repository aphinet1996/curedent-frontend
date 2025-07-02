<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import navItemsData from '~/mock/navItems'

const route = useRoute()
const navItems = ref(navItemsData)
const { locale } = useI18n()
const localePath = useLocalePath()

const pathWithoutLocale = computed(() => {
  const regex = new RegExp(`^/${locale.value}(/|$)`)
  return route.path.replace(regex, '/').replace(/\/+/g, '/').replace(/\/$/, '') || '/'
})

watch(
  () => route.path,
  () => {
    const cleanPath = pathWithoutLocale.value
    navItems.value.forEach((item) => {
      const itemPath = item.path.replace(/\/$/, '') || '/'
      item.active = itemPath === cleanPath
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex gap-3 flex-wrap">
    <NuxtLink
      v-for="item in navItems"
      :key="item.label"
      :to="localePath(item.path)"
      class="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border transition-all"
      :class="item.active
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-transparent border-gray-300 text-gray-300 hover:bg-white hover:text-black'"
    >
      <Icon :icon="item.icon" class="w-4 h-4" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </div>
</template>