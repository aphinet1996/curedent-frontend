export interface Doctor {
    id: string;
    name: string;
    avatar?: string;
    color: string;
  }
  
  export interface TimeSlot {
    start: string; // Format: HH:MM
    end: string; // Format: HH:MM
    doctorId: string;
    patientName?: string;
    description?: string;
  }
  
  export interface Appointment {
    id: string;
    doctorId: string;
    patientId?: string;
    patientName: string;
    date: string; // Format: YYYY-MM-DD
    startTime: string; // Format: HH:MM
    endTime: string; // Format: HH:MM
    status: 'scheduled' | 'completed' | 'cancelled';
    description?: string;
    treatment?: string;
  }
  
  export interface DaySchedule {
    date: string; // Format: YYYY-MM-DD
    appointments: Appointment[];
  }
  
  export type CalendarViewType = 'day' | 'week' | 'month';
  
  export interface CalendarState {
    doctors: Doctor[];
    appointments: Appointment[];
    selectedDate: string; // Format: YYYY-MM-DD
    currentView: CalendarViewType;
    filteredDoctors: string[]; // Array of doctor IDs
  }