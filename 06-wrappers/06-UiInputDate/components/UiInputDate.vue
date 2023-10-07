<template>
  <UiInput v-model="modelProxy" :type="type" :step="step">
    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName" />
    </template>
  </UiInput>
</template>

<script>
import UiInput from './UiInput.vue';

export default {
  name: 'UiInputDate',

  components: { UiInput },

  props: {
    type: {
      type: String,
      default: 'date',
      validator: (type) => ['date', 'time', 'datetime-local'].includes(type),
    },

    modelValue: {
      type: Number,
      default: null,
    },

    step: {
      type: [Number, String],
      default: null,
      validator: (step) => step === 'any' || Number.isFinite(Number(step)),
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      inputEl: null,
    };
  },

  computed: {
    formattedDate() {
      if (this.modelValue) {
        const isoDate = new Date(this.modelValue).toISOString();

        if (this.type === 'date') {
          // YYYY-MM-DD
          return isoDate.slice(0, 10);
        }

        if (this.type === 'time') {
          if (this.step && this.step % 60 !== 0) {
            // hh:mm:ss
            return isoDate.slice(11, 19);
          }
          // hh:mm
          return isoDate.slice(11, 16);
        }

        if (this.type === 'datetime-local') {
          // YYYY-MM-DDThh:mm
          return isoDate.slice(0, 16);
        }
      }

      return '';
    },

    modelProxy: {
      get() {
        return this.formattedDate;
      },

      set() {
        this.$emit('update:modelValue', this.inputEl?.valueAsNumber);
      },
    },
  },

  mounted() {
    this.inputEl = this.$el.querySelector('input');
  },
};
</script>
