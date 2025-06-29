// services/appointment.ts - Updated with patient appointments endpoint
import { useCookie } from 'nuxt/app';
import type {
    Appointment,
    ApiAppointment,
    CreateAppointmentRequest,
    ApiResponse,
    CalendarDayResponse,
    WeekViewResponse,
    WeekViewParams,
    MonthViewResponse,
    MonthViewParams
} from '~/types/appointment';

// Base API URL
const BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

/**
 * Custom fetch function with default options and error handling
 */
async function apiFetch<T>(url: string, options: any = {}, retries = 3): Promise<T> {
    const token = useCookie('auth_token').value;

    if (!token) {
        throw new Error('Authentication required');
    }

    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include' as const,
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await $fetch<T>(`${BASE_URL}${url}`, mergedOptions);
        } catch (error: any) {
            console.error(`API Error (${url}):`, error);

            if (attempt === retries || error.response?.status < 500) {
                if (error.response?.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                } else if (error.response?.status === 403) {
                    throw new Error('Forbidden: You do not have permission');
                } else if (error.response?.status === 404) {
                    throw new Error('Resource not found');
                } else {
                    throw new Error(error.message || 'Failed to fetch data');
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
    throw new Error('Max retries reached');
}

export const appointmentService = {
    /**
     * Get calendar day view appointments
     */
    async getCalendarDayAppointments(date: string): Promise<CalendarDayResponse> {
        return await apiFetch<CalendarDayResponse>(`/appointments/calendar/day`, {
            method: 'GET',
            params: { date },
        });
    },

    /**
     * Get calendar week view appointments
     */
    async getCalendarWeekAppointments(params: WeekViewParams): Promise<WeekViewResponse> {
        return await apiFetch<WeekViewResponse>(`/appointments/calendar/week`, {
            method: 'GET',
            params,
        });
    },

    /**
     * Get calendar month view appointments
     */
    async getCalendarMonthAppointments(params: MonthViewParams): Promise<MonthViewResponse> {
        return await apiFetch<MonthViewResponse>(`/appointments/calendar/month`, {
            method: 'GET',
            params,
        });
    },

    /**
     * Get appointments by patient ID
     */
    async getAppointmentsByPatientId(patientId: string): Promise<ApiResponse<{
        patientId: string;
        appointments: ApiAppointment[]
    }>> {
        return await apiFetch<ApiResponse<{
            patientId: string;
            appointments: ApiAppointment[]
        }>>(`/appointments/patients/${patientId}`, {
            method: 'GET',
        });
    },

    /**
     * Create a new appointment
     */
    async createAppointment(appointmentData: CreateAppointmentRequest): Promise<ApiResponse<{ appointment: Appointment }>> {
        return await apiFetch<ApiResponse<{ appointment: Appointment }>>('/appointments', {
            method: 'POST',
            body: appointmentData,
        });
    },

    /**
     * Get all appointments
     */
    async getAppointments(params?: {
        page?: number;
        limit?: number;
        date?: string;
        doctorId?: string;
        branchId?: string;
        status?: string;
    }): Promise<ApiResponse<{ appointments: Appointment[] }>> {
        return await apiFetch<ApiResponse<{ appointments: Appointment[] }>>('/appointments', {
            method: 'GET',
            params,
        });
    },

    /**
     * Get upcoming appointments
     */
    async getUpcomingAppointments(params?: {
        limit?: number;
        doctorId?: string;
        branchId?: string;
    }): Promise<ApiResponse<{ appointments: ApiAppointment[] }>> {
        return await apiFetch<ApiResponse<{ appointments: ApiAppointment[] }>>('/appointments/upcoming', {
            method: 'GET',
            params,
        });
    },

    /**
     * Get a specific appointment by ID
     */
    async getAppointmentById(id: string): Promise<ApiResponse<{ appointment: Appointment }>> {
        return await apiFetch<ApiResponse<{ appointment: Appointment }>>(`/appointments/${id}`, {
            method: 'GET',
        });
    },

    /**
     * Update an existing appointment
     */
    async updateAppointment(id: string, appointmentData: Partial<CreateAppointmentRequest>): Promise<ApiResponse<{ appointment: Appointment }>> {
        return await apiFetch<ApiResponse<{ appointment: Appointment }>>(`/appointments/${id}`, {
            method: 'PUT',
            body: appointmentData,
        });
    },

    /**
     * Delete an appointment
     */
    async deleteAppointment(id: string): Promise<ApiResponse<null>> {
        return await apiFetch<ApiResponse<null>>(`/appointments/${id}`, {
            method: 'DELETE',
        });
    },

    /**
     * Update appointment status
     */
    async updateAppointmentStatus(id: string, status: string): Promise<ApiResponse<{ appointment: Appointment }>> {
        return await apiFetch<ApiResponse<{ appointment: Appointment }>>(`/appointments/${id}/status`, {
            method: 'PATCH',
            body: { status },
        });
    }
};