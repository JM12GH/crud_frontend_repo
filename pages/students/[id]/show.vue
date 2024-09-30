<template>
  <div class="container mx-auto p-4">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b bg-gray-100">
        <h2 class="text-lg font-semibold text-blue-700">Student Page</h2>
        <button
            @click="goToIndexPage"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Back
        </button>
      </div>

      <div class="p-4" v-if="student">
        <h6 class="text-lg font-semibold text-blue-700">Name: <span class="text-black">{{
            student.first_name
          }} {{ student.last_name }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Email: <span class="text-black">{{ student.email }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Year: <span class="text-black">{{ student.year }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Approved: <span
            class="text-black">{{ student.is_approved ? 'Yes' : 'No' }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Category: <span
            class="text-black">{{ student.student_category?.name || 'N/A' }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Branch: <span
            class="text-black">{{ student.branch?.name || 'N/A' }}</span></h6>
        <h6 class="text-lg font-semibold text-blue-700">Books:</h6>
        <ul class="text-black">
          <li v-for="book in student.books" :key="book.title">{{ book.title }}</li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useStudentStore} from '~/stores/studentStore';

const route = useRoute();
const router = useRouter();
const store = useStudentStore();

const studentId = Number(route.params.id);
store.currentId = studentId;
const student = computed(() => store.student);

onMounted(() => {
  if (!store.student.id || store.currentId !== store.student.id) {
    store.fetchById(studentId).catch((error) => {
      console.error('Error fetching student:', error);
    });
  }
});

const goToIndexPage = () => {
  router.push('/students');
};
</script>
