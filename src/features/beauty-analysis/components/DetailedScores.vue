<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import type { Analysis } from "../types";
import { getFieldTranslation } from "../consts";

interface Props {
  analysis: Analysis;
}

defineProps<Props>();

const getFeaturePercentage = (value: number) => {
  return Math.round((value / 10) * 100);
};

const setupDetailedScoreAnimations = () => {
  // Animate detailed score cards
  const scoreCards = document.querySelectorAll('.detailed-score-card');
  scoreCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        scale: 1.03,
        rotationX: 5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out",
        delay: index * 0.02
      });

      // Animate the score number inside
      const scoreNumber = card.querySelector('.score-number');
      if (scoreNumber) {
        gsap.to(scoreNumber, {
          scale: 1.2,
          rotationZ: 5,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        rotationX: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      });

      const scoreNumber = card.querySelector('.score-number');
      if (scoreNumber) {
        gsap.to(scoreNumber, {
          scale: 1,
          rotationZ: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });

  // Animate additional scores progress bars
  const progressBars = document.querySelectorAll('.progress-bar-container');
  progressBars.forEach((container, index) => {
    container.addEventListener('mouseenter', () => {
      gsap.to(container, {
        y: -3,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        delay: index * 0.03
      });

      const progressBar = container.querySelector('.progress-fill');
      if (progressBar) {
        gsap.to(progressBar, {
          scaleY: 1.2,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      const percentage = container.querySelector('.percentage-text');
      if (percentage) {
        gsap.to(percentage, {
          scale: 1.1,
          fontWeight: "bold",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    container.addEventListener('mouseleave', () => {
      gsap.to(container, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      const progressBar = container.querySelector('.progress-fill');
      if (progressBar) {
        gsap.to(progressBar, {
          scaleY: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      const percentage = container.querySelector('.percentage-text');
      if (percentage) {
        gsap.to(percentage, {
          scale: 1,
          fontWeight: "500",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });
};

// Timer cleanup
let setupTimer: NodeJS.Timeout | null = null;

onMounted(() => {
  // Setup hover animations after component is mounted
  setupTimer = setTimeout(() => {
    if (typeof document !== 'undefined') {
      setupDetailedScoreAnimations();
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
  <div class="space-y-6">
    <!-- Detailed Scores -->
    <div
      v-if="analysis.detailed_scores"
      class="bg-card border border-border rounded-xl p-6"
    >
      <h3
        class="text-lg font-mono tracking-tight font-semibold text-card-foreground mb-6"
      >
        Puntuaciones Detalladas
      </h3>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(value, key) in analysis.detailed_scores"
          :key="key"
          class="detailed-score-card text-center p-4 bg-secondary/30 rounded-lg"
        >
          <div class="score-number text-2xl font-mono font-bold text-primary mb-1">
            {{ value.toFixed(1) }}
          </div>
          <div class="text-xs text-muted-foreground font-sans">
            {{ getFieldTranslation(key) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Scores -->
    <div
      v-if="analysis.additional_scores"
      class="bg-card border border-border rounded-xl p-6"
    >
      <h3 class="text-lg font-mono font-semibold text-card-foreground mb-6">
        Métricas Adicionales
      </h3>

      <div class="grid md:grid-cols-2 gap-4">
        <div
          v-for="(value, key) in analysis.additional_scores"
          :key="key"
          class="progress-bar-container space-y-2"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm font-sans text-card-foreground">
              {{ getFieldTranslation(key) }}
            </span>
            <span class="percentage-text text-sm font-mono font-semibold text-primary">
              {{ getFeaturePercentage(value) }}%
            </span>
          </div>

          <div class="w-full bg-secondary rounded-full h-2">
            <div
              class="progress-fill bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000 ease-out"
              :style="{ width: `${getFeaturePercentage(value)}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Scientific Explanation -->
    <div
      v-if="analysis.scientific_explanation"
      class="result-card bg-card border border-border rounded-xl p-6"
    >
      <h3
        class="text-lg font-mono tracking-tight font-semibold text-card-foreground mb-4"
      >
        Explicación Científica
      </h3>
      <p
        class="text-sm font-serif text-muted-foreground leading-relaxed text-balance"
      >
        {{ analysis.scientific_explanation }}
      </p>
    </div>

    <!-- Recommendations -->
    <div
      v-if="analysis.recommendations"
      class="result-card bg-card border border-border rounded-xl p-6"
    >
      <h3
        class="text-lg font-mono tracking-tight font-semibold text-card-foreground mb-4"
      >
        Recomendaciones
      </h3>
      <div class="p-4 bg-secondary/30 rounded-lg">
        <p
          class="text-sm font-serif text-card-foreground leading-relaxed text-balance"
        >
          {{ analysis.recommendations }}
        </p>
      </div>
    </div>
  </div>
</template>