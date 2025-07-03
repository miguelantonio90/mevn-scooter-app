<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
    <div v-if="hasHeaderSlot" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <slot name="header"></slot>
    </div>
    <div class="p-6"> <!-- Default padding for card body -->
      <slot></slot>
    </div>
    <div v-if="hasFooterSlot" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
      <!-- Changed dark:bg-gray-800 to dark:bg-gray-700 for footer to differentiate slightly if needed -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { useSlots, computed } from 'vue';

const slots = useSlots();

// Check if the slots are provided
const hasHeaderSlot = computed(() => !!slots.header && slots.header().length > 0);
const hasFooterSlot = computed(() => !!slots.footer && slots.footer().length > 0);

</script>

<style scoped>
/* Scoped styles for BaseCard if any specific are needed */
/* For example, if you want all card bodies to have a minimum height or specific flex properties not covered by Tailwind directly */
</style>
