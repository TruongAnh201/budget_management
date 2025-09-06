<template>
    <a-modal
      v-model:open=modelValue
      :title="title"
      @ok="handleOk"
      @cancel="handleCancel"
      :okText="okText"
      :cancelText="cancelText"
    >
      <!-- Nội dung truyền vào qua slot -->
      <slot />
    </a-modal>
  </template>

  <script setup>
  defineProps({
    modelValue: Boolean, // để v-model dùng bên ngoài
    title: {
      type: String,
      default: 'Modal Title',
    },
    okText: {
      type: String,
      default: 'OK',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
  });

  const emit = defineEmits(['update:modelValue', 'ok', 'cancel']);

  const handleOk = () => {
    emit('ok');
  };

  const handleCancel = () => {
    emit('update:modelValue', false);
    emit('cancel');
  };
  </script>