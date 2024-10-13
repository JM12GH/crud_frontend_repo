<template>
  <div class="container mx-auto p-4">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b bg-gray-100">
        <h2 class="text-lg font-semibold text-blue-700">Book Page</h2>
        <button
            @click="goToIndexPage"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Back
        </button>
      </div>
      <div class="p-4" v-if="book">
        <h6 class="text-lg font-semibold text-blue-700">Title: <span class="text-black">{{ book.title }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Description: <span class="text-black">{{
            book.description
          }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Shelf_No: <span class="text-black">{{
            book.shelf_number
          }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Photo:
          <span v-if="book.preview_photo" class="text-black">
              <img :src="`http://localhost:8000/storage/${book.preview_photo}`" :alt="book.title" width="100"
                   class="mt-2"/>
              </span><span v-else class="text-black">N/A</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Category: <span
            class="text-black">{{ book.book_category?.name || 'N/A' }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Authors:
          <span class="text-black">
              <template v-if="book.authors && book.authors.length > 0">
              <span v-for="(author, index) in book.authors" :key="author.id">
             {{ author.first_name }} {{ author.last_name }}
             <span v-if="index < book.authors.length - 1">, </span></span>
             </template><span v-else>N/A</span>
             </span>
        </h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useBookStore} from '~/stores/bookStore';

const route = useRoute();
const router = useRouter();
const store = useBookStore();

const bookId = Number(route.params.id);
store.currentId = bookId;

const book = computed(() => store.book);
onMounted(() => {
  if (!store.book.id || store.currentId !== store.book.id) {
    store.fetchById(bookId).catch((error) => {
      console.error('Error fetching book:', error);
    });
  }
});

const goToIndexPage = () => {
  router.push('/books');
};
</script>
  