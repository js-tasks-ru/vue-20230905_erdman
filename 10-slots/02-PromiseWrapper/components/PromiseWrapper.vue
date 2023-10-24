<template>
  <slot v-if="state === $options.STATES.PENDING" name="pending"></slot>
  <slot v-else-if="state === $options.STATES.FULFILLED" :result="result" name="fulfilled"></slot>
  <slot v-else-if="state === $options.STATES.REJECTED" :error="error" name="rejected"></slot>
</template>

<script>
const STATES = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
};

export default {
  name: 'PromiseWrapper',

  STATES,

  props: {
    promise: {
      type: Promise,
      required: true,
    },
  },

  data() {
    return {
      state: null,
      result: null,
      error: null,
    };
  },

  watch: {
    promise: {
      handler(newPromise) {
        this.getPromiseResult(newPromise);
      },
      immediate: true,
    },
  },

  methods: {
    async getPromiseResult(promise) {
      this.state = STATES.PENDING;

      try {
        this.result = await promise;
        this.state = STATES.FULFILLED;
      } catch (error) {
        this.error = error;
        this.state = STATES.REJECTED;
      }
    },
  },
};
</script>
