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
    events: [],
    displayedEvents: [],
    trainings: [],
    selectedTraining: localStorage.getItem('selectedTraining') ? JSON.parse(localStorage.getItem('selectedTraining')) : null,
    students: [],
    instructors: [],
  }),
  actions: {
    async fetchEvents() {
      try {
        const response = await axiosInstance.get('/event/event/');
        const dataset = response.data.map((event) => {
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);

          return {
            ...event,
            title: event.label,
            start: formatDateTime(startDate, event.full_day),
            end: formatDateTime(endDate, event.full_day),
            calendarId: event.type === 1 ? 'personal' : 'event',
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
          ...event,
          title: response.data.label,
          type: Number(response.data.type),
          start: formatDateTime(startDate, response.data.full_day),
          end: formatDateTime(endDate, response.data.full_day),
          calendarId: event.type === 1 ? 'personal' : 'event',
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
          ...event,
          title: response.data.label,
          start: formatDateTime(startDate, response.data.full_day),
          end: formatDateTime(endDate, response.data.full_day),
          calendarId: event.type === 1 ? 'personal' : 'event',
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
    },
    async fetchTrainings() {
      try {
        const response = await axiosInstance.get('/education/trainings/');
        this.trainings = response.data;
      } catch (error) {
        console.error('Failed to fetch trainings', error);
      }
    },
    async addTraining(training) {
      try {
        const response = await axiosInstance.post('/education/training/', training);
        this.trainings.push(response.data);
      } catch (error) {
        console.error('Failed to add training', error);
      }
    },
    async updateTraining(training) {
      try {
        const response = await axiosInstance.patch(`/education/training/${training.id}/`, training);
        const index = this.trainings.findIndex((t) => t.id === training.id);
        this.trainings[index] = response.data;
      } catch (error) {
        console.error('Failed to update training', error);
      }
    },
    async deleteTraining(training) {
      try {
        await axiosInstance.delete(`/education/training/${training.id}/`);
        this.trainings = this.trainings.filter((t) => t.id !== training.id);
      } catch (error) {
        console.error('Failed to delete training', error);
      }
    },
    async fetchStudents() {
      try {
        const response = await axiosInstance.get('/education/student/');
        this.students = response.data;
      } catch (error) {
        console.error('Failed to fetch students', error);
      }
    },
    async fetchInstructors() {
      try {
        const response = await axiosInstance.get('/education/instructors/');
        this.instructors = response.data;
      } catch (error) {
        console.error('Failed to fetch instructors', error);
      }
    },
    setSelectedTraining(training) {
      this.selectedTraining = training;
      if (training) {
        localStorage.setItem('selectedTraining', JSON.stringify(training));
      } else {
        localStorage.removeItem('selectedTraining');
      }
    },
    clearSelectedTraining() {
      this.selectedTraining = null;
      localStorage.removeItem('selectedTraining');
    },
    updateDisplayedEvents(filter) {
      let filteredEvents = [...this.events];

      if (filter.trainings.length) {
        console.log(filteredEvents[2]);
        filteredEvents = filteredEvents.filter((event) => filter.trainings.includes(event.training) || event.type === 1);
      }

      this.displayedEvents = filteredEvents;
    },
  }
});
