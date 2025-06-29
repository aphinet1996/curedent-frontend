<script setup lang="ts">
import TableSort from '~/components/TableSort.vue'

const columns = [
    { label: 'Date', key: 'date', width: '50px' },
    { label: 'Time', key: 'time', width: '50px' },
    { label: 'Action', key: 'action', width: '180px', wrap: true },
    { label: 'Patient HN', key: 'patientHN', width: '100px' },
    { label: 'Edit by', key: 'editBy', width: '80px' },
    { label: '', key: '', type: 'icon' as const, icon: 'mdi:trash-can-outline', width: '10px' }
]

const data = [
    { date: '06/08/2023', time: '11.38 AM', action: 'Add new patient', patientHN: 'HN #1123213124', editBy: 'Admin 1' },
    { date: '06/08/2023', time: '11.32 AM', action: 'Edit patient appointment', patientHN: 'HN #1123213124', editBy: 'Admin 1' },
]
</script>

<template>
    <TableSort :columns="columns" :rows="data" />
</template>