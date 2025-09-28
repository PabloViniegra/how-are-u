<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Sparkles, Shield, Zap, Brain } from "lucide-vue-next";
import { gsap } from "gsap";

const router = useRouter();
const ctaRef = ref<HTMLElement>();

const navigateToAnalysis = () => {
  console.log("Navegando a /make-beauty");
  try {
    router.push("/make-beauty");
  } catch (error) {
    console.error("Error navegando:", error);
    // Fallback usando window.location
    window.location.href = "/make-beauty";
  }
};

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
          // Reset the opacity and transform
          gsap.set(target, { opacity: 1, y: 0 });

          gsap.fromTo(target,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
            }
          );
        }

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  // Wait for DOM to be ready then observe elements
  setTimeout(() => {
    const elements = ctaRef.value?.querySelectorAll(".animate-on-scroll");
    if (elements) {
      elements.forEach((el) => {
        observer.observe(el);
      });
    }
  }, 100);
};

onMounted(() => {
  setupScrollAnimations();

  // Continuous button glow animation for CTA buttons specifically
  setTimeout(() => {
    const ctaButtons = ctaRef.value?.querySelectorAll(".glow-button");
    if (ctaButtons) {
      gsap.to(ctaButtons, {
        boxShadow: "0 0 40px rgba(59, 130, 246, 0.4), 0 8px 25px rgba(0, 0, 0, 0.15)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, 300);
});
</script>

<template>
  <section ref="ctaRef" class="relative py-24 overflow-hidden">
    <div class="mx-auto max-w-4xl text-center px-6 lg:px-8 animate-on-scroll">
      <div class="relative z-10">
        <h2
          class="text-3xl lg:text-4xl font-sans tracking-tight font-bold text-primary mb-6"
        >
          Listo para descubrir tu puntuación
        </h2>

        <p
          class="text-lg text-muted-foreground font-sans mb-8 max-w-2xl mx-auto"
        >
          El análisis es completamente gratuito y seguro. Tus fotos no se
          almacenan y el proceso es 100% anónimo.
        </p>

        <div class="relative inline-block">
          <button
            @click.stop="navigateToAnalysis"
            class="glow-button group relative inline-flex items-center justify-center px-12 py-6 text-xl font-medium text-primary-foreground bg-gradient-to-r from-primary via-primary to-accent rounded-full hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-primary/25"
            style="z-index: 10;"
          >
            <Sparkles
              class="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300"
            />
            Comenzar análisis
            <div
              class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12"
            ></div>
          </button>

          <!-- Pulsing ring effect -->
          <div
            class="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"
          ></div>
          <div
            class="absolute inset-0 rounded-full border border-primary/20"
            style="
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              animation-delay: 0.5s;
            "
          ></div>
        </div>

        <!-- Trust indicators -->
        <div class="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div class="text-center">
            <Shield class="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div class="text-sm font-sans text-muted-foreground">
              100% Seguro
            </div>
          </div>
          <div class="text-center">
            <Zap class="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div class="text-sm font-sans text-muted-foreground">
              Instantáneo
            </div>
          </div>
          <div class="text-center">
            <Brain class="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div class="text-sm font-sans text-muted-foreground">
              IA Avanzada
            </div>
          </div>
        </div>
      </div>

      <!-- Background animated gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 parallax"
        data-speed="0.1"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl opacity-50"
      ></div>
    </div>
  </section>
</template>

<style scoped>
.glow-button {
  position: relative;
  overflow: hidden;
}

.glow-button::before {
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

.glow-button:hover::before {
  left: 100%;
}

.parallax {
  will-change: transform;
}

/* Enhanced gradient animation */
.animate-on-scroll {
  /* GSAP will handle these properties */
}

/* Ensure proper stacking context for z-index */
.relative {
  position: relative;
}

/* Enhanced button styles */
.glow-button {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.glow-button:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Pulsing ring animation */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>