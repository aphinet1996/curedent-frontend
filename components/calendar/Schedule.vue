<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { format, parseISO, addMonths, subMonths } from 'date-fns';
import { useCalendarStore } from '~/stores/calendar';
import type { CalendarViewType } from '~/types/calendar';
import ViewDay from './ViewDay.vue';
import ViewWeek from './ViewWeek.vue';
import ViewMonth from './ViewMonth.vue';

const calendarStore = useCalendarStore();

const currentView = computed(() => calendarStore.currentView);

const currentMonthYear = computed(() => {
  return format(parseISO(calendarStore.selectedDate), 'MMMM yyyy');
});

const currentViewComponent = computed(() => {
  switch (currentView.value) {
    case 'day':
      return ViewDay;
    case 'week':
      return ViewWeek;
    case 'month':
    default:
      return ViewMonth;
  }
});

const setView = (view: CalendarViewType) => {
  calendarStore.setCurrentView(view);
};

const navigatePrevious = () => {
  const currentDate = parseISO(calendarStore.selectedDate);

  let newDate;
  switch (currentView.value) {
    case 'day':
      newDate = format(new Date(currentDate.setDate(currentDate.getDate() - 1)), 'yyyy-MM-dd');
      break;
    case 'week':
      newDate = format(new Date(currentDate.setDate(currentDate.getDate() - 7)), 'yyyy-MM-dd');
      break;
    case 'month':
    default:
      newDate = format(subMonths(currentDate, 1), 'yyyy-MM-dd');
      break;
  }

  calendarStore.setSelectedDate(newDate);
};

const navigateNext = () => {
  const currentDate = parseISO(calendarStore.selectedDate);

  let newDate;
  switch (currentView.value) {
    case 'day':
      newDate = format(new Date(currentDate.setDate(currentDate.getDate() + 1)), 'yyyy-MM-dd');
      break;
    case 'week':
      newDate = format(new Date(currentDate.setDate(currentDate.getDate() + 7)), 'yyyy-MM-dd');
      break;
    case 'month':
    default:
      newDate = format(addMonths(currentDate, 1), 'yyyy-MM-dd');
      break;
  }

  calendarStore.setSelectedDate(newDate);
};

const handleCreateAppointment = () => {
  console.log('Create appointment clicked');
};
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between py-4">
      <div class="flex-grow max-w-[210px] grid grid-cols-3 items-center">
        <div class="flex justify-start">
          <button class="rounded-full hover:bg-gray-100" @click="navigatePrevious">
            <div class="bg-blue-200 py-1 px-1 rounded-full">
              <Icon icon="mdi:chevron-left" class="w-5 h-5 text-blue-500" />
            </div>
          </button>
        </div>
    
        <div class="flex justify-center">
          <span class="text-gray-800 font-medium whitespace-nowrap">
            {{ currentMonthYear }}
          </span>
        </div>
    
        <div class="flex justify-end">
          <button class="rounded-full hover:bg-gray-100" @click="navigateNext">
            <div class="bg-blue-200 py-1 px-1 rounded-full">
              <Icon icon="mdi:chevron-right" class="w-5 h-5 text-blue-500" />
            </div>
          </button>
        </div>
      </div>
    
      <div class="bg-white max-h-8 rounded-3xl p-1 flex justify-end space-x-4 ml-6">
        <button class="px-4 py-1 rounded-3xl text-xs font-medium"
          :class="currentView === 'day' ? 'bg-blue-100 text-blue-600 shadow' : 'text-gray-600'" @click="setView('day')">
          D
        </button>
        <button class="px-4 py-1 rounded-3xl text-xs font-medium"
          :class="currentView === 'week' ? 'bg-blue-100 text-blue-600 shadow' : 'text-gray-600'" @click="setView('week')">
          W
        </button>
        <button class="px-4 py-1 rounded-3xl text-xs font-medium"
          :class="currentView === 'month' ? 'bg-blue-100 text-blue-600 shadow' : 'text-gray-600'" @click="setView('month')">
          M
        </button>
      </div>
    </div>

    <div class="flex-1 bg-white shadow rounded-lg overflow-hidden">
      <component :is="currentViewComponent"></component>
    </div>
  </div>
</template>
