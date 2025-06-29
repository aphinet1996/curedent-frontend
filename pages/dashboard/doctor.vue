<script setup lang="ts">
definePageMeta({
  layout: 'main'
})
import { Icon } from '@iconify/vue'
import CardProfile from '~/components/doctor/CardProfile.vue'
import CardPatientList from '~/components/doctor/CardPatientList.vue'
import CardDF from '~/components/doctor/CardDF.vue'
</script>

<template>
  <div class="max-w-screen-3xl mx-auto px-2 py-2 space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-2 text-xl font-semibold text-gray-800">
      <Icon icon="mdi:account-outline" class="w-6 h-6 text-blue-600" />
      Doctor Profile
    </div>

    <!-- Sub Header -->
    <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
      <span class="text-blue-600 font-medium">Today, 4 Apr 2025</span>
      <span class="flex items-center gap-1">
        <Icon icon="mdi:tooth-outline" class="w-4 h-4" />
        Prosthodontists
      </span>
      <span class="flex items-center gap-1">
        <Icon icon="mdi:calendar" class="w-4 h-4" />
        Today, 08.00 - 11.00
      </span>
    </div>

    <!-- Doctor Profile Card -->
    <CardProfile />

    <!-- Main Section -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Patient Lists -->
      <div class="xl:col-span-2">
        <CardPatientList />
      </div>

      <!-- DF Card -->
      <div>
        <CardDF />
      </div>
    </div>
  </div>
</template>