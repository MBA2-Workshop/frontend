<script setup>
import { ref, watch } from 'vue';
import { XMarkIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { useMainStore } from '../store/main';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  training: {
    type: Object,
    default: () => ({})
  }
});

const mainStore = useMainStore();
const emit = defineEmits(['close', 'save', 'delete']);

const editableTraining = ref({ ...props.training });

watch(() => props.training, (newTraining) => {
  editableTraining.value = { ...newTraining };
});

const closeModal = () => {
  emit('close');
};

const saveChanges = () => {
  console.log();
  const trainingSaveFormat = {
    id: editableTraining.value.id,
    name: editableTraining.value.name,
    description: editableTraining.value.description,
    students: editableTraining.value.students,
    instructor: editableTraining.value.instructor
  };
  emit('save', trainingSaveFormat);
  closeModal();
};

const deleteTraining = () => {
  emit('delete', editableTraining.value);
  closeModal();
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-neutral-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="text-xl font-semibold">Détails de l'évènement</h3>
        <button @click="closeModal">
          <XMarkIcon class="size-6" />
        </button>
      </div>
      <div class="space-y-4 mt-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
          <input id="title" v-model="editableTraining.name" placeholder="Titre de la formation" required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" v-model="editableTraining.description" placeholder="Description de la formation"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"></textarea>
        </div>
        <div>
          <label for="students" class="block text-sm font-medium text-gray-700">Étudiants</label>
          <select id="students" v-model="editableTraining.students" multiple
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="null" disabled>Sélectionner les étudiants</option>
            <option v-for="student in mainStore.students" :key="student.id" :value="student.id">
              {{ `${student.first_name} ${student.last_name} - ${student.email}` }}
            </option>
          </select>
        </div>
        <div>
          <label for="instructor" class="block text-sm font-medium text-gray-700">Formateur</label>
          <select id="instructor" v-model="editableTraining.instructor"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="null" disabled>Sélectionner un formateur</option>
            <option v-for="instructor in mainStore.instructors" :key="instructor.id" :value="instructor.id">
              {{ `${instructor.first_name} ${instructor.last_name} - ${instructor.email}` }}
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-4 mt-4">
          <button @click="deleteTraining"
            class="px-4 py-2 bg-red-600 text-white rounded-md flex items-center space-x-2">
            <TrashIcon class="size-5" />
            <span>Supprimer</span>
          </button>
          <button @click="saveChanges" class="px-4 py-2 bg-green-600 text-white rounded-md">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>
