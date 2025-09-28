<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { Share, Download } from "lucide-vue-next";
import { gsap } from "gsap";
import type { Analysis } from "../types";
import { ANALYSIS_STATUS } from "../consts";
import { useGlobalStore } from "@/shared/global-store";
import StatusCard from "./StatusCard.vue";
import OverallScore from "./OverallScore.vue";
import DetailedScores from "./DetailedScores.vue";

interface Props {
  analysis: Analysis;
  imageUrl?: string | null;
  showShareButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showShareButton: true,
});

const globalStore = useGlobalStore();

const shareAnalysis = async () => {
  try {
    const shareUrl = `${window.location.origin}/summary/${props.analysis.id}`;

    if (navigator.share) {
      await navigator.share({
        title: "Mi Análisis de Belleza",
        text: `¡Mira mi análisis de belleza! Obtuve una puntuación de ${props.analysis.overall_score}/10`,
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      globalStore.addNotification({
        type: "success",
        title: "Enlace copiado",
        message: "El enlace para compartir ha sido copiado al portapapeles",
      });
    }
  } catch (err) {
    console.error("Error sharing:", err);
    // Fallback: copy to clipboard
    try {
      const shareUrl = `${window.location.origin}/summary/${props.analysis.id}`;
      await navigator.clipboard.writeText(shareUrl);
      globalStore.addNotification({
        type: "success",
        title: "Enlace copiado",
        message: "El enlace para compartir ha sido copiado al portapapeles",
      });
    } catch (clipboardErr) {
      globalStore.addNotification({
        type: "error",
        title: "Error",
        message: "No se pudo compartir el análisis",
      });
    }
  }
};

const downloadResult = () => {
  // Esta funcionalidad se puede implementar más tarde
  globalStore.addNotification({
    type: "info",
    title: "Próximamente",
    message: "La función de descarga estará disponible pronto",
  });
};

const setupResultHoverAnimations = () => {
  // Animate result cards
  const resultCards = document.querySelectorAll(".result-card");
  resultCards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -5,
        scale: 1.02,
        rotationY: 2,
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        duration: 0.4,
        ease: "power2.out",
        delay: index * 0.05,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        rotationY: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        duration: 0.4,
        ease: "power2.out",
      });
    });
  });
};

// Timer cleanup
let setupTimer: NodeJS.Timeout | null = null;

onMounted(() => {
  // Setup hover animations after component is mounted
  setupTimer = setTimeout(() => {
    if (typeof document !== "undefined") {
      setupResultHoverAnimations();
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
  <div class="w-full max-w-4xl mx-auto space-y-6">
    <StatusCard :analysis="analysis" />

    <!-- Share Actions -->
    <div
      v-if="showShareButton && analysis.status === ANALYSIS_STATUS.FEASIBLE"
      class="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
    >
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-center sm:text-left">
          <h3 class="text-lg font-mono font-semibold text-card-foreground mb-1">
            ¡Comparte tu resultado!
          </h3>
          <p class="text-sm text-muted-foreground">
            Muestra tu análisis de belleza con tus amigos y familia
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="shareAnalysis"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Share class="w-4 h-4 mr-2" />
            Compartir
          </button>

          <button
            @click="downloadResult"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-all duration-300"
          >
            <Download class="w-4 h-4 mr-2" />
            Descargar
          </button>
        </div>
      </div>
    </div>

    <!-- Image Display -->
    <div v-if="imageUrl" class="bg-card border border-border rounded-xl p-6">
      <div class="flex justify-center">
        <div class="relative max-w-md w-full">
          <img
            :src="imageUrl"
            alt="Imagen analizada"
            class="w-full h-auto rounded-lg shadow-md object-cover backdrop-blur-lg"
            style="max-height: 400px"
          />
          <div
            class="absolute inset-0 rounded-lg border-2 border-primary/20"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="analysis.status === ANALYSIS_STATUS.FEASIBLE" class="space-y-6">
      <OverallScore :analysis="analysis" />
      <DetailedScores :analysis="analysis" />
    </div>
  </div>
</template>
