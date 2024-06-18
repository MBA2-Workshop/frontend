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
import '@schedule-x/theme-default/dist/index.css';
import ModalCreateEvent from './ModalCreateEvent.vue';
import { useMainStore } from '../store/main';

const mainStore = useMainStore();

const eventsServicePlugin = createEventsServicePlugin();

const config: CalendarConfig = {
  locale: 'fr-FR',
  views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
  defaultView: viewWeek.name,
  plugins: [eventsServicePlugin],
};

const calendarApp = createCalendar(config);

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const createEvent = async (newEvent) => {
  const createdEvent = await mainStore.addEvent(newEvent);
  eventsServicePlugin.add(createdEvent);
};

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

      <button @click="openModal" class="px-4 py-2 bg-business-700 text-white rounded-lg flex items-center space-x-2">
        <span>Créer</span>
        <PlusIcon class="size-5" />
      </button>
    </div>
    <div>
      <ScheduleXCalendar :calendar-app="calendarApp" />
    </div>
    <div>
      <ModalCreateEvent :isOpen="isModalOpen" @close="closeModal" @create="createEvent" />
    </div>
  </div>
</template>
