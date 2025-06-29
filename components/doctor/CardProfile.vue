<script setup lang="ts">
import { Icon } from '@iconify/vue'

const doctor = {
    name: 'Dr. Utumporn Rangsisiripaiboon',
    phone: '083-201-9533',
    branch: 'Silom Complex',
    gender: 'Female',
    age: '28 Years 6 Months',
    birth: '04/11/1994',
    nationality: 'American',
    address: '44/1, Ratchadaphisek Rd, Huai Khwang, Bangkok 10310',
    specialization: 'Prosthodontists',
    schedule: 'Mon-Tue, 08.00 - 11.00 | Wed, 13.00 - 18.00 | Thurs, 10.00 - 16.00',
    avatar: 'https://ui-avatars.com/api/?name=Utumporn+Rangsisiripaiboon&background=ccc&color=444'
}
</script>

<template>
    <div class="bg-white p-4 rounded-xl shadow-sm">
        <div class="flex justify-between items-start gap-6">
            <!-- Avatar -->
            <div class="relative">
                <img :src="doctor.avatar" alt="avatar" class="w-20 h-20 rounded-lg object-cover" />
                <div class="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer">
                    <Icon icon="mdi:camera" class="w-4 h-4 text-gray-500" />
                </div>
            </div>

            <!-- Doctor Info -->
            <div class="flex-1 space-y-1">
                <!-- Name & Phone -->
                <div class="flex items-center gap-2">
                    <h2 class="text-base font-semibold text-blue-600">{{ doctor.name }}</h2>
                    <span class="text-sm text-gray-700">
                        <Icon icon="mdi:phone" class="inline w-4 h-4 mr-1" />
                        {{ doctor.phone }}
                    </span>
                </div>

                <!-- First Row: Branch, Gender, Age -->
                <div class="grid grid-cols-6 gap-x-3 text-[9px] text-gray-500">
                    <div>Branch</div>
                    <div>Gender</div>
                    <div class="-ml-18">Age</div>
                    <div class="-ml-24">Birth</div>
                    <div class="-ml-36">Nationality</div>
                    <div class="-ml-50">Address</div>
                </div>
                <div class="grid grid-cols-6 gap-x-3 text-xs text-gray-800">
                    <div>{{ doctor.branch }}</div>
                    <div>{{ doctor.gender }}</div>
                    <div class="-ml-18">{{ doctor.age }}</div>
                    <div class="-ml-24">{{ doctor.birth }}</div>
                    <div class="-ml-36">{{ doctor.nationality }}</div>
                    <div class="-ml-50">{{ doctor.address }}</div>
                </div>

                <!-- Specialization & Schedule -->
                <div class="flex flex-wrap items-center gap-6 text-sm text-gray-800 pt-1">
                    <div class="flex items-center gap-2">
                        <Icon icon="mdi:account" class="w-4 h-4 text-gray-500" />
                        <span>{{ doctor.specialization }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="mdi:calendar" class="w-4 h-4 text-gray-500" />
                        <span>{{ doctor.schedule }}</span>
                    </div>
                </div>
            </div>

            <!-- Edit Button -->
            <button
                class="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600">
                <Icon icon="mdi:pencil-outline" class="w-4 h-4" />
                Edit
            </button>
        </div>
    </div>
</template>