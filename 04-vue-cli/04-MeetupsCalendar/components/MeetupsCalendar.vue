<template>
  <div class="calendar-view">
    <div class="calendar-view__controls">
      <div class="calendar-view__controls-inner">
        <button
          class="calendar-view__control-left"
          type="button"
          aria-label="Previous month"
          @click="handlerPrevMonthClick"
        ></button>
        <div class="calendar-view__date">{{ localeDateString }}</div>
        <button
          class="calendar-view__control-right"
          type="button"
          aria-label="Next month"
          @click="handlerNextMonthClick"
        ></button>
      </div>
    </div>

    <div class="calendar-view__grid">
      <div
        v-for="date in dates"
        class="calendar-view__cell"
        :class="{ 'calendar-view__cell_inactive': date.inactive }"
        tabindex="0"
      >
        <div class="calendar-view__cell-day">{{ date.day }}</div>
        <div class="calendar-view__cell-content">
          <a v-for="meetup in date.meetups" :key="meetup.id" :href="`/meetups/${meetup.id}`" class="calendar-event">{{
            meetup.title
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeetupsCalendar',

  props: {
    meetups: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      date: new Date(),
    };
  },

  computed: {
    year() {
      return this.date.getFullYear();
    },

    month() {
      return this.date.getMonth();
    },

    localeDateString() {
      return this.date.toLocaleDateString(navigator.language, {
        month: 'long',
        year: 'numeric',
      });
    },

    // Митапы во входном параметре в виде массива и датой в timestamp
    // неудобны для распределения по датам календаря с учетом местного часового пояса.
    // В связи с этим массив митапов конвертируется в объект, где ключи -- строка-дата 'yyyy-mm-dd'
    // в местном часовом поясе из timestamp митапа, а значения -- массив митапов в этот день.
    meetupsByDates() {
      const meetups = {};

      this.meetups.forEach((meetup) => {
        const dateKey = this.getDateKey(new Date(meetup.date));

        if (!meetups[dateKey]) meetups[dateKey] = [];
        meetups[dateKey].push(meetup);
      });

      return meetups;
    },

    dates() {
      const dates = [];

      const lastDayOfPrevMonth = this.getLastDayOfMonth(this.year, this.month - 1).getDate();
      const lastDayOfMonth = this.getLastDayOfMonth(this.year, this.month).getDate();

      const dayOfWeekFirstDayOfMonth = this.getEuroDayOfWeek(new Date(this.year, this.month, 1));
      const dayOfWeekLastDayOfMonth = this.getEuroDayOfWeek(this.getLastDayOfMonth(this.year, this.month));

      // Заполнение дней предыдущего месяца
      for (let day = lastDayOfPrevMonth - (dayOfWeekFirstDayOfMonth - 2); day <= lastDayOfPrevMonth; day += 1) {
        dates.push(this.getDateObject(this.year, this.month - 1, day, true));
      }

      // Заполнение дней текущего месяца
      for (let day = 1; day <= lastDayOfMonth; day += 1) {
        dates.push(this.getDateObject(this.year, this.month, day));
      }

      // Заполнение дней следующего месяца
      for (let day = 1; day <= 7 - dayOfWeekLastDayOfMonth; day += 1) {
        dates.push(this.getDateObject(this.year, this.month + 1, day, true));
      }

      return dates;
    },
  },

  methods: {
    getDateKey(date) {
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    },

    getDateObject(year, month, day, inactive = false) {
      const date = { day, inactive };

      const dateKey = this.getDateKey(new Date(year, month, day));
      if (this.meetupsByDates[dateKey]) date.meetups = this.meetupsByDates[dateKey];

      return date;
    },

    getLastDayOfMonth(year, month) {
      return new Date(year, month + 1, 0);
    },

    getEuroDayOfWeek(date) {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 ? 7 : dayOfWeek;
    },

    handlerPrevMonthClick() {
      this.date = new Date(this.year, this.month - 1);
    },

    handlerNextMonthClick() {
      this.date = new Date(this.year, this.month + 1);
    },
  },
};
</script>

<style scoped>
.calendar-view {
}

.calendar-view__controls {
  text-align: center;
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
  color: var(--blue);
  background-color: var(--blue-extra);
  padding: 24px;
  display: flex;
  justify-content: center;
}

.calendar-view__controls-inner {
  max-width: 325px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-transform: capitalize;
}

.calendar-view__controls-inner button {
  border: none;
  padding: 0;
}

.calendar-view__control-left,
.calendar-view__control-right {
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s all;
  background: url('@/assets/icons/icon-pill-active.svg') left center no-repeat;
  background-size: cover;
}

.calendar-view__control-left:hover,
.calendar-view__control-right:hover {
  opacity: 0.8;
}

.calendar-view__control-right {
  transform: rotate(180deg);
}

.calendar-view__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

.calendar-view__grid {
  border: 1px solid var(--grey);
  border-bottom: none;
}

.calendar-view__cell {
  position: relative;
  height: auto;
  padding: 6px 8px;
  background-color: var(--white);
  color: var(--grey-8);
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-bottom: 1px solid var(--grey);
  border-left: 1px solid var(--grey);
  text-align: right;
}

.calendar-view__cell.calendar-view__cell_inactive {
  background-color: var(--grey-light);
}

@media all and (max-width: 767px) {
  .calendar-view__cell:nth-child(5n + 1) {
    border-left: none;
  }
}

@media all and (min-width: 767px) {
  .calendar-view__grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .calendar-view__cell {
    height: 144px;
  }

  .calendar-view__cell:nth-child(7n + 1) {
    border-left: none;
  }
}

.calendar-event {
  --max-lines: 2;
  --line-height: 16px;

  display: block;
  text-align: left;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: var(--line-height);
  color: var(--white);
  padding: 4px 6px;
  border-radius: 2px;
  background-color: var(--blue);
  margin-top: 4px;
}

@media all and (min-width: 767px) {
  .calendar-event {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: calc(var(--max-lines) * var(--line-height) + 6px);
  }
}
</style>
