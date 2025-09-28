<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Camera, Sparkles, Star, Zap, Users, Shield } from "lucide-vue-next";
import { gsap } from "gsap";

const router = useRouter();
const heroRef = ref<HTMLElement>();
const titleRef = ref<HTMLElement>();
const statsRef = ref<HTMLElement>();
const floatingElementsRef = ref<HTMLElement>();

const stats = [
  { value: "98%", label: "Precisión", icon: Star },
  { value: "<3s", label: "Análisis", icon: Zap },
  { value: "5k+", label: "Usuarios", icon: Users },
  { value: "100%", label: "Privado", icon: Shield },
];

const createFloatingElements = () => {
  const container = floatingElementsRef.value;
  if (!container) return;

  for (let i = 0; i < 8; i++) {
    const element = document.createElement("div");
    element.className =
      "absolute w-2 h-2 bg-primary/20 rounded-full floating-element";
    element.style.left = Math.random() * 100 + "%";
    element.style.top = Math.random() * 100 + "%";
    container.appendChild(element);

    gsap.to(element, {
      y: -30,
      x: Math.random() * 40 - 20,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2,
    });

    gsap.to(element, {
      opacity: 0.3,
      scale: 1.5,
      duration: 2 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random(),
    });
  }
};

const navigateToAnalysis = () => {
  console.log("Navegando a /make-beauty");
  try {
    router.push("/make-beauty");
  } catch (error) {
    console.error("Error navegando:", error);
    window.location.href = "/make-beauty";
  }
};

onMounted(() => {
  // @ts-ignore
  gsap.from(heroRef.value?.querySelector(".hero-content"), {
    duration: 1.2,
    y: 60,
    opacity: 0,
    ease: "power3.out",
  });

  // @ts-ignore
  gsap.from(heroRef.value?.querySelectorAll(".animated-text"), {
    duration: 0.8,
    y: 20,
    opacity: 0,
    stagger: 0.2,
    delay: 0.5,
    ease: "power2.out",
  });

  if (titleRef.value) {
    gsap.to(titleRef.value, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5,
    });

    gsap.to(titleRef.value, {
      rotation: 1,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2,
    });

    gsap.to(titleRef.value, {
      scale: 1.02,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.8,
    });
  }

  createFloatingElements();

  setTimeout(() => {
    const heroButtons = heroRef.value?.querySelectorAll(".glow-button");
    if (heroButtons) {
      gsap.to(heroButtons, {
        boxShadow: "0 0 30px rgba(var(--primary), 0.3)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, 200);
});
</script>

<template>
  <section ref="heroRef" class="relative px-6 lg:px-8 py-24 lg:py-32">
    <div
      ref="floatingElementsRef"
      class="absolute inset-0 pointer-events-none parallax"
      data-speed="0.3"
    ></div>

    <div class="mx-auto max-w-4xl text-center hero-content">
      <h1
        ref="titleRef"
        class="text-5xl lg:text-7xl font-sans font-extrabold tracking-tight text-primary mb-8 animated-text"
      >
        ¿Cómo de
        <span
          class="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text animated-text"
        >
          Guap@
        </span>
        <span class="animated-text">eres?</span>
      </h1>

      <p
        class="text-xl lg:text-2xl text-muted-foreground font-sans font-medium mb-12 max-w-2xl mx-auto leading-relaxed animated-text"
      >
        Análisis científico de atractivo facial usando inteligencia artificial.
        Obtén una puntuación detallada y recomendaciones personalizadas.
      </p>

      <div
        class="flex flex-col sm:flex-row gap-4 justify-center mb-16 animated-text"
      >
        <button
          @click.stop="navigateToAnalysis"
          class="glow-button group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-foreground bg-gradient-to-r from-primary to-primary/80 rounded-full hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          style="z-index: 10"
        >
          <Camera
            class="w-5 h-5 mr-2 group-hover:rotate-6 transition-transform duration-300"
          />
          Analizar mi foto
          <div
            class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12"
          ></div>
        </button>

        <button
          @click="$router.push('/summary/123')"
          class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary bg-secondary rounded-full hover:bg-secondary/80 transition-all duration-300 transform hover:scale-105"
        >
          <Sparkles class="w-4 h-4 mr-2" />
          Ver análisis compartido
        </button>
      </div>

      <!-- Enhanced Stats -->
      <div
        ref="statsRef"
        class="stats-container grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
      >
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-item text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
        >
          <div
            class="w-10 h-10 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center"
          >
            <component :is="stat.icon" class="w-5 h-5 text-primary" />
          </div>
          <div
            class="text-2xl lg:text-3xl font-mono font-bold text-primary mb-1"
          >
            {{ stat.value }}
          </div>
          <div class="text-xs lg:text-sm text-muted-foreground font-sans">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div
      class="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl parallax"
      data-speed="0.2"
    ></div>
    <div
      class="absolute bottom-32 right-16 w-32 h-32 bg-accent/5 rounded-full blur-2xl parallax"
      data-speed="0.4"
    ></div>
  </section>
</template>
