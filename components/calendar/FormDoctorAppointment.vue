<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { format } from 'date-fns';
import { useCalendarStore } from '~/stores/calendar';
import { useDoctorStore } from '~/stores/doctor';
import type { Appointment, Doctor } from '~/types/calendar';
import Modal from '~/components/Modal.vue';

const props = defineProps<{
  show: boolean;
  doctorId?: string;
  appointmentId?: string;
  date?: string;
}>();

const emit = defineEmits(['close', 'saved']);

const calendarStore = useCalendarStore();
const doctorStore = useDoctorStore();
const formLoading = ref(false);

// Form data
const form = ref<{
  id?: string;
  doctorId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  description: string;
}>({
  doctorId: props.doctorId || '',
  patientName: '',
  date: props.date || format(new Date(), 'yyyy-MM-dd'),
  startTime: '09:00',
  endTime: '09:30',
  status: 'scheduled',
  description: 'คิวนัดตรวจฟัน'
});

// Status options
const statusOptions = [
  { value: 'scheduled', label: 'Pending', color: 'text-yellow-500' },
  { value: 'completed', label: 'Done', color: 'text-blue-500' },
  { value: 'cancelled', label: 'Cancel', color: 'text-red-500' },
];

// Time options (30 minute slots from 8:00 to 17:00)
const timeOptions = computed(() => {
  const times = [];
  for (let hour = 8; hour <= 17; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    times.push(`${hourStr}:00`);
    if (hour < 17) {
      times.push(`${hourStr}:30`);
    }
  }
  return times;
});

// Available doctors
const doctors = computed(() => doctorStore.getDoctors);

// Modal title
const modalTitle = computed(() => {
  return form.value.id ? 'แก้ไขการนัดหมาย' : 'สร้างการนัดหมาย';
});

// Load appointment data if editing
const loadAppointment = () => {
  if (props.appointmentId) {
    const appointment = calendarStore.appointments.find(a => a.id === props.appointmentId);
    if (appointment) {
      form.value = {
        id: appointment.id,
        doctorId: appointment.doctorId,
        patientName: appointment.patientName,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        description: appointment.description || 'คิวนัดตรวจฟัน'
      };
    }
  }
};

// Get doctor name
const getDoctorName = (doctorId: string) => {
  const doctor = calendarStore.getDoctor(doctorId);
  return doctor ? doctor.name : '';
};

// Handle form submission
const handleSubmit = async () => {
  try {
    formLoading.value = true;

    const appointmentData: Omit<Appointment, 'id'> = {
      doctorId: form.value.doctorId,
      patientName: form.value.patientName,
      date: form.value.date,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      status: form.value.status,
      description: form.value.description
    };

    if (form.value.id) {
      // Update existing appointment
      await calendarStore.updateAppointment({
        id: form.value.id,
        ...appointmentData
      });
    } else {
      // Create new appointment
      await calendarStore.createAppointment(appointmentData);
    }

    emit('saved');
    emit('close');

    // Reset form after submission
    form.value = {
      doctorId: '',
      patientName: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน'
    };
  } catch (error) {
    console.error('Error saving appointment:', error);
  } finally {
    formLoading.value = false;
  }
};

// Initialize form when props change
watch(() => props.appointmentId, () => {
  if (props.show) {
    loadAppointment();
  }
}, { immediate: true });

// Update end time when start time changes (default to 30-minute appointment)
watch(() => form.value.startTime, (newTime) => {
  const [hours, minutes] = newTime.split(':').map(Number);
  let endHour = hours;
  let endMinute = minutes + 30;

  if (endMinute >= 60) {
    endHour += 1;
    endMinute -= 60;
  }

  form.value.endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
});

// Reset form when modal is opened
watch(() => props.show, (isShown) => {
  if (isShown && !props.appointmentId) {
    form.value = {
      doctorId: props.doctorId || '',
      patientName: '',
      date: props.date || format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '09:30',
      status: 'scheduled',
      description: 'คิวนัดตรวจฟัน'
    };
  }
});
</script>

<template>
  <Modal :show="show" :title="modalTitle" @close="$emit('close')" widthClass="max-w-lg">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">แพทย์ผู้ทำการรักษา</label>
        <select v-model="form.doctorId"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          required>
          <option value="" disabled>เลือกแพทย์</option>
          <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
            {{ doctor.fullName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อคนไข้</label>
        <input type="text" v-model="form.patientName"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="ระบุชื่อคนไข้" required>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
          <input type="date" v-model="form.date"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">เวลาเริ่ม</label>
          <select v-model="form.startTime"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required>
            <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">เวลาสิ้นสุด</label>
          <select v-model="form.endTime"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required>
            <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
        <div class="flex gap-3">
          <label v-for="option in statusOptions" :key="option.value" class="flex items-center space-x-2 cursor-pointer">
            <input type="radio" v-model="form.status" :value="option.value" class="sr-only">
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm',
              form.status === option.value ? `${option.color} bg-opacity-10 border border-current` : 'text-gray-500 bg-gray-200'
            ]">
              {{ option.label }}
            </span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
        <textarea v-model="form.description" rows="2"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="รายละเอียดการนัดหมาย"></textarea>
      </div>

      <div class="flex justify-end space-x-2 pt-2">
        <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
          ยกเลิก
        </button>
        <button type="submit"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center"
          :disabled="formLoading">
          <Icon v-if="formLoading" icon="eos-icons:loading" class="mr-1 w-4 h-4" />
          <Icon v-else icon="material-symbols:save" class="mr-1 w-4 h-4" />
          บันทึก
        </button>
      </div>
    </form>

  </Modal>
</template>