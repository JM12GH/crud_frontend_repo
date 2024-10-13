<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b bg-gray-100">
        <h2 class="text-lg font-semibold text-blue-700">Author Page</h2>
        <button @click="goToIndexPage" class="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Back
        </button>
      </div>
      <div class="p-4" v-if="store.author">
        <h6 class="text-lg font-semibold text-blue-700">First Name: <span class="text-black">{{
            store.author.first_name
          }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Last Name: <span class="text-black">{{
            store.author.last_name
          }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Description: <span
            class="text-black">{{ store.author.description }}</span></h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useAuthorStore} from '@/stores/authorStore';

const route = useRoute();
const router = useRouter();
const store = useAuthorStore();
const authorId =  Number(route.params.id);


onMounted(async() => {
  store.fetchById(Number(authorId));
});

const goToIndexPage = () => {
  router.push('/authors');
}
</script>
  