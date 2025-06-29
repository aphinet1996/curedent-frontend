<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface PatientItem {
    treatment: string
    hn: string
    date: string
    time: string
    amount: number
}

const patients: PatientItem[] = [
    {
        treatment: 'Extractions',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        amount: 874,
    },
    {
        treatment: 'Teeth Whitenings',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        amount: 874,
    },
    {
        treatment: 'Teeth Whitenings',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        amount: 874,
    },
    {
        treatment: 'Teeth Whitenings',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        amount: 874,
    },
    {
        treatment: 'Teeth Whitenings',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        amount: 874,
    },
    {
        treatment: 'Teeth Whitenings',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        amount: 874,
    },
    {
        treatment: 'Teeth Whitenings',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        amount: 874,
    },
    {
        treatment: 'Teeth Whitenings',
        hn: '#12293289274',
        date: '02 Sep 23',
        time: '08.00 AM',
        amount: 874,
    },
]
</script>

<template>
    <div class="bg-white rounded-xl p-4 shadow-sm">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold text-gray-900">DF</h2>
            <a href="#" class="text-sm text-blue-500 hover:underline">View all</a>
        </div>

        <!-- List -->
        <div class="space-y-4">
            <div v-for="(item, i) in patients" :key="i" class="flex justify-between items-start">
                <!-- Left: icon + text -->
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icon icon="mdi:arrow-down-bold" class="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                        <div class="text-sm font-semibold text-gray-900">{{ item.treatment }}</div>
                        <div class="text-xs text-gray-500 flex items-center gap-2">
                            <span>HN {{ item.hn }}</span>
                            <span class="flex items-center gap-1">
                                <Icon icon="mdi:calendar-month-outline" class="w-4 h-4" />
                                {{ item.date }}, {{ item.time }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Right: Amount -->
                <div class="text-green-500 text-sm font-medium whitespace-nowrap">+ ${{ item.amount }}</div>
            </div>
        </div>
    </div>
</template>