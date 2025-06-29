<script setup>
import Alert from '~/components/Alert.vue';
const { isMobile } = useDeviceDetection()
</script>
<template>
  <div>
    <!-- <NuxtLayout>
      <NuxtPage />
    </NuxtLayout> -->
    <MobileWarningPage v-if="isMobile" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
    <Alert />
  </div>
</template>
