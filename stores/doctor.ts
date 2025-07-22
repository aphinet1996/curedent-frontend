// import { ref, computed } from 'vue';
// import { defineStore } from 'pinia';
// import { doctorService } from '~/services/doctor';
// import type { Doctor, DoctorParams, Pagination, DoctorOption } from '~/types/doctor';

// export const useDoctorStore = defineStore('doctor', () => {
//   // State
//   const doctors = ref<Doctor[]>([]);
//   const doctorOptions = ref<DoctorOption[]>([]);
//   const isLoading = ref(false);
//   const isLoadingOptions = ref(false);
//   const error = ref<string | null>(null);
//   const optionsError = ref<string | null>(null);
//   const pagination = ref<Pagination>({
//     total: 0,
//     page: 1,
//     limit: 10,
//     totalPages: 0
//   });

//   // Actions
//   async function fetchDoctors(params?: DoctorParams) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       const response = await doctorService.getDoctors(params);

//       if (response.status === 'success') {
//         doctors.value = response.data.doctors;

//         if (response.pagination) {
//           pagination.value = response.pagination;
//         }
//       }

//       return doctors.value;
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to fetch doctors';
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return [];
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function createDoctor(formData: FormData) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       const response = await doctorService.createDoctor(formData);

//       if (response.status === 'success') {
//         const newDoctor = response.data.doctor;
//         doctors.value.push(newDoctor);

//         // Clear cached options to force refresh
//         doctorOptions.value = [];

//         return newDoctor;
//       }

//       throw new Error('Failed to create doctor');
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to create doctor';
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function updateDoctor(id: string, formData: FormData) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       const response = await doctorService.updateDoctor(id, formData);

//       if (response.status === 'success') {
//         const updatedDoctor = response.data.doctor;
//         const index = doctors.value.findIndex(d => d.id === id);
//         if (index !== -1) {
//           doctors.value[index] = updatedDoctor;
//         }

//         // Clear cached options to force refresh
//         doctorOptions.value = [];

//         return updatedDoctor;
//       }

//       throw new Error('Failed to update doctor');
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to update doctor with ID ${id}`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function deleteDoctor(id: string) {
//     isLoading.value = true;
//     error.value = null;

//     try {
//       const success = await doctorService.deleteDoctor(id);

//       if (success) {
//         doctors.value = doctors.value.filter(d => d.id !== id);

//         // Clear cached options to force refresh
//         doctorOptions.value = [];

//         return true;
//       }

//       return false;
//     } catch (error: any) {
//       const errorMsg = error.message || `Failed to delete doctor with ID ${id}`;
//       error.value = errorMsg;
//       console.error(errorMsg);
//       return false;
//     } finally {
//       isLoading.value = false;
//     }
//   }

//   async function fetchDoctorOptions(): Promise<DoctorOption[]> {
//     // Return cached data if available
//     if (doctorOptions.value.length > 0) {
//       return doctorOptions.value;
//     }

//     isLoadingOptions.value = true;
//     optionsError.value = null;

//     try {
//       const options = await doctorService.getDoctorOptions();
//       doctorOptions.value = options;
//       return options;
//     } catch (error: any) {
//       const errorMsg = error.message || 'Failed to fetch doctor options';
//       optionsError.value = errorMsg;
//       console.error('Error fetching doctor options:', error);
//       throw error;
//     } finally {
//       isLoadingOptions.value = false;
//     }
//   }

//   function getDoctorNameById(id: string): string {
//     const doctor = doctorOptions.value.find(d => d.id === id);
//     return doctor?.value || 'ไม่ระบุแพทย์';
//   }

//   // เพิ่มฟังก์ชันสำหรับหาสีของหมอ
//   function getDoctorColorById(id: string): string {
//     const doctor = doctors.value.find(d => d.id === id);
//     return doctor?.color || '#3B82F6'; // default blue
//   }

//   // เพิ่มฟังก์ชันสำหรับหาหมอจากสี
//   function getDoctorsByColor(color: string): Doctor[] {
//     return doctors.value.filter(d => d.color === color);
//   }

//   async function refreshDoctorOptions(): Promise<DoctorOption[]> {
//     doctorOptions.value = [];
//     return await fetchDoctorOptions();
//   }

//   function sortDoctorsAZ() {
//     doctors.value = [...doctors.value].sort((a, b) => a.fullName.localeCompare(b.fullName));
//   }

//   function sortDoctorsBySpecialty() {
//     doctors.value = [...doctors.value].sort((a, b) => a.specialty.localeCompare(b.specialty));
//   }

//   // เพิ่มฟังก์ชันจัดเรียงตามสี
//   function sortDoctorsByColor() {
//     doctors.value = [...doctors.value].sort((a, b) => (a.color || '').localeCompare(b.color || ''));
//   }

//   // ปรับปรุงฟังก์ชันสำหรับสร้าง FormData ให้รองรับ color
//   function createFormDataFromDoctor(doctor: Partial<Doctor>, photo?: File): FormData {
//     const formData = new FormData();

//     if (photo) {
//       formData.append('photo', photo);
//     } else {
//       formData.append('photo', '');
//     }

//     if (doctor.name) formData.append('name', doctor.name);
//     if (doctor.surname) formData.append('surname', doctor.surname);
//     if (doctor.nickname) formData.append('nickname', doctor.nickname);
//     if (doctor.gender) formData.append('gender', doctor.gender);
//     if (doctor.nationality) formData.append('nationality', doctor.nationality);
//     if (doctor.birthday) formData.append('birthday', doctor.birthday);
//     if (doctor.address) formData.append('address', doctor.address);
//     if (doctor.specialty) formData.append('specialty', doctor.specialty);
//     if (doctor.color) formData.append('color', doctor.color); // เพิ่ม color
//     if (doctor.clinicId) formData.append('clinicId', doctor.clinicId);

//     if (doctor.branches) {
//       formData.append('branches', JSON.stringify(doctor.branches));
//     }

//     return formData;
//   }

//   // เพิ่มฟังก์ชันสำหรับ clear error
//   function clearError() {
//     error.value = null;
//     optionsError.value = null;
//   }

//   // เพิ่มฟังก์ชันสำหรับสถิติสี
//   const colorStats = computed(() => {
//     const stats: Record<string, number> = {};
//     doctors.value.forEach(doctor => {
//       const color = doctor.color || '#3B82F6';
//       stats[color] = (stats[color] || 0) + 1;
//     });
//     return stats;
//   });

//   // เพิ่มฟังก์ชันสำหรับหาสีที่ใช้งานอยู่
//   const usedColors = computed(() => {
//     const colors = new Set<string>();
//     doctors.value.forEach(doctor => {
//       if (doctor.color) {
//         colors.add(doctor.color);
//       }
//     });
//     return Array.from(colors);
//   });

//   // Getters
//   const getDoctors = computed(() => doctors.value);
//   const getDoctorOptions = computed(() => doctorOptions.value);
//   const getLoading = computed(() => isLoading.value);
//   const getLoadingOptions = computed(() => isLoadingOptions.value);
//   const getError = computed(() => error.value);
//   const getOptionsError = computed(() => optionsError.value);
//   const getPagination = computed(() => pagination.value);
//   const hasDoctorOptions = computed(() => doctorOptions.value.length > 0);

//   return {
//     // State
//     doctors,
//     doctorOptions,
//     isLoading,
//     isLoadingOptions,
//     error,
//     optionsError,
//     pagination,

//     // Actions
//     fetchDoctors,
//     createDoctor,
//     updateDoctor,
//     deleteDoctor,
//     fetchDoctorOptions,
//     getDoctorNameById,
//     getDoctorColorById, // เพิ่ม
//     getDoctorsByColor, // เพิ่ม
//     refreshDoctorOptions,
//     sortDoctorsAZ,
//     sortDoctorsBySpecialty,
//     sortDoctorsByColor, // เพิ่ม
//     createFormDataFromDoctor,
//     clearError,

//     // Getters
//     getDoctors,
//     getDoctorOptions,
//     getLoading,
//     getLoadingOptions,
//     getError,
//     getOptionsError,
//     getPagination,
//     hasDoctorOptions,
//     colorStats, // เพิ่ม
//     usedColors, // เพิ่ม
//   };
// });

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { doctorService } from '~/services/doctor';
import type { Doctor, DoctorParams, Pagination, DoctorOption } from '~/types/doctor';

export const useDoctorStore = defineStore('doctor', () => {
  const doctors = ref<Doctor[]>([]);
  const currentDoctor = ref<Doctor | null>(null);
  const doctorOptions = ref<DoctorOption[]>([]);
  const isLoading = ref(false);
  const isLoadingOptions = ref(false);
  const error = ref<string | null>(null);
  const optionsError = ref<string | null>(null);
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  async function fetchDoctors(params?: DoctorParams) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await doctorService.getDoctors(params);

      if (response.status === 'success') {
        doctors.value = response.data.doctors;

        if (response.pagination) {
          pagination.value = response.pagination;
        }
      }

      return doctors.value;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch doctors';
      error.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  // เพิ่ม fetchDoctorById function
  async function fetchDoctorById(id: string): Promise<Doctor | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await doctorService.getDoctorById(id);

      if (response.status === 'success') {
        currentDoctor.value = response.data.doctor;
        return currentDoctor.value;
      }

      throw new Error('Failed to fetch doctor');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch doctor with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createDoctor(formData: FormData) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await doctorService.createDoctor(formData);

      if (response.status === 'success') {
        const newDoctor = response.data.doctor;
        doctors.value.push(newDoctor);

        // Clear cached options to force refresh
        doctorOptions.value = [];

        return newDoctor;
      }

      throw new Error('Failed to create doctor');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create doctor';
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateDoctor(id: string, formData: FormData) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await doctorService.updateDoctor(id, formData);

      if (response.status === 'success') {
        const updatedDoctor = response.data.doctor;
        const index = doctors.value.findIndex(d => d.id === id);
        if (index !== -1) {
          doctors.value[index] = updatedDoctor;
        }

        if (currentDoctor.value && currentDoctor.value.id === id) {
          currentDoctor.value = updatedDoctor;
        }

        // Clear cached options to force refresh
        doctorOptions.value = [];

        return updatedDoctor;
      }

      throw new Error('Failed to update doctor');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update doctor with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteDoctor(id: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const success = await doctorService.deleteDoctor(id);

      if (success) {
        doctors.value = doctors.value.filter(d => d.id !== id);

        if (currentDoctor.value && currentDoctor.value.id === id) {
          currentDoctor.value = null;
        }

        // Clear cached options to force refresh
        doctorOptions.value = [];

        return true;
      }

      return false;
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete doctor with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchDoctorOptions(): Promise<DoctorOption[]> {
    // Return cached data if available
    if (doctorOptions.value.length > 0) {
      return doctorOptions.value;
    }

    isLoadingOptions.value = true;
    optionsError.value = null;

    try {
      const options = await doctorService.getDoctorOptions();
      doctorOptions.value = options;
      return options;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch doctor options';
      optionsError.value = errorMsg;
      console.error('Error fetching doctor options:', error);
      throw error;
    } finally {
      isLoadingOptions.value = false;
    }
  }

  function getDoctorNameById(id: string): string {
    const doctor = doctorOptions.value.find(d => d.id === id);
    return doctor?.value || 'ไม่ระบุแพทย์';
  }

  // เพิ่มฟังก์ชันสำหรับหาสีของหมอ
  function getDoctorColorById(id: string): string {
    const doctor = doctors.value.find(d => d.id === id);
    return doctor?.color || '#3B82F6'; // default blue
  }

  // เพิ่มฟังก์ชันสำหรับหาหมอจากสี
  function getDoctorsByColor(color: string): Doctor[] {
    return doctors.value.filter(d => d.color === color);
  }

  async function refreshDoctorOptions(): Promise<DoctorOption[]> {
    doctorOptions.value = [];
    return await fetchDoctorOptions();
  }

  function sortDoctorsAZ() {
    doctors.value = [...doctors.value].sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  function sortDoctorsBySpecialty() {
    doctors.value = [...doctors.value].sort((a, b) => a.specialty.localeCompare(b.specialty));
  }

  // เพิ่มฟังก์ชันจัดเรียงตามสี
  function sortDoctorsByColor() {
    doctors.value = [...doctors.value].sort((a, b) => (a.color || '').localeCompare(b.color || ''));
  }

  // ปรับปรุงฟังก์ชันสำหรับสร้าง FormData ให้รองรับ color
  function createFormDataFromDoctor(doctor: Partial<Doctor>, photo?: File): FormData {
    const formData = new FormData();

    if (photo) {
      formData.append('photo', photo);
    } else {
      formData.append('photo', '');
    }

    if (doctor.name) formData.append('name', doctor.name);
    if (doctor.surname) formData.append('surname', doctor.surname);
    if (doctor.nickname) formData.append('nickname', doctor.nickname);
    if (doctor.gender) formData.append('gender', doctor.gender);
    if (doctor.nationality) formData.append('nationality', doctor.nationality);
    if (doctor.birthday) formData.append('birthday', doctor.birthday);
    if (doctor.address) formData.append('address', doctor.address);
    if (doctor.specialty) formData.append('specialty', doctor.specialty);
    if (doctor.color) formData.append('color', doctor.color); // เพิ่ม color
    if (doctor.clinicId) formData.append('clinicId', doctor.clinicId);

    if (doctor.branches) {
      formData.append('branches', JSON.stringify(doctor.branches));
    }

    return formData;
  }

  // เพิ่มฟังก์ชันสำหรับ clear error
  function clearError() {
    error.value = null;
    optionsError.value = null;
  }

  function clearCurrentDoctor() {
    currentDoctor.value = null;
  }

  // เพิ่มฟังก์ชันสำหรับสถิติสี
  const colorStats = computed(() => {
    const stats: Record<string, number> = {};
    doctors.value.forEach(doctor => {
      const color = doctor.color || '#3B82F6';
      stats[color] = (stats[color] || 0) + 1;
    });
    return stats;
  });

  // เพิ่มฟังก์ชันสำหรับหาสีที่ใช้งานอยู่
  const usedColors = computed(() => {
    const colors = new Set<string>();
    doctors.value.forEach(doctor => {
      if (doctor.color) {
        colors.add(doctor.color);
      }
    });
    return Array.from(colors);
  });

  // Getters
  const getDoctors = computed(() => doctors.value);
  const getCurrentDoctor = computed(() => currentDoctor.value);
  const getDoctorOptions = computed(() => doctorOptions.value);
  const getLoading = computed(() => isLoading.value);
  const getLoadingOptions = computed(() => isLoadingOptions.value);
  const getError = computed(() => error.value);
  const getOptionsError = computed(() => optionsError.value);
  const getPagination = computed(() => pagination.value);
  const hasDoctorOptions = computed(() => doctorOptions.value.length > 0);
  const getDoctorById = computed(() => (id: string) => 
    doctors.value.find(doctor => doctor.id === id)
  );

  return {
    // State
    doctors,
    currentDoctor,
    doctorOptions,
    isLoading,
    isLoadingOptions,
    error,
    optionsError,
    pagination,

    // Actions
    fetchDoctors,
    fetchDoctorById, // เพิ่ม
    createDoctor,
    updateDoctor,
    deleteDoctor,
    fetchDoctorOptions,
    getDoctorNameById,
    getDoctorColorById,
    getDoctorsByColor,
    refreshDoctorOptions,
    sortDoctorsAZ,
    sortDoctorsBySpecialty,
    sortDoctorsByColor,
    createFormDataFromDoctor,
    clearError,
    clearCurrentDoctor, // เพิ่ม

    // Getters
    getDoctors,
    getCurrentDoctor, // เพิ่ม
    getDoctorOptions,
    getLoading,
    getLoadingOptions,
    getError,
    getOptionsError,
    getPagination,
    hasDoctorOptions,
    getDoctorById, // เพิ่ม
    colorStats,
    usedColors,
  };
});