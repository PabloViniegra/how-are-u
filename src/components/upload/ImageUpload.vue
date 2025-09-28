<script setup lang="ts">
import { ref, computed } from 'vue';
import { Upload, Camera, X, AlertCircle } from 'lucide-vue-next';
import { useImageUpload } from '@/composables/useImageUpload';

const emit = defineEmits<{
  fileSelected: [file: File];
  fileRemoved: [];
}>();

const {
  selectedFile,
  previewUrl,
  uploadError,
  handleFileInput,
  handleFileDrop,
  clearFile
} = useImageUpload();

const isDragOver = ref(false);
const fileInputRef = ref<HTMLInputElement>();

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  handleFileDrop(event);

  if (selectedFile.value) {
    emit('fileSelected', selectedFile.value);
  }
};

const handleFileChange = (event: Event) => {
  handleFileInput(event);

  if (selectedFile.value) {
    emit('fileSelected', selectedFile.value);
  }
};

const removeFile = () => {
  clearFile();
  emit('fileRemoved');
};

const openFileDialog = () => {
  fileInputRef.value?.click();
};

const hasFile = computed(() => !!selectedFile.value);
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Upload Area -->
    <div
      v-if="!hasFile"
      @click="openFileDialog"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      class="relative border-2 border-dashed border-border rounded-xl p-12 text-center transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5"
      :class="{
        'border-primary bg-primary/10': isDragOver,
        'border-destructive bg-destructive/5': uploadError
      }"
    >
      <div class="flex flex-col items-center space-y-4">
        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Upload class="w-8 h-8 text-primary" />
        </div>

        <div>
          <h3 class="text-xl font-mono font-semibold text-card-foreground mb-2">
            Sube tu foto
          </h3>
          <p class="text-muted-foreground font-sans mb-4">
            Arrastra y suelta tu imagen aquí o haz clic para seleccionar
          </p>
          <p class="text-sm text-muted-foreground font-sans">
            Formatos: JPG, PNG, WebP • Máximo 10MB
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300"
        >
          <Camera class="w-4 h-4 mr-2" />
          Seleccionar imagen
        </button>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        @change="handleFileChange"
        class="hidden"
      />
    </div>

    <!-- Preview -->
    <div v-if="hasFile && previewUrl" class="relative">
      <div class="relative rounded-xl overflow-hidden bg-card border border-border">
        <img
          :src="previewUrl"
          :alt="selectedFile?.name"
          class="w-full h-auto max-h-96 object-contain"
        />

        <button
          @click="removeFile"
          class="absolute top-4 right-4 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors duration-300"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="mt-4 p-4 bg-secondary/50 rounded-lg">
        <p class="text-sm font-mono text-card-foreground">
          {{ selectedFile?.name }}
        </p>
        <p class="text-xs text-muted-foreground font-sans">
          {{ Math.round((selectedFile?.size || 0) / 1024) }} KB
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="uploadError" class="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
      <div class="flex items-center space-x-2">
        <AlertCircle class="w-5 h-5 text-destructive" />
        <p class="text-sm font-sans text-destructive">{{ uploadError }}</p>
      </div>
    </div>
  </div>
</template>