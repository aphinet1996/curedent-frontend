<script setup lang="ts">
definePageMeta({
    layout: 'manage'
})
import CardDiagnosis from '~/components/manage/dxtx/CardDiagnosis.vue'
import CardTreatment from '~/components/manage/dxtx/CardTreatment.vue'
</script>

<template>
    <div>
        <div class="flex gap-4">
            <div class="w-1/2">
                <CardDiagnosis />
            </div>

            <div class="w-1/2">
                <CardTreatment />
            </div>
        </div>
    </div>
</template>