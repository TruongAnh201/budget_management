<template>
  <component :is="contextHolder" />
</template>

<script setup>
import { notification } from 'ant-design-vue';

const [api, contextHolder] = notification.useNotification();

// Cho phép emit cho các component khác dùng
defineExpose({
  notify: (options) => {
    const { type = 'info', placement = 'bottomRight', message = 'Thông báo', description, duration=2 } = options;
    api[type]({
      message,
      description,
      placement,
      duration
    });
  }
});
</script>
