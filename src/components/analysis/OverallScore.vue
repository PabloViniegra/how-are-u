<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import type { Analysis } from "@/types";
import { SCORE_RANGES } from "@/consts";

interface Props {
  analysis: Analysis;
}

const props = defineProps<Props>();

const scoreRange = computed(() => {
  const score = props.analysis.overall_score;
  if (score >= 8) return SCORE_RANGES.EXCELLENT;
  if (score >= 6) return SCORE_RANGES.GOOD;
  if (score >= 4) return SCORE_RANGES.AVERAGE;
  return SCORE_RANGES.POOR;
});

// Setup hover animations for score circle
const setupScoreHoverAnimations = () => {
  const scoreCircle = document.querySelector('.score-circle');
  if (scoreCircle) {
    scoreCircle.addEventListener('mouseenter', () => {
      gsap.to(scoreCircle, {
        scale: 1.05,
        rotationY: 5,
        duration: 0.3,
        ease: "power2.out"
      });

      // Animate the score text
      const scoreText = scoreCircle.querySelector('.score-text');
      if (scoreText) {
        gsap.to(scoreText, {
          scale: 1.1,
          color: "rgb(var(--primary))",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    scoreCircle.addEventListener('mouseleave', () => {
      gsap.to(scoreCircle, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
        ease: "power2.out"
      });

      const scoreText = scoreCircle.querySelector('.score-text');
      if (scoreText) {
        gsap.to(scoreText, {
          scale: 1,
          color: "rgb(var(--primary))",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  }
};

// Timer cleanup
let setupTimer: NodeJS.Timeout | null = null;

onMounted(() => {
  // Setup hover animations after component is mounted
  setupTimer = setTimeout(() => {
    if (typeof document !== 'undefined') {
      setupScoreHoverAnimations();
    }
  }, 500);
});

onUnmounted(() => {
  // Clean up timer on unmount
  if (setupTimer) {
    clearTimeout(setupTimer);
    setupTimer = null;
  }
});
</script>

<template>
  <div class="result-card bg-card border border-border rounded-xl p-8 text-center cursor-pointer transition-all duration-300">
    <h3
      class="text-lg font-mono tracking-tighter font-semibold text-card-foreground mb-4"
    >
      Puntuación General
    </h3>

    <div class="score-circle relative w-32 h-32 mx-auto mb-4">
      <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        <!-- Background circle -->
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="currentColor"
          stroke-width="8"
          class="text-secondary"
        />
        <!-- Progress circle -->
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="currentColor"
          stroke-width="8"
          :stroke-dasharray="`${(analysis.overall_score / 10) * 314} 314`"
          :class="`text-${scoreRange?.color}-500`"
          class="transition-all duration-1000 ease-out"
          stroke-linecap="round"
        />
      </svg>

      <div
        class="score-text absolute inset-0 flex flex-col items-center justify-center"
      >
        <span class="text-3xl font-mono font-bold text-primary">
          {{ analysis.overall_score.toFixed(1) }}
        </span>
        <span class="text-sm text-muted-foreground font-sans">/ 10</span>
      </div>
    </div>

    <div
      class="inline-flex items-center px-4 py-2 rounded-full text-sm font-sans"
      :class="`bg-${scoreRange?.color}-100 text-${scoreRange?.color}-800`"
    >
      {{ scoreRange?.label }}
    </div>
  </div>
</template>