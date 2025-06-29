<template>
    <div>
        <p class="mb-4 text-gray-400 text-sm">
            {{ $t('forgot.instruction') }}
        </p>

        <div class="relative mb-4">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Icon icon="mdi:email" class="w-5 h-5" />
            </span>
            <input type="text"
                class="w-full bg-gray-100 border border-gray-300 rounded pl-10 pr-3 py-3.5 focus:outline-none focus:ring focus:ring-blue-300"
                :placeholder="$t('forgot.email_placeholder')" />
        </div>

        <p class="mb-4 text-gray-400 text-sm">
            {{ $t('forgot.forgot_promt') }}
        </p>

        <button class="w-full bg-blue-600 text-white py-3 rounded mb-4 hover:bg-blue-700 transition-colors">
            {{ $t('login.login_button') }}
        </button>

        <button
            class="w-full border border-gray-300 py-2 rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Icon icon="devicon:google" class="w-5 h-5 mr-2" />
            {{ $t('login.google_signin') }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const showPassword = ref(false)
function togglePassword() {
    showPassword.value = !showPassword.value
}
</script>