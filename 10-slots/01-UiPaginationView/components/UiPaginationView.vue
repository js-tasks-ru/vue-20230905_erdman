<template>
  <div class="pagination-container">
    <template v-for="item in viewItems">
      <slot :item="item"></slot>
    </template>
  </div>
</template>

<script>
export default {
  name: 'UiPaginationView',

  props: {
    page: {
      type: Number,
      required: true,
      validator: (value) => value > 0,
    },

    perPage: {
      type: Number,
      required: true,
      validator: (value) => value > 0,
    },

    items: {
      type: Array,
      required: true,
    },
  },

  computed: {
    viewItems() {
      return this.items.slice(this.perPage * (this.page - 1), this.page * this.perPage);
    },
  },
};
</script>

<style></style>
