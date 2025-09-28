<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { Loader2, CheckCircle, X } from 'lucide-vue-next';
import { gsap } from 'gsap';
import type { UploadProgress } from '@/types';

interface Props {
  progress: UploadProgress;
  isComplete?: boolean;
  showCancel?: boolean;
}

const emit = defineEmits<{
  cancel: [];
}>();

const props = withDefaults(defineProps<Props>(), {
  isComplete: false,
  showCancel: true
});

const isUploading = computed(() => props.progress.percentage > 0 && !props.isComplete);

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const handleCancel = () => {
  emit('cancel');
};

// Animation refs
const progressBarRef = ref<HTMLElement>();
const progressFillRef = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();
const percentageRef = ref<HTMLElement>();
const shimmerRef = ref<HTMLElement>();


// Watch for progress changes and animate
watch(() => props.progress.percentage, (newProgress, oldProgress) => {
  if (progressFillRef.value && newProgress !== oldProgress) {
    // Animate the progress bar fill
    gsap.to(progressFillRef.value, {
      width: `${newProgress}%`,
      duration: 0.5,
      ease: "power2.out"
    });

    // Animate the percentage counter
    if (percentageRef.value) {
      gsap.to({ value: oldProgress || 0 }, {
        value: newProgress,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function() {
          if (percentageRef.value) {
            percentageRef.value.textContent = `${Math.round(this.targets()[0].value)}%`;
          }
        }
      });
    }

    // Add pulse effect when reaching milestones
    if (newProgress === 100 && !props.isComplete) {
      gsap.to(progressFillRef.value, {
        scale: 1.02,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  }
}, { immediate: false });

// Watch for completion
watch(() => props.isComplete, (isComplete) => {
  if (isComplete && progressFillRef.value) {
    // Success animation
    gsap.to(progressFillRef.value, {
      background: "linear-gradient(90deg, #22c55e, #16a34a)",
      duration: 0.5,
      ease: "power2.out"
    });

    // Scale animation for completion
    gsap.fromTo(progressFillRef.value,
      { scale: 1 },
      {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      }
    );
  }
});

// Mount animation
onMounted(() => {
  if (containerRef.value) {
    gsap.fromTo(containerRef.value,
      {
        y: 20,
        opacity: 0,
        scale: 0.98
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      }
    );
  }
});
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div ref="containerRef" class="bg-card border border-border rounded-xl p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <Loader2
              v-if="isUploading"
              class="w-6 h-6 text-primary animate-spin"
            />
            <CheckCircle
              v-else-if="isComplete"
              class="w-6 h-6 text-green-500"
            />
            <div
              v-else
              class="w-6 h-6 bg-muted rounded-full"
            />
          </div>

          <div>
            <h3 class="font-mono font-semibold text-card-foreground">
              {{ isComplete ? 'Análisis completado' : isUploading ? 'Subiendo y analizando imagen...' : 'Analizando con IA...' }}
            </h3>
            <p class="text-sm text-muted-foreground font-sans">
              {{ isComplete ? 'Tu imagen ha sido procesada exitosamente' : isUploading ? 'Subiendo tu imagen y procesando con IA avanzada' : 'Analizando características faciales y calculando métricas' }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-right">
            <div ref="percentageRef" class="text-2xl font-mono font-bold text-primary">
              {{ progress.percentage }}%
            </div>
            <div class="text-xs text-muted-foreground font-sans">
              {{ formatBytes(progress.loaded) }} / {{ formatBytes(progress.total) }}
            </div>
          </div>

          <!-- Cancel button -->
          <button
            v-if="showCancel && !isComplete"
            @click="handleCancel"
            class="w-8 h-8 flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full transition-colors duration-300"
            title="Cancelar análisis"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div ref="progressBarRef" class="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          ref="progressFillRef"
          class="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80"
          :style="{ width: '0%' }"
        />

        <!-- Enhanced shimmer effect during upload -->
        <div
          v-if="isUploading"
          ref="shimmerRef"
          class="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          :style="{
            transform: `translateX(${progress.percentage * 2}%)`,
            animation: 'shimmer 2s ease-in-out infinite'
          }"
        />
      </div>

      <!-- Status Messages -->
      <div class="mt-4 space-y-2">
        <div
          v-if="progress.percentage >= 10"
          class="flex items-center text-sm font-sans"
          :class="progress.percentage >= 100 ? 'text-green-600' : 'text-muted-foreground'"
        >
          <div class="w-2 h-2 rounded-full mr-3" :class="progress.percentage >= 100 ? 'bg-green-500' : 'bg-primary'" />
          Imagen subida y siendo analizada
        </div>

        <div
          v-if="progress.percentage >= 100 && !isComplete"
          class="flex items-center text-sm font-sans text-blue-600"
        >
          <div class="w-2 h-2 rounded-full bg-blue-500 mr-3 animate-pulse" />
          Analizando rostro...
        </div>

        <div
          v-if="progress.percentage >= 100 && !isComplete"
          class="flex items-center text-sm font-sans text-muted-foreground"
        >
          <div class="w-2 h-2 rounded-full bg-gray-400 mr-3" />
          Calculando métricas de belleza
        </div>

        <div
          v-if="isComplete"
          class="flex items-center text-sm font-sans text-green-600"
        >
          <div class="w-2 h-2 rounded-full bg-green-500 mr-3" />
          Análisis completado
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(300%);
    opacity: 0;
  }
}

.shimmer-effect {
  animation: shimmer 2s ease-in-out infinite;
}
</style>