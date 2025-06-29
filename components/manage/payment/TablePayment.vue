<script setup lang="ts">
import TableSort from '~/components/TableSort.vue'

const columns = [
    { label: 'Date', key: 'date' },
    { label: 'Time', key: 'time' },
    { label: 'Action', key: 'action' },
    { label: 'Price', key: 'price' },
    { label: 'DF', key: 'df' },
    { label: 'Patient HN', key: 'patientHN' }
]

const data = [
    { date: '06/08/2023', time: '11.38 AM', action: 'Installement 6', price: '10,000.-', df: '10,000.-', patientHN: 'HN #1123213124' },
    { date: '06/08/2023', time: '11.38 AM', action: 'Buy Toothbrush (Blue)', price: '150.-', df: '150.-', patientHN: 'HN #1123213124' },
    { date: '06/08/2023', time: '11.38 AM', action: 'Buy Toothbrush (Blue)', price: '150.-', df: '150.-', patientHN: 'HN #1123213124' },
    { date: '06/08/2023', time: '11.38 AM', action: 'Buy Toothbrush (Blue)', price: '150.-', df: '150.-', patientHN: 'HN #1123213124' },
    { date: '06/08/2023', time: '11.38 AM', action: 'Installement 3', price: '20,000.-', df: '20,000.-', patientHN: 'HN #1123213124' },
    { date: '06/08/2023', time: '11.38 AM', action: 'Credit card', price: '30,000.-', df: '30,000.-', patientHN: 'HN #1123213124' },
    { date: '06/08/2023', time: '11.38 AM', action: 'Credit card', price: '15,000.-', df: '15,000.-', patientHN: 'HN #1123213124' },
    { date: '06/08/2023', time: '11.38 AM', action: 'Cash', price: '9,000.-', df: '9,000.-', patientHN: 'HN #1123213124' },
]
</script>

<template>
    <TableSort :columns="columns" :rows="data" />
</template>