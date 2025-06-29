export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Patient information in appointment (local/form data)
export interface AppointmentPatient {
    isRegistered: boolean;
    patientId?: string; // For registered patients
    name?: string; // For unregistered patients
    phone?: string;
    email?: string;
}

// Patient information in API response
export interface ApiAppointmentPatient {
    isRegistered: boolean;
    id?: string; // API response field
    patientId?: string; // For registered patients
    hn?: string; // Hospital number
    name?: string; // Patient name
    phone?: string;
    email?: string;
}

// Doctor information in appointment (API response)
export interface AppointmentDoctor {
    id: string;
    name: string;
    specialty: string;
}

// Branch information in appointment (API response)
export interface AppointmentBranch {
    id: string;
    name: string;
}

// Clinic information in appointment (API response)
export interface AppointmentClinic {
    id: string;
    name: string;
}

// Calendar Day API Response interface
export interface CalendarDayResponse {
    status: string;
    data: {
        view: string;
        timezone: string;
        date: string;
        appointments: ApiAppointment[];
        summary: {
            total: number;
            byStatus: Record<string, number>;
            byType: Record<string, number>;
        };
    };
}

// Calendar Day Data (extracted from response)
export interface CalendarDayData {
    view: string;
    timezone: string;
    date: string;
    appointments: ApiAppointment[];
    summary: {
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
    };
}

// Appointment interface for local/form data
export interface Appointment {
    id: string;
    title: string;
    patient: AppointmentPatient;
    appointmentDate: string; // YYYY-MM-DD format
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    type: string;
    branchId: string;
    doctorId: string;
    notes?: string;
    status: AppointmentStatus;
    createdAt: string;
    updatedAt: string;
}

// Appointment interface for API response
export interface ApiAppointment {
    id: string;
    title: string;
    clinic?: AppointmentClinic;
    branch?: AppointmentBranch;
    doctor?: AppointmentDoctor;
    patient: ApiAppointmentPatient;
    appointmentDate: string; // ISO date string
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    duration?: number; // in minutes
    appointmentDateTime?: string; // ISO datetime string
    type: string;
    status: AppointmentStatus;
    tags?: string[];
    notes?: string;
    isToday?: boolean;
    isPast?: boolean;
    isFuture?: boolean;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: {
        id: string;
        name: string;
    };
}

// Create appointment request
export interface CreateAppointmentRequest {
    title: string;
    patient: AppointmentPatient;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    type: string;
    branchId: string;
    doctorId: string;
    notes?: string;
}

// Update appointment request
export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> {
    id: string;
}

export interface ApiAppointmentsResponse {
    status: string;
    data: {
        appointments: ApiAppointment[];
    };
    pagination?: Pagination;
    message?: string;
}

// Search and filter parameters
export interface AppointmentSearchParams {
    page?: number;
    limit?: number;
    date?: string;
    dateFrom?: string;
    dateTo?: string;
    doctorId?: string;
    branchId?: string;
    status?: AppointmentStatus;
    type?: string;
    search?: string; // For patient name or title search
}

// Calendar specific types (for displaying appointments)
export interface CalendarAppointment {
    id: string;
    title: string;
    patientName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    type: string;
    doctorId: string;
    doctorName?: string;
    color?: string; // For calendar display
}

// Time slot interface (for calendar grid)
export interface TimeSlot {
    time: string;
    available: boolean;
    appointment?: CalendarAppointment;
}

// Daily schedule interface
export interface DailySchedule {
    date: string;
    doctorId: string;
    timeSlots: TimeSlot[];
    appointments: CalendarAppointment[];
}

// Appointment statistics
export interface AppointmentStats {
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
}

// Recurring appointment pattern
export interface RecurringPattern {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // every N days/weeks/months/years
    daysOfWeek?: number[]; // for weekly pattern (0 = Sunday, 1 = Monday, etc.)
    dayOfMonth?: number; // for monthly pattern
    endDate?: string; // when to stop recurring
    occurrences?: number; // how many times to repeat
}

// Recurring appointment request
export interface CreateRecurringAppointmentRequest extends CreateAppointmentRequest {
    recurringPattern: RecurringPattern;
}

// Notification settings for appointment
export interface AppointmentNotification {
    id: string;
    appointmentId: string;
    type: 'email' | 'sms' | 'push';
    timing: 'immediate' | '15min' | '1hour' | '1day';
    status: 'pending' | 'sent' | 'failed';
    sentAt?: string;
}

// Appointment conflict information
export interface AppointmentConflict {
    type: 'doctor_unavailable' | 'time_overlap' | 'room_occupied';
    message: string;
    conflictingAppointmentId?: string;
    suggestedTimes?: string[];
}

// API Response wrapper
export interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
    pagination?: Pagination;
    errors?: string[];
}

// Appointment status enum
export type AppointmentStatus =
    | 'scheduled'
    | 'confirmed'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'no-show'
    | 'rescheduled';

// Appointment type options
export interface AppointmentTypeOption {
    value: string;
    label: string;
    category?: string;
    duration?: number; // in minutes
}

// Response types
export interface AppointmentResponse {
    status: string;
    data: {
        appointment: Appointment;
    };
    message?: string;
}

export interface AppointmentsResponse {
    status: string;
    data: {
        appointments: Appointment[];
    };
    pagination?: Pagination;
    message?: string;
}

// Calendar Day API Response interface
export interface CalendarDayResponse {
    status: string;
    data: {
        view: string;
        timezone: string;
        date: string;
        appointments: ApiAppointment[];
        summary: {
            total: number;
            byStatus: Record<string, number>;
            byType: Record<string, number>;
        };
    };
}

// Week View API Types
export interface WeekViewDay {
    date: string;
    dayOfWeek: number;
    appointments: ApiAppointment[];
    appointmentCount: number;
}

export interface WeekViewSummary {
    totalAppointments: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byDay: Record<string, number>;
}

export interface WeekViewData {
    view: 'week';
    timezone: string;
    weekStartsOn: number;
    weekStart: string;
    weekEnd: string;
    days: WeekViewDay[];
    summary: WeekViewSummary;
}

export interface WeekViewResponse {
    status: 'success';
    data: WeekViewData;
}

// Week View Parameters
export interface WeekViewParams {
    date: string; // YYYY-MM-DD format
    timezone?: string;
}

// Month View API Types
export interface MonthViewDay {
    date: string;
    dayOfMonth: number;
    isCurrentMonth: boolean;
    appointments: ApiAppointment[];
    appointmentCount: number;
}

export interface MonthViewWeek {
    weekNumber: number;
    days: MonthViewDay[];
}

export interface MonthViewSummary {
    totalAppointments: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    byWeek: Record<string, number>;
}

export interface MonthViewData {
    view: 'month';
    timezone: string;
    includeAdjacentDays: boolean;
    year: number;
    month: number;
    monthName: string;
    weeks: MonthViewWeek[];
    summary: MonthViewSummary;
}

export interface MonthViewResponse {
    status: 'success';
    data: MonthViewData;
}

// Month View Parameters
export interface MonthViewParams {
    month: string; // "06" format
    year: string;  // "2025" format
    timezone?: string;
}

// Grouped Appointment interface for ViewWeek
export interface GroupedAppointment {
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