<script setup>
import { ref, watch, computed } from 'vue';
import { XMarkIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { useMainStore } from '../store/main';
import { useUserStore } from '../store/user';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object,
    default: () => ({})
  }
});

const mainStore = useMainStore();
const userStore = useUserStore();
const emit = defineEmits(['close', 'save', 'delete']);

const editableEvent = ref({ ...props.event });

watch(() => props.event, (newEvent) => {
  editableEvent.value = { ...newEvent };
});

const closeModal = () => {
  emit('close');
};

const padToTwoDigits = (num) => num.toString().padStart(2, '0');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${padToTwoDigits(date.getMonth() + 1)}-${padToTwoDigits(date.getDate())}T${padToTwoDigits(date.getHours())}:${padToTwoDigits(date.getMinutes())}:00`;
};

watch(() => editableEvent.value.full_day, (newAllDay) => {
  setTimeout(() => {
    if (editableEvent.value.start) {
      const startDateClass = new Date(editableEvent.value.start);
      if (newAllDay) {
        editableEvent.value.start = `${startDateClass.getFullYear()}-${padToTwoDigits(startDateClass.getMonth() + 1)}-${padToTwoDigits(startDateClass.getDate())}`;
      } else {
        editableEvent.value.start = `${startDateClass.getFullYear()}-${padToTwoDigits(startDateClass.getMonth() + 1)}-${padToTwoDigits(startDateClass.getDate())}T${padToTwoDigits(startDateClass.getHours())}:${padToTwoDigits(startDateClass.getMinutes())}`;
      }
    }

    if (editableEvent.value.end) {
      const endDateClass = new Date(editableEvent.value.end);
      if (newAllDay) {
        editableEvent.value.end = `${endDateClass.getFullYear()}-${padToTwoDigits(endDateClass.getMonth() + 1)}-${padToTwoDigits(endDateClass.getDate())}`;
      } else {
        editableEvent.value.end = `${endDateClass.getFullYear()}-${padToTwoDigits(endDateClass.getMonth() + 1)}-${padToTwoDigits(endDateClass.getDate())}T${padToTwoDigits(endDateClass.getHours())}:${padToTwoDigits(endDateClass.getMinutes())}`;
      }
    }
  }, 1);
});

const saveChanges = () => {
  const eventSaveFormat = {
    id: editableEvent.value.id,
    label: editableEvent.value.title,
    start_date: formatDate(editableEvent.value.start),
    end_date: formatDate(editableEvent.value.end),
    full_day: editableEvent.value.full_day,
    type: editableEvent.value.type,
    training: editableEvent.value.type === 2 ? editableEvent.value.training : null,
    instructor: editableEvent.value.type === 2 ? editableEvent.value.instructor : null
  };
  emit('save', eventSaveFormat);
  closeModal();
};

const deleteEvent = () => {
  emit('delete', editableEvent.value);
  closeModal();
};

const isEditable = computed(() => {
  return userStore.user?.role === 3 || userStore.user?.id === editableEvent.value.user;
});
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
          <label class="block text-sm font-medium text-gray-700">Intitulé</label>
          <input type="text" v-model="editableEvent.title" :disabled="!isEditable"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Type d'évènement</label>
          <select v-model="editableEvent.type" :disabled="!isEditable"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="1">Personnel</option>
            <option value="2">Cours</option>
          </select>
        </div>
        <div v-if="editableEvent.type === 2">
          <label for="training" class="block text-sm font-medium text-gray-700">Formation</label>
          <select id="training" v-model="editableEvent.training" :disabled="!isEditable"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="null">Aucune</option>
            <option v-for="training in mainStore.trainings" :key="training.id" :value="training.id">
              {{ training.name }}
            </option>
          </select>
        </div>
        <div v-if="editableEvent.type === 2">
          <label for="instructor" class="block text-sm font-medium text-gray-700">Formateur</label>
          <select id="instructor" v-model="editableEvent.instructor" :disabled="!isEditable"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="null">Aucun</option>
            <option v-for="instructor in mainStore.instructors" :key="instructor.id" :value="instructor.id">
              {{ `${instructor.first_name} ${instructor.last_name} - ${instructor.email}` }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de début</label>
            <input :type="editableEvent.full_day ? 'date' : 'datetime-local'" v-model="editableEvent.start"
              :disabled="!isEditable"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de fin</label>
            <input :type="editableEvent.full_day ? 'date' : 'datetime-local'" v-model="editableEvent.end"
              :disabled="!isEditable"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
          </div>
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="editableEvent.full_day" :disabled="!isEditable"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded">
          <label class="ml-2 block text-sm text-gray-900">Dure toute la journée</label>
        </div>
        <div v-if="isEditable" class="flex justify-end space-x-4 mt-4">
          <button @click="deleteEvent" class="px-4 py-2 bg-red-600 text-white rounded-md flex items-center space-x-2">
            <TrashIcon class="size-5" />
            <span>Supprimer</span>
          </button>
          <button @click="saveChanges" class="px-4 py-2 bg-green-600 text-white rounded-md">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>
