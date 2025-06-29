<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

type Admin = {
  id: number
  name: string
  fullName: string
  role: 'Admin' | 'Super Admin'
  status: 'active' | 'inactive'
  updatedAt: string
}

const admins = ref<Admin[]>([
  {
    id: 1,
    name: 'Admin Pueng ♀',
    fullName: 'Phanida Chareonsuk',
    role: 'Super Admin',
    status: 'active',
    updatedAt: 'Wednesday, August 23, 2566 BE (GMT+7)'
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: i + 2,
    name: 'Admin Pueng ♀',
    fullName: 'Phanida Chareonsuk',
    role: 'Admin' as const,
    status: 'active' as const,
    updatedAt: 'Wednesday, August 23, 2566 BE (GMT+7)'
  }))
])

const handleRoleChange = (id: number, newRole: 'Admin' | 'Super Admin') => {
  const admin = admins.value.find(a => a.id === id)
  if (admin) admin.role = newRole
}

const handleDelete = (id: number) => {
  admins.value = admins.value.filter(a => a.id !== id)
}
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-xl shadow-sm">
    <table class="min-w-full text-sm text-left">
      <thead class="bg-gray-50 text-gray-500 text-xs">
        <tr>
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4">Role</th>
          <th class="px-6 py-4">Status</th>
          <th class="px-6 py-4">Last Update</th>
          <th class="px-6 py-4 text-right">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.id" class="border-t border-gray-200 hover:bg-gray-50">
          <td class="px-6 py-4 flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <div class="font-semibold text-gray-800">{{ admin.name }}</div>
              <div class="text-gray-500 text-xs">{{ admin.fullName }}</div>
            </div>
          </td>
          <td class="px-6 py-4">
            <select
              v-model="admin.role"
              @change="handleRoleChange(admin.id, admin.role)"
              class="px-7 py-1.5 rounded-full text-xs bg-blue-50 text-blue-700 font-medium border border-blue-200 focus:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </td>
          <td class="px-6 py-4">
            <span
              class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
              :class="{
                'bg-green-100 text-green-600': admin.status === 'active',
                'bg-red-100 text-red-600': admin.status === 'inactive'
              }"
            >
              <span class="w-2 h-2 rounded-full bg-current"></span>
              {{ admin.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="px-6 py-4 text-gray-500 text-xs">
            <div>{{ admin.updatedAt }}</div>
          </td>
          <td class="px-6 py-4 text-right">
            <button @click="handleDelete(admin.id)" class="text-gray-400 hover:text-red-500">
              <Icon icon="mdi:trash-can-outline" class="w-5 h-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>