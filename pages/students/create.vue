<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg overflow-hidden max-h-screen">
      <div class="flex items-center justify-between p-4 border-b h-16 bg-gray-100 text-black">
        <h2 class="text-lg font-semibold">Add New Student</h2>
        <button @click="goToIndexPage" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>
      </div>
      <div class="p-4 overflow-y-auto" style="max-height: calc(100vh - 10rem);">
        <div class="overflow-x-auto">

          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700">First Name</label>
              <input v-model="store.student.first_name" type="text" id="first-name"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input v-model="store.student.last_name" type="text" id="last-name"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
              <input v-model.number="store.student.year" type="text" id="year"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="store.student.email" type="email" id="email"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label for="is-approved" class="block text-sm font-medium text-gray-700">Is Approved</label>
              <select v-model="store.student.is_approved" id="is-approved"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>
            <div>
              <label for="branch" class="block text-sm font-medium text-gray-700">Branch</label>
              <select
                  v-model="store.student.branch!.id"
                  id="branch"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option v-for="branch in branchstore.branches" :key="branch.id" :value="branch.id">{{
                    branch.name
                  }}
                </option>
              </select>
            </div>
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <select
                  v-model="store.student.student_category!.id"
                  id="category"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option v-for="category in studentcategorystore.studentcategories" :key="category.id"
                        :value="category.id">{{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Books</label>
              <div class="mt-1 space-y-2 h-40 overflow-y-scroll">
                <div v-for="book in bookstore.books" :key="book.id" class="flex items-center">
                  <input
                      type="checkbox"
                      :id="'book' +book.id"
                      :value="book.id"
                      :checked="store.student.books.some(a => a.id === book.id)"
                      @change="handleChange($event, book, store)"

                      class="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                  <label :for="'book' + book.id" class="ml-2 text-sm text-gray-700">{{ book.title }}</label>
                </div>
              </div>
            </div>
            <div>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';
import {useStudentStore} from '~/stores/studentStore';
import {useBranchStore} from '~/stores/branchStore';
import {useStCategoryStore} from '~/stores/studentCategoryStore';
import {useBookStore} from '~/stores/bookStore';
import {handleChange} from '~/composables/handleBookChange';

const router = useRouter();
const store = useStudentStore();
const branchstore = useBranchStore();
const studentcategorystore = useStCategoryStore();
const bookstore = useBookStore();

const goToIndexPage = () => {
  router.push('/students');
}

async function submit() {
  await store.submit();
  await router.push('/students');
}

onMounted(async () => {
  store.resetStudent();
  await bookstore.fetchAll();
});
</script>
