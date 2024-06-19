import { defineStore } from 'pinia';
import axiosInstance from '../services/axiosInstance';

const padToTwoDigits = (num) => num.toString().padStart(2, '0');

const formatDateTime = (date, fullDay) => {
  const year = date.getFullYear();
  const month = padToTwoDigits(date.getMonth() + 1);
  const day = padToTwoDigits(date.getDate());
  if (fullDay) {
    return `${year}-${month}-${day}`;
  } else {
    const hours = padToTwoDigits(date.getHours());
    const minutes = padToTwoDigits(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
};

export const useMainStore = defineStore('main', {
  state: () => ({
    events: []
  }),
  actions: {
    async fetchEvents() {
      try {
        const response = await axiosInstance.get('/event/event/');
        const dataset = response.data.map((event) => {
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);

          return {
            id: event.id,
            title: event.label,
            start: formatDateTime(startDate, event.full_day),
            end: formatDateTime(endDate, event.full_day),
            type: event.type,
            full_day: event.full_day,
          }
        });
        this.events = dataset;
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    },
    async addEvent(event) {
      try {
        const response = await axiosInstance.post('/event/event/', event);

        const startDate = new Date(response.data.start_date);
        const endDate = new Date(response.data.end_date);

        const eventFormat = {
          id: response.data.id,
          title: response.data.label,
          start: formatDateTime(startDate, response.data.full_day),
          end: formatDateTime(endDate, response.data.full_day),
        }
        this.events.push(eventFormat);
        return eventFormat;
      } catch (error) {
        console.error('Failed to add event', error);
        return null;
      }
    },
    async updateEvent(event) {
      try {
        const response = await axiosInstance.patch(`/event/event/${event.id}/`, event);

        const startDate = new Date(response.data.start_date);
        const endDate = new Date(response.data.end_date);

        const eventFormat = {
          id: response.data.id,
          title: response.data.label,
          start: formatDateTime(startDate, response.data.full_day),
          end: formatDateTime(endDate, response.data.full_day),
          type: response.data.type,
          full_day: response.data.full_day,
        }
        const index = this.events.findIndex((e) => e.id === event.id);
        this.events[index] = eventFormat;
        return eventFormat;
      } catch (error) {
        console.error('Failed to update event', error);
        return null;
      }
    },
    async deleteEvent(event) {
      try {
        await axiosInstance.delete(`/event/event/${event.id}/`);
        this.events = this.events.filter((e) => e.id !== event.id);
        return event.id;
      } catch (error) {
        console.error('Failed to delete event', error);
      }
    }
  }
});
