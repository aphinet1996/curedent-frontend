<script setup lang="ts">
import { ref } from 'vue'

interface Tab {
  id: string
  label: string
}

const props = defineProps<{
  initialTabs?: Tab[]
  activeId?: string
}>()

const emit = defineEmits<{
  (e: 'update:active', id: string): void
  (e: 'add'): void
  (e: 'remove', id: string): void
  (e: 'rename', payload: { id: string; newLabel: string }): void
}>()

const tabs = ref<Tab[]>(props.initialTabs || [])
const activeTabId = ref(props.activeId || tabs.value[0]?.id || '')
const editingTabId = ref<string | null>(null)
const editLabel = ref('')

const setActive = (id: string) => {
  activeTabId.value = id
  emit('update:active', id)
}

const addTab = () => emit('add')

const removeTab = (id: string) => {
  emit('remove', id)
  tabs.value = tabs.value.filter(t => t.id !== id)
  if (activeTabId.value === id && tabs.value.length > 0) {
    activeTabId.value = tabs.value[0].id
    emit('update:active', activeTabId.value)
  }
}

const startEditing = (id: string, currentLabel: string) => {
  editingTabId.value = id
  editLabel.value = currentLabel
  setTimeout(() => {
    const input = document.getElementById(`input-${id}`) as HTMLInputElement
    input?.focus()
  })
}

const finishEditing = (id: string) => {
  emit('rename', { id, newLabel: editLabel.value })
  editingTabId.value = null
}
</script>

<template>
  <div>
    <!-- Tabs Header -->
    <div class="flex items-center space-x-1">
      <template v-for="tab in tabs" :key="tab.id">
        <div
          class="relative px-4 py-2 rounded-t-lg border border-b-0 border-gray-300 cursor-pointer"
          :class="[
            activeTabId === tab.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          <div class="flex items-center space-x-1">
            <template v-if="editingTabId === tab.id">
              <input
                :id="`input-${tab.id}`"
                v-model="editLabel"
                @blur="finishEditing(tab.id)"
                @keyup.enter="finishEditing(tab.id)"
                class="text-sm px-1 rounded border"
              />
            </template>
            <template v-else>
              <span @click="setActive(tab.id)" @dblclick="startEditing(tab.id, tab.label)" class="text-sm">
                {{ tab.label }}
              </span>
              <button @click="startEditing(tab.id, tab.label)" class="text-xs text-gray-400 hover:text-gray-700">
                <!-- ✏️ -->
              </button>
            </template>
            <button
              @click="removeTab(tab.id)"
              class="ml-1 text-xs text-gray-400 hover:text-red-500"
              title="Remove Tab"
            >
              ✕
            </button>
          </div>
        </div>
      </template>

      <!-- Add Tab -->
      <button
        @click="addTab"
        class="px-3 py-2 bg-gray-200 text-gray-600 rounded-t-lg hover:bg-gray-300"
      >
        +
      </button>
    </div>

    <!-- Tab Content -->
    <div class="shadow rounded-b-lg bg-white p-4 h-full">
      <slot :active="activeTabId" />
    </div>
  </div>
</template>