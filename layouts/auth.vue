<script setup lang="ts">
import DropdownLanguage from '~/components/DropdownLanguage.vue'
</script>
<template>
    <div class="relative w-full h-screen bg-no-repeat bg-cover bg-center"
        style="background-image: url('/login-bg.png')">
        <div class="absolute top-4 right-4">
            <DropdownLanguage />
        </div>

        <div class="flex flex-col items-center justify-center h-full space-y-10">
            <img src="/logo.png" alt="CUREDENT Logo" class="h-14 object-contain" />
            <div class="bg-white w-full max-w-md p-8">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>