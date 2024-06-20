<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, watchEffect } from 'vue';
import { AdjustmentsVerticalIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { ScheduleXCalendar } from '@schedule-x/vue';
import {
  createCalendar,
  viewDay,
  viewWeek,
  viewMonthGrid,
  viewMonthAgenda,
  CalendarConfig
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createCurrentTimePlugin } from '@schedule-x/current-time';
import '@schedule-x/theme-default/dist/index.css';
import ModalCreateEvent from './ModalCreateEvent.vue';
import ModalEventDetails from './ModalEventDetails.vue';
import { useMainStore } from '../store/main';

const mainStore = useMainStore();

const eventsServicePlugin = createEventsServicePlugin();

const isCreateModalOpen = ref(false);
const isDetailsModalOpen = ref(false);
const isSidebarOpen = ref(false);
const selectedEvent = ref(null);
const filters = ref({
  trainings: []
});

const openCreateModal = () => {
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
};

const openDetailsModal = (event) => {
  selectedEvent.value = event;
  isDetailsModalOpen.value = true;
};

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false;
};

const openSidebar = () => {
  isSidebarOpen.value = true;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const handleClickOutside = (event) => {
  const sidebar = document.getElementById('filter-sidebar');
  const openSidebarButton = document.getElementById('open-sidebar-button');
  if (sidebar && !sidebar.contains(event.target) && !openSidebarButton.contains(event.target)) {
    closeSidebar();
  }
};

watchEffect(() => {
  filters.value.trainings = mainStore.selectedTraining ? [mainStore.selectedTraining.id] : [];
});

watch(() => filters.value.trainings, () => {
  mainStore.updateDisplayedEvents(filters.value);
  eventsServicePlugin.set(mainStore.displayedEvents);
});

watch(() => mainStore.events, () => {
  mainStore.updateDisplayedEvents(filters.value);
});

onMounted(async () => {
  await mainStore.fetchEvents();
  eventsServicePlugin.set(mainStore.displayedEvents);
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebar();
      closeCreateModal();
      closeDetailsModal();
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebar();
      closeCreateModal();
      closeDetailsModal();
    }
  });
});

const createEvent = async (newEvent) => {
  const createdEvent = await mainStore.addEvent(newEvent);
  eventsServicePlugin.add(createdEvent);
};

const saveEvent = async (event) => {
  const updatedEvent = await mainStore.updateEvent(event);
  eventsServicePlugin.update(updatedEvent);
};

const deleteEvent = async (event) => {
  const deletedEventID = await mainStore.deleteEvent(event);
  eventsServicePlugin.remove(deletedEventID);
};

const config: CalendarConfig = {
  locale: 'fr-FR',
  views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
  defaultView: viewWeek.name,
  plugins: [
    eventsServicePlugin,
    createCurrentTimePlugin()
  ],
  dayBoundaries: {
    start: '06:00',
    end: '20:00',
  },
  calendars: {
    event: {
      colorName: 'event',
      lightColors: {
        main: '#1c7df9',
        container: '#d2e7ff',
        onContainer: '#002859',
      },
      darkColors: {
        main: '#c0dfff',
        onContainer: '#dee6ff',
        container: '#426aa2',
      },
    },
  },
  callbacks: {
    onEventClick: (event) => {
      openDetailsModal(event);
    }
  },
};

const calendarApp = createCalendar(config);
</script>

<template>
  <div>
    <div class="space-y-6 relative">
      <div class="flex justify-end space-x-6">
        <button id="open-sidebar-button" @click="openSidebar"
          class="py-2 px-3 border border-business-700 rounded-lg flex items-center justify-center">
          <AdjustmentsVerticalIcon class="size-6 text-business-700" />
        </button>

        <button @click="openCreateModal"
          class="px-4 py-2 bg-business-700 text-white rounded-lg flex items-center space-x-2">
          <span>Créer</span>
          <PlusIcon class="size-5" />
        </button>
      </div>
      <div>
        <ScheduleXCalendar :calendar-app="calendarApp" />
      </div>
      <div>
        <ModalCreateEvent :isOpen="isCreateModalOpen" @close="closeCreateModal" @create="createEvent" />
        <ModalEventDetails :isOpen="isDetailsModalOpen" :event="selectedEvent" @close="closeDetailsModal"
          @save="saveEvent" @delete="deleteEvent" />
      </div>
    </div>

    <div v-if="isSidebarOpen" class="fixed inset-0 bg-neutral-800 bg-opacity-50 flex items-center justify-center z-50">
      <div id="filter-sidebar" class="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Filtres</h2>
          <button @click="closeSidebar" class="text-gray-500 hover:text-gray-700">
            <XMarkIcon class="size-5" />
          </button>
        </div>
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Formations</label>
          <div class="flex flex-col space-y-2">
            <label v-for="training in mainStore.trainings" :key="training.id" class="flex items-center space-x-2">
              <input type="checkbox" v-model="filters.trainings" :value="training.id" />
              <span>{{ training.name }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
