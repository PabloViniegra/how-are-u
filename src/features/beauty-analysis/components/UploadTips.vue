<script setup lang="ts">
import { onMounted } from "vue";

const tips = [
  "Usa buena iluminación natural o artificial",
  "Mira directamente a la cámara",
  "Evita sombras en el rostro",
  "Usa una imagen de alta resolución",
];

onMounted(() => {
  // Setup hover animations after mount
  setTimeout(() => {
    setupTipHoverAnimations();
  }, 500);
});

// Animate tips cards on hover
const setupTipHoverAnimations = () => {
  // Check if document is available (SSR safe)
  if (typeof document === 'undefined') return;

  const tipCards = document.querySelectorAll(".tip-card");
  tipCards.forEach((card, _index) => {
    card.addEventListener("mouseenter", () => {
      // Animate the card
      (card as HTMLElement).style.transform = "translateY(-5px) scale(1.02)";
      (card as HTMLElement).style.transition = "all 0.3s ease";

      // Animate the dot
      const dot = card.querySelector(".bg-primary");
      if (dot) {
        (dot as HTMLElement).style.transform = "scale(1.2)";
        (dot as HTMLElement).style.boxShadow =
          "0 0 15px rgba(var(--primary), 0.6)";
        (dot as HTMLElement).style.transition = "all 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", () => {
      (card as HTMLElement).style.transform = "translateY(0) scale(1)";

      const dot = card.querySelector(".bg-primary");
      if (dot) {
        (dot as HTMLElement).style.transform = "scale(1)";
        (dot as HTMLElement).style.boxShadow = "none";
      }
    });
  });
};
</script>

<template>
  <div class="mt-12 bg-secondary/30 rounded-xl p-6">
    <h3
      class="text-lg font-mono font-semibold tracking-tighter text-card-foreground mb-4 text-center"
    >
      Consejos para mejores resultados
    </h3>

    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="(tip, index) in tips"
        :key="index"
        class="tip-card flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 cursor-default"
      >
        <div
          class="w-2 h-2 bg-primary rounded-full mt-2 transition-all duration-300"
        ></div>
        <p class="text-[14px] font-sans font-medium text-muted-foreground">
          {{ tip }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced hover effects */
.tip-card {
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
}

.tip-card:hover {
  border-color: rgba(var(--primary), 0.2);
  background: rgba(var(--primary), 0.05);
  backdrop-filter: blur(15px);
}

.tip-card:hover .bg-primary {
  box-shadow: 0 0 15px rgba(var(--primary), 0.6);
}

/* Custom cursor for interactive elements */
.tip-card {
  cursor: pointer;
}
</style>
