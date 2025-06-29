<script setup lang="ts">
definePageMeta({
  layout: false
})

import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useCalendarStore } from '~/stores/calendar'

import CardUpcoming from '~/components/calendar/CardUpcoming.vue'
import Schedule from '~/components/calendar/Schedule.vue'
import CardDoctorFilter from '~/components/calendar/CardDoctorFilter.vue'
import FormDoctorAppointment from '~/components/calendar/FormDoctorAppointment.vue'
import FormAppointment from '~/components/calendar/FormAppointment.vue'
import FormPatientDetail from '~/components/calendar/FormPatientDetail.vue'

const calendarStore = useCalendarStore()
const showForm = ref(false)

onMounted(async () => {
  await calendarStore.fetchAppointments()
})

function handleCreated(appointment: { date: string }) {
  // เมื่อสร้างเสร็จ ให้เลื่อนไปที่วันของนัดใหม่
  calendarStore.setSelectedDate(appointment.date)
  // ถ้าต้องการรีโหลดข้อมูลใหม่ ให้เรียก fetchAppointments() อีกครั้ง
  // await calendarStore.fetchAppointments()
}
</script>

<template>
  <NuxtLayout name="main">
    <!-- ปุ่มเพิ่มนัดใน subheader -->
    <template #subheader-right>
      <button
        class="rounded-lg flex items-center gap-1 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1"
        @click="showForm = true"
      >
        <Icon icon="mdi:add" class="w-4 h-4" />
        {{ $t('button.create') }}
      </button>
    </template>

    <!-- บล็อก Upcoming -->
    <div class="px-3">
      <CardUpcoming />
    </div>

    <!-- ตารางปฏิทินและตัวกรอง -->
    <div class="flex flex-col overflow-hidden mt-4">
      <div class="flex-1 grid grid-cols-7 gap-3 p-3">
        <!-- ซ้าย: Schedule -->
        <div class="col-span-6 overflow-hidden">
          <Schedule />
        </div>
        <!-- ขวา: Filter -->
        <div class="col-span-1">
          <CardDoctorFilter />
        </div>
      </div>
    </div>

    <!-- ฟอร์มสร้างนัดหมาย -->
    <FormAppointment
      :show="showForm"
      @close="showForm = false"
      @created="handleCreated"
    />
  </NuxtLayout>
</template>