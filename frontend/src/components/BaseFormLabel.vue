<template>
  <label :for="forInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    <slot></slot>
  </label>
</template>

<script setup>
defineProps({
  forInput: String,
});
</script>
