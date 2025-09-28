<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import { X } from "lucide-vue-next";

interface Props {
  show: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const modalRef = ref<HTMLElement>();
const overlayRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();

const handleEscKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    emit("close");
  }
};

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === overlayRef.value) {
    emit("close");
  }
};

watch(
  () => props.show,
  async (newShow) => {
    if (newShow) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";

      await nextTick();

      if (overlayRef.value && contentRef.value) {
        gsap.fromTo(
          overlayRef.value,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.fromTo(
          contentRef.value,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
        );
      }
    } else {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";

      if (overlayRef.value && contentRef.value) {
        gsap.to(overlayRef.value, { opacity: 0, duration: 0.2 });
        gsap.to(contentRef.value, {
          opacity: 0,
          scale: 0.95,
          y: -10,
          duration: 0.2,
        });
      }
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscKey);
  document.body.style.overflow = "auto";
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      ref="modalRef"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        ref="overlayRef"
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="handleOverlayClick"
      />

      <div
        ref="contentRef"
        class="relative bg-card border border-border rounded-lg shadow-2xl max-w-4xl max-h-[80vh] w-full overflow-hidden"
      >
        <div
          class="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between"
        >
          <h2 class="text-2xl font-bold font-sans text-foreground">
            Términos y Condiciones
          </h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Cerrar modal"
          >
            <X class="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div class="px-6 py-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div class="prose prose-sm max-w-none font-sans text-foreground">
            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              1. Aceptación de los Términos
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Al acceder y utilizar la aplicación "How Are U", usted acepta
              cumplir y estar sujeto a estos términos y condiciones. Si no está
              de acuerdo con alguno de estos términos, no debe usar nuestra
              aplicación.
            </p>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              2. Descripción del Servicio
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              "How Are U" es una aplicación de análisis de belleza facial que
              utiliza inteligencia artificial para proporcionar evaluaciones
              estéticas basadas en las imágenes proporcionadas por el usuario.
            </p>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              3. Uso de las Imágenes
            </h3>
            <ul class="mb-4 text-muted-foreground list-disc pl-6">
              <li>
                Las imágenes subidas son procesadas únicamente para el análisis
                facial solicitado
              </li>
              <li>
                No almacenamos permanentemente las imágenes en nuestros
                servidores
              </li>
              <li>El usuario conserva todos los derechos sobre sus imágenes</li>
              <li>
                No compartimos las imágenes con terceros sin consentimiento
                explícito
              </li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              4. Limitaciones del Servicio
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Los resultados proporcionados por nuestra aplicación son
              estimaciones basadas en algoritmos de IA y no deben considerarse
              como evaluaciones médicas o profesionales. La belleza es subjetiva
              y nuestros análisis son únicamente para fines de entretenimiento.
            </p>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              5. Responsabilidades del Usuario
            </h3>
            <ul class="mb-4 text-muted-foreground font-serif list-disc pl-6">
              <li>Solo subir imágenes propias o con autorización explícita</li>
              <li>No utilizar la aplicación para fines ilegales o dañinos</li>
              <li>Respetar los derechos de propiedad intelectual</li>
              <li>Mantener la confidencialidad de su cuenta si aplicable</li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              6. Modificaciones
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios serán efectivos inmediatamente después de su
              publicación en la aplicación.
            </p>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              7. Contacto
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Si tiene preguntas sobre estos términos, puede contactarnos a
              través de los canales oficiales de la aplicación.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
