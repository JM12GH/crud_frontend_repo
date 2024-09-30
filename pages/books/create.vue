<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg overflow-hidden max-h-screen">
      <div class="flex items-center justify-between p-4 border-b h-16 bg-gray-100 text-black">
        <h2 class="text-lg font-semibold">Add New Book</h2>
        <button @click="goToIndexPage" class="bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>
      </div>
      <div class="p-4 overflow-y-auto" style="max-height: calc(100vh - 10rem);">
        <div class="overflow-x-auto">
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input v-model="store.book.title" type="text" id="title"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="store.book.description"
                        class="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        id="description" name="description"></textarea>
            </div>
            <div>
              <label for="shelf_number" class="block text-sm font-medium text-gray-700">Shelf Number</label>
              <input v-model="store.book.shelf_number" type="text" id="shelf_number"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label for="preview_photo" class="block text-sm font-medium text-gray-700">Preview Photo</label>
              <input type="file" id="preview_photo"
                     class="mt-1 block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                     @change="(event) => handleFileChange(event, store)"/>
            </div>
            <div>
              <label for="total_nr_of_copies" class="block text-sm font-medium text-gray-700">Total Number of
                Copies</label>
              <input v-model="store.book.total_nr_of_copies" type="number" id="total_nr_of_copies"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <div>
              <label for="book_category_id" class="block text-sm font-medium text-gray-700">Category</label>
              <select v-model="store.book.book_category.id" id="book_category_id"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option v-for="category in categorystore.bookcategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Authors</label>
              <div class="mt-1 space-y-2 h-40 overflow-y-scroll">
                <div v-for="author in authorstore.authors" :key="author.id" class="flex items-center">
                  <input
                      type="checkbox"
                      :id="'author' + author.id"
                      :value="author.id"
                      :checked="store.book.authors.some(a => a.id === author.id)"
                      @change="(event) => handleAuthorChange(event, author, store)"
                      class="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                  <label :for="'author' + author.id" class="ml-2 text-sm text-gray-700">
                    {{ author.first_name }} {{ author.last_name }}
                  </label>
                </div>
              </div>
            </div>
            <div>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-3">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';
import {useBookStore} from '~/stores/bookStore';
import {useAuthorStore} from '~/stores/authorStore';
import {useBookCategoryStore} from '~/stores/bookCategoryStore';
import {handleFileChange} from '~/composables/handleChange';
import {handleAuthorChange} from '~/composables/handleChange';

const router = useRouter();
const store = useBookStore();
const authorstore = useAuthorStore();
const categorystore = useBookCategoryStore();

onMounted(async () => {
  await authorstore.fetchAll();
  await categorystore.fetchAll();
});

const goToIndexPage = () => {
  router.push('/books');
}
const submit = async () => {
  await store.submit();
  await router.push('/books');
}

onMounted(async () => {
  store.resetBook();
});
</script>