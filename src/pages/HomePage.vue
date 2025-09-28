<script setup lang="ts">
import { onMounted } from "vue";
import HeroSection from "@/features/home/components/HeroSection.vue";
import FeaturesSection from "@/features/home/components/FeaturesSection.vue";
import CTASection from "@/features/home/components/CTASection.vue";

const setupParallaxEffect = () => {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".parallax");

    parallaxElements.forEach((element) => {
      const speed = element.getAttribute("data-speed") || 0.5;
      // @ts-ignore
      const yPos = -(scrolled * parseFloat(speed));
      // @ts-ignore
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
};

onMounted(() => {
  // Setup parallax effects
  setupParallaxEffect();
});
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <HeroSection />
    <FeaturesSection />
    <CTASection />
  </div>
</template>
