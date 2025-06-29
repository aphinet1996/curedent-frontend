<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { usePatientStore } from '~/stores/patient'
import type { ApiPatient } from '~/types/patient'

const route = useRoute()
const patientStore = usePatientStore()
const id = route.params.id as string

const isLoading = ref(false)
const error = ref<string | null>(null)

const apiPatient = ref<ApiPatient | null>(null)

const patient = computed(() => {
    if (!apiPatient.value) {
        return {
            hn: '',
            name: '',
            image: null,
            tel: '',
            line: false,
            facebook: false,
            gender: '',
            age: '',
            birth: '',
            branch: '',
            nationality: '',
            address: '',
            condition: '',
            allergy: '-',
            pressure: '',
            bloodType: '',
            height: '',
            weight: ''
        }
    }

    const data = apiPatient.value

    return {
        hn: data.hn || '',
        name: data.fullName || `${data.firstName} ${data.lastName}`,
        image: null, // ใช้ profileImage จาก API หรือ null ถ้าไม่มี
        tel: data.phone || '',
        line: !!data.phone, // สมมติว่ามีเบอร์แล้วมี LINE
        facebook: false, // ไม่มีข้อมูลใน API
        gender: data.gender || '',
        age: data.age?.toString() || '',
        birth: data.dateOfBirth ? formatDate(data.dateOfBirth) : '',
        branch: data.branchName || '',
        nationality: data.nationality || '',
        address: formatAddress(data.currentAddress),
        condition: data.medicalInfo?.chronicDiseases?.join(', ') || '',
        allergy: data.medicalInfo?.drugAllergies?.length > 0
            ? data.medicalInfo.drugAllergies.join(', ')
            : '-',
        pressure: '',
        bloodType: data.bloodGroup || '',
        height: '',
        weight: ''
    }
})

// ฟังก์ชันช่วยในการ format วันที่
const formatDate = (dateString: string): string => {
    if (!dateString) return ''

    try {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    } catch (error) {
        console.error('Error formatting date:', error)
        return dateString
    }
}

const formatAddress = (address: any): string => {
    if (!address) return ''

    const parts = [
        address.address,
        address.subdistrict,
        address.district,
        address.province,
        address.zipcode
    ].filter(Boolean)

    return parts.join(', ')
}

const fetchPatientData = async () => {
    if (!id) {
        error.value = 'Patient ID is required'
        return
    }

    isLoading.value = true
    error.value = null

    try {
        console.log(`Fetching patient data for ID: ${id}`)

        const result = await patientStore.fetchPatientById(id)

        if (result) {
            apiPatient.value = result
            console.log('Patient data loaded successfully:', result)
        } else {
            error.value = 'Patient not found'
        }
    } catch (err: any) {
        console.error('Error fetching patient data:', err)
        error.value = err.message || 'Failed to load patient data'
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    if (id) {
        fetchPatientData()
    } else {
        error.value = 'No patient ID provided'
    }
})

const emit = defineEmits(['edit'])

const retryFetch = () => {
    fetchPatientData()
}
</script>

<template>
    <div v-if="isLoading" class="bg-white rounded-lg shadow px-4 py-8 flex items-center justify-center w-full">
        <div class="flex items-center gap-3 text-gray-600">
            <Icon icon="mdi:loading" class="w-6 h-6 animate-spin" />
            <span>กำลังโหลดข้อมูลผู้ป่วย...</span>
        </div>
    </div>

    <div v-else-if="error" class="bg-white rounded-lg shadow px-4 py-6 w-full">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 text-red-600">
                <Icon icon="mdi:alert-circle" class="w-6 h-6" />
                <div>
                    <div class="font-semibold">เกิดข้อผิดพลาด</div>
                    <div class="text-sm">{{ error }}</div>
                </div>
            </div>
            <button @click="retryFetch"
                class="flex items-center gap-1 px-3 py-1 rounded-md text-xs text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <Icon icon="mdi:refresh" class="w-4 h-4" />
                ลองใหม่
            </button>
        </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow px-4 py-4 flex items-start justify-between gap-4 w-full">
        <div class="flex items-start gap-4 flex-1">
            <div class="relative w-20 h-20 rounded-lg overflow-hidden">
                <img v-if="patient.image" :src="patient.image" alt="avatar" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Icon icon="iconoir:user" class="w-10 h-10 text-gray-500" />
                </div>

                <div class="absolute bottom-0 right-0 bg-black bg-opacity-50 rounded-full p-1">
                    <Icon icon="mdi:camera-outline" class="w-4 h-4 text-white" />
                </div>
            </div>

            <div class="space-y-1">
                <div class="text-xs text-gray-500">HN #{{ patient.hn }}</div>
                <div class="flex">
                    <div class="font-semibold text-blue-700 text-base">{{ patient.name }}</div>
                    <div class="flex items-center gap-2 text-sm text-gray-600 ml-3">
                        <!-- <Icon icon="ic:baseline-whatsapp" class="w-4 h-4 text-green-500" v-if="patient.line" />
                        <Icon icon="ri:facebook-fill" class="w-4 h-4 text-blue-600" v-if="patient.facebook" /> -->
                        <Icon icon="mdi:phone" class="w-4 h-4" />
                        <span>{{ patient.tel }}</span>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-1 ml-4">
                        <span v-if="patient.condition" class="bg-blue-100 text-xs text-blue-800 px-2 py-0.5 rounded-md">
                            Medical Condition: <span class="font-semibold">{{ patient.condition }}</span>
                        </span>
                        <span v-if="patient.allergy && patient.allergy !== '-'"
                            class="bg-red-100 text-xs text-red-800 px-2 py-0.5 rounded-md">
                            Drug allergy: {{ patient.allergy }}
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-6 gap-x-3 text-[9px] text-gray-500">
                    <div>First Branch: </div>
                    <div>Gender</div>
                    <div class="-ml-18">Age</div>
                    <div class="-ml-40">Birth</div>
                    <div class="-ml-50">Nationality</div>
                    <div class="-ml-56">Address</div>
                </div>
                <div class="grid grid-cols-6 gap-x-3 text-xs text-gray-800">
                    <div>{{ patient.branch }}</div>
                    <div>{{ patient.gender }}</div>
                    <div class="-ml-18">{{ patient.age }}</div>
                    <div class="-ml-40">{{ patient.birth }}</div>
                    <div class="-ml-50">{{ patient.nationality }}</div>
                    <div class="-ml-56">{{ patient.address }}</div>
                </div>
            </div>
        </div>

        <div class="flex flex-col items-end gap-2">
            <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="bg-blue-100 rounded-md px-3 py-1">
                    <div class="text-[10px] text-gray-500">Blood Pressure</div>
                    <div class="text-xs font-semibold">{{ patient.pressure || 'N/A' }}</div>
                </div>
                <div class="bg-blue-100 rounded-md px-3 py-1">
                    <div class="text-[10px] text-gray-500">Blood Type</div>
                    <div class="text-xs font-semibold">{{ patient.bloodType || 'N/A' }}</div>
                </div>
                <div class="bg-blue-100 rounded-md px-3 py-1">
                    <div class="text-[10px] text-gray-500">Height</div>
                    <div class="text-xs font-semibold">{{ patient.height || 'N/A' }}</div>
                </div>
                <div class="bg-blue-100 rounded-md px-3 py-1">
                    <div class="text-[10px] text-gray-500">Weight</div>
                    <div class="text-xs font-semibold">{{ patient.weight || 'N/A' }}</div>
                </div>
            </div>
        </div>

        <div class="flex flex-col py-3">
            <button @click="$emit('edit')"
                class="flex items-center gap-1 px-3 py-1 rounded-md text-xs text-white bg-blue-600 border border-blue-500 hover:bg-blue-700 transition-colors">
                <Icon icon="bx:edit" class="w-4 h-4" />
                Edit
            </button>
        </div>
    </div>
</template>