<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b bg-gray-100">
        <h2 class="text-lg font-semibold text-blue-700">Student Category Page</h2>
        <button
            @click="goToIndexPage"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Back
        </button>
      </div>
      <div class="p-4" v-if="studentcategory">
        <h6 class="text-lg font-semibold text-blue-700">Name: <span class="text-black">{{ studentcategory.name }}</span>
        </h6>
        <h6 class="text-lg font-semibold text-blue-700">Max_Allow: <span class="text-black">{{
            studentcategory.max_allow
          }}</span></h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useStCategoryStore} from '~/stores/studentCategoryStore';

const route = useRoute();
const router = useRouter();
const store = useStCategoryStore();
const studentcategoryId = computed(() => Number(route.params.id));
const studentcategory = computed(() => store.studentcategories.find(studentcategory => studentcategory.id === studentcategoryId.value));

onMounted(() => {
  store.fetchById(studentcategoryId.value).catch((error) => {
    console.error('Error fetching student category:', error);
  });
});

const goToIndexPage = () => {
  router.push('/student_categories');
}
</script>
