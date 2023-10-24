<template>
  <div class="calendar-view">
    <div class="calendar-view__controls">
      <div class="calendar-view__controls-inner">
        <button
          class="calendar-view__control-left"
          type="button"
          aria-label="Previous month"
          @click="handlePrevMonthClick"
        ></button>
        <div class="calendar-view__date">{{ localeDateString }}</div>
        <button
          class="calendar-view__control-right"
          type="button"
          aria-label="Next month"
          @click="handleNextMonthClick"
        ></button>
      </div>
    </div>

    <div class="calendar-view__grid">
      <div
        v-for="date in dates"
        :key="`${date.year}-${date.month}-${date.day}`"
        class="calendar-view__cell"
        :class="{ 'calendar-view__cell_inactive': date.inactive }"
        tabindex="0"
      >
        <div class="calendar-view__cell-day">{{ date.day }}</div>
        <div class="calendar-view__cell-content">
          <slot :year="date.year" :month="date.month" :day="date.day"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiCalendarView',

  data() {
    return {
      currentDate: new Date(),
    };
  },

  computed: {
    year() {
      return this.currentDate.getFullYear();
    },

    month() {
      return this.currentDate.getMonth();
    },

    localeDateString() {
      return this.currentDate.toLocaleDateString(navigator.language, {
        month: 'long',
        year: 'numeric',
      });
    },

    dates() {
      const dates = [];

      const lastDayOfPrevMonth = this.getLastDayOfMonth(this.year, this.month - 1).getDate();
      const lastDayOfMonth = this.getLastDayOfMonth(this.year, this.month).getDate();

      const dayOfWeekFirstDayOfMonth = this.getEuroDayOfWeek(new Date(this.year, this.month, 1));
      const dayOfWeekLastDayOfMonth = this.getEuroDayOfWeek(this.getLastDayOfMonth(this.year, this.month));

      // Заполнение дней предыдущего месяца
      const prevMonth = this.month > 0 ? this.month - 1 : 11;

      for (let day = lastDayOfPrevMonth - (dayOfWeekFirstDayOfMonth - 2); day <= lastDayOfPrevMonth; day += 1) {
        dates.push(this.getDateObject(this.year, prevMonth, day, true));
      }

      // Заполнение дней текущего месяца
      for (let day = 1; day <= lastDayOfMonth; day += 1) {
        dates.push(this.getDateObject(this.year, this.month, day));
      }

      // Заполнение дней следующего месяца
      const nextMonth = this.month < 11 ? this.month + 1 : 0;

      for (let day = 1; day <= 7 - dayOfWeekLastDayOfMonth; day += 1) {
        dates.push(this.getDateObject(this.year, nextMonth, day, true));
      }

      return dates;
    },
  },

  methods: {
    getDateObject(year, month, day, inactive = false) {
      return { year, month, day, inactive };
    },

    getLastDayOfMonth(year, month) {
      return new Date(year, month + 1, 0);
    },

    getEuroDayOfWeek(date) {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 ? 7 : dayOfWeek;
    },

    handlePrevMonthClick() {
      this.currentDate = new Date(this.year, this.month - 1);
    },

    handleNextMonthClick() {
      this.currentDate = new Date(this.year, this.month + 1);
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
</style>
