<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Camera, BarChart3, Sparkles, Zap } from "lucide-vue-next";
import { gsap } from "gsap";

const featuresRef = ref<HTMLElement>();

const features = [
  {
    icon: Camera,
    title: "Análisis Instantáneo",
    description:
      "Sube tu foto y obtén resultados en segundos usando IA avanzada",
  },
  {
    icon: BarChart3,
    title: "Puntuación Detallada",
    description:
      "Recibe métricas específicas sobre diferentes aspectos de tu rostro",
  },
  {
    icon: Sparkles,
    title: "Recomendaciones",
    description: "Obtén consejos personalizados para mejorar tu apariencia",
  },
  {
    icon: Zap,
    title: "Tecnología IA",
    description:
      "Basado en algoritmos de visión computacional y estándares científicos",
  },
];

const setupScrollAnimations = () => {
  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;

        if (target.classList.contains("animate-on-scroll")) {
          gsap.from(target, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        }

        if (target.classList.contains("feature-cards")) {
          gsap.from(target.querySelectorAll(".feature-card"), {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          });
        }

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(".animate-on-scroll, .feature-cards")
    .forEach((el) => {
      observer.observe(el);
    });
};

onMounted(() => {
  setupScrollAnimations();
});
</script>

<template>
  <section
    ref="featuresRef"
    class="relative py-24 bg-gradient-to-b from-secondary/30 to-background overflow-hidden"
  >
    <div class="mx-auto max-w-6xl px-6 lg:px-8">
      <div class="text-center mb-16 animate-on-scroll">
        <h2
          class="text-3xl lg:text-4xl font-sans tracking-tight font-bold text-primary mb-4"
        >
          ¿Cómo funciona?
        </h2>
        <p class="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
          Nuestro algoritmo analiza múltiples aspectos de tu rostro usando
          técnicas de visión computacional y estándares científicos de
          belleza.
        </p>
      </div>

      <div class="feature-cards grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="feature-card group relative p-6 bg-card/95 backdrop-blur-md rounded-xl border border-border/70 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:bg-card shadow-md"
        >
          <!-- Animated background gradient -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>

          <div class="relative z-10">
            <div
              class="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm"
            >
              <component
                :is="feature.icon"
                class="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <h3
              class="text-lg font-mono font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors duration-300"
            >
              {{ feature.title }}
            </h3>

            <p
              class="text-muted-foreground font-sans text-sm leading-relaxed"
            >
              {{ feature.description }}
            </p>
          </div>

          <!-- Hover indicator -->
          <div
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 rounded-t-full"
          ></div>
        </div>
      </div>
    </div>

    <!-- Background decorative elements -->
    <div
      class="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl parallax"
      data-speed="0.6"
    ></div>
    <div
      class="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl parallax"
      data-speed="0.4"
    ></div>
  </section>
</template>