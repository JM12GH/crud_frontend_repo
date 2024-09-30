<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg w-full max-w-full mx-0">
      <div class="flex items-center justify-between p-4 border-b h-12 bg-gray-200 text-black">
        <h2 class="text-md font-semibold">Book List</h2>
        <button
            @click="goToCreatePage"
            class="bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded text-md">
          Add New Book
        </button>
      </div>
      <div class="overflow-y-auto" style="max-width: calc(100vw - 2rem);">
        <div class=" m-1 border-b bg-gray-500 flex rounded-lg items-center justify-between">
          <div class="flex items-center space-x-2">
            <h3 class="text-white m-2 text-xs">Filter by:</h3>
            <div :class="{'flex': filterSection, 'hidden': !filterSection}" class="space-x-4 items-center">
              <FilterSelect
                  v-if="filterSection"
                  v-model="store.selectedCategory"
                  :options="bookcategorystore.bookcategories.map((category: BookCategory) => ({
                  value: category.id ?? '', 
                  text: category.name 
                }))"
                  id="category"
                  name="category"
                  placeholder="All Categories"/>
            </div>
          </div>
          <button
              id="toggleFilterBtn"
              @click="toggleFilters"
              class="text-white px-2 py-1 m-2 underline text-xs">
            {{ filterSection ? '- Hide Filters' : '+ Show Filters' }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full leading-normal border-collapse text-xs">
            <thead>
            <tr>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                ID
              </th>
              <th class="px-3 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Title
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Description
              </th>
              <th class="px-1 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Shelf_No
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Photo
              </th>
              <th class="px-1 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                No_Copies
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Category
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Authors
              </th>
              <th class="px-5 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="book in store.books" :key="book.id">
              <td class="px-1 py-2 border-b border-gray-200 text-[10px]">{{ book.id }}</td>
              <td class="px-2 py-2 border-b border-gray-200 text-[10px]">{{ book.title }}</td>
              <td class="px-2 py-2 border-b border-gray-200 text-[10px]">{{ book.description }}</td>
              <td class="px-1 py-2 border-b border-gray-200 text-[10px]">{{ book.shelf_number }}</td>
              <td class="px-2 py-2 border-b border-gray-200 text-[10px]">
                <div v-if="book.preview_photo">
                  <img :src="`http://localhost:8000/storage/${book.preview_photo}`" :alt="book.title" width="50"/>
                </div>
                <div v-else>N/A</div>
              </td>
              <td class="px-1 py-2 border-b border-gray-200 text-[10px]">{{ book.total_nr_of_copies }}</td>
              <td class="px-1 py-2 border-b border-gray-200 text-[10px]">{{ book.book_category?.name }}</td>
              <td class="px-1 py-2 border-b border-gray-200 text-[10px]">
                <div v-for="(authorGroup, index) in chunk(book.authors,1)" :key="index">
                    <span v-for="(author, authorIndex) in authorGroup" :key="author.id">
                      {{ author.first_name }} {{ author.last_name }}
                      <span v-if="authorIndex < authorGroup.length - 1"> , </span>
                    </span>
                </div>
              </td>
              <td class="px-7 py-2 border-b border-gray-200">
                <button @click="goToShowPage(book.id!)"
                        class="bg-blue-300 hover:bg-blue-400 text-white px-1 py-0.5 rounded text-xs mr-1">View
                </button>
                <button @click="goToEditPage(book.id!)"
                        class="bg-blue-700 hover:bg-blue-800 text-white px-1 py-0.5 rounded text-xs mr-1">Edit
                </button>
                <button @click="confirmDelete(book.id!, 'student')"
                        class="bg-red-700 hover:bg-red-800 text-white px-1 py-0.5 rounded text-xs">Delete
                </button>
              </td>
            </tr>
            </tbody>
          </table>
          <Pagination
              class="mb-4"
              v-if="store.pagination"
              :pagination="store.pagination"
              @updatePage="updatePage"/>
        </div>
      </div>
      <ConfirmationPopup
          :isVisible="isPopupVisible"
          :dataType="popupDataType"
          :recordId="popupRecordId"
          @confirm="() => handleDelete(store)"
          @cancel="closePopup"/>

      <Notification
          :success="!store.isNotificationError ? store.notificationMessage : null"
          :errors="[store.isNotificationError ? store.notificationMessage : null]"
          @clear="store.clearNotification"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useBookStore} from '~/stores/bookStore';
import Pagination from '~/components/Pagination.vue';
import ConfirmationPopup from '~/components/ConfirmationPopup.vue';
import Notification from '~/components/Notification.vue';
import FilterSelect from '~/components/FilterSelect.vue';
import {useDeletePopup} from '~/composables/useDeletePopup';
import {useBookCategoryStore} from '~/stores/bookCategoryStore';
import {chunk} from '~/utils/chunk';

const store = useBookStore();
const bookcategorystore = useBookCategoryStore();
const router = useRouter();
const filterSection = ref<boolean>(false);

const {
  isPopupVisible,
  popupDataType,
  popupRecordId,
  confirmDelete,
  handleDelete,
  closePopup
} = useDeletePopup();


const goToCreatePage = () => {
  router.push('/books/create');
};
const goToShowPage = (id: number) => {
  router.push(`/books/${id}/show`);
};
const goToEditPage = (id: number) => {
  router.push(`/books/${id}/edit`);
};

const updatePage = (page: number) => store.updatePage(page);
const toggleFilters = () => {
  filterSection.value = !filterSection.value;
}
onMounted(async () => {
  await bookcategorystore.fetchAll();
  await store.fetch();

});

watch([() => store.selectedCategory,],
    () => {
      store.fetch(1);
    }
);
</script>
  
  
  
  