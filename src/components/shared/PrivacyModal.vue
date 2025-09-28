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
            Política de Privacidad
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
              1. Información que Recopilamos
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Recopilamos únicamente la información necesaria para proporcionar
              nuestro servicio de análisis facial:
            </p>
            <ul class="mb-4 text-muted-foreground font-serif list-disc pl-6">
              <li>Imágenes faciales subidas por el usuario para análisis</li>
              <li>
                Datos técnicos básicos del dispositivo (navegador, sistema
                operativo)
              </li>
              <li>
                Información de uso de la aplicación para mejorar nuestros
                servicios
              </li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              2. Cómo Utilizamos su Información
            </h3>
            <ul class="mb-4 text-muted-foreground list-disc pl-6 font-serif">
              <li>
                Procesar las imágenes para realizar el análisis facial
                solicitado
              </li>
              <li>
                Mejorar la precisión y calidad de nuestros algoritmos de IA
              </li>
              <li>Proporcionar soporte técnico cuando sea necesario</li>
              <li>
                Analizar patrones de uso para optimizar la experiencia del
                usuario
              </li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              3. Almacenamiento y Seguridad
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Implementamos medidas de seguridad técnicas y organizativas
              apropiadas para proteger su información:
            </p>
            <ul class="mb-4 text-muted-foreground font-serif list-disc pl-6">
              <li>
                Las imágenes se procesan en tiempo real y se eliminan
                automáticamente después del análisis
              </li>
              <li>
                No almacenamos permanentemente imágenes faciales en nuestros
                servidores
              </li>
              <li>
                Utilizamos cifrado en tránsito para todas las comunicaciones
              </li>
              <li>
                Acceso restringido a los datos por parte del personal autorizado
              </li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              4. Compartir Información
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              No vendemos, intercambiamos o transferimos su información personal
              a terceros, excepto en las siguientes circunstancias:
            </p>
            <ul class="mb-4 text-muted-foreground font-serif list-disc pl-6">
              <li>Cuando sea requerido por ley o proceso legal</li>
              <li>Para proteger nuestros derechos, propiedad o seguridad</li>
              <li>
                Con proveedores de servicios que nos ayudan a operar la
                aplicación (bajo estrictos acuerdos de confidencialidad)
              </li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              5. Sus Derechos
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Usted tiene derecho a:
            </p>
            <ul class="mb-4 text-muted-foreground font-serif list-disc pl-6">
              <li>Acceder a la información que tenemos sobre usted</li>
              <li>Solicitar la corrección de información inexacta</li>
              <li>Solicitar la eliminación de su información personal</li>
              <li>Retirar el consentimiento para el procesamiento de datos</li>
              <li>
                Presentar una queja ante la autoridad de protección de datos
                correspondiente
              </li>
            </ul>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              6. Cookies y Tecnologías Similares
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Utilizamos cookies y tecnologías similares para mejorar su
              experiencia de usuario, recordar sus preferencias y analizar el
              tráfico del sitio web.
            </p>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              7. Menores de Edad
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Nuestra aplicación no está dirigida a menores de 18 años. No
              recopilamos conscientemente información personal de menores de
              edad.
            </p>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              8. Cambios en esta Política
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Podemos actualizar esta política de privacidad ocasionalmente. Le
              notificaremos sobre cambios significativos publicando la nueva
              política en nuestra aplicación.
            </p>

            <h3 class="text-xl font-semibold mb-4 font-sans text-foreground">
              9. Contacto
            </h3>
            <p class="mb-4 text-muted-foreground font-serif">
              Si tiene preguntas sobre esta política de privacidad o sobre cómo
              manejamos su información personal, puede contactarnos a través de
              los canales oficiales de la aplicación.
            </p>

            <p class="text-sm text-muted-foreground italic font-mono">
              Última actualización: 25 de septiembre de 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
