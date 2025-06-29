<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { format, parseISO } from 'date-fns';
import { useDoctorStore } from '~/stores/doctor';
import { useAppointmentStore } from '~/stores/appointment';
import type { Appointment, AppointmentStatus } from '~/types/appointment';
import Modal from '~/components/Modal.vue';

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
  appointment: Appointment | GroupedAppointment | null;
  isGrouped: boolean;
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();

// Loading states
const isUpdatingStatus = ref(false);
const isDeleting = ref(false);

// Status options
const statusOptions = [
  { value: 'pending', label: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-800', icon: 'mdi:clock-outline' },
  { value: 'confirmed', label: 'ยืนยันแล้ว', color: 'bg-green-100 text-green-800', icon: 'mdi:check-circle-outline' },
  { value: 'completed', label: 'เสร็จสิ้น', color: 'bg-blue-100 text-blue-800', icon: 'mdi:check-all' },
  { value: 'cancelled', label: 'ยกเลิก', color: 'bg-red-100 text-red-800', icon: 'mdi:close-circle-outline' },
  { value: 'no-show', label: 'ไม่มาตามนัด', color: 'bg-gray-100 text-gray-800', icon: 'mdi:account-cancel-outline' }
];

// Computed properties
const doctor = computed(() => {
  if (!props.appointment) return null;
  return doctorStore.getDoctors.find(d => d.id === props.appointment?.doctorId);
});

const doctorColor = computed(() => doctor.value?.color || '#6B7280');

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getDoctorHeaderStyle = computed(() => {
  const color = doctorColor.value;
  if (!color.startsWith('#')) return {};
  
  const rgb = hexToRgb(color);
  if (!rgb) return {};
  
  return {
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
    borderLeft: `4px solid ${color}`
  };
});

const currentStatus = computed(() => {
  if (!props.appointment || props.isGrouped) return null;
  const appointment = props.appointment as Appointment;
  return statusOptions.find(s => s.value === appointment.status);
});

const appointmentDate = computed(() => {
  if (!props.appointment) return '';
  if (props.isGrouped) {
    // For grouped appointments, we might need to get date from somewhere else
    return format(new Date(), 'วันที่ d MMMM yyyy');
  }
  const appointment = props.appointment as Appointment;
  return format(parseISO(appointment.appointmentDate), 'วันที่ d MMMM yyyy');
});

const timeRange = computed(() => {
  if (!props.appointment) return '';
  return `${props.appointment.startTime} - ${props.appointment.endTime}`;
});

const patients = computed(() => {
  if (!props.appointment) return [];
  
  if (props.isGrouped) {
    return (props.appointment as GroupedAppointment).patients;
  }
  
  const appointment = props.appointment as Appointment;
  return [{
    id: appointment.id,
    patient: appointment.patient,
    startTime: appointment.startTime,
    endTime: appointment.endTime
  }];
});

const modalTitle = computed(() => {
  return `รายละเอียดการนัดหมาย - ${doctor.value?.fullName || 'ไม่ระบุหมอ'}`;
});

// Additional appointment details
const appointmentDuration = computed(() => {
  if (props.isGrouped) return null;
  const appointment = props.appointment as Appointment;
  // Check if it's ApiAppointment with duration field
  if ('duration' in appointment) {
    return (appointment as any).duration;
  }
  return null;
});

const appointmentType = computed(() => {
  if (!props.appointment) return 'ไม่ระบุประเภท';
  if (props.isGrouped) return 'การนัดหมายกลุ่ม';
  return (props.appointment as Appointment).type || 'ไม่ระบุประเภท';
});

const appointmentBranch = computed(() => {
  if (props.isGrouped || !props.appointment) return null;
  const appointment = props.appointment as Appointment;
  if ('branch' in appointment) {
    return (appointment as any).branch;
  }
  return null;
});

const appointmentClinic = computed(() => {
  if (props.isGrouped || !props.appointment) return null;
  const appointment = props.appointment as Appointment;
  if ('clinic' in appointment) {
    return (appointment as any).clinic;
  }
  return null;
});

const appointmentTags = computed(() => {
  if (props.isGrouped || !props.appointment) return [];
  const appointment = props.appointment as Appointment;
  if ('tags' in appointment) {
    return (appointment as any).tags || [];
  }
  return [];
});

const createdByInfo = computed(() => {
  if (props.isGrouped || !props.appointment) return null;
  const appointment = props.appointment as Appointment;
  if ('createdBy' in appointment) {
    return (appointment as any).createdBy;
  }
  return null;
});

const createdAtFormatted = computed(() => {
  if (!props.appointment) return '';
  try {
    const createdAt = props.isGrouped 
      ? (props.appointment as any).createdAt 
      : (props.appointment as Appointment).createdAt;
    if (!createdAt) return '';
    return format(parseISO(createdAt), 'd MMM yyyy, HH:mm');
  } catch {
    return '';
  }
});

const updatedAtFormatted = computed(() => {
  if (!props.appointment) return '';
  try {
    const updatedAt = props.isGrouped 
      ? (props.appointment as any).updatedAt 
      : (props.appointment as Appointment).updatedAt;
    if (!updatedAt) return '';
    return format(parseISO(updatedAt), 'd MMM yyyy, HH:mm');
  } catch {
    return '';
  }
});

const appointmentFlags = computed(() => {
  if (props.isGrouped || !props.appointment) return [];
  const appointment = props.appointment as Appointment;
  const flags = [];
  
  if ('isToday' in appointment && (appointment as any).isToday) {
    flags.push({ label: 'วันนี้', class: 'bg-blue-100 text-blue-700' });
  }
  if ('isPast' in appointment && (appointment as any).isPast) {
    flags.push({ label: 'ผ่านมาแล้ว', class: 'bg-gray-100 text-gray-700' });
  }
  if ('isFuture' in appointment && (appointment as any).isFuture) {
    flags.push({ label: 'ในอนาคต', class: 'bg-green-100 text-green-700' });
  }
  if ('isActive' in appointment && (appointment as any).isActive) {
    flags.push({ label: 'กำลังใช้งาน', class: 'bg-orange-100 text-orange-700' });
  }
  
  return flags;
});

// Methods
const updateStatus = async (newStatus: AppointmentStatus) => {
  if (!props.appointment || props.isGrouped) return;
  
  const appointment = props.appointment as Appointment;
  isUpdatingStatus.value = true;
  
  try {
    await appointmentStore.updateAppointmentStatus(appointment.id, newStatus);
    emit('updated');
    
    // Show success message
    console.log(`สถานะถูกเปลี่ยนเป็น: ${statusOptions.find(s => s.value === newStatus)?.label}`);
  } catch (error) {
    console.error('Error updating status:', error);
    // Show error message
  } finally {
    isUpdatingStatus.value = false;
  }
};

const deleteAppointment = async () => {
  if (!props.appointment || props.isGrouped) return;
  
  if (!confirm('คุณแน่ใจหรือไม่ที่จะลบการนัดหมายนี้?')) return;
  
  const appointment = props.appointment as Appointment;
  isDeleting.value = true;
  
  try {
    await appointmentStore.deleteAppointment(appointment.id);
    emit('updated');
    emit('close');
    
    console.log('ลบการนัดหมายเรียบร้อยแล้ว');
  } catch (error) {
    console.error('Error deleting appointment:', error);
  } finally {
    isDeleting.value = false;
  }
};

const editAppointment = () => {
  // TODO: Navigate to edit page or open edit modal
  console.log('Edit appointment:', props.appointment?.id);
  emit('close');
};

const callPatient = (phone?: string) => {
  if (phone) {
    window.open(`tel:${phone}`, '_self');
  }
};

const emailPatient = (email?: string) => {
  if (email) {
    window.open(`mailto:${email}`, '_self');
  }
};

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => window.addEventListener('keydown', handleEsc));
onUnmounted(() => window.removeEventListener('keydown', handleEsc));
</script>

<template>
  <Modal 
    :show="isVisible && !!appointment" 
    :title="modalTitle"
    icon="mdi:calendar-check"
    width-class="max-w-4xl"
    @close="$emit('close')">
    
    <div v-if="appointment" class="space-y-4">
      <!-- Appointment Info Card -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div class="flex items-start justify-between">
          <!-- Left: Basic Info -->
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-12 h-12 rounded-lg overflow-hidden" 
                :style="{ backgroundColor: doctorColor + '20', border: `2px solid ${doctorColor}` }">
                <img v-if="doctor?.photo" :src="doctor.photo" :alt="doctor.fullName" 
                  class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                  :style="{ backgroundColor: doctorColor }">
                  {{ doctor?.fullName?.charAt(0) || 'D' }}
                </div>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800">{{ doctor?.fullName || 'ไม่ระบุหมอ' }}</h3>
                <p class="text-sm text-gray-600">{{ doctor?.specialty || 'ไม่ระบุความเชี่ยวชาญ' }}</p>
              </div>
            </div>

            <!-- Appointment Details Grid -->
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="flex items-center space-x-2">
                <Icon icon="mdi:calendar" class="w-4 h-4 text-blue-500" />
                <span class="text-gray-700">{{ appointmentDate }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Icon icon="mdi:clock" class="w-4 h-4 text-blue-500" />
                <span class="text-gray-700">{{ timeRange }}</span>
              </div>
              <div v-if="appointmentDuration" class="flex items-center space-x-2">
                <Icon icon="mdi:timer" class="w-4 h-4 text-blue-500" />
                <span class="text-gray-700">{{ appointmentDuration }} นาที</span>
              </div>
              <div class="flex items-center space-x-2">
                <Icon icon="mdi:medical-bag" class="w-4 h-4 text-blue-500" />
                <span class="text-gray-700">{{ appointmentType }}</span>
              </div>
            </div>
          </div>

          <!-- Right: Status & Actions -->
          <div class="text-right space-y-2">
            <div v-if="!isGrouped && currentStatus" class="inline-flex items-center space-x-2">
              <Icon :icon="currentStatus.icon" class="w-4 h-4" />
              <span class="px-3 py-1 rounded-lg text-xs font-medium" :class="currentStatus.color">
                {{ currentStatus.label }}
              </span>
            </div>
            <div v-if="appointmentBranch" class="text-xs text-gray-500">
              <Icon icon="mdi:domain" class="w-3 h-3 inline mr-1" />
              {{ appointmentBranch.name }}
            </div>
            <div v-if="appointmentClinic" class="text-xs text-gray-500">
              <Icon icon="mdi:hospital-building" class="w-3 h-3 inline mr-1" />
              {{ appointmentClinic.name }}
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="appointmentTags && appointmentTags.length > 0" class="mt-3 flex flex-wrap gap-1">
          <span v-for="tag in appointmentTags" :key="tag" 
            class="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Patients Section -->
      <div class="bg-white rounded-xl p-4 border border-gray-200">
        <h4 class="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <Icon icon="mdi:account-group" class="w-5 h-5 text-green-500" />
          <span>{{ isGrouped ? `ผู้ป่วย (${patients.length} คน)` : 'ข้อมูลผู้ป่วย' }}</span>
        </h4>
        
        <div class="space-y-3">
          <div v-for="(patient, index) in patients" :key="patient.id" 
            class="bg-gray-50 rounded-lg p-3 border border-gray-100">
            
            <!-- Patient Header -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {{ patient.patient.name?.charAt(0) || 'P' }}
                </div>
                <div>
                  <div class="flex items-center space-x-2">
                    <h5 class="font-medium text-gray-800">{{ patient.patient.name || 'ไม่ระบุชื่อ' }}</h5>
                    <span v-if="patient.patient.isRegistered" 
                      class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      สมาชิก
                    </span>
                  </div>
                  <div v-if="patient.patient.patientId" class="text-xs text-gray-500">
                    รหัส: {{ patient.patient.patientId }}
                  </div>
                </div>
              </div>
              
              <!-- Time for grouped appointments -->
              <div v-if="isGrouped" class="text-right">
                <div class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  {{ patient.startTime }} - {{ patient.endTime }}
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="flex items-center space-x-3">
              <button v-if="patient.patient.phone" 
                @click="callPatient(patient.patient.phone)"
                class="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                <Icon icon="mdi:phone" class="w-4 h-4" />
                <span>{{ patient.patient.phone }}</span>
              </button>
              
              <button v-if="patient.patient.email" 
                @click="emailPatient(patient.patient.email)"
                class="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                <Icon icon="mdi:email" class="w-4 h-4" />
                <span>{{ patient.patient.email }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div v-if="!isGrouped && (appointment as Appointment).notes" 
        class="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <h4 class="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
          <Icon icon="mdi:note-text" class="w-5 h-5 text-amber-500" />
          <span>หมายเหตุ</span>
        </h4>
        <p class="text-gray-700 text-sm leading-relaxed">{{ (appointment as Appointment).notes }}</p>
      </div>

      <!-- Metadata Section -->
      <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 class="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <Icon icon="mdi:information" class="w-5 h-5 text-gray-500" />
          <span>ข้อมูลเพิ่มเติม</span>
        </h4>
        
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div v-if="createdByInfo">
            <span class="text-gray-500">สร้างโดย:</span>
            <span class="ml-2 text-gray-700">{{ createdByInfo.name }}</span>
          </div>
          <div>
            <span class="text-gray-500">สร้างเมื่อ:</span>
            <span class="ml-2 text-gray-700">{{ createdAtFormatted }}</span>
          </div>
          <div>
            <span class="text-gray-500">อัปเดตล่าสุด:</span>
            <span class="ml-2 text-gray-700">{{ updatedAtFormatted }}</span>
          </div>
          <div v-if="appointmentFlags.length > 0">
            <span class="text-gray-500">สถานะ:</span>
            <span class="ml-2">
              <span v-for="flag in appointmentFlags" :key="flag.label"
                :class="flag.class"
                class="inline-block px-2 py-0.5 rounded text-xs font-medium mr-1">
                {{ flag.label }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Status Update Section (Single Appointment Only) -->
      <div v-if="!isGrouped" class="bg-white rounded-xl p-4 border border-gray-200">
        <h4 class="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <Icon icon="mdi:update" class="w-5 h-5 text-blue-500" />
          <span>เปลี่ยนสถานะ</span>
        </h4>
        
        <div class="grid grid-cols-3 lg:grid-cols-5 gap-2">
          <button 
            v-for="status in statusOptions" 
            :key="status.value"
            @click="updateStatus(status.value as AppointmentStatus)"
            :disabled="isUpdatingStatus"
            class="flex flex-col items-center space-y-1 p-2 border rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
            :class="{ 
              'border-blue-400 bg-blue-50 shadow-sm': currentStatus?.value === status.value,
              'border-gray-200': currentStatus?.value !== status.value
            }">
            <Icon :icon="status.icon" class="w-5 h-5 text-gray-600" />
            <span class="text-xs text-center leading-tight">{{ status.label }}</span>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-2">
        <div class="flex space-x-3">
          <button @click="editAppointment" 
            class="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Icon icon="mdi:pencil" class="w-4 h-4" />
            <span>แก้ไข</span>
          </button>
          
          <button v-if="!isGrouped" @click="deleteAppointment" 
            :disabled="isDeleting"
            class="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium">
            <Icon icon="mdi:delete" class="w-4 h-4" />
            <span>{{ isDeleting ? 'กำลังลบ...' : 'ลบ' }}</span>
          </button>
        </div>
        
        <button @click="$emit('close')" 
          class="flex items-center space-x-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium">
          <Icon icon="mdi:close" class="w-4 h-4" />
          <span>ปิด</span>
        </button>
      </div>
    </div>
  </Modal>
</template>