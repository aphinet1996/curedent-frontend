<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppointmentStore, type Appointment } from '~/stores/appointment'

interface CardAppointmentProps {
    appointmentId?: string | number
    appointment?: Appointment
    customClass?: string
    showEditButton?: boolean
}

const props = withDefaults(defineProps<CardAppointmentProps>(), {
    appointmentId: '',
    appointment: undefined,
    customClass: '',
    showEditButton: true
})

const emit = defineEmits<{
    (e: 'edit', appointment: Appointment): void
}>()

const appointmentStore = useAppointmentStore()

const appointmentData = computed(() => {
    if (props.appointment) {
        return props.appointment
    }

    if (props.appointmentId) {
        return appointmentStore.getAppointmentById(props.appointmentId)
    }

    return null
})

const statusConfig = {
    confirmed: {
        icon: 'line-md:circle-to-confirm-circle-transition',
        color: 'text-green-500',
        bgColor: 'bg-green-100',
        label: 'Confirm'
    },
    pending: {
        icon: 'mdi:clock-outline',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100',
        label: 'Pending'
    },
    done: {
        icon: 'line-md:circle-to-confirm-circle-transition',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100',
        label: 'Pending'
    },
    cancelled: {
        icon: 'ic:outline-cancel',
        color: 'text-red-500',
        bgColor: 'bg-red-100',
        label: 'Cancelled'
    }
}

const currentStatus = computed(() => {
    const status = appointmentData.value?.status || 'pending'
    return statusConfig[status]
})

const handleEdit = () => {
    if (appointmentData.value) {
        emit('edit', appointmentData.value)
    }
}
</script>

<template>
    <div :class="['bg-gray-50 rounded-lg border border-gray-100 p-3', customClass]">
        <div v-if="appointmentStore.loading" class="flex justify-center items-center py-4">
            <Icon icon="eos-icons:loading" class="w-6 h-6 text-blue-500 animate-spin" />
        </div>

        <div v-else-if="appointmentStore.error" class="text-red-500 text-[11px] py-2">
            <Icon icon="mdi:alert-circle" class="w-5 h-5 inline-block mr-1" />
            {{ appointmentStore.error }}
        </div>

        <div v-else-if="appointmentData" class="flex flex-col">

            <div class="flex flex-col gap-1 mb-1">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div :class="[currentStatus.bgColor, 'rounded-full flex items-center px-2 py-0.5']">
                            <Icon :icon="currentStatus.icon" :class="[currentStatus.color, 'w-4 h-4 mr-1']" />
                            <span :class="[currentStatus.color, 'text-[11px]']">
                                {{ currentStatus.label }}
                            </span>
                        </div>
                    </div>

                    <button v-if="showEditButton" @click="handleEdit"
                        class="text-gray-500 hover:text-blue-500 transition-colors p-1" aria-label="Edit appointment">
                        <Icon icon="bx:edit" class="w-5 h-5" />
                    </button>
                </div>

                <span class="2xl:text-sm xl:text-[12px] text-gray-800">
                    {{ appointmentData.patientName }}
                </span>
            </div>

            <!-- <div class="flex flex-col gap-1 2xl:flex-row 2xl:items-center 2xl:justify-between mb-1">
                <div class="flex justify-between items-center gap-2">
                    <div :class="[currentStatus.bgColor, 'rounded-full flex items-center px-2 py-0.5']">
                        <Icon :icon="currentStatus.icon" :class="[currentStatus.color, 'w-4 h-4 mr-1']" />
                        <span :class="[currentStatus.color, 'text-[11px] lg:text-[9px]']">
                            {{ currentStatus.label }}
                        </span>
                    </div>

                    <button v-if="showEditButton" @click="handleEdit"
                        class="text-gray-500 hover:text-blue-500 transition-colors p-1" aria-label="Edit appointment">
                        <Icon icon="bx:edit" class="w-5 h-5" />
                    </button>
                </div>

                <span class="text-sm lg:text-[10px] text-gray-800 pl-1">
                    {{ appointmentData.patientName }}
                </span>
            </div> -->

            <div class="text-[11px]">
                <div class="flex items-center gap-1 mb-1">
                    <span class="text-gray-500">Next Visit:</span>
                    <span class="font-medium">{{ appointmentData.nextVisitDate || '-' }}</span>
                </div>

                <div class="flex items-center gap-1 mb-1">
                    <span class="text-gray-500">Last Visit:</span>
                    <span class="font-medium">{{ appointmentData.lastVisitDate || '-' }}</span>
                </div>

                <div class="flex flex-col 2xl:flex-row 2xl:items-center justify-between">
                    <div class="flex items-center gap-1 mb-1">
                        <span class="text-gray-500">Doctor:</span>
                        <span class="font-medium">{{ appointmentData.doctor || '-' }}</span>
                    </div>

                    <div class="flex items-center gap-1 text-gray-500">
                        <span>Created:</span>
                        <span class="font-medium">{{ appointmentData.createdDate || '-' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-gray-500 text-[11px] py-2 text-center">
            ไม่พบข้อมูลการนัดหมาย
        </div>

        <slot></slot>
    </div>
</template>