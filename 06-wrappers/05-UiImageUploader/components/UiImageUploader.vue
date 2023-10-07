<template>
  <div class="image-uploader">
    <label
      class="image-uploader__preview"
      :class="{ 'image-uploader__preview-loading': state === 'uploading' }"
      :style="previewStyle"
    >
      <span class="image-uploader__text">{{ uploaderText }}</span>
      <input
        ref="input"
        type="file"
        accept="image/*"
        v-bind="$attrs"
        @click="handleClick"
        @change="handleChange"
        class="image-uploader__input"
      />
    </label>
  </div>
</template>

<script>
export default {
  name: 'UiImageUploader',

  inheritAttrs: false,

  props: {
    preview: {
      type: String,
      default: null,
    },

    uploader: {
      type: Function,
      default: null,
    },
  },

  emits: ['select', 'upload', 'error', 'remove'],

  data() {
    return {
      isUploading: false,
      selectedFile: null,
      previewImageUrl: this.preview,
    };
  },

  computed: {
    state() {
      if (this.isUploading) return 'uploading';
      if (this.previewImageUrl) return 'filled';

      return 'empty';
    },

    previewStyle() {
      const style = {};
      if (this.previewImageUrl) {
        style['--bg-url'] = `url('${this.previewImageUrl}')`;
      }

      return style;
    },

    uploaderText() {
      const statesText = {
        empty: 'Загрузить изображение',
        uploading: 'Загрузка...',
        filled: 'Удалить изображение',
      };

      return statesText[this.state];
    },
  },

  watch: {
    selectedFile() {
      this.updatePreviewImageUrl();
    },
  },

  methods: {
    handleClick(event) {
      // Предотвращение запуска диалогового окна выбора файла
      if (this.state !== 'empty') event.preventDefault();

      if (this.state === 'filled') this.removeImage();
    },

    handleChange(event) {
      const selectedFile = event.target.files[0];
      this.selectedFile = selectedFile;

      if (this.uploader) this.uploadImage();

      this.$emit('select', selectedFile);
    },

    async uploadImage() {
      this.isUploading = true;

      try {
        const response = await this.uploader(this.selectedFile);

        this.$emit('upload', response);
      } catch (error) {
        this.resetSelectedFile();

        this.$emit('error', error);
      } finally {
        this.isUploading = false;
      }
    },

    removeImage() {
      this.resetSelectedFile();

      this.$emit('remove');
    },

    updatePreviewImageUrl() {
      // Рекомендовано очищать предыдущий URL.createObjectURL
      if (this.previewImageUrl && typeof this.previewImageUrl === 'object') {
        URL.revokeObjectURL(this.selectedURL);
      }

      if (this.selectedFile) {
        this.previewImageUrl = URL.createObjectURL(this.selectedFile);
      } else {
        this.previewImageUrl = '';
      }
    },

    resetSelectedFile() {
      this.selectedFile = false;
      this.$refs.input.value = '';
    },
  },
};
</script>

<style scoped>
.image-uploader {
}

.image-uploader__input {
  opacity: 0;
  height: 0;
}

.image-uploader__preview {
  --bg-url: var(--default-cover);
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), var(--bg-url);
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  transition: 0.2s border-color;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 512px;
  height: 228px;
}

.image-uploader__text {
  color: var(--white);
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
}

.image-uploader__preview:hover {
  border-color: var(--blue);
}

.image-uploader__preview.image-uploader__preview-loading {
  cursor: no-drop;
}
</style>
