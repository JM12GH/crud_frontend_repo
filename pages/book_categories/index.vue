<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg w-full max-w-full mx-0">
      <!-- Card Header -->
      <div class="flex items-center justify-between p-4 border-b h-14 bg-gray-200 text-black">
        <h2 class="text-lg font-semibold">Book Category List</h2>
        <button
            @click="goToCreatePage"
            class="bg-blue-600 hover:bg-blue-800 text-white px-2 py-1 rounded text-md">
          Add Category
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full leading-normal border-collapse text-xs">
          <thead>
          <tr>
            <th class="px-3 py-2 border-b-2 border-gray-200 bg-white text-left font-semibold uppercase tracking-wider">
              ID
            </th>
            <th class="px-3 py-2 border-b-2 border-gray-200 bg-white text-left font-semibold uppercase tracking-wider">
              Name
            </th>
            <th class="px-3 py-2 border-b-2 border-gray-200 bg-white text-left font-semibold uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="bookcategory in store.bookcategories" :key="bookcategory.id">
            <td class="px-3 py-2 border-b border-gray-200">{{ bookcategory.id }}</td>
            <td class="px-3 py-2 border-b border-gray-200">{{ bookcategory.name }}</td>
            <td class="px-3 py-2 border-b border-gray-200">
              <button @click="goToShowPage(bookcategory.id!)"
                      class="bg-blue-300 hover:bg-blue-400 text-white px-1 py-0.5 rounded text-xs mr-1">View
              </button>
              <button @click="goToEditPage(bookcategory.id!)"
                      class="bg-blue-700 hover:bg-blue-800 text-white px-1 py-0.5 rounded text-xs mr-1">Edit
              </button>
              <button @click="confirmDelete(bookcategory.id!, 'author')"
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
        @cancel="closePopup"
    />

    <Notification
        :success="!store.isNotificationError ? store.notificationMessage : null"
        :errors="[store.isNotificationError ? store.notificationMessage : null]"
        @clear="store.clearNotification"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useBookCategoryStore} from '~/stores/bookCategoryStore';
import Pagination from '~/components/Pagination.vue';
import ConfirmationPopup from '~/components/ConfirmationPopup.vue';
import Notification from '~/components/Notification.vue';
import {useDeletePopup} from '~/composables/useDeletePopup';

const store = useBookCategoryStore();
const router = useRouter();
const {
  isPopupVisible,
  popupDataType,
  popupRecordId,
  confirmDelete,
  handleDelete,
  closePopup
} = useDeletePopup();


onMounted(async () => {
  await store.fetch();

});

const goToCreatePage = () => {
  router.push('/book_categories/create');
};

const goToShowPage = (id: number) => {
  router.push(`/book_categories/${id}/show`);
};

const goToEditPage = (id: number) => {
  router.push(`/book_categories/${id}/edit`);
};

const updatePage = (page: number) => store.updatePage(page);
</script>
