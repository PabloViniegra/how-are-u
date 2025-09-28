<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { RotateCcw } from "lucide-vue-next";
import { gsap } from "gsap";
import { useAnalysis } from "@/composables/useAnalysis";
import ImageUpload from "@/components/upload/ImageUpload.vue";
import UploadProgress from "@/components/upload/UploadProgress.vue";
import AnalysisResult from "@/components/analysis/AnalysisResult.vue";
import PageHeader from "@/components/beauty/PageHeader.vue";
import ProgressSteps from "@/components/beauty/ProgressSteps.vue";
import UploadTips from "@/components/beauty/UploadTips.vue";
import { ANALYSIS_STATUS } from "@/consts";

const router = useRouter();
const containerRef = ref<HTMLElement>();
const progressStepsRef = ref<any>();
const contentRef = ref<HTMLElement>();

const { uploadImage, uploadProgress, currentAnalysis, uploadAnalysisMutation } =
  useAnalysis();

const currentStep = ref<"upload" | "processing" | "result">("upload");
const selectedFile = ref<File | null>(null);
const currentImageUrl = ref<string | null>(null);

const canShowResult = computed(() => {
  return (
    currentAnalysis?.value &&
    (currentAnalysis.value.status === ANALYSIS_STATUS.FEASIBLE ||
      currentAnalysis.value.status === ANALYSIS_STATUS.IMPROVABLE ||
      currentAnalysis.value.status === ANALYSIS_STATUS.DENIED)
  );
});

const onFileSelected = (file: File) => {
  selectedFile.value = file;
  currentStep.value = "processing";
  // Create local image URL
  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value);
  }
  currentImageUrl.value = URL.createObjectURL(file);
  uploadImage(file);
};

const onFileRemoved = () => {
  selectedFile.value = null;
  currentStep.value = "upload";
  // Clean up image URL
  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value);
    currentImageUrl.value = null;
  }
};

const resetAnalysis = () => {
  selectedFile.value = null;
  currentStep.value = "upload";
  // Clean up image URL
  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value);
    currentImageUrl.value = null;
  }
};

const cancelAnalysis = () => {
  // Reset mutation state
  if (uploadAnalysisMutation) {
    uploadAnalysisMutation.reset();
  }

  // Reset local state
  resetAnalysis();
};

const goBack = () => {
  router.push("/");
};

// Animation functions
const animateProgressSteps = () => {
  if (progressStepsRef.value?.animateProgressSteps) {
    progressStepsRef.value.animateProgressSteps();
  }
};

const animateResultElements = () => {
  // Check if document exists (for testing environment)
  if (typeof document === "undefined") return;

  // Animate action buttons
  const actionButtons = document.querySelector(".action-buttons");
  if (actionButtons) {
    const buttons = actionButtons.querySelectorAll("button");

    gsap.fromTo(
      buttons,
      {
        y: 20,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.2)",
        stagger: 0.1,
      }
    );
  }

  // Animate image and cards if they exist
  const resultCards = document.querySelectorAll(".bg-card");
  if (resultCards.length > 0) {
    gsap.fromTo(
      resultCards,
      {
        y: 30,
        opacity: 0,
        rotationX: 10,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      }
    );
  }
};

// Watch for step changes and animate
watch(currentStep, (newStep, oldStep) => {
  if (contentRef.value && newStep !== oldStep) {
    // Animate content transition
    gsap.fromTo(
      contentRef.value,
      {
        y: 30,
        opacity: 0,
        scale: 0.98,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
      }
    );

    // Animate progress steps
    animateProgressSteps();

    // Special animation for result step
    if (newStep === "result") {
      setTimeout(() => {
        animateResultElements();
      }, 300);
    }
  }
});

// Watch for analysis completion
watch(
  () => uploadAnalysisMutation?.isSuccess?.value,
  (isSuccess) => {
    if (isSuccess && canShowResult.value) {
      currentStep.value = "result";
    }
  },
  { immediate: false }
);

// Watch for analysis errors
watch(
  () => uploadAnalysisMutation?.isError?.value,
  (isError) => {
    if (isError) {
      currentStep.value = "upload";
    }
  },
  { immediate: false }
);

onMounted(() => {
  if (containerRef.value) {
    gsap.fromTo(
      containerRef.value,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }
    );
  }
});

onUnmounted(() => {
  // Clean up image URL when component is unmounted
  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value);
  }
});
</script>

<template>
  <div ref="containerRef" class="min-h-screen py-12 px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <PageHeader />

      <ProgressSteps ref="progressStepsRef" :current-step="currentStep" />

      <!-- Content based on current step -->
      <div ref="contentRef" class="space-y-8">
        <!-- Upload Step -->
        <div v-if="currentStep === 'upload'">
          <ImageUpload
            @file-selected="onFileSelected"
            @file-removed="onFileRemoved"
          />

          <UploadTips />
        </div>

        <!-- Processing Step -->
        <div v-if="currentStep === 'processing'">
          <UploadProgress
            :progress="uploadProgress || { loaded: 0, total: 0, percentage: 0 }"
            :is-complete="uploadAnalysisMutation?.isSuccess?.value || false"
            @cancel="cancelAnalysis"
          />
        </div>

        <!-- Results Step -->
        <div v-if="currentStep === 'result' && currentAnalysis">
          <AnalysisResult
            :analysis="currentAnalysis"
            :image-url="currentImageUrl"
          />

          <!-- Action Buttons -->
          <div class="flex justify-center space-x-4 mt-8 action-buttons">
            <button
              @click="resetAnalysis"
              class="action-button inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all duration-300 shadow-sm"
            >
              <RotateCcw class="w-4 h-4 mr-2" />
              Nuevo análisis
            </button>

            <button
              @click="goBack"
              class="action-button inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-sm"
            >
              Volver al inicio
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="uploadAnalysisMutation?.isError?.value" class="text-center">
          <div
            class="bg-destructive/10 border border-destructive/20 rounded-xl p-6"
          >
            <h3 class="text-lg font-mono font-semibold text-destructive mb-2">
              Error en el análisis
            </h3>
            <p class="text-sm font-sans text-muted-foreground mb-4">
              {{
                uploadAnalysisMutation?.error?.value?.message ||
                "Ha ocurrido un error inesperado"
              }}
            </p>
            <button
              @click="resetAnalysis"
              class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-button {
  position: relative;
  overflow: hidden;
}

.action-button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.action-button:hover::after {
  width: 300px;
  height: 300px;
}

* {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.action-button {
  cursor: pointer;
}
</style>
