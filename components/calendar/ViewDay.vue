<!-- <script setup lang="ts">
import { computed, ref } from 'vue';
import { format, parseISO } from 'date-fns';
import { useCalendarStore } from '~/stores/calendar';
import type { Appointment } from '~/types/calendar';
import CardAppointment from './CardAppointment.vue';

const calendarStore = useCalendarStore();

const hours = Array.from({ length: 11 }, (_, i) => i + 8);

const formattedDate = computed(() => {
  return format(parseISO(calendarStore.selectedDate), 'EEEE, d MMMM yyyy');
});

const formatHour = (hour: number) => {
  return `${hour} ${hour < 12 ? 'AM' : 'PM'}`;
};

const filteredDoctors = computed(() => {
  return calendarStore.getFilteredDoctors;
});

const handleAppointmentClick = (appointment: Appointment | GroupedAppointment) => {
  console.log('Appointment clicked:', appointment);
};

const previousDay = () => {
  const currentDate = parseISO(calendarStore.selectedDate);
  const prevDate = new Date(currentDate);
  prevDate.setDate(currentDate.getDate() - 1);
  calendarStore.setSelectedDate(format(prevDate, 'yyyy-MM-dd'));
};

const nextDay = () => {
  const currentDate = parseISO(calendarStore.selectedDate);
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);
  calendarStore.setSelectedDate(format(nextDate, 'yyyy-MM-dd'));
};

const totalAppointments = computed(() => {
  return calendarStore.getDailyAppointments(calendarStore.selectedDate).length;
});

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

const areConsecutiveAppointments = (app1: Appointment, app2: Appointment): boolean => {
  return app1.endTime === app2.startTime;
};

const groupConsecutiveAppointments = (appointments: Appointment[]): (Appointment | GroupedAppointment)[] => {
  if (!appointments.length) return [];

  const sortedAppointments = [...appointments].sort((a: Appointment, b: Appointment) =>
    a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime)
  );

  const result: (Appointment | GroupedAppointment)[] = [];
  let currentGroup: Appointment[] = [sortedAppointments[0]];

  for (let i = 1; i < sortedAppointments.length; i++) {
    const current = sortedAppointments[i];
    const previous = sortedAppointments[i - 1];

    if (
      current.doctorId === previous.doctorId &&
      areConsecutiveAppointments(previous, current)
    ) {
      currentGroup.push(current);
    } else {
      if (currentGroup.length > 1) {
        const firstApp = currentGroup[0];
        const lastApp = currentGroup[currentGroup.length - 1];

        result.push({
          id: currentGroup.map(app => app.id).join('-'),
          doctorId: firstApp.doctorId,
          startTime: firstApp.startTime,
          endTime: lastApp.endTime,
          patients: currentGroup.map(app => ({
            id: app.id,
            patientName: app.patientName,
            startTime: app.startTime,
            endTime: app.endTime
          }))
        });
      } else {
        result.push(currentGroup[0]);
      }

      currentGroup = [current];
    }
  }

  if (currentGroup.length > 1) {
    const firstApp = currentGroup[0];
    const lastApp = currentGroup[currentGroup.length - 1];

    result.push({
      id: currentGroup.map(app => app.id).join('-'),
      doctorId: firstApp.doctorId,
      startTime: firstApp.startTime,
      endTime: lastApp.endTime,
      patients: currentGroup.map(app => ({
        id: app.id,
        patientName: app.patientName,
        startTime: app.startTime,
        endTime: app.endTime
      }))
    });
  } else if (currentGroup.length === 1) {
    result.push(currentGroup[0]);
  }

  return result;
};

const getGroupedAppointmentsByDoctor = computed(() => {
  const dailyAppointments = calendarStore.getDailyAppointments(calendarStore.selectedDate);
  const grouped: Record<string, (Appointment | GroupedAppointment)[]> = {};

  filteredDoctors.value.forEach(doctor => {
    const doctorAppointments = dailyAppointments.filter(app => app.doctorId === doctor.id);
    grouped[doctor.id] = groupConsecutiveAppointments(doctorAppointments);
  });

  return grouped;
});

const getGroupedAppointmentsForDoctorAndHour = (doctorId: string, hour: number) => {
  const appointments = getGroupedAppointmentsByDoctor.value[doctorId] || [];

  return appointments.filter(app => {
    const startHour = parseInt(app.startTime.split(':')[0], 10);
    const endHour = parseInt(app.endTime.split(':')[0], 10);

    return startHour === hour || (startHour < hour && endHour > hour);
  });
};

const getAppointmentStyle = (appointment: Appointment | GroupedAppointment) => {
  const [startHour, startMinute] = appointment.startTime.split(':').map(Number);
  const [endHour, endMinute] = appointment.endTime.split(':').map(Number);

  const top = (startMinute / 60) * 100;
  const durationInMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
  const height = (durationInMinutes / 60) * 100;

  return {
    top: `${top}%`,
    height: `${height}%`,
    width: '100%',
  };
};

const isGroupedAppointment = (appointment: Appointment | GroupedAppointment): appointment is GroupedAppointment => {
  return 'patients' in appointment;
};
</script>


<template>
  <div class="flex flex-col h-full">
    <div class="day-header flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 shadow-sm">
      <div class="invisible w-24">
        Spacer
      </div>

      <div class="flex items-center justify-center space-x-2">
        <button @click="previousDay" class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <h2 class="text-lg font-semibold">{{ formattedDate }}</h2>

        <button @click="nextDay" class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        {{ totalAppointments }} Appointments
      </div>
    </div>

    <div class="flex-1 overflow-y-auto bg-white">
      <div v-for="hour in hours" :key="hour" class="grid time-grid">
        <div class="time-label text-gray-500 text-sm font-medium pr-2 py-2 text-right">
          {{ formatHour(hour) }}
        </div>

        <div v-for="doctor in filteredDoctors" :key="`${doctor.id}-${hour}`" class="doctor-column relative">
          <div class="border-t border-gray-200 h-full">
            <div class="half-hour-marker"></div>

            <div v-for="appointment in getGroupedAppointmentsForDoctorAndHour(doctor.id, hour)" :key="appointment.id"
              class="absolute p-0.5 left-0 right-0" :style="getAppointmentStyle(appointment)">
              <CardAppointment :appointment="appointment" :is-grouped="isGroupedAppointment(appointment)"
                @click="handleAppointmentClick" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-grid {
  display: grid;
  grid-template-columns: 60px repeat(auto-fill, minmax(150px, 1fr));
}

.doctor-column {
  position: relative;
  height: 100px;
}

.half-hour-marker {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px dashed #e5e7eb;
}
</style> -->

<!-- <script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { format, parseISO } from 'date-fns';
import { useCalendarStore } from '~/stores/calendar';
import type { Appointment } from '~/types/calendar';
import CardAppointment from './CardAppointment.vue';

const calendarStore = useCalendarStore();
const hours = Array.from({ length: 11 }, (_, i) => i + 8);

const currentDate = ref(calendarStore.selectedDate);

const renderKey = ref(`render-${Date.now()}`);

const formattedDate = computed(() => {
  return format(parseISO(currentDate.value), 'EEEE, d MMMM yyyy');
});

const uniqueDoctors = computed(() => {
  const doctors = calendarStore.getFilteredDoctors;
  const uniqueIds = new Set();
  return doctors.filter(doctor => {
    if (uniqueIds.has(doctor.id)) {
      return false;
    }
    uniqueIds.add(doctor.id);
    return true;
  });
});

const totalAppointments = computed(() => {
  return calendarStore.getDailyAppointments(currentDate.value).length;
});

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

const areConsecutiveAppointments = (app1: Appointment, app2: Appointment): boolean =>
  app1.endTime === app2.startTime;

const convertToGroupIfNeeded = (group: Appointment[]): Appointment | GroupedAppointment => {
  if (group.length === 1) return group[0];

  const first = group[0];
  const last = group[group.length - 1];
  return {
    id: group.map(g => g.id).join('-'),
    doctorId: first.doctorId,
    startTime: first.startTime,
    endTime: last.endTime,
    patients: group.map(g => ({
      id: g.id,
      patientName: g.patientName,
      startTime: g.startTime,
      endTime: g.endTime
    }))
  };
};

const groupConsecutiveAppointments = (appointments: Appointment[]): (Appointment | GroupedAppointment)[] => {
  if (!appointments.length) return [];

  const uniqueApps: Appointment[] = [];
  const seenIds = new Set();

  for (const app of appointments) {
    if (!seenIds.has(app.id)) {
      seenIds.add(app.id);
      uniqueApps.push(app);
    }
  }

  const sorted = [...uniqueApps].sort((a, b) =>
    a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime)
  );

  if (sorted.length === 0) return [];

  const result: (Appointment | GroupedAppointment)[] = [];
  let group: Appointment[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const previous = sorted[i - 1];

    if (current.doctorId === previous.doctorId && areConsecutiveAppointments(previous, current)) {
      group.push(current);
    } else {
      result.push(convertToGroupIfNeeded(group));
      group = [current];
    }
  }

  result.push(convertToGroupIfNeeded(group));
  return result;
};

const appointmentCache = ref<Record<string, any>>({});

const getAppointmentsForDoctorAndHour = (doctorId: string, hour: number) => {
  const cacheKey = `${doctorId}-${hour}-${currentDate.value}`;

  if (appointmentCache.value[cacheKey]) {
    return appointmentCache.value[cacheKey];
  }


  const allAppointments = calendarStore.getDailyAppointments(currentDate.value);
  const doctorAppointments = allAppointments.filter(a => a.doctorId === doctorId);

  const groupedAppointments = groupConsecutiveAppointments(doctorAppointments);
  const hourAppointments = groupedAppointments.filter(app => {
    if (!app?.startTime) return false;
    const [startHour] = app.startTime.split(':').map(Number);
    return startHour === hour;
  });

  // เก็บข้อมูลลง cache
  appointmentCache.value[cacheKey] = hourAppointments;

  return hourAppointments;
};

const getAppointmentStyle = (appointment: Appointment | GroupedAppointment) => {
  if (!appointment.startTime || !appointment.endTime) return {};
  const [startHour, startMinute] = appointment.startTime.split(':').map(Number);
  const [endHour, endMinute] = appointment.endTime.split(':').map(Number);

  const top = (startMinute / 60) * 100;
  const durationInMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
  const height = (durationInMinutes / 60) * 100;

  return {
    top: `${top}%`,
    height: `${height}%`,
    width: '100%',
  };
};

const isGroupedAppointment = (a: Appointment | GroupedAppointment): a is GroupedAppointment => {
  return 'patients' in a;
};

const previousDay = () => {
  const date = parseISO(currentDate.value);
  date.setDate(date.getDate() - 1);
  const newDate = format(date, 'yyyy-MM-dd');
  currentDate.value = newDate;
  calendarStore.setSelectedDate(newDate);

  // ล้าง cache และสร้าง key ใหม่
  appointmentCache.value = {};
  renderKey.value = `render-${Date.now()}`;

  console.log(`Changed to previous day: ${newDate}`);
};

const nextDay = () => {
  const date = parseISO(currentDate.value);
  date.setDate(date.getDate() + 1);
  const newDate = format(date, 'yyyy-MM-dd');
  currentDate.value = newDate;
  calendarStore.setSelectedDate(newDate);

  // ล้าง cache และสร้าง key ใหม่
  appointmentCache.value = {};
  renderKey.value = `render-${Date.now()}`;

  console.log(`Changed to next day: ${newDate}`);
};

const handleAppointmentClick = (appointment: Appointment | GroupedAppointment) => {
  console.log('Appointment clicked:', appointment);
};
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="day-header flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 shadow-sm">
      <div class="invisible w-24">Spacer</div>

      <div class="flex items-center justify-center space-x-2">
        <button @click="previousDay" class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
          <Icon icon="mdi:chevron-left" class="w-4 h-4" />
        </button>
        <h2 class="text-lg font-semibold">{{ formattedDate }}</h2>
        <button @click="nextDay" class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
          <Icon icon="mdi:chevron-right" class="w-4 h-4" />
        </button>
      </div>

      <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        {{ totalAppointments }} Appointments
      </div>
    </div>

    <div class="flex-1 overflow-y-auto bg-white" :key="renderKey">
      <div v-for="hour in hours" :key="`hr-${hour}`" class="grid time-grid">
        <div class="time-label text-gray-500 text-sm font-medium pr-2 py-2 text-right">
          {{ hour }} {{ hour < 12 ? 'AM' : 'PM' }} </div>

            <div v-for="doctor in uniqueDoctors" :key="`${doctor.id}-${hour}-${renderKey}`"
              class="doctor-column relative border-l border-gray-100">
              <div class="border-t border-gray-200 h-full">
                <div class="half-hour-marker"></div>

                <div v-for="appointment in getAppointmentsForDoctorAndHour(doctor.id, hour)"
                  :key="`app-${appointment.id}-${renderKey}`" class="absolute p-0.5 left-0 right-0"
                  :style="getAppointmentStyle(appointment)">
                  <CardAppointment :appointment="appointment" :is-grouped="isGroupedAppointment(appointment)"
                    @click="handleAppointmentClick" />
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.time-grid {
  display: grid;
  grid-template-columns: 60px repeat(auto-fill, minmax(150px, 1fr));
}

.doctor-column {
  position: relative;
  height: 100px;
}

.half-hour-marker {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px dashed #e5e7eb;
}
</style> -->

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { format, parseISO } from 'date-fns';
import { useDoctorStore } from '~/stores/doctor';
import { useAppointmentStore } from '~/stores/appointment';
import type { ApiAppointment, Appointment } from '~/types/appointment';
import CardAppointment from './CardAppointment.vue';
import ModalAppointment from './ModalAppointment.vue';

// Stores
const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();

// Local state
const hours = Array.from({ length: 11 }, (_, i) => i + 8);
const currentDate = ref(format(new Date(), 'yyyy-MM-dd'));
const renderKey = ref(`render-${Date.now()}`);

// Modal state
const selectedAppointment = ref<Appointment | GroupedAppointment | null>(null);
const isSelectedGrouped = ref(false);
const showModal = ref(false);

// ฟังก์ชันหาสีของ doctor
const getDoctorColor = (doctorId: string): string | undefined => {
  const doctor = doctorStore.getDoctors.find(d => d.id === doctorId);
  return doctor?.color;
};

// Computed
const formattedDate = computed(() => {
  return format(parseISO(currentDate.value), 'EEEE, d MMMM yyyy');
});

const appointments = computed(() => appointmentStore.getCalendarDayAppointments);

const uniqueDoctors = computed(() => {
  const doctors = doctorStore.getDoctors;
  const appointmentDoctorIds = new Set(
    appointments.value
      .map(appointment => appointment.doctor?.id)
      .filter(Boolean)
  );
  
  return doctors.filter(doctor => appointmentDoctorIds.has(doctor.id));
});

const totalAppointments = computed(() => {
  return appointmentStore.getCalendarDayTotalAppointments;
});

const isLoading = computed(() => appointmentStore.getLoadingCalendarDay);
const error = computed(() => appointmentStore.getCalendarDayError);

// Interface สำหรับการจัดกลุ่ม appointment
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

// แปลง ApiAppointment เป็น format ที่ component ต้องการ
const convertApiAppointmentToCalendar = (apiAppointment: ApiAppointment): Appointment => {
  return {
    id: apiAppointment.id,
    title: apiAppointment.title,
    patient: {
      isRegistered: apiAppointment.patient.isRegistered,
      patientId: apiAppointment.patient.patientId,
      name: apiAppointment.patient.name,
      phone: apiAppointment.patient.phone,
      email: apiAppointment.patient.email,
    },
    appointmentDate: apiAppointment.appointmentDate.split('T')[0], // แปลง ISO date เป็น YYYY-MM-DD
    startTime: apiAppointment.startTime,
    endTime: apiAppointment.endTime,
    type: apiAppointment.type,
    branchId: apiAppointment.branch?.id || '',
    doctorId: apiAppointment.doctor?.id || '',
    notes: apiAppointment.notes,
    status: apiAppointment.status,
    createdAt: apiAppointment.createdAt,
    updatedAt: apiAppointment.updatedAt,
  };
};

const calendarAppointments = computed(() => {
  return appointments.value.map(convertApiAppointmentToCalendar);
});

const areConsecutiveAppointments = (app1: Appointment, app2: Appointment): boolean =>
  app1.endTime === app2.startTime;

const convertToGroupIfNeeded = (group: Appointment[]): Appointment | GroupedAppointment => {
  if (group.length === 1) return group[0];

  const first = group[0];
  const last = group[group.length - 1];
  return {
    id: group.map(g => g.id).join('-'),
    title: `${group.length} การนัดหมายต่อเนื่อง`,
    doctorId: first.doctorId,
    startTime: first.startTime,
    endTime: last.endTime,
    patients: group.map(g => ({
      id: g.id,
      patient: g.patient,
      startTime: g.startTime,
      endTime: g.endTime
    }))
  };
};

const groupConsecutiveAppointments = (appointments: Appointment[]): (Appointment | GroupedAppointment)[] => {
  if (!appointments.length) return [];

  const uniqueApps: Appointment[] = [];
  const seenIds = new Set();

  for (const app of appointments) {
    if (!seenIds.has(app.id)) {
      seenIds.add(app.id);
      uniqueApps.push(app);
    }
  }

  const sorted = [...uniqueApps].sort((a, b) =>
    a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime)
  );

  if (sorted.length === 0) return [];

  const result: (Appointment | GroupedAppointment)[] = [];
  let group: Appointment[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const previous = sorted[i - 1];

    if (current.doctorId === previous.doctorId && areConsecutiveAppointments(previous, current)) {
      group.push(current);
    } else {
      result.push(convertToGroupIfNeeded(group));
      group = [current];
    }
  }

  result.push(convertToGroupIfNeeded(group));
  return result;
};

const appointmentCache = ref<Record<string, any>>({});

const getAppointmentsForDoctorAndHour = (doctorId: string, hour: number) => {
  const cacheKey = `${doctorId}-${hour}-${currentDate.value}`;

  if (appointmentCache.value[cacheKey]) {
    return appointmentCache.value[cacheKey];
  }

  const doctorAppointments = calendarAppointments.value.filter(a => a.doctorId === doctorId);
  const groupedAppointments = groupConsecutiveAppointments(doctorAppointments);
  const hourAppointments = groupedAppointments.filter(app => {
    if (!app?.startTime) return false;
    const [startHour] = app.startTime.split(':').map(Number);
    return startHour === hour;
  });

  // เก็บข้อมูลลง cache
  appointmentCache.value[cacheKey] = hourAppointments;

  return hourAppointments;
};

const getAppointmentStyle = (appointment: Appointment | GroupedAppointment) => {
  if (!appointment.startTime || !appointment.endTime) return {};
  const [startHour, startMinute] = appointment.startTime.split(':').map(Number);
  const [endHour, endMinute] = appointment.endTime.split(':').map(Number);

  const top = (startMinute / 60) * 100;
  const durationInMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
  const height = (durationInMinutes / 60) * 100;

  return {
    top: `${top}%`,
    height: `${height}%`,
    width: '100%',
  };
};

const isGroupedAppointment = (a: Appointment | GroupedAppointment): a is GroupedAppointment => {
  return 'patients' in a;
};

// API Functions
const fetchDayAppointments = async (date: string) => {
  try {
    await appointmentStore.fetchCalendarDayAppointments(date);
  } catch (err: any) {
    console.error('Error fetching day appointments:', err);
  }
};

// Navigation functions
const previousDay = () => {
  const date = parseISO(currentDate.value);
  date.setDate(date.getDate() - 1);
  const newDate = format(date, 'yyyy-MM-dd');
  currentDate.value = newDate;

  // ล้าง cache และสร้าง key ใหม่
  appointmentCache.value = {};
  renderKey.value = `render-${Date.now()}`;

  console.log(`Changed to previous day: ${newDate}`);
};

const nextDay = () => {
  const date = parseISO(currentDate.value);
  date.setDate(date.getDate() + 1);
  const newDate = format(date, 'yyyy-MM-dd');
  currentDate.value = newDate;

  // ล้าง cache และสร้าง key ใหม่
  appointmentCache.value = {};
  renderKey.value = `render-${Date.now()}`;

  console.log(`Changed to next day: ${newDate}`);
};

const handleAppointmentClick = (appointment: Appointment | GroupedAppointment) => {
  selectedAppointment.value = appointment;
  isSelectedGrouped.value = isGroupedAppointment(appointment);
  showModal.value = true;
  console.log('Appointment clicked:', appointment);
};

const handleModalClose = () => {
  showModal.value = false;
  selectedAppointment.value = null;
  isSelectedGrouped.value = false;
};

const handleAppointmentUpdated = async () => {
  // Refresh appointments data
  await fetchDayAppointments(currentDate.value);
  
  // Clear cache และสร้าง key ใหม่
  appointmentCache.value = {};
  renderKey.value = `render-${Date.now()}`;
};

// Watchers
watch(
  () => currentDate.value,
  (newDate) => {
    fetchDayAppointments(newDate);
  }
);

// Lifecycle
onMounted(async () => {
  // ดึงข้อมูลหมอ
  if (doctorStore.getDoctors.length === 0) {
    await doctorStore.fetchDoctors({ limit: 100 });
  }
  
  // ดึงข้อมูล appointments สำหรับวันปัจจุบัน
  await fetchDayAppointments(currentDate.value);
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="day-header flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 shadow-sm">
      <div class="invisible w-24">Spacer</div>

      <div class="flex items-center justify-center space-x-2">
        <button @click="previousDay" class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
          <Icon icon="mdi:chevron-left" class="w-4 h-4" />
        </button>
        <h2 class="text-lg font-semibold">{{ formattedDate }}</h2>
        <button @click="nextDay" class="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
          <Icon icon="mdi:chevron-right" class="w-4 h-4" />
        </button>
      </div>

      <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
        {{ totalAppointments }} Appointments
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <Icon icon="mdi:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchDayAppointments(currentDate)" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ลองใหม่
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex-1 overflow-y-auto bg-white" :key="renderKey">
      <!-- Empty State -->
      <div v-if="uniqueDoctors.length === 0" class="flex-1 flex items-center justify-center">
        <div class="text-center text-gray-500">
          <Icon icon="mdi:calendar-blank" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p class="text-lg mb-2">ไม่มีการนัดหมายในวันนี้</p>
          <p class="text-sm">เลือกวันอื่นหรือสร้างการนัดหมายใหม่</p>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div v-else>
        <div v-for="hour in hours" :key="`hr-${hour}`" class="grid time-grid">
          <div class="time-label text-gray-500 text-sm font-medium pr-2 py-2 text-right">
            {{ hour }} {{ hour < 12 ? 'AM' : 'PM' }}
          </div>

          <div v-for="doctor in uniqueDoctors" :key="`${doctor.id}-${hour}-${renderKey}`"
            class="doctor-column relative border-l border-gray-100">
            <div class="border-t border-gray-200 h-full">
              <div class="half-hour-marker"></div>

              <div v-for="appointment in getAppointmentsForDoctorAndHour(doctor.id, hour)"
                :key="`app-${appointment.id}-${renderKey}`" class="absolute p-0.5 left-0 right-0"
                :style="getAppointmentStyle(appointment)">
                <CardAppointment 
                  :appointment="appointment" 
                  :is-grouped="isGroupedAppointment(appointment)"
                  :doctor-color="getDoctorColor(appointment.doctorId)"
                  @click="handleAppointmentClick" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Detail Modal -->
    <ModalAppointment 
      :appointment="selectedAppointment"
      :is-grouped="isSelectedGrouped"
      :is-visible="showModal"
      @close="handleModalClose"
      @updated="handleAppointmentUpdated" />
  </div>
</template>

<style scoped>
.time-grid {
  display: grid;
  grid-template-columns: 60px repeat(auto-fill, minmax(150px, 1fr));
}

.doctor-column {
  position: relative;
  height: 100px;
}

.half-hour-marker {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px dashed #e5e7eb;
}
</style>