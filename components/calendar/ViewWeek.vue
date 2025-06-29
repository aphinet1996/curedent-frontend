<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useDoctorStore } from '~/stores/doctor';
import { useAppointmentStore } from '~/stores/appointment';
import type { Appointment, ApiAppointment } from '~/types/appointment';
import CardAppointment from './CardAppointment.vue';

const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();

const hours = Array.from({ length: 11 }, (_, i) => i + 8);

const convertApiAppointmentToAppointment = (apiAppointment: ApiAppointment): Appointment => {
  return {
    id: apiAppointment.id,
    title: apiAppointment.title,
    patient: {
      isRegistered: apiAppointment.patient.isRegistered,
      patientId: apiAppointment.patient.id,
      name: apiAppointment.patient.name,
      phone: apiAppointment.patient.phone,
      email: apiAppointment.patient.email,
    },
    appointmentDate: apiAppointment.appointmentDate.split('T')[0],
    startTime: apiAppointment.startTime,
    endTime: apiAppointment.endTime,
    type: apiAppointment.type,
    branchId: apiAppointment.branch?.id || '',
    doctorId: apiAppointment.doctor?.id || '',
    notes: apiAppointment.notes || '',
    status: apiAppointment.status,
    createdAt: apiAppointment.createdAt,
    updatedAt: apiAppointment.updatedAt,
  };
};

const weekDays = computed(() => {
  const weekData = appointmentStore.getWeekViewData;
  if (!weekData) return [];

  return weekData.days.map(day => ({
    date: day.date,
    dayOfWeek: day.dayOfWeek,
    dayName: getDayName(day.dayOfWeek),
    dateDisplay: formatDateDisplay(day.date),
    appointments: day.appointments.map(convertApiAppointmentToAppointment),
    appointmentCount: day.appointmentCount,
  }));
});

const getDayName = (dayOfWeek: number): string => {
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return days[dayOfWeek];
};

const formatDateDisplay = (date: string): string => {
  const d = new Date(date);
  return d.getDate().toString();
};

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

const areConsecutive = (a: Appointment, b: Appointment) =>
  a.doctorId === b.doctorId && a.endTime === b.startTime;

const convertGroup = (group: Appointment[]): Appointment | GroupedAppointment => {
  if (group.length === 1) return group[0];
  const first = group[0], last = group[group.length - 1];
  return {
    id: group.map(x => x.id).join('-'),
    title: `${group.length} การนัดหมายต่อเนื่อง`,
    doctorId: first.doctorId,
    startTime: first.startTime,
    endTime: last.endTime,
    patients: group.map(x => ({
      id: x.id,
      patient: x.patient,
      startTime: x.startTime,
      endTime: x.endTime
    }))
  };
};

const groupConsecutiveAppointments = (apps: Appointment[]): (Appointment | GroupedAppointment)[] => {
  const sorted = [...apps].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const result: (Appointment | GroupedAppointment)[] = [];
  let grp: Appointment[] = [];
  for (const app of sorted) {
    if (!grp.length || areConsecutive(grp[grp.length - 1], app)) {
      grp.push(app);
    } else {
      result.push(convertGroup(grp));
      grp = [app];
    }
  }
  if (grp.length) result.push(convertGroup(grp));
  return result;
};

// เช็คว่า object นั้นเป็น grouped หรือไม่
const isGroupedAppointment = (a: any): a is GroupedAppointment => 'patients' in a;

// —— ดัดแปลงฟังก์ชันดึงนัด ——
const getAppointmentsForDayAndHour = (date: string, hour: number) => {
  const day = weekDays.value.find(d => d.date === date);
  if (!day) return [];

  const grouped = groupConsecutiveAppointments(day.appointments);
  // กรองเฉพาะที่เริ่มตรงชั่วโมงนั้น
  return grouped.filter(app => {
    const [h] = app.startTime.split(':').map(Number);
    return h === hour;
  });
};

const activeAppointmentId = ref<string | null>(null);

const getAppointmentStyle = (app: Appointment | GroupedAppointment) => {
  const [sH, sM] = app.startTime.split(':').map(Number);
  const [eH, eM] = app.endTime.split(':').map(Number);
  const top = (sM / 60) * 100;
  const durationInMinutes = (eH - sH) * 60 + (eM - sM);
  const height = (durationInMinutes / 60) * 100;
  return {
    top: `${top}%`,
    height: `${height}%`,
    left: '5%',
    width: '90%',
  };
};

const getDoctor = (doctorId: string) => {
  return doctorStore.getDoctors.find(d => d.id === doctorId);
};

const handleAppointmentClick = (app: Appointment | GroupedAppointment) => {
  console.log('Clicked:', app);
  activeAppointmentId.value = app.id;
};

const isLoading = computed(() => appointmentStore.getLoadingWeekView);

const goToPreviousWeek = async () => {
  await appointmentStore.goToPreviousWeek();
};

const goToNextWeek = async () => {
  await appointmentStore.goToNextWeek();
};

// const goToToday = async () => {
//   await appointmentStore.goToToday();
// };

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    doctorStore.fetchDoctors({ limit: 100 }),
    appointmentStore.fetchCalendarWeekAppointments({
      date: appointmentStore.getSelectedDate
    })
  ]);
});
</script>

<template>
  <div class="view-week flex flex-col h-full">

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-2 text-gray-600">กำลังโหลด...</span>
    </div>

    <div v-else-if="weekDays.length > 0" class="flex-1 flex flex-col">
      <div class="flex justify-between px-2 pt-2">
        <button @click="goToPreviousWeek" :disabled="isLoading"
          class="p-2 rounded-full bg-blue-200 hover:bg-blue-300 disabled:opacity-50 transition-colors">
          <Icon icon="mdi:chevron-left" class="w-5 h-5" />
        </button>

        <button @click="goToNextWeek" :disabled="isLoading"
          class="p-2 rounded-full bg-blue-200 hover:bg-blue-300 disabled:opacity-50 transition-colors">
          <Icon icon="mdi:chevron-right" class="w-5 h-5" />
        </button>
      </div>
      <div class="week-header grid border-b border-b-gray-100 bg-white"
        :style="{ gridTemplateColumns: `45px repeat(${weekDays.length}, 1fr)` }">
        <div></div>
        <div v-for="day in weekDays" :key="day.date" class="text-center py-3 border-r border-gray-200">
          <div class="flex justify-center">
            <div class="lg:text-sm text-md font-medium text-gray-600 mb-1">{{ day.dayName }}</div>
            <div class="lg:text-sm text-md font-medium text-gray-600 mb-1">,</div>
            <div class="lg:text-sm text-md font-medium text-gray-800 mb-1">{{ day.dateDisplay }}</div>
          </div>
          <div class="px-4">
            <div v-if="day.date === new Date().toISOString().split('T')[0]"
              class="text-xs text-white bg-blue-600 rounded-full px-2 py-1 mt-1">
              วันนี้
            </div>
          </div>
        </div>
      </div>


      <div class="time-grid flex-1 overflow-y-auto">
        <div v-for="hour in hours" :key="hour" class="time-row grid"
          :style="{ gridTemplateColumns: `45px repeat(${weekDays.length}, 1fr)`, height: '100px' }">

          <div class="text-gray-500 lg:text-[12px] text-sm pt-2 text-center ">
            {{ `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}` }} 
            <!-- {{ `${hour}:00` }}  -->
          </div>

              <div v-for="day in weekDays" :key="day.date"
                class="relative border-r border-gray-200 hover:bg-gray-50 transition-colors">
                <div class="absolute left-0 right-0 border-t border-dashed border-gray-300"></div>

                <div v-for="appt in getAppointmentsForDayAndHour(day.date, hour)" :key="appt.id"
                  class="absolute cursor-pointer" :style="[
                    getAppointmentStyle(appt),
                    { zIndex: appt.id === activeAppointmentId ? 10 : 1 }
                  ]" @click="handleAppointmentClick(appt)">
                  <CardAppointment :appointment="appt" :is-grouped="isGroupedAppointment(appt)"
                    @click="handleAppointmentClick" />
                </div>
              </div>
          </div>
        </div>
      </div>

      <div v-else class="flex-1 flex items-center justify-center text-gray-500">
        <div class="text-center">
          <Icon icon="mdi:calendar-blank" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>ไม่มีข้อมูลการนัดหมาย</p>
        </div>
      </div>
    </div>
</template>

<style scoped>
.view-week {
  height: 100vh;
}

.time-row:hover .relative {
  background-color: rgba(59, 130, 246, 0.02);
}

.week-header {
  position: sticky;
  top: 0;
  z-index: 5;
}
</style>