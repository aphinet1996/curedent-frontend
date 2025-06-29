<script setup lang="ts">
definePageMeta({
    layout: 'manage'
})
import TablePayment from '~/components/manage/payment/TablePayment.vue'
import CardPaymentType from '~/components/manage/payment/CardPaymentType.vue'

</script>

<template>
    <div>
        <div class="flex gap-4">
            <!-- Left: Table -->
            <div class="w-3/4">
                <TablePayment />
            </div>

            <!-- Right: Card -->
            <div class="w-1/3">
                <CardPaymentType />
            </div>
        </div>
    </div>
</template>