<script setup>
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import { useMainStore } from "../store/main";
import { computed } from "vue";

const mainStore = useMainStore();
const count = computed(() => mainStore.count);
const increment = mainStore.increment;
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="flex flex-col flex-1">
      <Header />
      <main class="px-8 py-4 flex-1">
        <div class="space-y-0.5">
          <h1 class="text-3xl font-bold">Pédagogie</h1>
          <p class="text-base">Calendrier de formation</p>
        </div>
        <div class="mt-8">
          <p>Count: {{ count }}</p>
          <button @click="increment" class="mt-4 px-4 py-2 bg-business-700 text-white rounded">Increment</button>
          <div class="mt-4">
            <router-link to="/" class="text-blue-600 underline">Signin</router-link>
            <router-link to="/signup" class="ml-4 text-blue-600 underline">Signup</router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
