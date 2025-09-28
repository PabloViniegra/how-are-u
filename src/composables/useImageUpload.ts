import { ref } from 'vue';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from '@/consts';

export const useImageUpload = () => {
  const selectedFile = ref<File | null>(null);
  const previewUrl = ref<string | null>(null);
  const uploadError = ref<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as any)) {
      return 'Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `El archivo es muy grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB permitidos.`;
    }

    return null;
  };

  const selectFile = (file: File) => {
    const error = validateFile(file);

    if (error) {
      uploadError.value = error;
      return false;
    }

    uploadError.value = null;
    selectedFile.value = file;

    // Create preview URL
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    previewUrl.value = URL.createObjectURL(file);

    return true;
  };

  const clearFile = () => {
    selectedFile.value = null;
    uploadError.value = null;

    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = null;
    }
  };

  const handleFileInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      selectFile(file);
    }
  };

  const handleFileDrop = (event: DragEvent) => {
    event.preventDefault();

    const file = event.dataTransfer?.files[0];

    if (file) {
      selectFile(file);
    }
  };

  return {
    selectedFile,
    previewUrl,
    uploadError,
    selectFile,
    clearFile,
    handleFileInput,
    handleFileDrop,
    validateFile,
  };
};