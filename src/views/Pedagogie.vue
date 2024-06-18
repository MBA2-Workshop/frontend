<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Calendrier from '../components/Calendrier.vue';

const route = useRoute();
const router = useRouter();

const activeTab = ref(route.hash || '#calendrier');

const changeTab = (tab) => {
  activeTab.value = tab;
  router.push({ hash: tab });
};
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="flex flex-col flex-1">
      <Header />
      <main class="px-8 py-4 flex-1">
        <div class="space-y-4">
          <div class="space-y-0.5">
            <h1 class="text-3xl font-semibold">Pédagogie</h1>
            <p class="text-base">Calendrier de formation</p>
          </div>
          <div class="flex border-b border-neutral-0">
            <div
              :class="['px-4 py-2 hover:bg-neutral-300 hover:cursor-pointer', { 'border-b border-neutral-900': activeTab === '#calendrier' }]"
              @click="changeTab('#calendrier')">
              <span
                :class="['text-base', { 'text-neutral-900 font-semibold': activeTab === '#calendrier', 'text-neutral-700': activeTab !== '#calendrier' }]">
                Calendrier
              </span>
            </div>
            <div
              :class="['px-4 py-2 hover:bg-neutral-300 hover:cursor-pointer', { 'border-b border-neutral-900': activeTab === '#emargement' }]"
              @click="changeTab('#emargement')">
              <span
                :class="['text-base', { 'text-neutral-900 font-semibold': activeTab === '#emargement', 'text-neutral-700': activeTab !== '#emargement' }]">
                Émargement
              </span>
            </div>
            <div
              :class="['px-4 py-2 hover:bg-neutral-300 hover:cursor-pointer', { 'border-b border-neutral-900': activeTab === '#notes' }]"
              @click="changeTab('#notes')">
              <span
                :class="['text-base', { 'text-neutral-900 font-semibold': activeTab === '#notes', 'text-neutral-700': activeTab !== '#notes' }]">
                Notes
              </span>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <div v-if="activeTab === '#calendrier'">
            <Calendrier />
          </div>
          <div v-if="activeTab === '#emargement'">
            <p>Contenu de l'Émargement</p>
          </div>
          <div v-if="activeTab === '#notes'">
            <p>Contenu des Notes</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
