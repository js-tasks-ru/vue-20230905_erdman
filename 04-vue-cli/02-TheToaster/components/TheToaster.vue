<template>
  <div class="toasts">
    <UiToast
      v-for="toast in toasts.values()"
      :key="toast.id"
      :type="toast.type"
      :message="toast.message"
      @close="handleClose(toast.id)"
      class="toasts__toast"
      closable
    />
  </div>
</template>

<script>
import UiToast from './UiToast.vue';

const DEFAULT_CLOSE_DELAY = 5000;

export default {
  name: 'TheToaster',

  components: { UiToast },

  expose: ['success', 'error'],

  data() {
    return {
      toasts: new Map(),
      nextToastId: 0,
    };
  },

  methods: {
    getNewToastId() {
      const id = this.nextToastId;

      this.nextToastId += 1;
      return id;
    },

    addToast(type, message, closeDelay) {
      const id = this.getNewToastId();

      this.toasts.set(id, { id, type, message });
      setTimeout(() => this.deleteToast(id), closeDelay);
    },

    deleteToast(id) {
      this.toasts.delete(id);
    },

    handleClose(id) {
      this.deleteToast(id);
    },

    success(message, closeDelay = DEFAULT_CLOSE_DELAY) {
      this.addToast('success', message, closeDelay);
    },

    error(message, closeDelay = DEFAULT_CLOSE_DELAY) {
      this.addToast('error', message, closeDelay);
    },
  },
};
</script>

<style scoped>
.toasts {
  position: fixed;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  white-space: pre-wrap;
  z-index: 999;
}

@media all and (min-width: 992px) {
  .toasts {
    bottom: 72px;
    right: 112px;
  }
}

.toasts__toast + .toasts__toast {
  margin-top: 20px;
}
</style>
