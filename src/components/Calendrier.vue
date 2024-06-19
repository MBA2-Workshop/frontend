<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AdjustmentsVerticalIcon, PlusIcon } from '@heroicons/vue/24/solid';
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
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import '@schedule-x/theme-default/dist/index.css';
import ModalCreateEvent from './ModalCreateEvent.vue';
import ModalEventDetails from './ModalEventDetails.vue';
import { useMainStore } from '../store/main';

const mainStore = useMainStore();

const eventsServicePlugin = createEventsServicePlugin();

const isCreateModalOpen = ref(false);
const isDetailsModalOpen = ref(false);
const selectedEvent = ref(null);

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
  callbacks: {
    onEventClick: (event) => {
      openDetailsModal(event);
    }
  },
};

const calendarApp = createCalendar(config);

onMounted(async () => {
  await mainStore.fetchEvents();
  eventsServicePlugin.set(mainStore.events);
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-end space-x-6">
      <button disabled class="py-2 px-3 border border-neutral-400 rounded-lg flex items-center justify-center">
        <AdjustmentsVerticalIcon class="size-6 text-neutral-400" />
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
</template>
