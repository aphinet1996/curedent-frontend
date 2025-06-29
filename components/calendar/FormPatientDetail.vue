<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { format, parseISO } from 'date-fns';
import { useCalendarStore } from '~/stores/calendar';
import type { Appointment } from '~/types/calendar';
import Modal from '~/components/Modal.vue';

const props = defineProps<{
  show: boolean;
  patientId?: string;
}>();

const emit = defineEmits(['close']);

const calendarStore = useCalendarStore();
const showAppointmentForm = ref(false);

// สร้างข้อมูลคนไข้จำลอง
const patient = ref({
  id: props.patientId || 'patient-001',
  name: 'Jelly Natthamon',
  phoneNumber: '090-193-9103',
  gender: 'Female',
  note: 'ความดันสูง แพ้ยา: -',
  image: '/images/patient-avatar.jpg',
  socialAccounts: [
    { type: 'line', username: 'jelly_line' },
    { type: 'facebook', url: 'facebook.com/jelly' }
  ]
});

// สร้างข้อมูลจำลองสำหรับการนัดหมาย
const mockAppointments = ref([
  {
    id: 'app-001',
    patientId: 'patient-001',
    patientName: 'K. Natthamon Konglimchareon (Jelly)',
    doctorId: 'doctor-001',
    doctorName: 'Dr. John Doe',
    date: '2025-05-01',
    startTime: '10:00',
    endTime: '10:30',
    status: 'scheduled',
    note: 'ตรวจสุขภาพประจำปี',
    treatmentType: 'จัดฟัน (Invisalign Full)'
  },
  {
    id: 'app-002',
    patientId: 'patient-001',
    patientName: 'K. Natthamon Konglimchareon (Jelly)',
    doctorId: 'doctor-002',
    doctorName: 'Dr. John Doe',
    date: '2025-04-15',
    startTime: '13:00',
    endTime: '14:00',
    status: 'scheduled',
    note: 'ติดตามอาการความดัน',
    treatmentType: 'จัดฟัน (Invisalign Full)'
  },
  {
    id: 'app-003',
    patientId: 'patient-001',
    patientName: 'K. Natthamon Konglimchareon (Jelly)',
    doctorId: 'doctor-001',
    doctorName: 'Dr. John Doe',
    date: '2025-03-15',
    startTime: '09:00',
    endTime: '09:30',
    status: 'completed',
    note: 'ตรวจติดตามผล',
    treatmentType: 'จัดฟัน (Invisalign Full)'
  },
  {
    id: 'app-004',
    patientId: 'patient-001',
    patientName: 'K. Natthamon Konglimchareon (Jelly)',
    doctorId: 'doctor-003',
    doctorName: 'Dr. John Doe',
    date: '2025-02-20',
    startTime: '11:00',
    endTime: '11:30',
    status: 'cancelled',
    note: 'ยกเลิกเนื่องจากหมอติดประชุม',
    treatmentType: 'จัดฟัน (Invisalign Full)'
  }
]);

// แบ่งประเภทการนัดหมาย
const upcomingAppointments = computed(() => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return mockAppointments.value.filter(app => app.date >= today && app.status === 'scheduled');
});

const pastAppointments = computed(() => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return mockAppointments.value.filter(app => app.date < today || app.status !== 'scheduled');
});

// รูปแบบวันที่และเวลา
const formatDateTime = (dateStr: string, startTime: string, endTime: string) => {
  if (!dateStr) return '';

  try {
    const date = parseISO(dateStr);
    // Format date as "15 AUG 2023"
    const formattedDate = format(date, 'd MMM yyyy').toUpperCase();

    // Format time as "13.00 - 14.00" (replacing ":" with ".")
    const formattedStartTime = startTime.replace(':', '.');
    const formattedEndTime = endTime.replace(':', '.');

    return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
  } catch (error) {
    return dateStr;
  }
};

// เปิดฟอร์มสร้างการนัดหมายใหม่
const createAppointment = () => {
  showAppointmentForm.value = true;
};

// สถานะการนัดหมาย และสี
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'scheduled':
      return { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' };
    case 'completed':
      return { text: 'Done', class: 'bg-blue-100 text-blue-800' };
    case 'cancelled':
      return { text: 'Cancel', class: 'bg-red-100 text-red-800' };
    default:
      return { text: status, class: 'bg-gray-100 text-gray-800' };
  }
};

// สำหรับใช้ในการพัฒนาต่อไป: เพิ่มคนเป็น Admin
const visibleAdmins = ref([
  { id: 'admin-1', name: 'Admin 1' },
  { id: 'admin-2', name: 'Admin 2' }
]);

const addAdmin = () => {
  console.log('Add admin');
};

const removeAdmin = (adminId: string) => {
  console.log('Remove admin', adminId);
};
</script>

<template>
  <Modal :show="show" @close="$emit('close')" widthClass="max-w-3xl">
    <div v-if="show" class="relative">
      <!-- ข้อมูลคนไข้ -->
      <div class="flex mb-6 items-start pt-2">
        <!-- รูปโปรไฟล์ -->
        <div class="w-24 h-24 rounded-lg overflow-hidden mr-4 flex-shrink-0 border border-gray-200">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=jelly" alt="Patient avatar"
            class="w-full h-full object-cover" />
        </div>

        <!-- ข้อมูลคนไข้ -->
        <div class="flex-grow">
          <div class="flex items-start">
            <h2 class="text-md font-bold mr-2">{{ patient.name }}</h2>
            <button class="text-blue-500 font-medium flex items-center text-sm">
              <Icon icon="mdi:pencil" class="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          <!-- Social accounts -->
          <div class="mt-2 flex gap-2">
            <button class="px-3 py-1 rounded-md bg-green-100 text-green-700 text-sm flex items-center">
              <Icon icon="ri:line-fill" class="w-4 h-4 mr-1" />
              Line
            </button>
            <button class="px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-sm flex items-center">
              <Icon icon="ri:facebook-fill" class="w-4 h-4 mr-1" />
              Facebook
            </button>
          </div>

          <!-- ข้อมูลติดต่อ -->
          <div class="flex mt-2 text-gray-700">
            <div class="flex items-center text-xs">
              <Icon icon="mdi:telephone" class="w-4 h-4 mr-1" />
              <span>Tel: {{ patient.phoneNumber }}</span>
            </div>
            <div class="flex items-center text-xs">
              <Icon icon="mdi:gender-female" class="w-4 h-4 mr-1" />
              <span>{{ patient.gender }}</span>
            </div>
          </div>

          <!-- Note -->
          <div class="flex mt-2 text-gray-700">
            <div class="text-xs text-gray-500">โรคประจำตัว:</div>
            <div class="ml-1 text-xs text-gray-500">{{ patient.note }}</div>
          </div>
        </div>
      </div>

      <!-- หัวข้อส่วน Appointment -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <h3 class="font-semibold text-md mr-2">Appointment</h3>
          <button @click="createAppointment"
            class="rounded-lg flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm">
            <Icon icon="mdi:plus" class="w-5 h-5" />
            Create an appointment
          </button>
        </div>
      </div>

      <!-- ส่วนการนัดหมายที่กำลังจะมาถึง -->
      <div class="mb-4">
        <h4 class="text-sm text-gray-500 mb-2">Upcoming</h4>
        <div v-if="upcomingAppointments.length > 0" class="space-y-3">
          <div v-for="appointment in upcomingAppointments" :key="appointment.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <!-- ส่วนซ้าย: รูปโปรไฟล์ -->
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=jelly" alt="Patient"
                class="w-10 h-10 rounded-full mr-3" />

              <!-- ส่วนข้อมูลคนไข้ -->
              <div class="flex-grow">
                <div class="flex items-center">
                  <div class="font-light text-xs text-gray-900 mr-2">{{ appointment.patientName }}</div>
                </div>

                <div class="flex items-center text-sm text-gray-600">
                  <div class="flex items-center mr-3">
                    <Icon icon="mdi:phone" class="w-3 h-3 mr-1" />
                    <span class="text-xs">
                      Tel: {{ patient.phoneNumber }}
                    </span>
                  </div>
                  <div class="flex items-center">
                    <Icon icon="mdi:gender-female" class="w-3 h-3 mr-1" />
                    <span class="text-xs">
                      {{ patient.gender }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- เส้นคั่นแนวตั้ง -->
              <div class="h-10 w-px bg-gray-200 mx-3"></div>

              <!-- ส่วนขวา: ข้อมูลการรักษาและสถานะ -->
              <div class="flex flex-col">
                <div class="flex justify-between">
                  <div class="flex justify-start text-sm text-gray-700 mb-1">{{ appointment.treatmentType }}</div>
                  <div class="flex justify-end">
                    <span class="px-3 py-1 text-xs rounded-full" :class="getStatusInfo(appointment.status).class">
                      {{ getStatusInfo(appointment.status).text }}
                    </span>
                  </div>
                </div>
                <div class="flex">
                  <div class="flex items-center text-xs text-gray-600 mr-3">
                    <Icon icon="mdi:doctor" class="w-4 h-4 mr-1 text-blue-500" />
                    <span>{{ appointment.doctorName }}</span>
                  </div>

                  <div class="flex items-center text-xs text-gray-600">
                    <Icon icon="mdi:calendar" class="w-4 h-4 mr-1 text-blue-500" />
                    <span>{{ formatDateTime(appointment.date, appointment.startTime, appointment.endTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 italic text-sm">ไม่มีการนัดหมายที่กำลังจะมาถึง</div>
      </div>

      <!-- ส่วนการนัดหมายที่ผ่านมาแล้ว -->
      <div class="mb-4">
        <h4 class="text-sm text-gray-500 mb-2">Past</h4>
        <div v-if="pastAppointments.length > 0" class="space-y-3">
          <div v-for="appointment in pastAppointments" :key="appointment.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=jelly" alt="Patient"
                class="w-10 h-10 rounded-full mr-3" />

              <div class="flex-grow">
                <div class="flex items-center">
                  <div class="font-light text-xs text-gray-900 mr-2">{{ appointment.patientName }}</div>
                </div>

                <div class="flex items-center text-sm text-gray-600">
                  <div class="flex items-center mr-3">
                    <Icon icon="mdi:phone" class="w-3 h-3 mr-1" />
                    <span class="text-xs">
                      Tel: {{ patient.phoneNumber }}
                    </span>
                  </div>
                  <div class="flex items-center">
                    <Icon icon="mdi:gender-female" class="w-3 h-3 mr-1" />
                    <span class="text-xs">
                      {{ patient.gender }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="h-10 w-px bg-gray-200 mx-3"></div>

              <div class="flex flex-col">
                <div class="flex justify-between">
                  <div class="flex justify-start text-sm text-gray-700 mb-1">{{ appointment.treatmentType }}</div>
                  <div class="flex justify-end">
                    <span class="px-3 py-1 text-xs rounded-full" :class="getStatusInfo(appointment.status).class">
                      {{ getStatusInfo(appointment.status).text }}
                    </span>
                  </div>
                </div>
                <div class="flex">
                  <div class="flex items-center text-xs text-gray-600 mr-3">
                    <Icon icon="mdi:doctor" class="w-4 h-4 mr-1 text-blue-500" />
                    <span>{{ appointment.doctorName }}</span>
                  </div>

                  <div class="flex items-center text-xs text-gray-600">
                    <Icon icon="mdi:calendar" class="w-4 h-4 mr-1 text-blue-500" />
                    <span>{{ formatDateTime(appointment.date, appointment.startTime, appointment.endTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 italic text-sm">ไม่มีการนัดหมายที่ผ่านมาแล้ว</div>
      </div>

      <!-- ส่วน Visible To -->
      <div class="mt-6">
        <div class="flex mb-2">
          <h4 class="text-gray-700">Visible To.</h4>
          <button class="ml-2 rounded-lg flex items-center gap-1 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3"
          @click="showForm = true">
          <Icon icon="mdi:add" class="w-4 h-4" />
          Add
        </button>
        </div>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <!-- รายการผู้ดูแล -->
          <div v-for="admin in visibleAdmins" :key="admin.id"
            class="flex items-center bg-gray-100 rounded-lg pl-3 pr-1 py-1">
            <span class="text-xs mr-1">{{ admin.name }}</span>
            <button @click="removeAdmin(admin.id)" class="text-gray-400 hover:text-gray-600 p-1">
              <Icon icon="mdi:delete-outline" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>