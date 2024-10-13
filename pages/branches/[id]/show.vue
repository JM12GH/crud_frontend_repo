<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b bg-gray-100">
        <h2 class="text-lg font-semibold text-blue-700">Branch Page</h2>
        <button
            @click="goToIndexPage"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg">
          Back
        </button>
      </div>
      <div class="p-4" v-if="store.branch">
        <h6 class="text-lg font-semibold text-blue-700">The branch with id {{ store.branch.id }} name is: <span
            class="text-black">{{ store.branch.name }}</span></h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useBranchStore} from '@/stores/branchStore';

const route = useRoute();
const router = useRouter();
const store = useBranchStore();
const branchId = Number(route.params.id);


onMounted(async () => {
  await store.fetchById(Number(branchId))
});

const goToIndexPage = () => {
  router.push('/branches');
}
</script>
