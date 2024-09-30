<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
      <div class="flex justify-between items-center border-b pb-2">
        <h2 class="text-xl font-semibold">{{ title }}</h2>
        <button @click="cancel" class="text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <p class="mt-4 text-sm text-gray-700">{{ message }}</p>
      <div class="mt-6 flex justify-end space-x-2">
        <button
            @click="cancel"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded text-sm">
          Cancel
        </button>
        <button
            @click="confirm"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';

interface Props {
  isVisible: boolean;
  dataType: string;
  recordId: number | null;
}

interface Emits {
  (event: 'confirm'): void;

  (event: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const title = ref<string>('Confirm Delete');
const message = ref<string>('');

watch([() => props.dataType, () => props.recordId], ([newType, newId]) => {
  if (newId !== null) {
    message.value = `Are you sure you want to delete this ${newType} with ID ${newId}?`;
  } else {
    message.value = `Are you sure you want to delete this ${newType}?`;
  }
});

const confirm = () => {
  if (props.recordId !== null) {
    emit('confirm');
  }
}

const cancel = () => {
  emit('cancel');
}
</script>
