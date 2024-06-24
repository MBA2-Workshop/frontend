<script setup>
import { onMounted, ref, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { useMainStore } from '../store/main';

const padToTwoDigits = (num) => num.toString().padStart(2, '0');

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const mainStore = useMainStore();
const emit = defineEmits(['close', 'create']);

const title = ref('');
const type = ref('1');
const startDate = ref('');
const endDate = ref('');
const allDay = ref(false);
const training = ref(mainStore.selectedTraining?.id || null);
const instructor = ref(null);

const closeModal = () => {
  emit('close');
};

watch(() => mainStore.selectedTraining, (newTraining) => {
  training.value = newTraining?.id || null;
});

watch(allDay, (newAllDay) => {
  setTimeout(() => {
    if (startDate.value) {
      const startDateClass = new Date(startDate.value);
      if (newAllDay) {
        startDate.value = `${startDateClass.getFullYear()}-${padToTwoDigits(startDateClass.getMonth() + 1)}-${padToTwoDigits(startDateClass.getDate())}`;
      } else {
        startDate.value = `${startDateClass.getFullYear()}-${padToTwoDigits(startDateClass.getMonth() + 1)}-${padToTwoDigits(startDateClass.getDate())}T${padToTwoDigits(startDateClass.getHours())}:${padToTwoDigits(startDateClass.getMinutes())}`;
      }
    }

    if (endDate.value) {
      const endDateClass = new Date(endDate.value);
      if (newAllDay) {
        endDate.value = `${endDateClass.getFullYear()}-${padToTwoDigits(endDateClass.getMonth() + 1)}-${padToTwoDigits(endDateClass.getDate())}`;
      } else {
        endDate.value = `${endDateClass.getFullYear()}-${padToTwoDigits(endDateClass.getMonth() + 1)}-${padToTwoDigits(endDateClass.getDate())}T${padToTwoDigits(endDateClass.getHours())}:${padToTwoDigits(endDateClass.getMinutes())}`;
      }
    }
  }, 1);
});

const createEvent = () => {
  const startDateClass = new Date(startDate.value);
  const endDateClass = new Date(endDate.value);

  const newEvent = {
    label: title.value,
    start_date: `${startDateClass.getFullYear()}-${padToTwoDigits(startDateClass.getMonth() + 1)}-${padToTwoDigits(startDateClass.getDate())}T${padToTwoDigits(startDateClass.getHours())}:${padToTwoDigits(startDateClass.getMinutes())}:00`,
    end_date: `${endDateClass.getFullYear()}-${padToTwoDigits(endDateClass.getMonth() + 1)}-${padToTwoDigits(endDateClass.getDate())}T${padToTwoDigits(endDateClass.getHours())}:${padToTwoDigits(endDateClass.getMinutes())}:00`,
    full_day: allDay.value,
    type: type.value,
    training: type.value === '2' ? training.value : null,
    instructor: type.value === '2' ? instructor.value : null
  };
  emit('create', newEvent);
  closeModal();

  title.value = '';
  type.value = '1';
  startDate.value = '';
  endDate.value = '';
  allDay.value = false;
  instructor.value = null;
};

onMounted(async () => {
  await mainStore.fetchTrainings();
  await mainStore.fetchInstructors();
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-neutral-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="text-xl font-semibold">Créer un évènement</h3>
        <button @click="closeModal">
          <XMarkIcon class="size-6" />
        </button>
      </div>
      <form @submit.prevent="createEvent" class="space-y-4 mt-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Intitulé</label>
          <input type="text" id="title" v-model="title" placeholder="Nom de l'évènement" required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type d'évènement</label>
          <select id="type" v-model="type" required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="1">Personnel</option>
            <option value="2">Cours</option>
          </select>
        </div>
        <div v-if="type === '2'">
          <label for="training" class="block text-sm font-medium text-gray-700">Formation</label>
          <select id="training" v-model="training"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="null">Aucune</option>
            <option v-for="training in mainStore.trainings" :key="training.id" :value="training.id">
              {{ training.name }}
            </option>
          </select>
        </div>
        <div v-if="type === '2'">
          <label for="instructor" class="block text-sm font-medium text-gray-700">Formateur</label>
          <select id="instructor" v-model="instructor"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="null">Aucun</option>
            <option v-for="instructor in mainStore.instructors" :key="instructor.id" :value="instructor.id">
              {{ `${instructor.first_name} ${instructor.last_name} - ${instructor.email}` }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700">Date de début</label>
            <input :type="allDay ? 'date' : 'datetime-local'" id="startDate" v-model="startDate" required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700">Date de fin</label>
            <input :type="allDay ? 'date' : 'datetime-local'" id="endDate" v-model="endDate" required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
          </div>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="allDay" v-model="allDay" class="h-4 w-4 text-blue-600 border-gray-300 rounded">
          <label for="allDay" class="ml-2 block text-sm text-gray-900">Dure toute la journée</label>
        </div>
        <button type="submit" class="px-4 py-2 w-full bg-green-600 text-white rounded-md">Ajouter</button>
      </form>
    </div>
  </div>
</template>
