import { createApp, defineComponent } from './vendor/vue.esm-browser';

const RootComponent = defineComponent({
  data() {
    return {
      counter: 0,
    };
  },
});

const app = createApp(RootComponent);
const vm = app.mount('#app');
