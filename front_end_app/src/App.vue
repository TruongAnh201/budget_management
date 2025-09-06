<template>
  <router-view />
  <NotificationProvider ref="notifier" />
</template>
<script setup>
import NotificationProvider from '@/components/Notification.vue';
import { ref, onMounted } from 'vue';

const notifier = ref();

onMounted(() => {
  // Đăng ký global nếu muốn
  // Object.assign(notifier.value.notify);
  window.$notify = notifier.value.notify;
});
</script>
<style>
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>