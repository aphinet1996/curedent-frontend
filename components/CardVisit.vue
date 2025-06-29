<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppointmentStore } from '~/stores/appointment'
import type { ApiAppointment } from '~/types/appointment'

interface CardVisitProps {
    appointmentId?: string | number
    appointment?: ApiAppointment
    customClass?: string
    showActions?: boolean
    showEditButton?: boolean
    showDeleteButton?: boolean
}

const props = withDefaults(defineProps<CardVisitProps>(), {
    appointmentId: '',
    appointment: undefined,
    customClass: '',
    showActions: true,
    showEditButton: true,
    showDeleteButton: false
})

const emit = defineEmits<{
    (e: 'edit', appointment: ApiAppointment): void
    (e: 'update', appointment: ApiAppointment): void
    (e: 'delete', appointmentId: string): void
    (e: 'statusChange', appointmentId: string, status: string): void
}>()

const appointmentStore = useAppointmentStore()

const appointmentData = computed(() => {
    if (props.appointment) {
        return props.appointment
    }
    if (props.appointmentId && appointmentStore.getCurrentPatientId) {
        return appointmentStore.getPatientAppointmentById(
            appointmentStore.getCurrentPatientId,
            props.appointmentId.toString()
        )
    }
    return null
})

const statusConfig = {
    scheduled: {
        icon: 'mdi:clock-outline',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
        label: 'Scheduled'
    },
    confirmed: {
        icon: 'line-md:circle-to-confirm-circle-transition',
        color: 'text-green-500',
        bgColor: 'bg-green-100',
        label: 'Confirmed'
    },
    'in-progress': {
        icon: 'mdi:play-circle-outline',
        color: 'text-purple-500',
        bgColor: 'bg-purple-100',
        label: 'In Progress'
    },
    completed: {
        icon: 'mdi:check-circle',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Completed'
    },
    cancelled: {
        icon: 'mdi:cancel',
        color: 'text-red-500',
        bgColor: 'bg-red-100',
        label: 'Cancelled'
    },
    'no-show': {
        icon: 'mdi:account-off',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        label: 'No Show'
    },
    rescheduled: {
        icon: 'mdi:calendar-sync',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100',
        label: 'Rescheduled'
    }
}

const currentStatus = computed(() => {
    const status = appointmentData.value?.status || 'scheduled'
    return statusConfig[status] || statusConfig.scheduled
})

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatTime = (timeString: string) => {
    return timeString
}

const formatDateTime = (dateString: string, timeString: string) => {
    const date = formatDate(dateString)
    const time = formatTime(timeString)
    return `${date} เวลา ${time}`
}

const isAppointmentPast = computed(() => {
    if (!appointmentData.value) return false
    return appointmentData.value.isPast || false
})

const isAppointmentToday = computed(() => {
    if (!appointmentData.value) return false
    return appointmentData.value.isToday || false
})

const getTypeColor = (type: string) => {
    const typeColors = {
        consultation: 'bg-blue-100 text-blue-700',
        checkup: 'bg-green-100 text-green-700',
        treatment: 'bg-purple-100 text-purple-700',
        surgery: 'bg-red-100 text-red-700',
        followup: 'bg-orange-100 text-orange-700'
    }
    return typeColors[type] || 'bg-gray-100 text-gray-700'
}

// Handlers
const handleEdit = () => {
    if (appointmentData.value) {
        emit('edit', appointmentData.value)
    }
}

const handleUpdate = () => {
    if (appointmentData.value) {
        emit('update', appointmentData.value)
    }
}

const handleDelete = () => {
    if (appointmentData.value) {
        emit('delete', appointmentData.value.id)
    }
}

const handleStatusChange = async (newStatus: string) => {
    if (appointmentData.value) {
        try {
            await appointmentStore.updateAppointmentStatus(appointmentData.value.id, newStatus)
            emit('statusChange', appointmentData.value.id, newStatus)
        } catch (error) {
            console.error('Failed to update appointment status:', error)
        }
    }
}

const statusOptions = computed(() => {
    const current = appointmentData.value?.status
    const options = []

    if (current !== 'confirmed') options.push({ value: 'confirmed', label: 'Confirm' })
    if (current !== 'completed') options.push({ value: 'completed', label: 'Complete' })
    if (current !== 'cancelled') options.push({ value: 'cancelled', label: 'Cancel' })
    if (current !== 'no-show') options.push({ value: 'no-show', label: 'No Show' })

    return options
})
</script>

<template>
    <div :class="[
        'bg-white rounded-lg border transition-all duration-200 hover:shadow-md p-3',
        isAppointmentToday ? 'border-blue-300 bg-blue-50' : 'border-gray-200',
        isAppointmentPast ? 'opacity-75' : '',
        customClass
    ]">
        <div v-if="appointmentStore.getLoadingPatientAppointments" class="flex justify-center items-center py-4">
            <Icon icon="eos-icons:loading" class="w-6 h-6 text-blue-500 animate-spin" />
        </div>

        <div v-else-if="appointmentStore.getPatientAppointmentsError" class="text-red-500 text-[11px] py-2">
            <Icon icon="mdi:alert-circle" class="w-5 h-5 inline-block mr-1" />
            {{ appointmentStore.getPatientAppointmentsError }}
        </div>

        <div v-else-if="appointmentData" class="flex flex-col space-y-2">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div :class="[currentStatus.bgColor, 'inline-flex items-center px-2 py-1 rounded-full mb-1']">
                        <Icon :icon="currentStatus.icon" :class="[currentStatus.color, 'w-3 h-3 mr-1']" />
                        <span :class="[currentStatus.color, 'text-[10px] font-medium']">
                            {{ currentStatus.label }}
                        </span>
                    </div>

                    <div v-if="isAppointmentToday"
                        class="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-medium ml-1">
                        <Icon icon="mdi:calendar-today" class="w-3 h-3 mr-1" />
                        วันนี้
                    </div>
                </div>

                <div v-if="showActions && statusOptions.length > 0" class="relative group">
                    <button class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none">
                        <Icon icon="mdi:dots-vertical" class="w-4 h-4" />
                    </button>

                    <div
                        class="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block min-w-[120px]">
                        <button v-for="option in statusOptions" :key="option.value"
                            @click="handleStatusChange(option.value)"
                            class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg">
                            {{ option.label }}
                        </button>

                        <div v-if="showEditButton || showDeleteButton" class="border-t border-gray-200">
                            <button v-if="showEditButton" @click="handleEdit"
                                class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100">
                                <Icon icon="mdi:edit" class="w-3 h-3 inline mr-1" />
                                Edit
                            </button>

                            <button v-if="showDeleteButton" @click="handleDelete"
                                class="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-b-lg">
                                <Icon icon="mdi:delete" class="w-3 h-3 inline mr-1" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <h4 class="text-sm font-medium text-gray-900 line-clamp-1">
                    {{ appointmentData.title }}
                </h4>

                <div
                    :class="[getTypeColor(appointmentData.type), 'inline-block px-2 py-0.5 rounded text-[10px] font-medium']">
                    {{ appointmentData.type }}
                </div>
            </div>

            <div class="text-[11px] text-gray-600 space-y-1">
                <div class="flex items-center gap-1">
                    <Icon icon="mdi:calendar" class="w-3 h-3 text-gray-400" />
                    <span>{{ formatDateTime(appointmentData.appointmentDate, appointmentData.startTime) }}</span>
                </div>

                <!-- <div v-if="appointmentData.duration" class="flex items-center gap-1">
                    <Icon icon="mdi:clock" class="w-3 h-3 text-gray-400" />
                    <span>{{ appointmentData.duration }} นาที</span>
                </div> -->

                <div v-if="appointmentData.doctor" class="flex items-center gap-1">
                    <Icon icon="mdi:doctor" class="w-3 h-3 text-gray-400" />
                    <span>{{ appointmentData.doctor.name }}</span>
                    <span v-if="appointmentData.doctor.specialty" class="text-gray-500">
                        ({{ appointmentData.doctor.specialty }})
                    </span>
                </div>

                <div v-if="appointmentData.branch" class="flex items-center gap-1">
                    <Icon icon="mdi:map-marker" class="w-3 h-3 text-gray-400" />
                    <span>{{ appointmentData.branch.name }}</span>
                </div>

                <!-- <div v-if="appointmentData.clinic" class="flex items-center gap-1">
                    <Icon icon="mdi:hospital-building" class="w-3 h-3 text-gray-400" />
                    <span>{{ appointmentData.clinic.name }}</span>
                </div> -->

                <div v-if="appointmentData.notes" class="flex items-start gap-1">
                    <Icon icon="mdi:note-text" class="w-3 h-3 text-gray-400 mt-0.5" />
                    <span class="line-clamp-2">{{ appointmentData.notes }}</span>
                </div>

                <div v-if="appointmentData.tags && appointmentData.tags.length > 0"
                    class="flex items-center gap-1 flex-wrap">
                    <Icon icon="mdi:tag" class="w-3 h-3 text-gray-400" />
                    <span v-for="tag in appointmentData.tags" :key="tag"
                        class="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px]">
                        {{ tag }}
                    </span>
                </div>
            </div>

            <!-- <div v-if="appointmentData.createdBy" class="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                สร้างโดย {{ appointmentData.createdBy.name }} • {{ formatDate(appointmentData.createdAt) }}
            </div> -->
        </div>

        <div v-else class="text-gray-500 text-[11px] py-2 text-center">
            ไม่พบข้อมูลการนัดหมาย
        </div>

        <slot></slot>
    </div>
</template>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Hover effect for dropdown */
.group:hover .hidden {
    display: block;
}
</style>