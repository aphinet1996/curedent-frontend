<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Card from '../Card.vue';
// import { useAppointmentStore, type Payment } from '~/stores/appointment';
import CardPaymentAdd from './CardPaymentAdd.vue';

interface CardPaymentProps {
    paymentId?: string | number
    // payment?: Payment
    payment?: string
    customClass?: string
    showEditButton?: boolean
}

const props = withDefaults(defineProps<CardPaymentProps>(), {
    paymentId: '',
    payment: undefined,
    customClass: '',
    showEditButton: true
})

const emit = defineEmits<{
    // (e: 'edit', visit: Visit): void
    (e: 'edit', visit: string): void
}>()

// ใช้ store จาก Pinia
const paymentStore = useAppointmentStore()

// Computed property สำหรับดึงข้อมูลจาก store หรือใช้จาก props
const paymentData = computed(() => {
    if (props.payment) {
        return props.payment
    }

    // if (props.paymentId) {
    //     return paymentStore.getVisitById(props.paymentId)
    // }

    return null
})

// Status configuration
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

// Computed เพื่อดึงสถานะ
const currentStatus = computed(() => {
    // const status = paymentData.value?.status || 'pending'
    // return statusConfig[status]
    return 'pending'
})

// Handler
const handleEdit = () => {
    if (paymentData.value) {
        emit('edit', paymentData.value)
    }
}

onMounted(() => {
    // paymentStore.fetchPayments()
})

const showForm = ref(false)

const handleSubmit = (data: any) => {
  console.log('Submitted:', data)
  showForm.value = false
}
</script>

<template>
    <Card :icon="'fluent:payment-32-regular'" :title="'Payment'" :customClasses="'w-full overflow-auto'">
        <template #headerRight>
            <Button icon="mdi:add" label="Add" size="xs" @click="showForm = true" />
        </template>

        <!-- <div v-if="paymentStore.loading" class="flex justify-center items-center py-6">
            <Icon icon="eos-icons:loading" class="w-6 h-6 text-blue-500 animate-spin" />
        </div>

        <div v-else-if="paymentStore.error" class="text-red-500 text-sm py-2">
            <Icon icon="mdi:alert-circle" class="w-5 h-5 inline-block mr-1" />
            {{ paymentStore.error }}
        </div> -->

        <!-- <div v-else class="space-y-3">
            <template v-if="paymentStore.payments.length > 0">
                <div v-if="paymentData" class="flex flex-col">
                    <div class="flex items-start justify-between mb-1">
                        <div class="flex items-center gap-2">
                            <div :class="[currentStatus.bgColor, 'rounded-full flex items-center px-2 py-0.5']">
                                <Icon :icon="currentStatus.icon" :class="[currentStatus.color, 'w-4 h-4 mr-1']" />
                                <span :class="[currentStatus.color, 'text-[11px]']">
                                    {{ currentStatus.label }}
                                </span>
                            </div>
                            <span class="text-sm text-gray-800">{{ paymentData.treatment }}</span>
                        </div>
                    </div>
        
                    <div class="text-[11px]">
                        <div class="flex items-center gap-1 mb-1">
                            <span class="text-gray-500 w-20">Appointed:</span>
                            <span class="font-medium">{{ paymentData.doctor || '-' }}</span>
                        </div>
        
                        <div class="flex items-center gap-1 mb-1">
                            <span class="text-gray-500 w-20">Doctor:</span>
                            <span class="font-medium">{{ paymentData.doctor || '-' }}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="text-gray-500 text-center py-6">
                    ไม่พบประวัติชำระเงิน
                </div>
            </template>
        </div> -->
        <div class="text-gray-500 text-center py-6">
            ไม่พบประวัติชำระเงิน
        </div>
    </Card>
    <CardPaymentAdd :show="showForm" @close="showForm = false" @submit="handleSubmit" />
</template>