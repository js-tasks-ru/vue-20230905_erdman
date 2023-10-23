<script>
import { h, compile } from 'vue';

export default {
  name: 'TemplateRenderer',

  props: {
    template: {
      type: String,
      required: true,
    },

    bindings: {
      type: Object,
      default: () => ({}),
    },

    components: {
      type: [Object, Array],
      default: () => [],
    },
  },

  computed: {
    compiledTemplate() {
      return compile(this.template);
    },

    renderingComponent() {
      return { components: this.components, props: ['bindings'], render: this.compiledTemplate };
    },
  },

  render() {
    return h(this.renderingComponent, { bindings: this.bindings });
  },
};
</script>
