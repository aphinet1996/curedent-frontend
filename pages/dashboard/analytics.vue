<!-- <script setup lang="ts">
definePageMeta({
  layout: 'main'
})
import { ref, computed } from 'vue'
import SummaryCard from '~/components/analytics/CardSummary.vue'
import TreatmentTypeCard from '~/components/analytics/CardTreatmentType.vue'
import ExpenseCard from '~/components/analytics/CardExpense.vue'
import IncomeCard from '~/components/analytics/CardIncome.vue'

const cards = [
  { label: 'Confirm', value: '100,000', difference: -11.09, highlightColor: '#34d5dc' },
  { label: 'Total Income', value: '12,345', highlightColor: '#10b981' },
  { label: 'Total Expenses', value: '6,789', difference: 5.43, highlightColor: '#f97316' },
  { label: 'Cancel', value: '1,234', difference: 2.01, highlightColor: '#f43f5e' },
  { label: 'Pending', value: '8,765', difference: -3.5, highlightColor: '#6366f1' },
  { label: 'Shipped', value: '22,222', highlightColor: '#8b5cf6' }
]

const cardsPerPage = 4
const groupedPages = computed(() => {
  const pages = []
  for (let i = 0; i < cards.length; i += cardsPerPage) {
    pages.push(cards.slice(i, i + cardsPerPage))
  }
  return pages
})

const scrollRef = ref<HTMLDivElement | null>(null)
const activePage = ref(0)

const handleScroll = () => {
  if (!scrollRef.value) return
  const scrollLeft = scrollRef.value.scrollLeft
  const pageWidth = scrollRef.value.clientWidth
  activePage.value = Math.round(scrollLeft / pageWidth)
}

const scrollToPage = (pageIndex: number) => {
  if (!scrollRef.value) return
  const pageWidth = scrollRef.value.clientWidth
  scrollRef.value.scrollTo({ left: pageWidth * pageIndex, behavior: 'smooth' })
}
</script>
<template>
  <div class="p-4 space-y-6">
    <h1 class="text-2xl">Analytics Overview</h1>

    <div class="overflow-x-auto">
      <div ref="scrollRef" class="flex snap-x snap-mandatory scroll-smooth overflow-x-scroll no-scrollbar"
        @scroll="handleScroll" :style="{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }">
        <div v-for="(page, pageIndex) in groupedPages" :key="pageIndex"
          class="snap-start shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          <SummaryCard v-for="(card, index) in page" :key="index" :label="card.label" :value="card.value"
            :difference="card.difference" :highlightColor="card.highlightColor" />
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-2 space-x-2">
      <span v-for="(_, index) in groupedPages" :key="index" @click="scrollToPage(index)" class="cursor-pointer"
        :class="['w-2 h-2 rounded-full', activePage === index ? 'bg-blue-500' : 'bg-gray-300']" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <TreatmentTypeCard />
      <ExpenseCard />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div><IncomeCard /></div>
        <div><IncomeCard /></div>
      </div>
      <div><IncomeCard /></div>
    </div>

  </div>
</template> -->

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})
import { ref, computed } from 'vue'
import SummaryCard from '~/components/analytics/CardSummary.vue'
import TreatmentTypeCard from '~/components/analytics/CardTreatmentType.vue'
import ExpenseCard from '~/components/analytics/CardExpense.vue'
import IncomeCard from '~/components/analytics/CardIncome.vue'
import HistoryTransactionCard from '~/components/analytics/CardHistoryTransactions.vue'
import RecentOPDCard from '~/components/analytics/CardRecentOPD.vue'

const cards = [
  { label: 'Confirm', value: '100,000', difference: -11.09, highlightColor: '#34d5dc' },
  { label: 'Total Income', value: '12,345', highlightColor: '#10b981' },
  { label: 'Total Expense', value: '6,789', difference: 5.43, highlightColor: '#f97316' },
  { label: 'Cancel', value: '1,234', difference: 2.01, highlightColor: '#f43f5e' },
  { label: 'Pending', value: '8,765', difference: -3.5, highlightColor: '#6366f1' },
  { label: 'Shipped', value: '22,222', highlightColor: '#8b5cf6' }
]

const cardsPerPage = 4
const groupedPages = computed(() => {
  const pages = []
  for (let i = 0; i < cards.length; i += cardsPerPage) {
    pages.push(cards.slice(i, i + cardsPerPage))
  }
  return pages
})

const scrollRef = ref<HTMLDivElement | null>(null)
const activePage = ref(0)

const handleScroll = () => {
  if (!scrollRef.value) return
  const scrollLeft = scrollRef.value.scrollLeft
  const pageWidth = scrollRef.value.clientWidth
  activePage.value = Math.round(scrollLeft / pageWidth)
}

const scrollToPage = (pageIndex: number) => {
  if (!scrollRef.value) return
  const pageWidth = scrollRef.value.clientWidth
  scrollRef.value.scrollTo({ left: pageWidth * pageIndex, behavior: 'smooth' })
}
</script>

<template>
  <!-- <div class="max-w-screen-xl mx-auto px-2 py-2 space-y-4"> -->
  <div class="max-w-screen-3xl mx-auto px-2 py-2 space-y-4">
    <h1 class="text-2xl font-bold">Analytics Overview</h1>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div class="xl:col-span-2 space-y-6">
        <div>
          <div class="overflow-x-auto">
            <div ref="scrollRef" class="flex snap-x snap-mandatory scroll-smooth overflow-x-scroll"
              @scroll="handleScroll" :style="{ scrollbarWidth: 'none', msOverflowStyle: 'none' }">
              <div v-for="(page, pageIndex) in groupedPages" :key="pageIndex"
                class="snap-start shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard v-for="(card, index) in page" :key="index" :label="card.label" :value="card.value"
                  :difference="card.difference" :highlightColor="card.highlightColor" />
              </div>
            </div>
          </div>
          <!-- Dot -->
          <div class="flex justify-center mt-1 space-x-2">
            <span v-for="(_, index) in groupedPages" :key="index" @click="scrollToPage(index)"
              class="w-2 h-2 rounded-full cursor-pointer"
              :class="activePage === index ? 'bg-blue-500' : 'bg-gray-300'" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TreatmentTypeCard class="min-h-[300px]" />
          <ExpenseCard class="min-h-[300px]" />
        </div>
      </div>

      <!-- 🔸 Right column: IncomeCard เต็มความสูง -->
      <div class="row-span-1 h-full self-stretch">
        <IncomeCard class="h-full w-full" />
      </div>
    </div>

    <!-- 🔻 Bottom: OPD + History -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RecentOPDCard />
      <HistoryTransactionCard />
    </div>
  </div>
</template>