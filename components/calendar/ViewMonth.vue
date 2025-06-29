<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  getDate
} from 'date-fns';
import { useAppointmentStore } from '~/stores/appointment';
import { useDoctorStore } from '~/stores/doctor';
import type { CalendarAppointment } from '~/types/appointment';

const appointmentStore = useAppointmentStore();
const doctorStore = useDoctorStore();

// Header
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ฟังก์ชันแปลงสี hex เป็น RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// ฟังก์ชันสร้าง style สำหรับ appointment items
const getAppointmentStyle = (doctorId: string) => {
  const doctor = getDoctor(doctorId);
  const color = doctor?.color;
  
  if (!color || !color.startsWith('#')) {
    return {
      class: 'bg-gray-100', // fallback Tailwind class
      style: {}
    };
  }
  
  const rgb = hexToRgb(color);
  if (!rgb) {
    return {
      class: 'bg-gray-100',
      style: {}
    };
  }
  
  return {
    class: '', // ไม่ใช้ Tailwind class
    style: {
      backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`, // 15% opacity สำหรับ month view
      borderLeft: `3px solid ${color}`
    }
  };
};

// ฟังก์ชันสำหรับเอาสี hex ของ doctor
const getDoctorColor = (doctorId: string): string => {
  const doctor = getDoctor(doctorId);
  return doctor?.color || 'gray';
};

// Helper function to get appointments for a specific date
const getDailyAppointments = (dateStr: string): CalendarAppointment[] => {
  const appointments = appointmentStore.getMonthViewAppointmentsByDate(dateStr);
  return appointments.map(apt => ({
    id: apt.id,
    title: apt.title,
    patientName: apt.patient.name || 'ไม่ระบุชื่อ',
    date: dateStr,
    startTime: apt.startTime,
    endTime: apt.endTime,
    status: apt.status,
    type: apt.type,
    doctorId: apt.doctor?.id || '',
    doctorName: apt.doctor?.name,
    color: apt.doctor?.id ? getDoctorColor(apt.doctor.id) : 'gray'
  }));
};

// Helper function to get doctor info
const getDoctor = (doctorId: string) => {
  return doctorStore.getDoctors.find(d => d.id === doctorId);
};

// เตรียมข้อมูลวันในเดือน
const calendarDays = computed(() => {
  const sel = parseISO(appointmentStore.getSelectedDate);
  const start = startOfWeek(startOfMonth(sel));
  const end = endOfWeek(endOfMonth(sel));
  const today = new Date();

  return eachDayOfInterval({ start, end }).map(d => {
    const ds = format(d, 'yyyy-MM-dd');
    return {
      date: ds,
      dayNumber: getDate(d),
      isCurrent: isSameMonth(d, startOfMonth(sel)),
      isToday: isSameDay(d, today),
      isSelected: ds === appointmentStore.getSelectedDate,
      appointments: getDailyAppointments(ds)
    };
  });
});

// หลังจาก export อะไรเสร็จ ให้เพิ่ม
const getPopoverStyle = (idx: number) => {
  const row = Math.floor(idx / 7);
  const col = idx % 7;
  const style: Record<string, string> = {};

  // ถ้าอยู่แถวล่าง (rows 4 หรือ 5 ใน 0-index) ให้ขึ้นด้านบน
  if (row >= 3) {
    style.bottom = '100%';
    style.marginBottom = '0.25rem';
  } else {
    // มิฉะนั้น ให้ลงด้านล่าง
    style.top = '100%';
    style.marginTop = '0.25rem';
  }

  // ถ้าอยู่คอลัมน์ขวาสุด (col 5 หรือ 6) ให้ชิดขวา
  if (col >= 5) {
    style.right = '0';
  } else {
    // มิฉะนั้น ชิดซ้าย
    style.left = '0';
  }

  return style;
};

// เก็บวันที่กดดู more
const showMoreFor = ref<string | null>(null);

// เลือกวันที่
const selectDate = (ds: string) => {
  appointmentStore.setSelectedDate(ds);
};

// Handler สำหรับการคลิกนอก popover
const handleOutsideClick = (event: MouseEvent) => {
  // ถ้าไม่มี popover เปิดอยู่ ไม่ต้องทำอะไร
  if (showMoreFor.value === null) return;
  
  // ตรวจสอบว่าคลิกนอก popover หรือไม่
  const target = event.target as HTMLElement;
  
  // ตรวจสอบว่า target หรือ parent ของมันมี class 'popover' หรือไม่
  // หรือเป็นปุ่ม "+ more" หรือไม่
  const isMoreButton = target.closest('.more-button');
  const isInsidePopover = target.closest('.popover');
  
  // ถ้าคลิกนอก popover และไม่ใช่ปุ่ม more ให้ปิด popover
  if (!isInsidePopover && !isMoreButton) {
    showMoreFor.value = null;
  }
};

// เพิ่ม event listener เมื่อ component ถูกเรียกใช้
onMounted(async () => {
  document.addEventListener('click', handleOutsideClick);
  
  // Fetch initial data
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();
  
  await Promise.all([
    doctorStore.fetchDoctors({ limit: 100 }),
    appointmentStore.fetchCalendarMonthAppointments({ month, year })
  ]);
});

// นำ event listener ออกเมื่อ component ถูกทำลาย
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <div class="view-month relative h-full flex flex-col">
    <!-- header วัน -->
    <div class="grid grid-cols-7 text-center py-2 border-b border-gray-200">
      <div v-for="d in daysOfWeek" :key="d" class="text-sm font-medium">{{ d }}</div>
    </div>

    <!-- grid เดือน -->
    <div class="grid grid-cols-7 grid-rows-6 flex-1">
      <!-- note: ใส่ idx เพื่อคำนวณตำแหน่ง -->
      <div v-for="(day, idx) in calendarDays" :key="day.date"
        class="day-cell relative border-b border-r border-gray-200 p-1 overflow-visible cursor-pointer" :class="{
          'bg-gray-50': !day.isCurrent,
          'bg-blue-50': day.isToday,
          'border-blue-300': day.isSelected
        }" @click="selectDate(day.date)">
        <!-- เลขวัน -->
        <div class="day-number text-sm rounded-full w-6 h-6 flex items-center justify-center mb-1" :class="{
          'bg-blue-500 text-white': day.isToday,
          'text-gray-400': !day.isCurrent
        }">
          {{ day.dayNumber }}
        </div>

        <!-- นัด 3 รายการแรก -->
        <div class="appointments-container mt-1 text-[0.65rem]">
          <div v-for="apt in day.appointments.slice(0, 3)" :key="apt.id" 
            class="truncate rounded px-1 mb-1"
            :class="getAppointmentStyle(apt.doctorId).class"
            :style="getAppointmentStyle(apt.doctorId).style">
            {{ apt.startTime }} {{ apt.patientName }}
          </div>
          <!-- +N more -->
          <div v-if="day.appointments.length > 3" class="text-xs text-gray-600 font-medium cursor-pointer more-button"
            @click.stop="showMoreFor = showMoreFor === day.date ? null : day.date">
            +{{ day.appointments.length - 3 }} more
          </div>
        </div>

        <!-- Popover (absolute ใน day-cell) -->
        <div v-if="showMoreFor === day.date"
          class="absolute z-10 bg-white shadow-lg rounded p-2 w-48 max-h-48 overflow-auto popover" :style="getPopoverStyle(idx)"
          @click.stop>
          <!-- เนื้อหาเหมือนเดิม -->
          <div class="text-sm font-semibold mb-2 text-center">
            {{ format(parseISO(day.date), 'dd MMM yyyy') }}
          </div>
          <div v-for="apt in day.appointments" :key="apt.id"
            class="flex justify-between items-center mb-1 rounded px-1 py-0.5"
            :class="getAppointmentStyle(apt.doctorId).class"
            :style="getAppointmentStyle(apt.doctorId).style">
            <span class="text-xs">{{ apt.startTime }}</span>
            <span class="text-xs">{{ apt.patientName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.day-cell {
  min-height: 80px;
  /* ต้องเปิด overflow-visible ให้โผล่ขึ้นมานอกกริด */
  overflow: visible;
}
</style>