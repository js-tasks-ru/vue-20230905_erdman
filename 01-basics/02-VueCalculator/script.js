import { createApp, defineComponent } from './vendor/vue.esm-browser';

const RootComponent = defineComponent({
  data() {
    return {
      leftOperand: 0,
      rightOperand: 0,
      operator: 'sum',
    };
  },

  computed: {
    calculationResult() {
      switch (this.operator) {
        case 'sum':
          return this.leftOperand + this.rightOperand;
        case 'subtract':
          return this.leftOperand - this.rightOperand;
        case 'multiply':
          return this.leftOperand * this.rightOperand;
        case 'divide':
          return this.leftOperand / this.rightOperand;
        default:
          return NaN;
      }
    },
  },
});

const app = createApp(RootComponent);
const vm = app.mount('#app');
