<script setup lang="ts">
import Card from '~/components/Card.vue'

interface ProfitItem {
    label: string
    value: number
    diff: number
    currentProfit: number
    potentialProfit: number
    dotColor: string
}

const profitSummary = {
    current: {
        label: 'Current Profit',
        value: 250035.5,
        diff: 3.4,
        color: '#10b981'
    },
    potential: {
        label: 'Potential Profit',
        value: 250035.5,
        diff: -3.4,
        color: '#3b82f6'
    }
}

const items: ProfitItem[] = [
    {
        label: 'Invisalign Full Course',
        value: 1678000,
        diff: 11.56,
        currentProfit: 678000,
        potentialProfit: 780000,
        dotColor: '#a78bfa'
    },
    {
        label: 'Veneer Course',
        value: 4678000,
        diff: 26.56,
        currentProfit: 4678000,
        potentialProfit: 4780000,
        dotColor: '#a78bfa'
    },    
    {
        label: 'Veneer Course',
        value: 4678000,
        diff: 26.56,
        currentProfit: 4678000,
        potentialProfit: 4780000,
        dotColor: '#a78bfa'
    },
    {
        label: 'Veneer Course',
        value: 4678000,
        diff: 26.56,
        currentProfit: 4678000,
        potentialProfit: 4780000,
        dotColor: '#a78bfa'
    },
    {
        label: 'Veneer Course',
        value: 4678000,
        diff: 26.56,
        currentProfit: 4678000,
        potentialProfit: 4780000,
        dotColor: '#a78bfa'
    },
    {
        label: 'Veneer Course',
        value: 4678000,
        diff: 26.56,
        currentProfit: 4678000,
        potentialProfit: 4780000,
        dotColor: '#a78bfa'
    }
]

const formatNumber = (num: number) => num.toLocaleString()

const getBadgeClass = (diff: number) => {
    if (diff > 0) return 'bg-green-100 text-green-600'
    if (diff < 0) return 'bg-red-100 text-red-600'
    return 'bg-gray-100 text-gray-600'
}

const getArrow = (diff: number) => {
    if (diff > 0) return '▲'
    if (diff < 0) return '▼'
    return ''
}
</script>

<template>
    <Card class="bg-white space-y-4">
        <!-- Head Summary -->
        <div class="grid grid-cols-2 gap-4">
            <!-- Current Profit -->
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: profitSummary.current.color }" />
                    {{ profitSummary.current.label }}
                </div>

                <!-- value + diff -->
                <div class="flex items-center gap-2 mt-1">
                    <div class="text-base font-semibold">{{ formatNumber(profitSummary.current.value) }}</div>
                    <div :class="[
                        'text-xs inline-flex items-center px-2 py-0.5 rounded',
                        getBadgeClass(profitSummary.current.diff)
                    ]">
                        {{ getArrow(profitSummary.current.diff) }} {{ Math.abs(profitSummary.current.diff).toFixed(2)
                        }}%
                    </div>
                </div>
            </div>

            <!-- Potential Profit -->
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: profitSummary.potential.color }" />
                    {{ profitSummary.potential.label }}
                </div>

                <!-- value + diff -->
                <div class="flex items-center gap-2 mt-1">
                    <div class="text-base font-semibold">{{ formatNumber(profitSummary.potential.value) }}</div>
                    <div :class="[
                        'text-xs inline-flex items-center px-2 py-0.5 rounded',
                        getBadgeClass(profitSummary.potential.diff)
                    ]">
                        {{ getArrow(profitSummary.potential.diff) }} {{
                        Math.abs(profitSummary.potential.diff).toFixed(2) }}%
                    </div>
                </div>
            </div>
        </div>

        <!-- Color Line -->
        <div class="flex gap-3 h-1 mt-2">
            <div class="w-full rounded-full" v-for="color in ['#3b82f6', '#a78bfa', '#f472b6', '#facc15', '#22d3ee']"
                :key="color" :style="{ backgroundColor: color }" />
        </div>

        <!-- Items -->
        <div class="space-y-3">
            <div v-for="(item, i) in items" :key="i" class="rounded-md border border-gray-100 p-4">
                <div class="flex justify-between gap-2 flex-col md:flex-row">
                    <!-- Left -->
                    <div>
                        <div class="flex items-center gap-2 text-xs text-gray-800">
                            <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.dotColor }" />
                            {{ item.label }}
                        </div>

                        <div class="flex items-center gap-2 mt-1">
                            <div class="text-base font-semibold">{{ formatNumber(item.value) }}</div>
                            <div
                                :class="['text-xs inline-flex items-center px-2 py-0.5 rounded', getBadgeClass(item.diff)]">
                                {{ getArrow(item.diff) }} {{ Math.abs(item.diff).toFixed(2) }}%
                            </div>
                        </div>
                    </div>

                    <!-- Right -->
                    <div class="text-xs text-right text-gray-600 space-y-1 shrink-0 min-w-[140px]">
                        <div>
                            Current:
                            <span class="text-black font-semibold">{{ formatNumber(item.currentProfit) }}.-</span>
                        </div>
                        <div>
                            Potential:
                            <span class="text-black font-semibold">{{ formatNumber(item.potentialProfit) }}.-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>