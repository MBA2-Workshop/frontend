<script setup>
import { ref, watch } from 'vue';
import { XMarkIcon, TrashIcon } from '@heroicons/vue/24/solid';

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

const saveChanges = () => {
  const eventSaveFormat = {
    id: editableEvent.value.id,
    label: editableEvent.value.title,
    start_date: formatDate(editableEvent.value.start),
    end_date: formatDate(editableEvent.value.end),
    full_day: editableEvent.value.full_day,
    type: editableEvent.value.type,
    instructor: null
  };
  emit('save', eventSaveFormat);
  closeModal();
};

const deleteEvent = () => {
  emit('delete', editableEvent.value);
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
          <label class="block text-sm font-medium text-gray-700">Intitulé</label>
          <input type="text" v-model="editableEvent.title"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Type d'évènement</label>
          <select v-model="editableEvent.type"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300">
            <option value="1">Personnel</option>
            <option value="2">Public</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de début</label>
            <input :type="editableEvent.full_day ? 'date' : 'datetime-local'" v-model="editableEvent.start"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de fin</label>
            <input :type="editableEvent.full_day ? 'date' : 'datetime-local'" v-model="editableEvent.end"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring focus:border-blue-300" />
          </div>
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="editableEvent.full_day" class="h-4 w-4 text-blue-600 border-gray-300 rounded">
          <label class="ml-2 block text-sm text-gray-900">Dure toute la journée</label>
        </div>
        <div class="flex justify-end space-x-4 mt-4">
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
