<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Patient {
    avatar: string
    name: string
    hn: string
    date: string
    time: string
    treatment: string
    treatmentColor: string
}

const patients: Patient[] = [
    {
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        name: 'Mr. Casey Lou',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        treatment: 'Teeth Whitenings',
        treatmentColor: 'bg-green-100 text-green-700',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
        name: 'Mr. Casey Lou',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        treatment: 'Teeth Whitenings',
        treatmentColor: 'bg-blue-100 text-blue-700',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        name: 'Mr. Casey Lou',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        treatment: 'Extractions',
        treatmentColor: 'bg-purple-100 text-purple-700',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        name: 'Mr. Casey Lou',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        treatment: 'Extractions',
        treatmentColor: 'bg-purple-100 text-purple-700',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        name: 'Mr. Casey Lou',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        treatment: 'Extractions',
        treatmentColor: 'bg-purple-100 text-purple-700',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        name: 'Mr. Casey Lou',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        treatment: 'Extractions',
        treatmentColor: 'bg-purple-100 text-purple-700',
    },
    {
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        name: 'Mr. Casey Lou',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        treatment: 'Extractions',
        treatmentColor: 'bg-purple-100 text-purple-700',
    },
]
</script>

<template>
    <div class="bg-white rounded-xl p-4 shadow-sm">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-base font-semibold text-gray-800">Patient Lists</h2>
            <button class="text-sm text-blue-500 bg-blue-50 px-3 py-1 rounded flex items-center gap-1">
                Today
                <Icon icon="mdi:chevron-down" class="w-4 h-4" />
            </button>
        </div>

        <!-- List -->
        <div class="space-y-4">
            <div v-for="(p, i) in patients" :key="i" class="flex justify-between items-center">
                <!-- Left: avatar + detail -->
                <div class="flex items-start gap-3">
                    <img :src="p.avatar" alt="avatar" class="w-9 h-9 rounded-full object-cover" />
                    <div>
                        <div class="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            {{ p.name }}
                            <span :class="['text-xs px-2 py-0.5 rounded', p.treatmentColor]">
                                {{ p.treatment }}
                            </span>
                        </div>
                        <div class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span>HN {{ p.hn }}</span>
                            <span class="flex items-center gap-1">
                                <Icon icon="mdi:calendar" class="w-4 h-4" />
                                {{ p.date }}, {{ p.time }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Right: Confirm button -->
                <button
                    class="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium flex items-center gap-1">
                    <Icon icon="mdi:check-circle-outline" class="w-4 h-4" />
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>