<template>
  <div class="flex flex-col h-screen bg-white">
    <header class="w-full h-14 bg-navColor text-white flex items-center justify-between px-4">
      <h1 class="text-xl font-semibold">DASHBOARD</h1>
      <button @click="toggleSidebar" class="block lg:hidden text-white p-2">
        <Icon name="mdi:menu"/>
      </button>
    </header>
    <div class="flex flex-1">
      <aside
          :class="{'hidden': !isSidebarVisible, 'lg:block': true}"
          class="w-40 bg-sideColor text-white flex flex-col fixed lg:relative lg:w-40 lg:top-0 top-14 lg:bottom-0 bottom-0 transition-transform lg:transition-none">
        <nav class="flex-grow mt-2">
          <ul>
            <li class="px-2 py-4 hover:bg-gray-700 text-[14px]">
              <NuxtLink to="/students" class="flex items-center space-x-2">
                <Icon name="mdi:account-group-outline"/>
                <span>Students</span>
              </NuxtLink>
            </li>
            <li class="px-2 py-2 hover:bg-gray-700 text-[14px]">
              <NuxtLink to="/student_categories" class="flex items-center space-x-2">
                <Icon name="mdi:laptop"/>
                <span>Student Categories</span>
              </NuxtLink>
            </li>
            <li class="px-2 py-4 hover:bg-gray-700 text-[14px]">
              <NuxtLink to="/books" class="flex items-center space-x-2">
                <Icon name="mdi:book-outline"/>
                <span>Books</span>
              </NuxtLink>
            </li>
            <li class="px-2 py-4 hover:bg-gray-700 text-[14px]">
              <NuxtLink to="/book_categories" class="flex items-center space-x-2">
                <Icon name="mdi:bookmark-outline"/>
                <span>Book Categories</span>
              </NuxtLink>
            </li>
            <li class="px-2 py-4 hover:bg-gray-700 text-[14px]">
              <NuxtLink to="/authors" class="flex items-center space-x-2">
                <Icon name="mdi:account-outline"/>
                <span>Authors</span>
              </NuxtLink>
            </li>
            <li class="px-2 py-4 hover:bg-gray-700 text-[14px]">
              <NuxtLink to="/branches" class="flex items-center space-x-2">
                <Icon name="mdi:map-marker-outline"/>
                <span>Branches</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main class="flex-1 p-4 ml-0 lg:ml-50 transition-all duration-300">
        <slot/>
      </main>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const isSidebarVisible = ref(false)

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}
</script>


