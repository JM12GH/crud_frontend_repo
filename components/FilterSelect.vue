<template>
  <div>
    <select
        :value="props.modelValue"
        @change="handleChange"
        :id="props.id"
        :name="props.name"
        class="mt-1 block w-full pl-2 pr-3 py-1 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-md max-h-40 overflow-y-auto"
    >
      <option value="">{{ props.placeholder }}</option>
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from 'vue';

interface Option {
  value: number | string;
  text: string;
}

const props = defineProps<{
  modelValue?: string | number;
  options: Option[];
  id?: string;
  name?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null;
  if (target) {
    emit('update:modelValue', target.value);
  }
}
</script>
