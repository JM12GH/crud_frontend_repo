<template>
  <div v-if="message" class="fixed bottom-5 right-5 p-3 z-50 w-96">
    <div
        :class="['alert', notificationClass, 'p-6', 'rounded-lg', 'shadow-lg', 'flex', 'items-center', 'justify-between']"
        role="alert">
      <div>
        <ul v-if="isError" class="mb-0 space-y-2 text-sm">
          <li v-for="(error, index) in filteredErrors" :key="index">{{ error }}</li>
        </ul>
        <span v-else class="text-sm">{{ success }}</span>
      </div>
      <button type="button" class="ml-4 p-2 text-black" @click="clearNotification" aria-label="Close">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, defineEmits} from 'vue';

interface NotificationProps {
  success?: string | null;
  errors: (string | null)[];
}

const props = defineProps<NotificationProps>();
const emit = defineEmits<{ (event: 'clear'): void; }>();
const message = computed(() => {
  return props.success ?? (filteredErrors.value.length > 0 ? 'Error occurred' : '')
});
const isError = computed(() => filteredErrors.value.length > 0);
const notificationClass = computed(() => isError.value ? 'bg-red-300 text-black' : 'bg-green-300 text-black');
const filteredErrors = computed(() => props.errors.filter((error): error is string => error !== null));
const clearNotification = () => {
  emit('clear');
}
</script>
