<script setup>
import { onMounted, ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { useMainStore } from '../store/main';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const mainStore = useMainStore();
const emit = defineEmits(['close', 'create']);

const title = ref('');
const description = ref('');
const students = ref([]);
const instructor = ref(null);

const createTraining = () => {
  const newTraining = {
    name: title.value,
    description: description.value,
    students: students.value,
    instructor: instructor.value,
  };
  emit('create', newTraining);
  emit('close');

  title.value = '';
  description.value = '';
  students.value = [];
  instructor.value = null;
};

onMounted(async () => {
  await mainStore.fetchStudents();
  await mainStore.fetchInstructors();
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-neutral-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="text-xl font-semibold">Créer une formation</h3>
        <button @click="emit('close')">
          <XMarkIcon class="size-6" />
        </button>
      </div>
      <form @submit.prevent="createTraining" class="space-y-4 mt-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
          <input id="title" v-model="title" placeholder="Titre de la formation" required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" v-model="description" placeholder="Description de la formation" required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"></textarea>
        </div>
        <div>
          <label for="students" class="block text-sm font-medium text-gray-700">Étudiants</label>
          <select id="students" v-model="students" multiple
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option v-for="student in mainStore.students" :key="student.id" :value="student.id">
              {{ `${student.first_name} ${student.last_name} - ${student.email}` }}
            </option>
          </select>
        </div>
        <div>
          <label for="instructor" class="block text-sm font-medium text-gray-700">Formateur</label>
          <select id="instructor" v-model="instructor"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="null" disabled>Sélectionner un formateur</option>
            <option v-for="instructor in mainStore.instructors" :key="instructor.id" :value="instructor.id">
              {{ `${instructor.first_name} ${instructor.last_name} - ${instructor.email}` }}
            </option>
          </select>
        </div>
        <button type="submit"
          class="w-full mt-4 px-4 py-2 bg-business-700 text-white rounded hover:bg-business-800 focus:outline-none focus:ring focus:border-blue-300">
          Créer la formation
        </button>
      </form>
    </div>
  </div>
</template>
