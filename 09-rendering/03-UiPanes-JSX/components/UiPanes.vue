<script lang="jsx">
import UiButton from './UiButton.vue';

export default {
  name: 'UiPanes',

  components: {
    UiButton,
  },

  data() {
    return {
      panes: (this.$slots.default?.() ?? []).map((vnode) => ({ content: vnode, id: Math.random() })),
    };
  },

  methods: {
    /**
     * Переместить i-ую панель вверх
     *
     * @param {number} i
     */
    up(i) {
      const temp = this.panes[i];
      this.panes[i] = this.panes[i - 1];
      this.panes[i - 1] = temp;
    },

    /**
     * Переместить i-ую панель вниз
     *
     * @param {number} i
     */
    down(i) {
      const temp = this.panes[i];
      this.panes[i] = this.panes[i + 1];
      this.panes[i + 1] = temp;
    },
  },

  render() {
    return (
      <div class="panes">
        {this.panes.map(({ content, id }, i) => (
          <div class="pane" key={id}>
            <div class="pane__content">{content}</div>
            <div class="pane__controls">
              <UiButton
                class={{ 'pane__disabled-button': i === 0 }}
                variant="secondary"
                block
                onClick={() => this.up(i)}
              >
                Up
              </UiButton>
              <UiButton
                class={{ 'pane__disabled-button': i === this.panes.length - 1 }}
                variant="danger"
                block
                onClick={() => this.down(i)}
              >
                Down
              </UiButton>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
</script>

<style scoped>
.panes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pane {
  display: flex;
  flex-direction: row;
  border: 3px solid var(--blue-light);
}

.pane__content {
  border-right: 3px solid var(--blue-light);
  padding: 8px;
  flex: 1 0;
}

.pane__controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  width: min-content;
}

.pane__disabled-button {
  visibility: hidden;
}
</style>
