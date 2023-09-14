import { defineComponent } from '../vendor/vue.esm-browser.js';

export default defineComponent({
  name: 'MeetupCover',

  props: {
    title: String,
    image: String,
  },

  computed: {
    styleObject() {
      if (!this.image) return {};

      return { '--bg-url': `url('${this.image}')` };
    },
  },

  template: `
    <div class="meetup-cover" :style="styleObject">
      <h1 class="meetup-cover__title">{{ title }}</h1>
    </div>`,
});
