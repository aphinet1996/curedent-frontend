<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useDoctorStore } from '~/stores/doctor';

const doctorStore = useDoctorStore();

// Local filter state (replacing calendar store functionality)
const filteredDoctors = ref<string[]>([]);
const showAll = ref(true);

// Get doctors from doctor store
const doctors = computed(() => doctorStore.getDoctors);

// Check if a doctor is currently selected in filters
const isDoctorSelected = (doctorId: string) => {
  return filteredDoctors.value.includes(doctorId);
};

// Toggle a specific doctor filter
const toggleDoctor = (doctorId: string) => {
  if (isDoctorSelected(doctorId)) {
    // Remove doctor from filter
    filteredDoctors.value = filteredDoctors.value.filter(id => id !== doctorId);
  } else {
    // Add doctor to filter
    filteredDoctors.value.push(doctorId);
  }

  // Update showAll status
  const allDoctors = doctors.value.length === filteredDoctors.value.length;
  showAll.value = allDoctors;
};

// Toggle show all doctors
const toggleShowAll = () => {
  if (showAll.value) {
    // Reset to show all doctors
    filteredDoctors.value = doctors.value.map(doctor => doctor.id);
  } else {
    // Clear all filters
    filteredDoctors.value = [];
  }
};

// Watch filtered doctors to update showAll state
watch(
  () => filteredDoctors.value,
  (newValue) => {
    showAll.value = newValue.length === doctors.value.length;
  }
);

// Initialize filters when doctors are loaded
watch(
  () => doctors.value,
  (newDoctors) => {
    if (newDoctors.length > 0 && filteredDoctors.value.length === 0) {
      // Default to show all doctors
      filteredDoctors.value = newDoctors.map(doctor => doctor.id);
      showAll.value = true;
    }
  },
  { immediate: true }
);

// Fetch doctors on mount
onMounted(async () => {
  if (doctors.value.length === 0) {
    await doctorStore.fetchDoctors({ limit: 100 });
  }
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Filters</h2>

    <div class="space-y-2">
      <div class="flex items-center">
        <input type="checkbox" id="show-all" v-model="showAll"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          @change="toggleShowAll" />
        <label for="show-all" class="ml-2 text-sm font-medium text-gray-800">Show All</label>
      </div>

      <div v-for="doctor in doctors" :key="doctor.id" class="flex items-center">
        <input type="checkbox" :id="doctor.id" :checked="isDoctorSelected(doctor.id)"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          @change="toggleDoctor(doctor.id)" />
        <label :for="doctor.id" class="ml-2 text-sm font-medium text-gray-800">
          {{ doctor.fullName }}
        </label>
      </div>
    </div>
  </div>
</template>