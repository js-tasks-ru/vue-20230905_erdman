<template>
  <UiCalendarView v-slot="{ year, month, day }">
    <UiCalendarEvent
      v-for="meetup in meetupsByDates[getDateKey(year, month, day)]"
      :key="meetup.id"
      tag="a"
      :href="`/meetups/${meetup.id}`"
    >
      {{ meetup.title }}
    </UiCalendarEvent>
  </UiCalendarView>
</template>

<script>
import UiCalendarView from './UiCalendarView.vue';
import UiCalendarEvent from './UiCalendarEvent.vue';

export default {
  name: 'MeetupsCalendar',

  components: {
    UiCalendarEvent,
    UiCalendarView,
  },

  props: {
    meetups: {
      type: Array,
      required: true,
    },
  },

  computed: {
    // Преобразованный объект митапов, в котором ключи - строка-дата 'yyyy-mm-dd',
    // значения - массив митапов в этот день.
    meetupsByDates() {
      const meetups = {};

      this.meetups.forEach((meetup) => {
        const date = new Date(meetup.date);
        const dateKey = this.getDateKey(date.getFullYear(), date.getMonth(), date.getDate());

        if (!meetups[dateKey]) meetups[dateKey] = [];
        meetups[dateKey].push(meetup);
      });

      return meetups;
    },
  },

  methods: {
    getDateKey(year, month, day) {
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style scoped></style>
