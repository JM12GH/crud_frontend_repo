<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg overflow-hidden max-h-screen">
      <div class="flex items-center justify-between p-4 border-b h-16 bg-gray-100 text-black">
        <h2 class="text-lg font-semibold">Add New Branch</h2>
        <button
            @click="goToIndexPage"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg">Back
        </button>
      </div>
      <div class="p-4 overflow-y-auto" style="max-height: calc(100vh - 10rem);">
        <div class="overflow-x-auto">
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input v-model="store.branch.name" type="text" id="name"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Submit</button>
          </form>
        </div>
      </div>
    </div>
    <Notification
        :success="!store.isNotificationError ? store.notificationMessage : ''"
        :errors="store.isNotificationError ? [store.notificationMessage] : []"
        @clear="clearNotification"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useBranchStore} from '@/stores/branchStore';

const route = useRoute();
const router = useRouter();
const store = useBranchStore();

onMounted(async () => {
  const id = parseInt(route.params.id as string);
  if (id) {
    await store.fetchById(id);
  }
});

const goToIndexPage = () => {
  router.push('/branches');
};

const submit = async () => {
  await store.submit();
  await router.push('/branches');
};
const clearNotification = () => store.clearNotification();
onMounted(async () => {
  store.resetBranch();
});
</script>