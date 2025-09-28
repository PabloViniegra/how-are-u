<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

interface Props {
  currentStep: "upload" | "processing" | "result";
}

defineProps<Props>();

const progressStepsRef = ref<HTMLElement>();

const animateProgressSteps = () => {
  if (progressStepsRef.value) {
    const steps = progressStepsRef.value.querySelectorAll(
      ".step-circle, .step-connector"
    );

    gsap.fromTo(
      steps,
      {
        scale: 0.9,
        opacity: 0.7,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.2)",
        stagger: 0.1,
      }
    );
  }
};

onMounted(() => {
  // Progress steps animation
  setTimeout(() => {
    animateProgressSteps();
  }, 400);
});

// Watch for external step changes to re-animate
defineExpose({
  animateProgressSteps,
});
</script>

<template>
  <div ref="progressStepsRef" class="flex justify-center mb-12">
    <div class="flex items-center space-x-4">
      <div class="flex items-center">
        <div
          class="step-circle w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono font-semibold transition-all duration-300"
          :class="
            currentStep === 'upload'
              ? 'bg-primary text-primary-foreground shadow-lg scale-110'
              : 'bg-secondary text-muted-foreground'
          "
        >
          1
        </div>
        <span
          class="ml-2 text-sm font-sans"
          :class="
            currentStep === 'upload'
              ? 'text-primary'
              : 'text-muted-foreground'
          "
        >
          Subir imagen
        </span>
      </div>

      <div
        class="step-connector w-8 h-0.5 transition-all duration-500"
        :class="
          ['processing', 'result'].includes(currentStep)
            ? 'bg-primary shadow-sm'
            : 'bg-secondary'
        "
      ></div>

      <div class="flex items-center">
        <div
          class="step-circle w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono font-semibold transition-all duration-300"
          :class="
            currentStep === 'processing'
              ? 'bg-primary text-primary-foreground shadow-lg scale-110'
              : currentStep === 'result'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-secondary text-muted-foreground'
          "
        >
          2
        </div>
        <span
          class="ml-2 text-sm font-sans"
          :class="
            ['processing', 'result'].includes(currentStep)
              ? 'text-primary'
              : 'text-muted-foreground'
          "
        >
          Procesando
        </span>
      </div>

      <div
        class="step-connector w-8 h-0.5 transition-all duration-500"
        :class="
          currentStep === 'result' ? 'bg-primary shadow-sm' : 'bg-secondary'
        "
      ></div>

      <div class="flex items-center">
        <div
          class="step-circle w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono font-semibold transition-all duration-300"
          :class="
            currentStep === 'result'
              ? 'bg-primary text-primary-foreground shadow-lg scale-110'
              : 'bg-secondary text-muted-foreground'
          "
        >
          3
        </div>
        <span
          class="ml-2 text-sm font-sans"
          :class="
            currentStep === 'result'
              ? 'text-primary'
              : 'text-muted-foreground'
          "
        >
          Resultados
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-circle {
  position: relative;
  overflow: hidden;
}

.step-circle::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s;
}

.step-circle:hover::before {
  width: 100%;
  height: 100%;
}

/* Custom cursor for interactive elements */
.step-circle:not(.active) {
  cursor: pointer;
}
</style>