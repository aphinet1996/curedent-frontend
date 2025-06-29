<!-- <script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const visibleTo = ref(['Admin 1', 'Admin 2'])
const tags = ref(['Patient', 'Invisalign Full'])

const removeVisible = (index: number) => {
    visibleTo.value.splice(index, 1)
}

const removeTag = (index: number) => {
    tags.value.splice(index, 1)
}
</script>

<template>
    <div class="rounded-2xl shadow bg-white p-4 max-w-[320px] space-y-6 text-sm">
        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="mynaui:user-solid" class="text-blue-600 w-5 h-5" />
                    </div>
                    <span class="font-semibold text-gray-800">Profile</span>
                </div>
                <button
                    class="px-3 py-1 ml-2 rounded-lg text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                    <Icon icon="bx:edit" class="w-4 h-4" />
                    Edit
                </button>
            </div>

            <div class="flex items-center gap-3">
                <div class="relative">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                        class="rounded-lg w-24 h-24 object-cover" />
                    <Icon icon="mdi:camera"
                        class="absolute bottom-1 right-1 w-5 h-5 bg-white rounded-full p-1 shadow" />
                </div>
                <div class="text-sm space-y-1">
                    <div class="text-gray-400">HN #1123213124</div>
                    <div class="font-semibold text-blue-600 text-base">Mr. Casey Lou</div>
                    <div class="text-gray-700">📞 083-201-9533</div>
                    <div class="flex gap-2">
                        <Icon icon="ic:baseline-facebook" class="text-green-500 w-5 h-5" />
                        <Icon icon="ic:baseline-line" class="text-green-500 w-5 h-5" />
                    </div>
                </div>
            </div>

            <div class="bg-blue-100 text-xs rounded px-3 py-1">
                Medical Condition:
                <span class="font-bold text-sm text-black">Heart Failure</span>
            </div>
            <div class="bg-blue-100 text-xs rounded px-3 py-1">Drug allergy: -</div>
        </div>

        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="ant-design:calendar-filled" class="text-blue-600 w-5 h-5" />
                    </div>
                    <span class="font-semibold text-gray-800">Appointment</span>
                </div>
                <button
                    class="px-3 py-1 ml-2 rounded-lg text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                    <Icon icon="mdi:add" class="w-4 h-4" />
                    Create
                </button>
            </div>

            <div class="bg-gray-50 rounded-xl p-3 text-xs space-y-1">
                <span class="flex items-center gap-1 bg-green-400 text-white rounded-full text-xs px-2 py-0.5 max-w-20">
                    <Icon icon="line-md:circle-to-confirm-circle-transition" class="w-4 h-4" />
                    Confirm
                </span>
                <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-700">จัดฟันใส (Invisalign Full)</span>
                    <Icon icon="bx:edit" class="ml-auto text-gray-400 w-4 h-4" />
                </div>
                <div>Next Visit: <span class="font-medium">27/05/2023</span></div>
                <div>Last Visit: <span class="font-medium">01/05/2023</span></div>
                <div>Doctor: <span class="font-medium">Dr. Charoen (Mai)</span></div>
                <div class="text-right text-gray-400">Created: 01/04/2023</div>
            </div>
        </div>

        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="streamline:visible-solid" class="text-blue-600 w-5 h-5" />
                    </div>
                    <span class="font-semibold text-gray-800">Visible To.</span>
                </div>
                <button
                    class="px-3 py-1 ml-2 rounded-lg text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                    <Icon icon="mdi:add" class="w-4 h-4" />
                    Add
                </button>
            </div>
            <div class="space-y-2">
                <div v-for="(admin, index) in visibleTo" :key="index"
                    class="bg-gray-100 rounded-lg border border-gray-300 px-3 py-1 flex items-center justify-between">
                    {{ admin }}
                    <button @click="removeVisible(index)">
                        <Icon icon="mdi:trash-can" class="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                </div>
            </div>
        </div>

        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="mdi:tag" class="text-blue-600 w-5 h-5" />
                    </div>
                    <span class="font-semibold text-gray-800">Tag</span>
                </div>
                <button
                    class="px-3 py-1 ml-2 rounded-lg text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                    <Icon icon="mdi:add" class="w-4 h-4" />
                    Add
                </button>
            </div>
            <div class="flex flex-wrap gap-2">
                <div v-for="(tag, index) in tags" :key="index"
                    class="px-2 py-1 rounded-sm text-xs bg-red-100 text-red-600 flex items-center gap-1">
                    {{ tag }}
                    <button @click="removeTag(index)">
                        <Icon icon="mdi:close" class="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template> -->
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '~/stores/chat'

const chatStore = useChatStore()

// เมื่อผู้ใช้เปลี่ยน ให้โหลดข้อมูลที่เกี่ยวข้อง
watchEffect(() => {
    if (chatStore.activeUserId) {
        chatStore.fetchUserProfile()
        // ฟีเจอร์เพิ่มเติมที่ยังไม่มี API รองรับ
        // chatStore.fetchTags()
        // chatStore.fetchVisibleAdmins()
        // chatStore.fetchAppointments()
    }
})

// ข้อมูลตัวอย่างสำหรับแสดง (เนื่องจาก API ยังไม่รองรับ)
const sampleAppointment = {
    status: 'confirmed',
    treatment: 'Line Customer Support',
    nextVisit: '30/04/2025',
    lastVisit: '20/04/2025',
    doctor: 'Admin',
    createdAt: '20/04/2025'
}

// ข้อมูลเกี่ยวกับ Visible To
const visibleTo = ref(['Admin 1', 'Admin 2'])

const removeVisible = (index: number) => {
    visibleTo.value.splice(index, 1)
}

// ฟังก์ชันเพิ่ม Tag (ตัวอย่างเท่านั้น)
const tags = ref(['Line User', 'Customer'])
const newTagName = ref('')
const tagDropdownVisible = ref(false)

const toggleTagDropdown = () => {
    tagDropdownVisible.value = !tagDropdownVisible.value
}

const addNewTag = () => {
    if (!newTagName.value.trim()) return
    tags.value.push(newTagName.value)
    newTagName.value = ''
    tagDropdownVisible.value = false
}

const removeTag = (index: number) => {
    tags.value.splice(index, 1)
}
</script>

<template>
    <div class="rounded-2xl shadow bg-white p-4 max-w-[320px] space-y-6 text-sm">
        <!-- Profile Section -->
        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="mynaui:user-solid" class="text-blue-600 w-5 h-5" />
                    </div>
                    <span class="font-semibold text-gray-800">Profile</span>
                </div>
                <button
                    class="px-3 py-1 ml-2 rounded-lg text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                    <Icon icon="bx:edit" class="w-4 h-4" />
                    Edit
                </button>
            </div>

            <div>
                <div v-if="chatStore.loading.profile" class="text-center py-4">
                    <div class="text-sm text-gray-500">กำลังโหลดข้อมูลโปรไฟล์...</div>
                </div>

                <div v-if="!chatStore.loading.profile && !chatStore.userProfile && chatStore.activeUserId"
                    class="text-center py-4">
                    <div class="text-sm text-gray-500">ไม่พบข้อมูลโปรไฟล์</div>
                </div>

                <div v-if="chatStore.userProfile" class="flex items-center gap-3">
                    <div class="relative">
                        <img v-if="chatStore.userProfile.pictureUrl" :src="chatStore.userProfile.pictureUrl"
                            class="rounded-lg w-24 h-24 object-cover" />
                        <div v-else class="rounded-lg w-24 h-24 bg-blue-100 flex items-center justify-center">
                            <Icon icon="mynaui:user-solid" class="w-10 h-10 text-gray-500" />
                        </div>
                        <Icon icon="mdi:camera"
                            class="absolute bottom-1 right-1 w-5 h-5 bg-white rounded-full p-1 shadow" />
                    </div>
                    <div class="text-sm space-y-1">
                        <div class="text-gray-400">HN #{{ chatStore.userProfile?.userId?.slice(-10) || 'ยังไม่ระบุ' }}
                        </div>
                        <div class="font-semibold text-blue-600 text-base">{{ chatStore.userProfile.displayName }}</div>
                        <div class="text-gray-700">
                            📞 {{ chatStore.userProfile?.statusMessage?.match(/\d{3}-\d{3}-\d{4}/)?.toString() ||
                            'ไม่ระบุ' }}
                        </div>
                        <div class="flex gap-2">
                            <Icon icon="ic:baseline-line" class="text-green-500 w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div class="bg-blue-100 text-xs rounded px-3 py-1 mt-3">
                    Medical Condition:
                    <span class="font-bold text-sm text-black">ไม่ระบุ</span>
                </div>
                <div class="bg-blue-100 text-xs rounded px-3 py-1 mt-1">
                    Drug allergy: <span class="font-bold text-sm">-</span>
                </div>
            </div>
        </div>

        <!-- Appointment Section -->
        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="ant-design:calendar-filled" class="text-blue-600 w-5 h-5" />
                    </div>
                    <span class="font-semibold text-gray-800">Appointment</span>
                </div>
                <button
                    class="px-3 py-1 ml-2 rounded-lg text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                    <Icon icon="mdi:add" class="w-4 h-4" />
                    Create
                </button>
            </div>

            <div class="bg-gray-50 rounded-xl p-3 text-xs space-y-1">
                <span class="flex items-center gap-1 bg-green-400 text-white rounded-full text-xs px-2 py-0.5 max-w-20">
                    <Icon icon="line-md:circle-to-confirm-circle-transition" class="w-4 h-4" />
                    {{ sampleAppointment.status }}
                </span>
                <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-700">{{ sampleAppointment.treatment }}</span>
                    <Icon icon="bx:edit" class="ml-auto text-gray-400 w-4 h-4" />
                </div>
                <div>Next Visit: <span class="font-medium">{{ sampleAppointment.nextVisit }}</span></div>
                <div>Last Visit: <span class="font-medium">{{ sampleAppointment.lastVisit }}</span></div>
                <div>Doctor: <span class="font-medium">{{ sampleAppointment.doctor }}</span></div>
                <div class="text-right text-gray-400">Created: {{ sampleAppointment.createdAt }}</div>
            </div>
        </div>

        <!-- Visible To Section -->
        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="streamline:visible-solid" class="text-blue-600 w-5 h-5" />
                    </div>
                    <span class="font-semibold text-gray-800">Visible To.</span>
                </div>
                <button
                    class="px-3 py-1 ml-2 rounded-lg text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                    <Icon icon="mdi:add" class="w-4 h-4" />
                    Add
                </button>
            </div>

            <div class="space-y-2">
                <div v-for="(admin, index) in visibleTo" :key="index"
                    class="bg-gray-100 rounded-lg border border-gray-300 px-3 py-1 flex items-center justify-between">
                    {{ admin }}
                    <button @click="removeVisible(index)">
                        <Icon icon="mdi:trash-can" class="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                </div>

                <div v-if="visibleTo.length === 0" class="text-center w-full py-2">
                    <div class="text-sm text-gray-500">ไม่มีผู้มองเห็น</div>
                </div>
            </div>
        </div>

        <!-- Tags Section -->
        <div class="space-y-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <div class="bg-blue-200 py-1 px-1 rounded-4xl">
                        <Icon icon="mdi:tag" class="text-blue-600 w-5 h-5" />
                    </div>
                    <span class="font-semibold text-gray-800">Tag</span>
                </div>
                <div class="relative">
                    <button @click="toggleTagDropdown"
                        class="px-3 py-1 ml-2 rounded-lg text-sm flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                        <Icon icon="mdi:add" class="w-4 h-4" />
                        Add
                    </button>

                    <div v-if="tagDropdownVisible"
                        class="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-10 w-48">
                        <input v-model="newTagName" type="text" placeholder="Tag name"
                            class="w-full mb-2 border border-gray-300 rounded px-2 py-1 text-sm" />
                        <div class="flex justify-end">
                            <button @click="addNewTag" class="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                                Add Tag
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <div v-for="(tag, index) in tags" :key="index"
                    class="px-2 py-1 rounded-sm text-xs bg-red-100 text-red-600 flex items-center gap-1">
                    {{ tag }}
                    <button @click="removeTag(index)">
                        <Icon icon="mdi:close" class="w-3 h-3" />
                    </button>
                </div>

                <div v-if="tags.length === 0" class="text-center w-full py-2">
                    <div class="text-sm text-gray-500">ไม่มี Tag</div>
                </div>
            </div>
        </div>
    </div>
</template>