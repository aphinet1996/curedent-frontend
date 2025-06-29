<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import navItemsData from '~/mock/navItems.json'

const navItems = ref(navItemsData)

const setActive = (label: string) => {
  navItems.value.forEach((item) => {
    item.active = item.label === label
  })
}
</script>

<template>
  <div class="flex gap-3 flex-wrap">
    <button
      v-for="item in navItems"
      :key="item.label"
      @click="setActive(item.label)"
      class="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border transition-all"
      :class="item.active
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-transparent border-gray-300 text-gray-300 hover:bg-white hover:text-black'"
    >
      <Icon :icon="item.icon" class="w-4 h-4" />
      <span>{{ item.label }}</span>
    </button>
  </div>
</template> -->

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
// import navItemsData from '~/mock/navItems'
import navItemsData from '~/mock/navItems.json'

const route = useRoute()
const navItems = ref(navItemsData)

const normalizePath = (path: string) =>
  path.replace(/^\/(en|th|jp)(?=\/)/, '').replace(/\/$/, '')

  watch(
  () => route.path,
  (path) => {
    const cleanPath = normalizePath(path)
    navItems.value.forEach((item) => {
      item.active = item.path === cleanPath
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
    :to="item.path"
    class="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full border transition-all"
    :class="normalizePath(route.path) === item.path
      ? 'bg-blue-500 text-white border-blue-500'
      : 'bg-transparent border-gray-300 text-gray-300 hover:bg-white hover:text-black'"
  >
    <Icon :icon="item.icon" class="w-4 h-4" />
    <span>{{ item.label }}</span>
  </NuxtLink>
  </div>
</template>