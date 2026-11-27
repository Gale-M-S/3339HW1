<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  notice: { type: String, default: '' },
});
</script>

<template>
  <p v-if="error" class="feedback error" role="alert">{{ error }}</p>
  <p v-else-if="notice" class="feedback success" role="status">{{ notice }}</p>
  <p v-else-if="loading" class="feedback loading" role="status">Loading records…</p>
</template>
