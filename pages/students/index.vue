<template>
  <div class="container mx-auto p-0">
    <div class="bg-white shadow-md rounded-lg w-full max-w-full mx-0">
      <div class="flex items-center justify-between p-4 border-b h-12 bg-gray-200 text-black">
        <h2 class="text-md font-semibold">Student List</h2>
        <button
            @click="goToCreatePage"
            class="bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded text-md">
          Add New Student
        </button>
      </div>
      <div class=" overflow-y-auto" style="max-width: calc(100vw - 2rem);">
        <div class="p-0 m-1 border-b bg-gray-500 flex rounded-lg items-center justify-between">
          <h3 class="text-white m-2 text-xs">Filter by</h3>
          <div :class="{'flex': filterSection, 'hidden': !filterSection}" class="space-x-4 items-center">
            <FilterSelect
                v-model="store.selectedBranch"
                :options="branchstore.branches.map(branch => ({
              value: branch.id ?? '',
              text: branch.name
            }))"
                id="branch"
                name="branch"
                placeholder="All Branches"/>
            <FilterSelect
                v-model="store.selectedCategory"
                :options="studentcategorystore.studentcategories.map(category => ({
              value: category.id ?? '',
              text: category.name
            }))"
                id="category"
                name="category"
                placeholder="All Categories"/>
            <FilterSelect
                v-model="store.selectedYear"
                :options="yearstore.years.map(year => ({ value: year, text: year.toString() }))"
                id="year"
                name="year"
                placeholder="All Years"/>
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
              <th class="px-1 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                ID
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                First Name
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Last Name
              </th>
              <th class="px-1 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Year
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Email
              </th>
              <th class="px-1 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Approved
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Branch
              </th>
              <th class="px-2 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Category
              </th>
              <th class="px-3 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Books
              </th>
              <th class="px-5 py-2 border-b-2 border-gray-200 bg-white text-left text-[10px] font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="student in store.students" :key="student.id">
              <td class="px-1 py-2 border-b border-gray-200 text-[10px]">{{ student.id }}</td>
              <td class="px-2 py-2 border-b border-gray-200 text-[10px]">{{ student.first_name }}</td>
              <td class="px-2 py-2 border-b border-gray-200 text-[10px]">{{ student.last_name }}</td>
              <td class="px-1 py-2 border-b border-gray-200 text-[10px]">{{ student.year }}</td>
              <td class="px-2 py-2 border-b border-gray-200 text-[10px]">{{ student.email }}</td>
              <td class="px-1 py-2 border-b border-gray-200 text-[10px]">{{ student.is_approved ? 'Yes' : 'No' }}</td>
              <td class="px-2 py-2 border-b border-gray-200 text-[10px]">{{ student.branch?.name }}</td>
              <td class="px-2 py-2 border-b border-gray-200 text-[10px]">{{ student.student_category?.name }}</td>
              <td class="px-3 py-2 border-b border-gray-200 text-[10px]">
                <div class="flex flex-col space-y-1">
                  <div v-for="(group, index) in chunk(student.books || [], 1)" :key="index">
                    <span>{{ group.map(book => book.title).join(' , ') }}</span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-2 border-b border-gray-200">
                <button @click="goToShowPage(student.id!)"
                        class="bg-blue-300 hover:bg-blue-400 text-white px-1 py-0.5 rounded text-xs mr-1">View
                </button>
                <button @click="goToEditPage(student.id!)"
                        class="bg-blue-700 hover:bg-blue-800 text-white px-1 py-0.5 rounded text-xs mr-1">Edit
                </button>
                <button @click="confirmDelete(student.id!, 'student')"
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

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useStudentStore} from '~/stores/studentStore';
import Pagination from '~/components/Pagination.vue';
import ConfirmationPopup from '~/components/ConfirmationPopup.vue';
import Notification from '~/components/Notification.vue';
import FilterSelect from '~/components/FilterSelect.vue';
import {useDeletePopup} from '~/composables/useDeletePopup';
import {useBranchStore} from '~/stores/branchStore';
import {useStCategoryStore} from '~/stores/studentCategoryStore';
import {useYearsStore} from '~/stores/yearsStore';
import {chunk} from '~/utils/chunk';

const store = useStudentStore();
const branchstore = useBranchStore();
const studentcategorystore = useStCategoryStore();
const yearstore = useYearsStore();
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
  router.push('/students/create');
};
const goToShowPage = (id: number) => {
  router.push(`/students/${id}/show`);
};
const goToEditPage = (id: number) => {
  router.push(`/students/${id}/edit`);
};


const updatePage = (page: number) => store.updatePage(page);
const toggleFilters = () => {
  filterSection.value = !filterSection.value;
}
onMounted(async () => {
  await branchstore.fetchAll();
  await studentcategorystore.fetchAll();
  await yearstore.fetch();
  await store.fetch();
});

watch(
    [
      () => store.selectedBranch,
      () => store.selectedCategory,
      () => store.selectedYear
    ],
    () => {
      store.fetch(1);
    }
);

</script>


