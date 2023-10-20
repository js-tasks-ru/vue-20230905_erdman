<script>
import { h } from 'vue';

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

  render() {
    const renderingComponent = {
      components: this.components,
      props: ['bindings'],
      template: this.template,
    };

    return h(renderingComponent, { bindings: this.bindings });
  },
};
</script>
