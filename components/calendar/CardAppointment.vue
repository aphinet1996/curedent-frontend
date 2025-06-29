<!-- <script setup lang="ts">
import { computed } from 'vue';
import { useCalendarStore } from '~/stores/calendar';
import type { Appointment } from '~/types/calendar';

interface GroupedAppointment {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  patients: Array<{
    id: string;
    patientName: string;
    startTime: string;
    endTime: string;
  }>;
}

const props = defineProps<{
  appointment: Appointment | GroupedAppointment;
  isGrouped: boolean;
}>();

const emit = defineEmits<{
  (e: 'click', appointment: Appointment | GroupedAppointment): void;
}>();

const calendarStore = useCalendarStore();

const doctorColor = computed(() => {
  const doctor = calendarStore.getDoctor(props.appointment.doctorId);
  return doctor ? doctor.color : 'bg-gray-100';
});

const doctorName = computed(() => {
  const doctor = calendarStore.getDoctor(props.appointment.doctorId);
  return doctor ? doctor.name : '';
});

const timeRange = computed(() => {
  const formattedStart = props.appointment.startTime.replace(':', '.');
  const formattedEnd = props.appointment.endTime.replace(':', '.');
  return `${formattedStart} - ${formattedEnd}`;
});

const formattedTime = computed(() => {
  if (props.isGrouped) return '';
  const appointment = props.appointment as Appointment;
  return `${appointment.startTime}-${appointment.endTime}`;
});

const patientLabel = computed(() => {
  if (props.isGrouped) return '';
  const appointment = props.appointment as Appointment;
  return `K.${appointment.patientName}`;
});

const patients = computed(() => {
  if (!props.isGrouped) return [];
  return (props.appointment as GroupedAppointment).patients;
});

const formatPatientEntry = (patient: { patientName: string; startTime: string; endTime: string }) => {
  const start = patient.startTime.replace(':', '.');
  const end = patient.endTime.replace(':', '.');
  return `${start}-${end} K.${patient.patientName}`;
};
</script>

<template>
  <div class="appointment-card w-full" :class="doctorColor" @click="$emit('click', appointment)">
    <div class="p-2 rounded-md">
      <div class="font-medium text-gray-800 text-xs">{{ doctorName }}</div>

      <div class="flex items-center text-[9px] text-gray-600 mb-1">
        <svg class="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clip-rule="evenodd" />
        </svg>
        <span>{{ timeRange }}</span>
      </div>

      <div v-if="!isGrouped" class="bg-teal-400 text-white py-1 px-2 rounded text-[10px]">
        {{ formattedTime }} {{ patientLabel }}
      </div>

      <div v-else>
        <div v-for="(patient, index) in patients" :key="patient.id"
          class="bg-teal-400 text-white py-1 px-2 rounded text-[10px] mb-1"
          :class="{ 'mb-1': index < patients.length - 1 }">
          {{ formatPatientEntry(patient) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appointment-card {
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.appointment-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
</style> -->

<script setup lang="ts">
import { computed } from 'vue';
import { useDoctorStore } from '~/stores/doctor';
import type { Appointment } from '~/types/appointment';

interface GroupedAppointment {
  id: string;
  title: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  patients: Array<{
    id: string;
    patient: {
      isRegistered: boolean;
      patientId?: string;
      name?: string;
      phone?: string;
      email?: string;
    };
    startTime: string;
    endTime: string;
  }>;
}

const props = defineProps<{
  appointment: Appointment | GroupedAppointment;
  isGrouped: boolean;
  doctorColor?: string; // เพิ่ม prop สำหรับสี doctor
}>();

const emit = defineEmits<{
  (e: 'click', appointment: Appointment | GroupedAppointment): void;
}>();

const doctorStore = useDoctorStore();

// ฟังก์ชันแปลงสี hex เป็น RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// สร้าง style สำหรับการ์ด appointment
const getCardStyle = computed(() => {
  // ใช้สีจาก prop ก่อน แล้วค่อย fallback ไปหาจาก store
  let color = props.doctorColor;

  if (!color) {
    const doctor = doctorStore.getDoctors.find(d => d.id === props.appointment.doctorId);
    color = doctor?.color;
  }

  if (!color || !color.startsWith('#')) {
    // fallback เป็นสีเทา
    return {
      backgroundColor: 'rgb(243, 244, 246)', // gray-100
      borderLeft: '4px solid rgb(156, 163, 175)' // gray-400
    };
  }

  const rgb = hexToRgb(color);
  if (!rgb) {
    return {
      backgroundColor: 'rgb(243, 244, 246)',
      borderLeft: '4px solid rgb(156, 163, 175)'
    };
  }

  return {
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`, // 10% opacity
    borderLeft: `4px solid ${color}`
  };
});

// fallback class สำหรับกรณีที่ไม่มีสีจาก API
const fallbackColorClass = computed(() => {
  if (props.doctorColor && props.doctorColor.startsWith('#')) {
    return ''; // ไม่ใช้ class ถ้ามีสีจาก API
  }

  const doctor = doctorStore.getDoctors.find(d => d.id === props.appointment.doctorId);
  if (doctor?.color && doctor.color.startsWith('#')) {
    return ''; // ไม่ใช้ class ถ้ามีสีจาก store
  }

  return 'bg-gray-100'; // fallback Tailwind class
});

const doctorName = computed(() => {
  const doctor = doctorStore.getDoctors.find(d => d.id === props.appointment.doctorId);
  return doctor?.name || '';
});

const timeRange = computed(() => {
  const formattedStart = props.appointment.startTime.replace(':', '.');
  const formattedEnd = props.appointment.endTime.replace(':', '.');
  return `${formattedStart} - ${formattedEnd}`;
});

const formattedTime = computed(() => {
  if (props.isGrouped) return '';
  const appointment = props.appointment as Appointment;
  return `${appointment.startTime}-${appointment.endTime}`;
});

const patientLabel = computed(() => {
  if (props.isGrouped) return '';
  const appointment = props.appointment as Appointment;
  return `K.${appointment.patient.name || 'ไม่ระบุชื่อ'}`;
});

const patients = computed(() => {
  if (!props.isGrouped) return [];
  return (props.appointment as GroupedAppointment).patients;
});

const formatPatientEntry = (patient: {
  patient: { name?: string };
  startTime: string;
  endTime: string
}) => {
  const start = patient.startTime.replace(':', '.');
  const end = patient.endTime.replace(':', '.');
  return `${start}-${end} K.${patient.patient.name || 'ไม่ระบุชื่อ'}`;
};
</script>

<template>
  <div class="appointment-card w-full" :class="fallbackColorClass" :style="(props.doctorColor && props.doctorColor.startsWith('#')) ||
    (doctorStore.getDoctors.find(d => d.id === appointment.doctorId)?.color?.startsWith('#'))
    ? getCardStyle : {}" @click="$emit('click', appointment)">
    <div class="p-2 rounded-md">
      <div class="font-medium text-gray-800 text-xs">{{ doctorName }}</div>

      <div class="flex items-center text-[9px] text-gray-600 mb-1">
        <svg class="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clip-rule="evenodd" />
        </svg>
        <span>{{ timeRange }}</span>
      </div>

      <div v-if="!isGrouped" class="bg-teal-400 text-white py-1 px-2 rounded text-[10px]">
        {{ formattedTime }} {{ patientLabel }}
      </div>

      <div v-else>
        <div v-for="(patient, index) in patients" :key="patient.id"
          class="bg-teal-400 text-white py-1 px-2 rounded text-[10px] mb-1"
          :class="{ 'mb-1': index < patients.length - 1 }">
          {{ formatPatientEntry(patient) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appointment-card {
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.appointment-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
</style>