<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '~/stores/auth';
import type { LoginCredentials } from '~/types/auth';
import { useRouter } from 'nuxt/app';

const authStore = useAuthStore();
const router = useRouter();
const showPassword = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const credentials = ref<LoginCredentials>({
  emailOrUsername: '',
  password: '',
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    await authStore.login(credentials.value);
    router.push('/dashboard');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = () => {
  console.log('Google Sign-In clicked');
};
</script>
<template>
  <div>
    <form @submit.prevent="handleLogin">
      <div class="relative mb-4">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Icon icon="mdi:email" class="w-5 h-5" />
        </span>
        <input
          v-model="credentials.emailOrUsername"
          type="text"
          class="w-full bg-gray-100 border border-gray-300 rounded pl-10 pr-3 py-3.5 focus:outline-none focus:ring focus:ring-blue-300"
          :placeholder="$t('login.email_placeholder')"
          required
        />
      </div>

      <div class="relative mb-4">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Icon icon="mdi:lock" class="w-5 h-5" />
        </span>
        <input
          v-model="credentials.password"
          :type="showPassword ? 'text' : 'password'"
          class="w-full bg-gray-100 border border-gray-300 rounded pl-10 pr-10 py-3.5 focus:outline-none focus:ring focus:ring-blue-300"
          :placeholder="$t('login.password_placeholder')"
          required
        />
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          @click="togglePassword"
        >
          <Icon v-if="showPassword" icon="mdi:eye-off" class="w-5 h-5" />
          <Icon v-else icon="mdi:eye" class="w-5 h-5" />
        </button>
      </div>

      <div v-if="error" class="text-red-500 mb-4 text-center">
        {{ error }}
      </div>

      <div class="flex justify-end mb-6">
        <NuxtLink to="/forgot" class="text-gray-400 hover:underline">
          {{ $t('login.forgot_password') }}
        </NuxtLink>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-3 rounded mb-4 hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {{ loading ? $t('login.login_button') : $t('login.login_button') }}
      </button>
    </form>

    <div class="flex flex-row justify-center mb-4">
      <span>{{ $t('login.signup_prompt') }}</span>
      <NuxtLink to="/signup" class="ml-2">
        <span class="text-blue-500">{{ $t('signup.signup_button') }}</span>
      </NuxtLink>
    </div>

    <button
      class="w-full border border-gray-300 py-2 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
      @click="handleGoogleSignIn"
    >
      <Icon icon="devicon:google" class="w-5 h-5 mr-2" />
      {{ $t('login.google_signin') }}
    </button>
  </div>
</template>