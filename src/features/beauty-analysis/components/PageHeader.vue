<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import { gsap } from "gsap";

const router = useRouter();
const headerRef = ref<HTMLElement>();

const goBack = () => {
  router.push("/");
};

onMounted(() => {
  // Header animations with stagger
  if (headerRef.value) {
    const headerElements = headerRef.value.querySelectorAll("button, h1, p");

    gsap.fromTo(
      headerElements,
      {
        y: -30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
        stagger: 0.15,
        delay: 0.2,
      }
    );
  }
});
</script>

<template>
  <div ref="headerRef" class="text-center mb-12">
    <button
      @click="goBack"
      class="back-button inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 mb-6 cursor-pointer"
    >
      <ArrowLeft class="w-4 h-4 mr-2" />
      Volver al inicio
    </button>

    <h1
      class="floating-title text-4xl lg:text-5xl font-sans tracking-tight font-bold text-primary mb-4"
    >
      Análisis de
      <span
        class="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text"
      >
        Belleza
      </span>
    </h1>

    <p class="text-lg text-muted-foreground font-serif max-w-2xl mx-auto">
      Sube una foto clara de tu rostro para obtener un análisis detallado de
      tus características faciales usando inteligencia artificial.
    </p>
  </div>
</template>

<style scoped>
.back-button {
  position: relative;
  overflow: hidden;
}

.back-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s;
}

.back-button:hover::before {
  left: 100%;
}

/* Gradient animation for title */
.floating-title .bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>