<script setup lang="ts">
import { computed } from "vue";
import { AlertTriangle, XCircle, CheckCircle } from "lucide-vue-next";
import type { Analysis } from "@/types";
import { ANALYSIS_STATUS, STATUS_LABELS } from "@/consts";

interface Props {
  analysis: Analysis;
}

const props = defineProps<Props>();

const statusIcon = computed(() => {
  switch (props.analysis.status) {
    case ANALYSIS_STATUS.FEASIBLE:
      return CheckCircle;
    case ANALYSIS_STATUS.IMPROVABLE:
      return AlertTriangle;
    case ANALYSIS_STATUS.DENIED:
      return XCircle;
    default:
      return XCircle;
  }
});

const statusColor = computed(() => {
  switch (props.analysis.status) {
    case ANALYSIS_STATUS.FEASIBLE:
      return "text-green-500";
    case ANALYSIS_STATUS.IMPROVABLE:
      return "text-yellow-500";
    case ANALYSIS_STATUS.DENIED:
      return "text-red-500";
    default:
      return "text-gray-500";
  }
});

const statusBgColor = computed(() => {
  switch (props.analysis.status) {
    case ANALYSIS_STATUS.FEASIBLE:
      return "bg-green-50 border-green-200";
    case ANALYSIS_STATUS.IMPROVABLE:
      return "bg-yellow-50 border-yellow-200";
    case ANALYSIS_STATUS.DENIED:
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
});
</script>

<template>
  <div class="bg-card border border-border rounded-xl p-6">
    <div class="flex items-center space-x-4">
      <div
        :class="[
          'w-12 h-12 rounded-full flex items-center justify-center',
          statusBgColor,
        ]"
      >
        <component :is="statusIcon" :class="['w-6 h-6', statusColor]" />
      </div>

      <div>
        <h2
          class="text-xl font-mono tracking-tight font-bold text-card-foreground"
        >
          {{ STATUS_LABELS[analysis.status] }}
        </h2>

        <p
          v-if="analysis.status === ANALYSIS_STATUS.DENIED"
          class="text-muted-foreground font-sans"
        >
          La imagen no contiene un rostro válido para analizar. Por favor,
          sube una foto clara de tu cara.
        </p>

        <p
          v-else-if="analysis.status === ANALYSIS_STATUS.IMPROVABLE"
          class="text-muted-foreground font-sans"
        >
          El rostro es detectable pero la calidad de la imagen es
          insuficiente. Intenta con mejor iluminación y resolución.
        </p>

        <p v-else class="text-muted-foreground font-sans">
          Tu imagen ha sido analizada exitosamente. Aquí están tus resultados.
        </p>
      </div>
    </div>
  </div>
</template>