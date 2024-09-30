<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg w-full max-w-full mx-0">
      <div class="flex items-center justify-between p-4 border-b h-14 bg-gray-200 text-black">
        <h2 class="text-lg font-semibold">Branch List</h2>
        <button
            @click="goToCreatePage"
            class="bg-blue-600 hover:bg-blue-800 text-white px-2 py-1 rounded text-md">
          Add Branch
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
          <tr v-for="branch in store.branches" :key="branch.id">
            <td class="px-3 py-2 border-b border-gray-200">{{ branch.id }}</td>
            <td class="px-3 py-2 border-b border-gray-200">{{ branch.name }}</td>

            <td class="px-3 py-2 border-b border-gray-200">
              <button @click="goToShowPage(branch.id!)"
                      class="bg-blue-300 hover:bg-blue-400 text-white px-1 py-0.5 rounded text-xs mr-1">View
              </button>
              <button @click="goToEditPage(branch.id!)"
                      class="bg-blue-700 hover:bg-blue-800 text-white px-1 py-0.5 rounded text-xs mr-1">Edit
              </button>
              <button @click="confirmDelete(branch.id!, 'branch')"
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
        @clear="store.clearNotification"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useBranchStore} from '~/stores/branchStore';
import Pagination from '~/components/Pagination.vue';
import ConfirmationPopup from '~/components/ConfirmationPopup.vue';
import Notification from '~/components/Notification.vue';
import {useDeletePopup} from '~/composables/useDeletePopup';

const store = useBranchStore();
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
  console.log(store.pagination);
});

const goToCreatePage = () => {
  router.push('/branches/create');
};

const goToShowPage = (id: number) => {
  router.push(`/branches/${id}/show`);
};

const goToEditPage = (id: number) => {
  router.push(`/branches/${id}/edit`);
};

const updatePage = (page: number) => store.updatePage(page);
</script>
