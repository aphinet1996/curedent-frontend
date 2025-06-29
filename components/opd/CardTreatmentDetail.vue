<script setup lang="ts">
import { ref } from 'vue'
import Tab from '~/components/Tab.vue'
import { Icon } from '@iconify/vue'
import CardToothChart from '../CardToothChart.vue'

const tabs = ref([
    { id: 'tab1', label: 'D: 15/9/2022' },
    { id: 'tab2', label: 'D: 06/9/2022' },
    { id: 'tab3', label: 'D: 06/5/2022' }
])
const activeTab = ref('tab1')

const handleAdd = () => {
    const id = `tab${tabs.value.length + 1}`
    tabs.value.push({ id, label: `D: xx/xx/xxxx` })
    activeTab.value = id
}
const handleRemove = (id: string) => {
    tabs.value = tabs.value.filter(t => t.id !== id)
    if (activeTab.value === id && tabs.value.length > 0) {
        activeTab.value = tabs.value[0].id
    }
}
const handleRename = (id: string, newLabel: string) => {
    const tab = tabs.value.find(t => t.id === id)
    if (tab) tab.label = newLabel
}
</script>

<template>
    <div class="bg-white rounded-lg shadow p-4">
        <Tab :initialTabs="tabs" :active-id="activeTab" @update:active="activeTab = $event" @add="handleAdd"
            @remove="handleRemove" @rename="({ id, newLabel }) => handleRename(id, newLabel)">
            <template #default="{ active }">
                <div class="grid grid-cols-12 gap-4 mt-4">
                    <div class="col-span-12 md:col-span-3 space-y-3">
                        <div>
                            <label class="text-xs text-gray-700">Dentist:</label>
                            <select class="form-select w-full rounded-lg border border-gray-300 text-xs">
                                <option>Choose Dentist</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs text-gray-700">Chief Complain:</label>
                            <textarea class="form-textarea w-full rounded-lg border border-gray-300 text-xs" rows="3"
                                placeholder="Type here ..."></textarea>
                        </div>
                        <div>
                            <label class="text-xs text-gray-700">Side:</label>
                            <select class="form-select w-full rounded-lg border border-gray-300 text-xs">
                                <option>Choose Side</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs text-gray-700">Teeth:</label>
                            <div class="grid grid-cols-6 gap-1 text-xs">
                                <label v-for="n in 32" :key="n" class="flex items-center gap-1">
                                    <input type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2" />
                                    <span>{{ n + 16 }}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-6 flex items-center justify-center">
                        <CardToothChart />
                    </div>

                    <div class="col-span-12 md:col-span-3 flex justify-end items-start">
                        <div class="flex items-center gap-2">
                            <label class="text-xs text-gray-700 whitespace-nowrap">Move To:</label>
                            <select class="form-select rounded-lg border border-gray-300 text-xs">
                                <option>Choose Room</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-span-12 grid grid-cols-4 gap-2 mt-4">
                        <textarea placeholder="I/O:" class="form-textarea w-full rounded-lg border border-gray-300"
                            rows="2"></textarea>
                        <textarea placeholder="DX:" class="form-textarea w-full rounded-lg border border-gray-300"
                            rows="2"></textarea>
                        <textarea placeholder="TX:" class="form-textarea w-full rounded-lg border border-gray-300"
                            rows="2"></textarea>
                        <textarea placeholder="Remark:" class="form-textarea w-full rounded-lg border border-gray-300"
                            rows="2"></textarea>
                    </div>
                </div>
            </template>
        </Tab>
    </div>
</template>