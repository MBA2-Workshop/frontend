<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Calendrier from '../components/Calendrier.vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Trainings from '../components/Trainings.vue';
import { useMainStore } from '../store/main';

const route = useRoute();
const router = useRouter();
const mainStore = useMainStore();
const activeTab = ref(mainStore.selectedTraining ? route.hash || '#calendrier' : '#trainings');

const changeTab = (tab) => {
  activeTab.value = tab;
  router.push({ hash: tab });
};

const selectedTraining = ref(mainStore.selectedTraining?.id || 'null');

const onSelectTraining = (event) => {
  const trainingId = event.target.value;
  const foundTraining = mainStore.trainings.find((t) => t.id === Number(trainingId));
  mainStore.setSelectedTraining(foundTraining || null);
};

watch(() => mainStore.selectedTraining, (newTraining) => {
  selectedTraining.value = newTraining?.id || 'null';
});

watch(() => route.hash, (newHash) => {
  if (!mainStore.selectedTraining && newHash !== '#trainings') {
    changeTab('#trainings')
  } else {
    changeTab(newHash || '#trainings');
  }
});

onMounted(async () => {
  changeTab(activeTab.value);
  await mainStore.fetchTrainings();
});
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="flex flex-col flex-1">
      <Header />
      <main class="px-8 py-4 flex-1">
        <div class="space-y-4">
          <div class="flex justify-between">
            <div class="space-y-0.5">
              <h1 class="text-3xl font-semibold">Pédagogie</h1>
              <p class="text-base">Calendrier de formation</p>
            </div>
            <div class="flex items-center space-x-4">
              <button v-if="mainStore.selectedTraining && activeTab !== '#trainings'"
                @click="() => { changeTab('#trainings'); mainStore.clearSelectedTraining() }"
                class="p-2 bg-neutral-100 hover:bg-neutral-300 text-neutral-900 rounded-full flex items-center space-x-2">
                <ArrowLeftIcon class="size-5" />
              </button>
              <select v-if="mainStore.selectedTraining && activeTab !== '#trainings'" v-model="selectedTraining"
                @change="onSelectTraining" class="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg">
                <option value="null" disabled>Sélectionner une formation</option>
                <option v-for="training in mainStore.trainings" :key="training.id" :value="training.id">
                  {{ training.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex border-b border-neutral-0" v-if="mainStore.selectedTraining && activeTab !== '#trainings'">
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
          <div v-if="!mainStore.selectedTraining || activeTab === '#trainings'">
            <Trainings />
          </div>
          <div v-else-if="mainStore.selectedTraining && activeTab === '#calendrier'">
            <Calendrier />
          </div>
          <div v-else-if="mainStore.selectedTraining && activeTab === '#emargement'">
            <p>Contenu de l'Émargement</p>
          </div>
          <div v-else-if="mainStore.selectedTraining && activeTab === '#notes'">
            <p>Contenu des Notes</p>
          </div>
          <div v-else>
            <p>Contenu introuvable</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
