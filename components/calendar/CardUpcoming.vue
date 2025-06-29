<!-- <script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useCalendarStore } from '~/stores/calendar';
import FormDoctorAppointment from '~/components/calendar/FormDoctorAppointment.vue';

const calendarStore = useCalendarStore();
const currentPage = ref(0);

// Modal state
const showAppointmentForm = ref(false);
const selectedDoctor = ref<string | undefined>(undefined);

// ค่าคงที่สำหรับขนาดและจำนวนการ์ด
const cardWidth = 230;
const visibleItems = 5;

// รายการหมอที่มีการนัดหมาย
const filteredDoctors = computed(() => {
  return calendarStore.getFilteredDoctors;
});

// เฉพาะข้อมูลที่จะแสดงในหน้าปัจจุบัน
const visibleDoctors = computed(() => {
  const startIndex = currentPage.value * visibleItems;
  return filteredDoctors.value.slice(startIndex, startIndex + visibleItems);
});

// คำนวณจำนวนหน้าทั้งหมด
const totalPages = computed(() => {
  return Math.ceil(filteredDoctors.value.length / visibleItems);
});

// ดึงข้อมูลการนัดหมายของหมอแต่ละคน
const getDoctorTimeSlots = (doctorId: string) => {
  const appointments = calendarStore.getUpcomingAppointments.filter(
    appointment => appointment.doctorId === doctorId
  );

  return appointments.map(appointment => ({
    start: appointment.startTime,
    end: appointment.endTime,
    description: appointment.patientName,
  })).slice(0, 2);
};

// ฟังก์ชันสำหรับการเลื่อนหน้า (ปิดไม่ให้ event bubbling)
const goToPage = (page: number) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

// ตรวจสอบและรีเซ็ต pagination เมื่อข้อมูลเปลี่ยน
onMounted(() => {
  // ป้องกันปัญหา event propagation โดยรีเซ็ตหน้าเมื่อ component mount
  currentPage.value = 0;
});

// เปิด Modal การนัดหมายเมื่อกดที่การ์ดหมอ
const openAppointmentForm = (doctorId: string) => {
  selectedDoctor.value = doctorId;
  showAppointmentForm.value = true;
};

// ปิด Modal
const closeAppointmentForm = () => {
  showAppointmentForm.value = false;
  selectedDoctor.value = undefined;
};

// บันทึกการนัดหมายเสร็จแล้ว
const handleAppointmentSaved = () => {
  // อาจจะเพิ่มการแสดง notification หรือการอัพเดตข้อมูลเพิ่มเติมตรงนี้
  closeAppointmentForm();
};
</script>

<template>
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-xl font-bold text-gray-800">Upcoming</h2>

    <div class="flex items-center gap-1 px-5" v-if="filteredDoctors.length > visibleItems">
      <button @click.stop="prevPage" class="p-1 rounded-full hover:bg-gray-100 disabled:opacity-40"
        :disabled="currentPage === 0">
        <Icon icon="mdi:chevron-left" class="w-4 h-4" />
      </button>
      <button @click.stop="nextPage" class="p-1 rounded-full hover:bg-gray-100 disabled:opacity-40"
        :disabled="currentPage >= totalPages - 1">
        <Icon icon="mdi:chevron-right" class="w-4 h-4" />
      </button>
    </div>
  </div>

  <div class="w-full overflow-hidden">
    <div class="flex space-x-2 transition-transform duration-300">
      <div v-for="doctor in visibleDoctors" :key="doctor.id"
        class="rounded-lg p-2 flex-shrink-0 flex min-h-[90px] h-[80px] cursor-pointer hover:shadow-md transition-shadow"
        :class="doctor.color" :style="{ width: cardWidth + 'px' }" @click="openAppointmentForm(doctor.id)">

        <div class="flex-shrink-0 mr-2 flex items-center justify-center">
          <div class="w-14 h-14 bg-white rounded-full overflow-hidden">
            <img v-if="doctor.avatar" :src="doctor.avatar" :alt="doctor.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
              {{ doctor.name.charAt(0) }}
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col overflow-hidden">
          <h3 class="font-bold text-gray-800 mb-1 text-sm truncate">{{ doctor.name }}</h3>

          <div class="flex-1 overflow-y-auto">
            <div v-for="(timeSlot, index) in getDoctorTimeSlots(doctor.id)" :key="index"
              class="bg-white bg-opacity-70 rounded p-0.5 mb-1 text-[11px] truncate">
              {{ timeSlot.start }} - {{ timeSlot.end }} K.{{ timeSlot.description }}
            </div>

            <div v-if="getDoctorTimeSlots(doctor.id).length === 0" class="text-xs text-gray-500 italic">
              ไม่มีการนัดหมาย
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-center mt-2 gap-1" v-if="totalPages > 1">
    <button v-for="page in totalPages" :key="page - 1" @click.stop="goToPage(page - 1)"
      class="w-1 h-1 rounded-full transition-colors duration-200"
      :class="currentPage === page - 1 ? 'bg-blue-500' : 'bg-gray-300'"></button>
  </div>

  <FormDoctorAppointment :show="showAppointmentForm" :doctor-id="selectedDoctor" @close="closeAppointmentForm"
    @saved="handleAppointmentSaved" />
</template> -->


<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useDoctorStore } from '~/stores/doctor';
import { useAppointmentStore } from '~/stores/appointment';
import type { ApiAppointment } from '~/types/appointment';
import FormDoctorAppointment from '~/components/calendar/FormDoctorAppointment.vue'

const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();
const currentPage = ref(0);

const showAppointmentForm = ref(false);
const selectedDoctor = ref<string | undefined>(undefined);

const cardWidth = 230;
const visibleItems = 5;

// ฟังก์ชันแปลงสี hex เป็น RGB และสร้าง inline styles
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getCardStyles = (hexColor?: string) => {
  if (!hexColor || !hexColor.startsWith('#')) {
    return {
      backgroundColor: 'rgb(243, 244, 246)',
    };
  }

  const rgb = hexToRgb(hexColor);

  if (!rgb) {
    return {
      backgroundColor: 'rgb(243, 244, 246)'
    };
  }

  const styles = {
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
  };

  return styles;
};

const fallbackColors = [
  'bg-blue-100 border-blue-400',
  'bg-green-100 border-green-400',
  'bg-purple-100 border-purple-400',
  'bg-pink-100 border-pink-400',
  'bg-yellow-100 border-yellow-400',
  'bg-indigo-100 border-indigo-400',
  'bg-red-100 border-red-400',
  'bg-teal-100 border-teal-400'
];

// Local state for appointments
const upcomingAppointments = ref<ApiAppointment[]>([]);
const isLoadingAppointments = ref(false);

// สร้าง interface สำหรับ doctor card (รวม placeholder)
interface DoctorCard {
  id: string;
  fullName: string;
  photo?: string;
  color: string;
  cardStyles?: any;
  avatar?: string;
  isPlaceholder?: boolean;
}

// ดึงรายการหมอทั้งหมดพร้อมสีจาก API
const allDoctorsWithColors = computed(() => {
  const doctors = doctorStore.getDoctors;

  return doctors.map((doctor, index) => {

    let colorClass = '';
    let cardStyles = {};

    if (doctor.color && doctor.color.startsWith('#')) {
      // ใช้สีจาก API - ต้องเป็น hex color
      cardStyles = getCardStyles(doctor.color);
      colorClass = doctor.color; // เก็บสี hex ไว้
    } else {
      // ใช้สี fallback
      colorClass = fallbackColors[index % fallbackColors.length];
      cardStyles = {}; // ใช้ Tailwind classes แทน
    }

    return {
      ...doctor,
      color: colorClass,
      cardStyles,
      avatar: doctor.photo,
      isPlaceholder: false
    };
  });
});

// สร้าง placeholder cards เมื่อหมอไม่ครบ
const createPlaceholderCards = (count: number): DoctorCard[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `placeholder-${index}`,
    fullName: 'ยังไม่มีหมอ',
    color: 'bg-gray-100 border-gray-300',
    isPlaceholder: true
  }));
};

// เฉพาะข้อมูลที่จะแสดงในหน้าปัจจุบัน
const visibleDoctors = computed(() => {
  const startIndex = currentPage.value * visibleItems;
  const endIndex = startIndex + visibleItems;
  const doctorsSlice = allDoctorsWithColors.value.slice(startIndex, endIndex);

  // ถ้าการ์ดไม่ครบ 5 ให้เพิ่ม placeholder
  const remainingSlots = visibleItems - doctorsSlice.length;
  if (remainingSlots > 0) {
    const placeholders = createPlaceholderCards(remainingSlots);
    return [...doctorsSlice, ...placeholders];
  }

  return doctorsSlice;
});

// คำนวณจำนวนหน้าทั้งหมด (ขึ้นอยู่กับจำนวนหมอจริง)
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(allDoctorsWithColors.value.length / visibleItems));
});

// ดึงข้อมูลการนัดหมายของหมอแต่ละคน
const getDoctorTimeSlots = (doctorId: string) => {
  if (doctorId.startsWith('placeholder-')) {
    return [];
  }

  const appointments = upcomingAppointments.value.filter(
    appointment => appointment.doctor?.id === doctorId
  );

  return appointments.map(appointment => ({
    start: appointment.startTime,
    end: appointment.endTime,
    description: appointment.patient?.name || 'ไม่ระบุชื่อ',
  })).slice(0, 2); // แสดงแค่ 2 รายการแรก
};

// ฟังก์ชันสำหรับการเลื่อนหน้า
const goToPage = (page: number) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

// เปิด Modal การนัดหมายเมื่อกดที่การ์ดหมอ
const openAppointmentForm = (doctorId: string) => {
  if (doctorId.startsWith('placeholder-')) {
    return;
  }
  selectedDoctor.value = doctorId;
  showAppointmentForm.value = true;
};

// ปิด Modal
const closeAppointmentForm = () => {
  showAppointmentForm.value = false;
  selectedDoctor.value = undefined;
};

// บันทึกการนัดหมายเสร็จแล้ว
const handleAppointmentSaved = () => {
  closeAppointmentForm();
  // รีเฟรชข้อมูลการนัดหมาย
  fetchUpcomingAppointments();
};

// ดึงข้อมูลหมอและการนัดหมาย
const fetchDoctors = async () => {
  try {
    await doctorStore.fetchDoctors({ limit: 100 });
  } catch (error) {
    console.error('Error fetching doctors:', error);
  }
};

const fetchUpcomingAppointments = async () => {
  isLoadingAppointments.value = true;
  try {
    const appointments = await appointmentStore.fetchUpcomingAppointments({
      limit: 50 // ดึงการนัดหมายที่กำลังจะมาถึง
    });
    upcomingAppointments.value = appointments;
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    upcomingAppointments.value = [];
  } finally {
    isLoadingAppointments.value = false;
  }
};

// ดึงข้อมูลเมื่อ component mount
onMounted(async () => {
  currentPage.value = 0;
  await Promise.all([
    fetchDoctors(),
    fetchUpcomingAppointments()
  ]);
});

// Computed สำหรับการโหลด
const isLoading = computed(() => {
  return doctorStore.getLoading || isLoadingAppointments.value;
});

// ตรวจสอบว่ามีการ์ดจริงหรือไม่ (ไม่ใช่ placeholder ทั้งหมด)
const hasRealDoctors = computed(() => {
  return allDoctorsWithColors.value.length > 0;
});

// ฟังก์ชันสำหรับดึงชื่อหมอจาก ID (สำหรับ debug)
const getDoctorName = (doctorId: string): string => {
  return doctorStore.getDoctorNameById(doctorId);
};
</script>

<template>
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-xl font-bold text-gray-800">Upcoming</h2>

    <div class="flex items-center gap-1 px-5" v-if="totalPages > 1">
      <button @click.stop="prevPage" class="p-1 rounded-full hover:bg-gray-100 disabled:opacity-40"
        :disabled="currentPage === 0">
        <Icon icon="mdi:chevron-left" class="w-4 h-4" />
      </button>
      <button @click.stop="nextPage" class="p-1 rounded-full hover:bg-gray-100 disabled:opacity-40"
        :disabled="currentPage >= totalPages - 1">
        <Icon icon="mdi:chevron-right" class="w-4 h-4" />
      </button>
    </div>
  </div>

  <div v-if="isLoading" class="w-full flex justify-center items-center py-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span class="ml-2 text-gray-600">กำลังโหลด...</span>
  </div>

  <div v-else class="w-full overflow-hidden">
    <div class="flex space-x-2 transition-transform duration-300">
      <div v-for="doctor in visibleDoctors" :key="doctor.id"
        class="rounded-lg p-2 flex-shrink-0 flex min-h-[90px] h-[80px] transition-shadow" :class="[
          // ใช้ Tailwind class เฉพาะ placeholder และ fallback colors (รวม )
          !doctor.cardStyles || Object.keys(doctor.cardStyles).length === 0 ? doctor.color : '',
          doctor.isPlaceholder
            ? 'cursor-default'
            : 'cursor-pointer hover:shadow-md'
        ]" :style="{
          width: cardWidth + 'px',
          // ใช้ inline styles สำหรับสีจาก API (จะ override Tailwind)
          ...(doctor.cardStyles && Object.keys(doctor.cardStyles).length > 0 ? doctor.cardStyles : {})
        }" @click="!doctor.isPlaceholder && openAppointmentForm(doctor.id)">

        <!-- Debug info (ลบออกภายหลัง) -->
        <div v-if="!doctor.isPlaceholder" class="absolute -top-6 left-0 text-xs text-red-500 z-10">
          {{ doctor.color }}
        </div>

        <!-- Placeholder Card -->
        <div v-if="doctor.isPlaceholder" class="w-full flex flex-col items-center justify-center text-gray-400">
          <Icon icon="mdi:account-plus" class="w-8 h-8 mb-1" />
          <span class="text-xs text-center">{{ doctor.fullName }}</span>
        </div>

        <!-- Doctor Card -->
        <template v-else>
          <div class="flex-shrink-0 mr-2 flex items-center justify-center">
            <div class="w-14 h-14 bg-white rounded-full overflow-hidden">
              <img v-if="doctor.avatar" :src="doctor.avatar" :alt="doctor.fullName"
                class="w-full h-full object-cover" />
              <div v-else
                class="w-full h-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                {{ doctor.fullName.charAt(0) }}
              </div>
            </div>
          </div>

          <div class="flex-1 flex flex-col overflow-hidden">
            <h3 class="font-bold text-gray-800 mb-1 text-sm truncate">{{ doctor.fullName }}</h3>

            <div class="flex-1 overflow-y-auto">
              <div v-for="(timeSlot, index) in getDoctorTimeSlots(doctor.id)" :key="index"
                class="bg-white bg-opacity-70 rounded p-0.5 mb-1 text-[11px] truncate">
                {{ timeSlot.start }} - {{ timeSlot.end }} K.{{ timeSlot.description }}
              </div>

              <div v-if="getDoctorTimeSlots(doctor.id).length === 0" class="text-xs text-gray-500 italic">
                ไม่มีการนัดหมาย
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <div class="flex justify-center mt-2 gap-1" v-if="totalPages > 1">
    <button v-for="page in totalPages" :key="page - 1" @click.stop="goToPage(page - 1)"
      class="w-1 h-1 rounded-full transition-colors duration-200"
      :class="currentPage === page - 1 ? 'bg-blue-500' : 'bg-gray-300'"></button>
  </div>

  <FormDoctorAppointment :show="showAppointmentForm" :doctorId="selectedDoctor" @close="closeAppointmentForm"
    @saved="handleAppointmentSaved" />
</template>