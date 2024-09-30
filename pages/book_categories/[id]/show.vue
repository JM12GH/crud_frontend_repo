<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b bg-gray-100">
        <h2 class="text-lg font-semibold text-blue-700">Book Category Page</h2>
        <button
            @click="goToIndexPage"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Back
        </button>
      </div>
      <div class="p-4" v-if="bookcategory">
        <h6 class="text-lg font-semibold text-blue-700">Name: <span class="text-black">{{ bookcategory.name }}</span>
        </h6>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useBookCategoryStore} from '~/stores/bookCategoryStore';

const route = useRoute();
const router = useRouter();
const store = useBookCategoryStore();
const bookcategoryId = computed(() => Number(route.params.id));
const bookcategory = computed(() => store.bookcategories.find(bookcategory => bookcategory.id === bookcategoryId.value));

onMounted(() => {
  store.fetchById(bookcategoryId.value).catch((error) => {
    console.error('Error fetching book category:', error);
  });
});

const goToIndexPage = () => {
  router.push('/book_categories');
}
</script>
  