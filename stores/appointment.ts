import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { appointmentService } from '~/services/appointment';
import type { 
  Appointment, 
  CreateAppointmentRequest, 
  ApiAppointment,
  CalendarDayData,
  WeekViewData,
  WeekViewParams,
  MonthViewData,
  MonthViewParams
} from '~/types/appointment';

export const useAppointmentStore = defineStore('appointment', () => {
  // State
  const appointments = ref<Appointment[]>([]);
  const currentAppointment = ref<Appointment | null>(null);
  
  // Patient-specific appointments
  const patientAppointments = ref<Map<string, ApiAppointment[]>>(new Map());
  const currentPatientId = ref<string | null>(null);
  
  const calendarDayData = ref<CalendarDayData | null>(null);
  const weekViewData = ref<WeekViewData | null>(null);
  const monthViewData = ref<MonthViewData | null>(null);
  const selectedDate = ref(new Date().toISOString().split('T')[0]);
  
  // Loading states
  const isLoading = ref(false);
  const isLoadingPatientAppointments = ref(false);
  const isLoadingCalendarDay = ref(false);
  const isLoadingWeekView = ref(false);
  const isLoadingMonthView = ref(false);
  
  // Error states
  const error = ref<string | null>(null);
  const patientAppointmentsError = ref<string | null>(null);
  const calendarDayError = ref<string | null>(null);
  const weekViewError = ref<string | null>(null);
  const monthViewError = ref<string | null>(null);
  
  // Pagination
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  // Actions
  const fetchAppointments = async (params?: {
    page?: number;
    limit?: number;
    date?: string;
    doctorId?: string;
    branchId?: string;
    status?: string;
  }): Promise<Appointment[]> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await appointmentService.getAppointments(params);

      if (response.status === 'success') {
        appointments.value = response.data.appointments || [];
        return appointments.value;
      }

      throw new Error('Failed to fetch appointments');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch appointments';
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // New action for fetching patient appointments
  const fetchPatientAppointments = async (patientId: string): Promise<ApiAppointment[]> => {
    isLoadingPatientAppointments.value = true;
    patientAppointmentsError.value = null;
    currentPatientId.value = patientId;

    try {
      const response = await appointmentService.getAppointmentsByPatientId(patientId);

      if (response.status === 'success') {
        const appointments = response.data.appointments || [];
        // Store in Map for caching
        patientAppointments.value.set(patientId, appointments);
        return appointments;
      }

      throw new Error('Failed to fetch patient appointments');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch patient appointments';
      patientAppointmentsError.value = errorMsg;
      console.error(errorMsg);
      return [];
    } finally {
      isLoadingPatientAppointments.value = false;
    }
  };

  const fetchCalendarDayAppointments = async (date: string): Promise<CalendarDayData | null> => {
    isLoadingCalendarDay.value = true;
    calendarDayError.value = null;

    try {
      const response = await appointmentService.getCalendarDayAppointments(date);

      if (response.status === 'success') {
        calendarDayData.value = response.data;
        return calendarDayData.value;
      }

      throw new Error('Failed to fetch calendar day appointments');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch calendar day appointments';
      calendarDayError.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoadingCalendarDay.value = false;
    }
  };

  const fetchCalendarWeekAppointments = async (params: WeekViewParams): Promise<WeekViewData | null> => {
    isLoadingWeekView.value = true;
    weekViewError.value = null;

    try {
      const response = await appointmentService.getCalendarWeekAppointments(params);

      if (response.status === 'success') {
        weekViewData.value = response.data;
        selectedDate.value = params.date;
        return weekViewData.value;
      }

      throw new Error('Failed to fetch calendar week appointments');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch calendar week appointments';
      weekViewError.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoadingWeekView.value = false;
    }
  };

  const fetchCalendarMonthAppointments = async (params: MonthViewParams): Promise<MonthViewData | null> => {
    isLoadingMonthView.value = true;
    monthViewError.value = null;

    try {
      const response = await appointmentService.getCalendarMonthAppointments(params);

      if (response.status === 'success') {
        monthViewData.value = response.data;
        return monthViewData.value;
      }

      throw new Error('Failed to fetch calendar month appointments');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch calendar month appointments';
      monthViewError.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoadingMonthView.value = false;
    }
  };

  const fetchUpcomingAppointments = async (params?: {
    limit?: number;
    doctorId?: string;
    branchId?: string;
  }): Promise<ApiAppointment[]> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await appointmentService.getUpcomingAppointments(params);

      if (response.status === 'success') {
        const upcomingAppointments = response.data.appointments || [];
        return upcomingAppointments;
      }

      throw new Error('Failed to fetch upcoming appointments');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to fetch upcoming appointments';
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAppointmentById = async (id: string): Promise<Appointment | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await appointmentService.getAppointmentById(id);

      if (response.status === 'success') {
        currentAppointment.value = response.data.appointment;
        return currentAppointment.value;
      }

      throw new Error('Failed to fetch appointment');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to fetch appointment with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const createAppointment = async (appointmentData: CreateAppointmentRequest): Promise<Appointment | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await appointmentService.createAppointment(appointmentData);

      if (response.status === 'success') {
        const newAppointment = response.data.appointment;
        appointments.value.unshift(newAppointment);
        
        // Refresh patient appointments if current patient is affected
        if (currentPatientId.value && appointmentData.patient.patientId === currentPatientId.value) {
          await fetchPatientAppointments(currentPatientId.value);
        }
        
        return newAppointment;
      }

      throw new Error('Failed to create appointment');
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create appointment';
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<CreateAppointmentRequest>): Promise<Appointment | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await appointmentService.updateAppointment(id, appointmentData);

      if (response.status === 'success') {
        const updatedAppointment = response.data.appointment;

        const index = appointments.value.findIndex(appointment => appointment.id === id);
        if (index !== -1) {
          appointments.value[index] = updatedAppointment;
        }

        if (currentAppointment.value && currentAppointment.value.id === id) {
          currentAppointment.value = updatedAppointment;
        }

        // Refresh patient appointments if current patient is affected
        if (currentPatientId.value) {
          await fetchPatientAppointments(currentPatientId.value);
        }

        return updatedAppointment;
      }

      throw new Error('Failed to update appointment');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update appointment with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      await appointmentService.deleteAppointment(id);

      appointments.value = appointments.value.filter(appointment => appointment.id !== id);

      if (currentAppointment.value && currentAppointment.value.id === id) {
        currentAppointment.value = null;
      }

      // Refresh patient appointments if current patient is affected
      if (currentPatientId.value) {
        await fetchPatientAppointments(currentPatientId.value);
      }

      return true;
    } catch (error: any) {
      const errorMsg = error.message || `Failed to delete appointment with ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateAppointmentStatus = async (id: string, status: string): Promise<Appointment | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await appointmentService.updateAppointmentStatus(id, status);

      if (response.status === 'success') {
        const updatedAppointment = response.data.appointment;

        const index = appointments.value.findIndex(appointment => appointment.id === id);
        if (index !== -1) {
          appointments.value[index] = updatedAppointment;
        }

        if (currentAppointment.value && currentAppointment.value.id === id) {
          currentAppointment.value = updatedAppointment;
        }

        // Refresh patient appointments if current patient is affected
        if (currentPatientId.value) {
          await fetchPatientAppointments(currentPatientId.value);
        }

        return updatedAppointment;
      }

      throw new Error('Failed to update appointment status');
    } catch (error: any) {
      const errorMsg = error.message || `Failed to update appointment status for ID ${id}`;
      error.value = errorMsg;
      console.error(errorMsg);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Week Navigation Functions
  const goToPreviousWeek = async (): Promise<void> => {
    const currentDate = new Date(selectedDate.value);
    currentDate.setDate(currentDate.getDate() - 7);
    const newDate = currentDate.toISOString().split('T')[0];
    await fetchCalendarWeekAppointments({ date: newDate });
  };

  const goToNextWeek = async (): Promise<void> => {
    const currentDate = new Date(selectedDate.value);
    currentDate.setDate(currentDate.getDate() + 7);
    const newDate = currentDate.toISOString().split('T')[0];
    await fetchCalendarWeekAppointments({ date: newDate });
  };

  const goToToday = async (): Promise<void> => {
    const today = new Date().toISOString().split('T')[0];
    await fetchCalendarWeekAppointments({ date: today });
  };

  // Month Navigation Functions
  const goToPreviousMonth = async (): Promise<void> => {
    const currentMonth = monthViewData.value?.month || new Date().getMonth() + 1;
    const currentYear = monthViewData.value?.year || new Date().getFullYear();
    
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    
    if (newMonth === 0) {
      newMonth = 12;
      newYear -= 1;
    }
    
    await fetchCalendarMonthAppointments({ 
      month: newMonth.toString().padStart(2, '0'), 
      year: newYear.toString() 
    });
  };

  const goToNextMonth = async (): Promise<void> => {
    const currentMonth = monthViewData.value?.month || new Date().getMonth() + 1;
    const currentYear = monthViewData.value?.year || new Date().getFullYear();
    
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    
    if (newMonth === 13) {
      newMonth = 1;
      newYear += 1;
    }
    
    await fetchCalendarMonthAppointments({ 
      month: newMonth.toString().padStart(2, '0'), 
      year: newYear.toString() 
    });
  };

  const goToCurrentMonth = async (): Promise<void> => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    await fetchCalendarMonthAppointments({ month, year });
  };

  // Patient appointment utility functions
  const getPatientAppointments = (patientId: string): ApiAppointment[] => {
    return patientAppointments.value.get(patientId) || [];
  };

  const getCurrentPatientAppointments = (): ApiAppointment[] => {
    if (!currentPatientId.value) return [];
    return getPatientAppointments(currentPatientId.value);
  };

  const getPatientAppointmentById = (patientId: string, appointmentId: string): ApiAppointment | null => {
    const appointments = getPatientAppointments(patientId);
    return appointments.find(appointment => appointment.id === appointmentId) || null;
  };

  const getPatientUpcomingAppointments = (patientId: string): ApiAppointment[] => {
    const appointments = getPatientAppointments(patientId);
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate >= now && appointment.status !== 'cancelled';
    }).sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  };

  const getPatientPastAppointments = (patientId: string): ApiAppointment[] => {
    const appointments = getPatientAppointments(patientId);
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate < now;
    }).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  };

  // Calendar Day Utility Functions
  const getCalendarDayAppointmentsByDoctor = (doctorId: string): ApiAppointment[] => {
    if (!calendarDayData.value) return [];
    return calendarDayData.value.appointments.filter(appointment => appointment.doctor?.id === doctorId);
  };

  const getCalendarDayAppointmentsByHour = (hour: number): ApiAppointment[] => {
    if (!calendarDayData.value) return [];
    return calendarDayData.value.appointments.filter(appointment => {
      const [startHour] = appointment.startTime.split(':').map(Number);
      return startHour === hour;
    });
  };

  const getCalendarDayAppointmentsByDoctorAndHour = (doctorId: string, hour: number): ApiAppointment[] => {
    if (!calendarDayData.value) return [];
    return calendarDayData.value.appointments.filter(appointment => {
      const [startHour] = appointment.startTime.split(':').map(Number);
      return appointment.doctor?.id === doctorId && startHour === hour;
    });
  };

  // Utility functions
  const getAppointmentsByDate = (date: string): Appointment[] => {
    return appointments.value.filter(appointment => appointment.appointmentDate === date);
  };

  const getAppointmentsByDoctor = (doctorId: string): Appointment[] => {
    return appointments.value.filter(appointment => appointment.doctorId === doctorId);
  };

  const getAppointmentsByStatus = (status: string): Appointment[] => {
    return appointments.value.filter(appointment => appointment.status === status);
  };

  const getAppointmentsByDateRange = (startDate: string, endDate: string): Appointment[] => {
    return appointments.value.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return appointmentDate >= start && appointmentDate <= end;
    });
  };

  const getTodayAppointments = (): Appointment[] => {
    const today = new Date().toISOString().split('T')[0];
    return getAppointmentsByDate(today);
  };

  const getUpcomingAppointmentsRange = (days: number = 7): Appointment[] => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return getAppointmentsByDateRange(
      today.toISOString().split('T')[0],
      futureDate.toISOString().split('T')[0]
    );
  };

  const searchAppointments = (searchTerm: string): Appointment[] => {
    if (!searchTerm) return appointments.value;

    const term = searchTerm.toLowerCase();
    return appointments.value.filter(appointment => {
      const patientName = appointment.patient.name?.toLowerCase() || '';
      const title = appointment.title.toLowerCase();
      const notes = appointment.notes?.toLowerCase() || '';
      
      return patientName.includes(term) || 
             title.includes(term) || 
             notes.includes(term);
    });
  };

  // Clear functions
  const clearError = (): void => {
    error.value = null;
  };

  const clearPatientAppointmentsError = (): void => {
    patientAppointmentsError.value = null;
  };

  const clearCalendarDayError = (): void => {
    calendarDayError.value = null;
  };

  const clearWeekViewError = (): void => {
    weekViewError.value = null;
  };

  const clearMonthViewError = (): void => {
    monthViewError.value = null;
  };

  const clearCurrentAppointment = (): void => {
    currentAppointment.value = null;
  };

  const clearCalendarDayData = (): void => {
    calendarDayData.value = null;
  };

  const clearWeekViewData = (): void => {
    weekViewData.value = null;
  };

  const clearMonthViewData = (): void => {
    monthViewData.value = null;
  };

  const clearPatientAppointments = (patientId?: string): void => {
    if (patientId) {
      patientAppointments.value.delete(patientId);
    } else {
      patientAppointments.value.clear();
      currentPatientId.value = null;
    }
  };

  // Month View Utility Functions
  const getMonthViewAppointmentsByDate = (date: string): ApiAppointment[] => {
    if (!monthViewData.value) return [];
    
    for (const week of monthViewData.value.weeks) {
      for (const day of week.days) {
        if (day.date === date) {
          return day.appointments;
        }
      }
    }
    return [];
  };

  const setSelectedDate = (date: string): void => {
    selectedDate.value = date;
  };

  const setCurrentPatientId = (patientId: string | null): void => {
    currentPatientId.value = patientId;
  };

  // Getters (computed)
  const getAppointments = computed(() => appointments.value);
  const getCurrentAppointment = computed(() => currentAppointment.value);
  const getCalendarDayData = computed(() => calendarDayData.value);
  const getWeekViewData = computed(() => weekViewData.value);
  const getMonthViewData = computed(() => monthViewData.value);
  const getSelectedDate = computed(() => selectedDate.value);
  const getCurrentPatientId = computed(() => currentPatientId.value);
  
  // Loading getters
  const getLoading = computed(() => isLoading.value);
  const getLoadingPatientAppointments = computed(() => isLoadingPatientAppointments.value);
  const getLoadingCalendarDay = computed(() => isLoadingCalendarDay.value);
  const getLoadingWeekView = computed(() => isLoadingWeekView.value);
  const getLoadingMonthView = computed(() => isLoadingMonthView.value);
  
  // Error getters
  const getError = computed(() => error.value);
  const getPatientAppointmentsError = computed(() => patientAppointmentsError.value);
  const getCalendarDayError = computed(() => calendarDayError.value);
  const getWeekViewError = computed(() => weekViewError.value);
  const getMonthViewError = computed(() => monthViewError.value);
  
  const getPagination = computed(() => pagination.value);
  const getTotalAppointments = computed(() => appointments.value.length);
  const getCalendarDayTotalAppointments = computed(() => calendarDayData.value?.summary.total || 0);
  
  const getAppointmentById = computed(() => (id: string) =>
    appointments.value.find(appointment => appointment.id === id)
  );

  // Patient appointment getters
  const getPatientAppointmentsByStatus = computed(() => (patientId: string, status: string) => {
    const appointments = getPatientAppointments(patientId);
    return appointments.filter(appointment => appointment.status === status);
  });

  // Calendar Day Getters
  const getCalendarDayAppointments = computed(() => calendarDayData.value?.appointments || []);
  const getCalendarDayUniqueDoctors = computed(() => {
    if (!calendarDayData.value) return [];
    const uniqueIds = new Set();
    return calendarDayData.value.appointments
      .map(appointment => appointment.doctor)
      .filter(doctor => {
        if (!doctor || uniqueIds.has(doctor.id)) return false;
        uniqueIds.add(doctor.id);
        return true;
      });
  });

  // Status-specific getters
  const getScheduledAppointments = computed(() => 
    appointments.value.filter(appointment => appointment.status === 'scheduled')
  );
  const getCompletedAppointments = computed(() => 
    appointments.value.filter(appointment => appointment.status === 'completed')
  );
  const getCancelledAppointments = computed(() => 
    appointments.value.filter(appointment => appointment.status === 'cancelled')
  );

  return {
    // State
    appointments,
    currentAppointment,
    patientAppointments,
    currentPatientId,
    calendarDayData,
    weekViewData,
    monthViewData,
    selectedDate,
    isLoading,
    isLoadingPatientAppointments,
    isLoadingCalendarDay,
    isLoadingWeekView,
    isLoadingMonthView,
    error,
    patientAppointmentsError,
    calendarDayError,
    weekViewError,
    monthViewError,
    pagination,

    // Actions
    fetchAppointments,
    fetchPatientAppointments,
    fetchCalendarDayAppointments,
    fetchCalendarWeekAppointments,
    fetchCalendarMonthAppointments,
    fetchUpcomingAppointments,
    fetchAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    getAppointmentsByDate,
    getAppointmentsByDoctor,
    getAppointmentsByStatus,
    getAppointmentsByDateRange,
    getTodayAppointments,
    getUpcomingAppointments: getUpcomingAppointmentsRange,
    searchAppointments,
    getCalendarDayAppointmentsByDoctor,
    getCalendarDayAppointmentsByHour,
    getCalendarDayAppointmentsByDoctorAndHour,
    getMonthViewAppointmentsByDate,
    getPatientAppointments,
    getCurrentPatientAppointments,
    getPatientAppointmentById,
    getPatientUpcomingAppointments,
    getPatientPastAppointments,
    setSelectedDate,
    setCurrentPatientId,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    clearError,
    clearPatientAppointmentsError,
    clearCalendarDayError,
    clearWeekViewError,
    clearMonthViewError,
    clearCurrentAppointment,
    clearCalendarDayData,
    clearWeekViewData,
    clearMonthViewData,
    clearPatientAppointments,

    // Getters
    getAppointments,
    getCurrentAppointment,
    getCalendarDayData,
    getWeekViewData,
    getMonthViewData,
    getSelectedDate,
    getCurrentPatientId,
    getLoading,
    getLoadingPatientAppointments,
    getLoadingCalendarDay,
    getLoadingWeekView,
    getLoadingMonthView,
    getError,
    getPatientAppointmentsError,
    getCalendarDayError,
    getWeekViewError,
    getMonthViewError,
    getPagination,
    getTotalAppointments,
    getCalendarDayTotalAppointments,
    getAppointmentById,
    getPatientAppointmentsByStatus,
    getCalendarDayAppointments,
    getCalendarDayUniqueDoctors,
    getScheduledAppointments,
    getCompletedAppointments,
    getCancelledAppointments
  };
});