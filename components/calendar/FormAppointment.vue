<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useDoctorStore } from '~/stores/doctor';
import { usePatientStore } from '~/stores/patient';
import { useBranchStore } from '~/stores/branch';
import { useAlertStore } from '~/stores/components/alert';
import { appointmentService } from '~/services/appointment';
import type { CreateAppointmentRequest } from '~/types/appointment';
import Modal from '~/components/Modal.vue';

const props = defineProps<{
  show: boolean;
  doctorId?: string;
  patientId?: string;
  appointmentId?: string;
  selectedDate?: string;
}>();

const emit = defineEmits(['close', 'saved']);

// Stores
const doctorStore = useDoctorStore();
const patientStore = usePatientStore();
const branchStore = useBranchStore();
const alertStore = useAlertStore();

const formLoading = ref(false);

// Form data
const form = ref({
  title: '',
  patientType: 'unregistered', // 'registered' | 'unregistered'
  
  // For registered patients
  selectedPatientId: props.patientId || '',
  
  // For unregistered patients
  patientName: '',
  patientPhone: '',
  patientEmail: '',
  
  // Appointment details
  appointmentDate: props.selectedDate || '',
  startTime: '',
  endTime: '',
  type: '',
  doctorId: props.doctorId || '',
  branchId: '',
  notes: ''
});

// Patient search
const patientSearchTerm = ref('');
const showPatientDropdown = ref(false);

// ตัวเลือกเวลา (ช่วงเวลา 30 นาที ตั้งแต่ 9:00 - 17:00)
const timeOptions = computed(() => {
  const times = [];
  for (let hour = 9; hour <= 17; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    times.push(`${hourStr}:00`);
    if (hour < 17) {
      times.push(`${hourStr}:30`);
    }
  }
  return times;
});

// Get data from stores
const doctors = computed(() => doctorStore.getDoctorOptions);
const patients = computed(() => patientStore.getPatients);
const branches = computed(() => branchStore.branches);

// Filter patients based on search term
const filteredPatients = computed(() => {
  if (!patientSearchTerm.value) return patients.value.slice(0, 10); // Show first 10 patients
  
  const searchTerm = patientSearchTerm.value.toLowerCase();
  return patients.value.filter(patient => 
    patient.firstNameTh.toLowerCase().includes(searchTerm) ||
    patient.lastNameTh.toLowerCase().includes(searchTerm) ||
    patient.hn.toLowerCase().includes(searchTerm) ||
    patient.phone.includes(searchTerm)
  ).slice(0, 10);
});

// Get selected patient details
const selectedPatient = computed(() => {
  if (form.value.selectedPatientId) {
    return patients.value.find(p => p.id === form.value.selectedPatientId);
  }
  return null;
});

// Calculate end time automatically
const calculateEndTime = (startTime: string): string => {
  if (!startTime) return '';
  
  const [hours, minutes] = startTime.split(':').map(Number);
  let endHour = hours;
  let endMinute = minutes + 30; // Default 30 minutes duration
  
  if (endMinute >= 60) {
    endHour += 1;
    endMinute -= 60;
  }
  
  return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
};

// Watch start time to auto-calculate end time
watch(() => form.value.startTime, (newStartTime) => {
  if (newStartTime) {
    form.value.endTime = calculateEndTime(newStartTime);
  }
});

// Load initial data
const loadInitialData = async () => {
  try {
    await Promise.all([
      doctorStore.fetchDoctorOptions(),
      patientStore.fetchPatients({ limit: 100 }), // Load patients for search
      branchStore.fetchBranches()
    ]);
    
    // Set default branch if only one exists
    if (branches.value.length === 1) {
      form.value.branchId = branches.value[0].id;
    }
  } catch (error) {
    console.error('Error loading initial data:', error);
    alertStore.error('ไม่สามารถโหลดข้อมูลเริ่มต้นได้', 'เกิดข้อผิดพลาด');
  }
};

// Select patient from dropdown
const selectPatient = (patient: any) => {
  form.value.selectedPatientId = patient.id;
  patientSearchTerm.value = `${patient.firstNameTh} ${patient.lastNameTh} (${patient.hn})`;
  showPatientDropdown.value = false;
};

// Clear patient selection
const clearPatientSelection = () => {
  form.value.selectedPatientId = '';
  patientSearchTerm.value = '';
};

// Toggle patient type
const togglePatientType = (type: 'registered' | 'unregistered') => {
  form.value.patientType = type;
  
  // Clear fields when switching
  if (type === 'registered') {
    form.value.patientName = '';
    form.value.patientPhone = '';
    form.value.patientEmail = '';
  } else {
    form.value.selectedPatientId = '';
    patientSearchTerm.value = '';
  }
};

// Reset form
const resetForm = () => {
  form.value = {
    title: '',
    patientType: 'unregistered',
    selectedPatientId: props.patientId || '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentDate: props.selectedDate || '',
    startTime: '',
    endTime: '',
    type: '',
    doctorId: props.doctorId || '',
    branchId: '',
    notes: ''
  };
  patientSearchTerm.value = '';
  
  // Set default branch if only one exists
  if (branches.value.length === 1) {
    form.value.branchId = branches.value[0].id;
  }
};

// Submit form
const handleSubmit = async () => {
  try {
    formLoading.value = true;
    
    // Validation
    if (!form.value.title.trim()) {
      alertStore.error('กรุณากรอกหัวข้อการนัดหมาย', 'ข้อมูลไม่ครบถ้วน');
      return;
    }
    
    if (form.value.patientType === 'registered' && !form.value.selectedPatientId) {
      alertStore.error('กรุณาเลือกผู้ป่วย', 'ข้อมูลไม่ครบถ้วน');
      return;
    }
    
    if (form.value.patientType === 'unregistered') {
      if (!form.value.patientName.trim()) {
        alertStore.error('กรุณากรอกชื่อผู้ป่วย', 'ข้อมูลไม่ครบถ้วน');
        return;
      }
      if (!form.value.patientPhone.trim()) {
        alertStore.error('กรุณากรอกเบอร์โทรศัพท์', 'ข้อมูลไม่ครบถ้วน');
        return;
      }
    }
    
    if (!form.value.appointmentDate || !form.value.startTime || !form.value.doctorId || !form.value.branchId) {
      alertStore.error('กรุณากรอกข้อมูลให้ครบถ้วน', 'ข้อมูลไม่ครบถ้วน');
      return;
    }
    
    // Prepare appointment data
    const appointmentData: CreateAppointmentRequest = {
      title: form.value.title.trim(),
      patient: {
        isRegistered: form.value.patientType === 'registered',
        ...(form.value.patientType === 'registered' 
          ? { patientId: form.value.selectedPatientId }
          : {
              name: form.value.patientName.trim(),
              phone: form.value.patientPhone.trim(),
              email: form.value.patientEmail.trim() || undefined
            }
        )
      },
      appointmentDate: form.value.appointmentDate,
      startTime: form.value.startTime,
      endTime: form.value.endTime || calculateEndTime(form.value.startTime),
      type: 'consultation',
      branchId: form.value.branchId,
      doctorId: form.value.doctorId,
      notes: form.value.notes || undefined
    };

    // Create appointment
    const response = await appointmentService.createAppointment(appointmentData);
    
    if (response.status === 'success') {
      alertStore.success('สร้างการนัดหมายสำเร็จ', 'สำเร็จ');
      emit('saved', response.data.appointment);
      emit('close');
      resetForm();
    } else {
      throw new Error('Failed to create appointment');
    }

  } catch (error: any) {
    console.error('Error creating appointment:', error);
    alertStore.error(error.message || 'เกิดข้อผิดพลาดในการสร้างการนัดหมาย', 'เกิดข้อผิดพลาด');
  } finally {
    formLoading.value = false;
  }
};

// Watch modal show/hide
watch(() => props.show, (isShown) => {
  if (isShown) {
    loadInitialData();
    resetForm();
    
    // Set patient if provided
    if (props.patientId) {
      form.value.patientType = 'registered';
      form.value.selectedPatientId = props.patientId;
    }
  }
});

// Modal title
const modalTitle = computed(() => 'สร้างการนัดหมายใหม่');

// Calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
</script>

<template>
  <Modal :show="show" :title="modalTitle" @close="$emit('close')" widthClass="max-w-6xl">
    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column - Patient Information -->
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:account-group" class="w-5 h-5 text-blue-600" />
            ข้อมูลผู้ป่วย
          </h3>

          <!-- Title -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">หัวข้อการนัดหมาย *</label>
            <input 
              type="text" 
              v-model="form.title" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium bg-white"
              placeholder="เพิ่มหัวข้อการนัดหมาย"
              required
            >
          </div>
          
          <!-- Patient Type Toggle -->
          <div class="mb-6">
            <!-- <label class="block text-sm font-medium text-gray-700 mb-3">ประเภทผู้ป่วย</label> -->
            <div class="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
              <button
                type="button"
                @click="togglePatientType('unregistered')"
                :class="[
                  'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2',
                  form.patientType === 'unregistered'
                    ? 'bg-white text-blue-600 shadow-md ring-1 ring-blue-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <Icon icon="mdi:account-plus" class="w-4 h-4" />
                ผู้ป่วยไม่ลงทะเบียน
              </button>
              <button
                type="button"
                @click="togglePatientType('registered')"
                :class="[
                  'flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2',
                  form.patientType === 'registered'
                    ? 'bg-white text-blue-600 shadow-md ring-1 ring-blue-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]"
              >
                <Icon icon="mdi:account-check" class="w-4 h-4" />
                ผู้ป่วยลงทะเบียน
              </button>
            </div>
          </div>

          <!-- Patient Fields - Registered -->
          <div v-if="form.patientType === 'registered'" class="space-y-4">
            <div class="relative">
              <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Icon icon="mdi:magnify" class="w-4 h-4" />
                เลือกผู้ป่วย *
              </label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="patientSearchTerm"
                  @input="showPatientDropdown = true"
                  @focus="showPatientDropdown = true"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="ค้นหาผู้ป่วย (ชื่อ, HN, เบอร์โทร)"
                  :class="{ 'pr-12': form.selectedPatientId }"
                >
                <button
                  v-if="form.selectedPatientId"
                  type="button"
                  @click="clearPatientSelection"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon icon="mdi:close-circle" class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Patient Dropdown -->
              <div v-if="showPatientDropdown && !form.selectedPatientId" class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                <div v-if="filteredPatients.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                  <Icon icon="mdi:account-search" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  ไม่พบผู้ป่วย
                </div>
                <button
                  v-for="patient in filteredPatients"
                  :key="patient.id"
                  type="button"
                  @click="selectPatient(patient)"
                  class="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon icon="mdi:account" class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ patient.firstNameTh }} {{ patient.lastNameTh }}</div>
                      <div class="text-sm text-gray-500">HN: {{ patient.hn }} | โทร: {{ patient.phone }}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Selected Patient Info -->
            <div v-if="selectedPatient" class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:account-check" class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div class="font-semibold text-blue-900">{{ selectedPatient.firstNameTh }} {{ selectedPatient.lastNameTh }}</div>
                  <div class="text-sm text-blue-700">HN: {{ selectedPatient.hn }} | โทร: {{ selectedPatient.phone }}</div>
                  <div class="text-xs text-blue-600 mt-1">{{ selectedPatient.gender }} | อายุ: {{ calculateAge(selectedPatient.dateOfBirth) }} ปี</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Patient Fields - Unregistered -->
          <div v-if="form.patientType === 'unregistered'" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="mdi:account" class="w-4 h-4" />
                  ชื่อผู้ป่วย *
                </label>
                <input 
                  type="text" 
                  v-model="form.patientName" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="ชื่อ-นามสกุล"
                  required
                >
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="mdi:phone" class="w-4 h-4" />
                  เบอร์โทร *
                </label>
                <input 
                  type="tel" 
                  v-model="form.patientPhone" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="0xx-xxx-xxxx"
                  required
                >
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Icon icon="mdi:email" class="w-4 h-4" />
                อีเมล
              </label>
              <input 
                type="email" 
                v-model="form.patientEmail" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="example@email.com"
              >
            </div>
          </div>
        </div>

        <!-- Date and Time Section -->
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:calendar-clock" class="w-5 h-5 text-green-600" />
            วันที่และเวลา
          </h3>

          <!-- Date -->
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Icon icon="mdi:calendar" class="w-4 h-4" />
              วันที่นัดหมาย *
            </label>
            <div class="relative">
              <input 
                type="date" 
                v-model="form.appointmentDate" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                required
              >
              <!-- <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <Icon icon="mdi:calendar" class="w-5 h-5" />
              </div> -->
            </div>
          </div>

          <!-- Time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Icon icon="mdi:clock-start" class="w-4 h-4" />
                เวลาเริ่ม *
              </label>
              <select 
                v-model="form.startTime" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                required
              >
                <option value="">เลือกเวลา</option>
                <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Icon icon="mdi:clock-end" class="w-4 h-4" />
                เวลาสิ้นสุด
              </label>
              <input 
                type="time" 
                v-model="form.endTime" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                readonly
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Appointment Details -->
      <div class="space-y-6">
        <!-- Appointment Type Section -->
        <!-- <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:medical-bag" class="w-5 h-5 text-purple-600" />
            ประเภทการรักษา
          </h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ประเภทการนัดหมาย *</label>
            <select 
              v-model="form.type" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              required
            >
              <option value="">เลือกประเภทการนัดหมาย</option>
              <optgroup label="การรักษาทั่วไป">
                <option value="consultation">ปรึกษา</option>
                <option value="checkup">ตรวจสุขภาพ</option>
                <option value="treatment">รักษา</option>
                <option value="follow-up">ติดตามผล</option>
              </optgroup>
              <optgroup label="การรักษาทางทันตกรรม">
                <option value="dental-checkup">ตรวจฟันประจำปี</option>
                <option value="teeth-cleaning">ขูดหินปูน</option>
                <option value="fillings">อุดฟัน</option>
                <option value="root-canal">รักษารากฟัน</option>
                <option value="teeth-whitening">ฟอกสีฟัน</option>
                <option value="orthodontics">จัดฟัน</option>
                <option value="extraction">ถอนฟัน</option>
                <option value="dentures">ฟันปลอม</option>
                <option value="implants">รากฟันเทียม</option>
              </optgroup>
            </select>
          </div>
        </div> -->

        <!-- Doctor and Branch Section -->
        <div class="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:doctor" class="w-5 h-5 text-orange-600" />
            แพทย์และสาขา
          </h3>

          <!-- Doctor -->
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Icon icon="mdi:stethoscope" class="w-4 h-4" />
              แพทย์ผู้รักษา *
            </label>
            <select 
              v-model="form.doctorId" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              required
            >
              <option value="">เลือกแพทย์</option>
              <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                {{ doctor.value }}
              </option>
            </select>
          </div>

          <!-- Branch -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Icon icon="mdi:hospital-building" class="w-4 h-4" />
              สาขา *
            </label>
            <select 
              v-model="form.branchId" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              required
            >
              <option value="">เลือกสาขา</option>
              <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:note-text" class="w-5 h-5 text-gray-600" />
            หมายเหตุเพิ่มเติม
          </h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">รายละเอียดเพิ่มเติม</label>
            <textarea 
              v-model="form.notes" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white resize-none"
              placeholder="เพิ่มหมายเหตุหรือรายละเอียดพิเศษ..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 ">
          <button 
            type="submit" 
            class="w-full px-6 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            :disabled="formLoading"
          >
            <span v-if="formLoading" class="flex items-center justify-center">
              <Icon icon="eos-icons:loading" class="w-6 h-6 mr-3 animate-spin" />
              กำลังบันทึกการนัดหมาย...
            </span>
            <span v-else class="flex items-center justify-center">
              <Icon icon="mdi:calendar-check" class="w-6 h-6 mr-3" />
              ยืนยันการนัดหมาย
            </span>
          </button>
        </div>
      </div>
    </form>
    
    <!-- Click outside to close patient dropdown -->
    <div 
      v-if="showPatientDropdown" 
      @click="showPatientDropdown = false" 
      class="fixed inset-0 z-0"
    ></div>
  </Modal>
</template>

<style scoped>
/* Custom scrollbar for patient dropdown */
.max-h-64::-webkit-scrollbar {
  width: 8px;
}

.max-h-64::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 4px;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Gradient backgrounds */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Custom focus styles for better accessibility */
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Smooth transitions for all interactive elements */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Disabled state styling */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

/* Custom select appearance */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Animation for loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Card shadow effects */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* Ring focus styles for different colors */
.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59 130 246 / 0.5);
}

.focus\:ring-green-500:focus {
  --tw-ring-color: rgb(34 197 94 / 0.5);
}

.focus\:ring-purple-500:focus {
  --tw-ring-color: rgb(168 85 247 / 0.5);
}

.focus\:ring-orange-500:focus {
  --tw-ring-color: rgb(249 115 22 / 0.5);
}

.focus\:ring-gray-500:focus {
  --tw-ring-color: rgb(107 114 128 / 0.5);
}
</style>