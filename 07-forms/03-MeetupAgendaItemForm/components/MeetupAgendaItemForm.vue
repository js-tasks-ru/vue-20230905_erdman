<template>
  <fieldset class="agenda-item-form">
    <button type="button" class="agenda-item-form__remove-button" @click="handleRemove">
      <UiIcon icon="trash" />
    </button>

    <UiFormGroup>
      <UiDropdown v-model="localAgendaItem.type" title="Тип" :options="$options.agendaItemTypeOptions" name="type" />
    </UiFormGroup>

    <div class="agenda-item-form__row">
      <div class="agenda-item-form__col">
        <UiFormGroup label="Начало">
          <UiInput v-model="localAgendaItem.startsAt" type="time" placeholder="00:00" name="startsAt" />
        </UiFormGroup>
      </div>
      <div class="agenda-item-form__col">
        <UiFormGroup label="Окончание">
          <UiInput v-model="localAgendaItem.endsAt" type="time" placeholder="00:00" name="endsAt" />
        </UiFormGroup>
      </div>
    </div>

    <UiFormGroup :label="titleText">
      <UiInput v-model="localAgendaItem.title" name="title" />
    </UiFormGroup>
    <UiFormGroup v-if="type === 'talk'" label="Докладчик">
      <UiInput v-model="localAgendaItem.speaker" name="speaker" />
    </UiFormGroup>
    <UiFormGroup v-if="type === 'talk' || type === 'other'" label="Описание">
      <UiInput v-model="localAgendaItem.description" multiline name="description" />
    </UiFormGroup>
    <UiFormGroup v-if="type === 'talk'" label="Язык">
      <UiDropdown
        v-model="localAgendaItem.language"
        title="Язык"
        :options="$options.talkLanguageOptions"
        name="language"
      />
    </UiFormGroup>
  </fieldset>
</template>

<script>
import UiIcon from './UiIcon.vue';
import UiFormGroup from './UiFormGroup.vue';
import UiInput from './UiInput.vue';
import UiDropdown from './UiDropdown.vue';

const agendaItemTypeIcons = {
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
};

const agendaItemDefaultTitles = {
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
};

const agendaItemTypeOptions = Object.entries(agendaItemDefaultTitles).map(([type, title]) => ({
  value: type,
  text: title,
  icon: agendaItemTypeIcons[type],
}));

const talkLanguageOptions = [
  { value: null, text: 'Не указано' },
  { value: 'RU', text: 'RU' },
  { value: 'EN', text: 'EN' },
];

// 5 -> '05'
function toLeadingZero(num) {
  return num / 10 < 1 ? `0${num}` : num;
}

// 10:05 -> 605
function convertTimeToNumber(time) {
  const timeArr = time.split(':');

  return Number(timeArr[0]) * 60 + Number(timeArr[1]);
}

// 605 -> 10:05
function convertNumberToTime(initNum) {
  const num = initNum >= 0 ? initNum : 1440 + initNum;

  const hour = toLeadingZero(Math.trunc(num / 60) % 24);
  const min = toLeadingZero(num % 60);

  return `${hour}:${min}`;
}

export default {
  name: 'MeetupAgendaItemForm',

  agendaItemTypeOptions,
  talkLanguageOptions,

  components: { UiIcon, UiFormGroup, UiInput, UiDropdown },

  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },

  emits: ['update:agendaItem', 'remove'],

  data() {
    return {
      localAgendaItem: { ...this.agendaItem },
    };
  },

  computed: {
    type() {
      return this.localAgendaItem.type;
    },

    titleText() {
      if (this.type === 'talk') return 'Тема';
      if (this.type === 'other') return 'Заголовок';

      return 'Нестандартный текст (необязательно)';
    },
  },

  watch: {
    'localAgendaItem.startsAt': function (newStartsAt, oldStartsAt) {
      // Изменение времени окончания митапа на такую же величину, что и время начала митапа
      const startsAtDifference = convertTimeToNumber(newStartsAt) - convertTimeToNumber(oldStartsAt);
      const newEndsAtNum = startsAtDifference + convertTimeToNumber(this.localAgendaItem.endsAt);

      this.localAgendaItem.endsAt = convertNumberToTime(newEndsAtNum);
    },

    localAgendaItem: {
      handler(updatedAgendaItem) {
        this.$emit('update:agendaItem', { ...updatedAgendaItem });
      },
      deep: true,
    },
  },

  methods: {
    handleRemove() {
      this.$emit('remove');
    },
  },
};
</script>

<style scoped>
.agenda-item-form {
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  position: relative;
  padding: 20px 10% 0 16px;
}

.agenda-item-form__remove-button {
  position: absolute;
  top: 4px;
  right: 0;
  box-shadow: none;
  border: none;
  background-color: transparent;
  outline: none;
  padding: 4px;
  cursor: pointer;
  transition: 0.2s opacity;
}

.agenda-item-form__remove-button:hover {
  opacity: 0.6;
}

.agenda-item-form__row {
  display: flex;
  flex-direction: column;
}

.agenda-item-form__col + .agenda-item-form__col {
  margin-top: 16px;
}

.agenda-item-form__col:first-child {
  margin-left: 0;
}

@media all and (min-width: 992px) {
  .agenda-item-form {
    padding: 28px 25% 4px 24px;
  }

  .agenda-item-form__remove-button {
    top: 20px;
    right: 20px;
  }

  .agenda-item-form__row {
    flex-direction: row;
    justify-content: space-between;
    margin: 0 -12px;
  }

  .agenda-item-form__col {
    flex: 1 1 auto;
    padding: 0 12px;
  }

  .agenda-item-form__col + .agenda-item-form__col {
    margin-top: 0;
  }

  .agenda-item-form__col:first-child {
    margin-left: 0;
  }
}
</style>
