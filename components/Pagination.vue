<template>
  <div v-if="pagination.last_page > 1" class="flex justify-center mt-4">
    <ul class="inline-flex items-center -space-x-px">
      <li>
        <button
            aria-label="Previous page"
            @click="$emit('updatePage', pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        > ←
        </button>
      </li>
      <li v-for="page in pages" :key="page">
        <button
            aria-label="'Page ' + page"
            @click="$emit('updatePage', page)"
            :class="{
            'px-3 py-2 leading-tight text-blue-600 border border-gray-300 bg-blue-100 hover:bg-blue-100 hover:text-blue-700': page === pagination.current_page,
            'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700': page !== pagination.current_page
           }">
          {{ page }}
        </button>
      </li>
      <li>
        <button
            aria-label="Next page"
            @click="$emit('updatePage', pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >→
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps} from 'vue';

interface Pagination {
  current_page: number;
  last_page: number;
}

const props = defineProps<{
  pagination: Pagination;
}>();

const pages = computed(() => {
  const range = 2;
  let startPage = Math.max(props.pagination.current_page - range, 1);
  let endPage = Math.min(props.pagination.current_page + range, props.pagination.last_page);

  if (endPage - startPage < range * 2) {
    startPage = Math.max(endPage - range * 2, 1);
    endPage = Math.min(startPage + range * 2, props.pagination.last_page);
  }

  return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
});
</script>