<script setup>
import { useRouter } from 'vue-router';
import { useMainStore } from '../store/main';
import { useUserStore } from '../store/user';
import ModalCreateTraining from './ModalCreateTraining.vue';
import ModalTrainingDetails from './ModalTrainingDetails.vue';
import { PencilIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';

const router = useRouter();
const mainStore = useMainStore();
const userStore = useUserStore();

const selectTraining = (training) => {
  mainStore.setSelectedTraining(training);
  router.push({ hash: '#calendrier' });
};

const isCreateModalOpen = ref(false);
const isDetailsModalOpen = ref(false);
const selectedTraining = ref(null);

const openCreateModal = () => {
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
};

const openDetailsModal = (training) => {
  selectedTraining.value = training;
  isDetailsModalOpen.value = true;
};

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false;
};

const createTraining = async (newTraining) => {
  await mainStore.addTraining(newTraining);
};

const saveTraining = async (training) => {
  await mainStore.updateTraining(training);
};

const deleteTraining = async (training) => {
  await mainStore.deleteTraining(training);
};

onMounted(async () => {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDetailsModal();
      closeCreateModal();
    }
  })
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Formation disponibles</h2>
    <ul class="space-y-2">
      <li v-for="training in mainStore.trainings" :key="training.id"
        class="flex justify-between items-center space-x-4 border py-2 px-3 rounded cursor-pointer bg-gray-100 hover:bg-gray-300"
        @click="selectTraining(training)">
        <div class="flex flex-1 justify-between items-center space-x-2">
          <span>{{ training.name }}</span>
          <span class="text-sm text-gray-500">{{ `${new Date(training.start_date).getFullYear()}-${new
            Date(training.end_date).getFullYear()}` }}</span>
        </div>
        <button v-if="userStore.user?.role === 3" class="border-2 border-business-700 p-1 rounded hover:bg-gray-100"
          @click.stop="openDetailsModal(training)">
          <PencilIcon class="size-5" />
        </button>
      </li>
    </ul>
    <button v-if="userStore.user?.role === 3"
      class="w-full mt-4 px-4 py-2 bg-business-700 hover:bg-business-800 text-white rounded" @click="openCreateModal">
      Créer une nouvelle formation
    </button>
    <ModalCreateTraining :isOpen="isCreateModalOpen" @close="closeCreateModal" @create="createTraining" />
    <ModalTrainingDetails :isOpen="isDetailsModalOpen" :training="selectedTraining" @close="closeDetailsModal"
      @save="saveTraining" @delete="deleteTraining" />
  </div>
</template>
