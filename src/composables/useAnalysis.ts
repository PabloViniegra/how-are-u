import { computed, watch } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useAnalysisStore } from '@/stores/analysis-store';
import { useGlobalStore } from '@/stores/global-store';
import { apiService } from '@/services/api';
import type { Analysis, AnalysisRequest } from '@/types';
import { ANALYSIS_STATUS } from '@/consts';

export const useAnalysis = () => {
  const analysisStore = useAnalysisStore();
  const globalStore = useGlobalStore();

  // Upload and create analysis
  const uploadAnalysisMutation = useMutation({
    mutationFn: async (request: AnalysisRequest) => {
      analysisStore.setAnalyzing(true);
      analysisStore.resetUploadProgress();

      const response = await apiService.uploadImage(
        request.image,
        (progress) => {
          analysisStore.setUploadProgress(progress);
        }
      );

      return response.data;
    },
    onSuccess: (analysis: Analysis) => {
      analysisStore.addAnalysis(analysis);
      analysisStore.setCurrentAnalysis(analysis);

      // Si el análisis no es feasible, mostrar inmediatamente
      if (analysis.status !== ANALYSIS_STATUS.FEASIBLE) {
        analysisStore.setAnalyzing(false);
        return;
      }

      // Si es feasible, continuar con la lógica normal
      globalStore.addNotification({
        type: 'success',
        title: 'Análisis completado',
        message: 'Tu imagen ha sido analizada exitosamente',
      });
    },
    onError: (error: any) => {
      console.error('Upload failed:', error);

      let userMessage = 'No se pudo procesar tu imagen';

      if (error.message.includes('timeout')) {
        userMessage = 'La imagen está tardando mucho en procesarse. Por favor, intenta con una imagen más pequeña o verifica tu conexión.';
      } else if (error.message.includes('Network error')) {
        userMessage = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
      } else if (error.message.includes('HTTP error! status: 413')) {
        userMessage = 'La imagen es muy grande. Por favor, usa una imagen menor a 10MB.';
      } else if (error.message.includes('HTTP error! status: 400')) {
        userMessage = 'Formato de imagen no válido. Usa JPG, PNG o WebP.';
      } else if (error.message.includes('HTTP error! status: 401') || error.message.includes('HTTP error! status: 403')) {
        userMessage = 'Error de autenticación. Verifica la configuración de la API.';
      }

      globalStore.setError(userMessage);
      analysisStore.setAnalyzing(false);
      analysisStore.resetUploadProgress();

      globalStore.addNotification({
        type: 'error',
        title: 'Error en el análisis',
        message: userMessage,
        duration: 8000, // Mostrar por más tiempo para errores
      });
    },
    onSettled: () => {
      // Solo marcar como no analizando si ya terminó completamente
      if (analysisStore.currentAnalysis?.status) {
        analysisStore.setAnalyzing(false);
      }
    },
  });

  // Fetch analysis by ID
  const fetchAnalysisByIdMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiService.getAnalysis(id);
      return response.data;
    },
    onSuccess: (analysis: Analysis) => {
      // Actualizar análisis en la lista
      const index = analysisStore.analyses.findIndex(a => a.id === analysis.id);
      if (index !== -1) {
        analysisStore.analyses[index] = analysis;
      }

      // Actualizar análisis actual
      if (analysisStore.currentAnalysis?.id === analysis.id) {
        analysisStore.setCurrentAnalysis(analysis);
      }

      // Si ahora es feasible, notificar
      if (analysis.status === ANALYSIS_STATUS.FEASIBLE) {
        globalStore.addNotification({
          type: 'success',
          title: 'Análisis actualizado',
          message: 'Tu análisis está listo para visualizar',
        });
      }
    },
    onError: (error: any) => {
      console.error('Fetch analysis failed:', error);
      globalStore.setError(error.message || 'Error al obtener el análisis');
    },
  });

  // Get all analyses
  const analysesQuery = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const response = await apiService.getAnalyses();
      return response.data;
    },
  });

  // Watch for successful data fetching
  watch(
    () => analysesQuery.data.value,
    (data) => {
      if (data && !analysisStore.isAnalyzing) {
        analysisStore.analyses = data;
      }
    },
    { immediate: false }
  );

  // Watch for errors
  watch(
    () => analysesQuery.error.value,
    (error) => {
      if (error) {
        console.error('Fetch analyses failed:', error);
        globalStore.setError(error.message || 'Error al cargar los análisis');
      }
    },
    { immediate: false }
  );

  const uploadImage = (file: File, options?: any) => {
    return uploadAnalysisMutation.mutate({ image: file, options });
  };

  const getAnalysisById = (id: number) => {
    return fetchAnalysisByIdMutation.mutate(id);
  };

  const refetchAnalyses = () => {
    return analysesQuery.refetch();
  };

  return {
    // Mutations
    uploadAnalysisMutation,
    fetchAnalysisByIdMutation,
    // Queries
    analysesQuery,
    // Actions
    uploadImage,
    getAnalysisById,
    refetchAnalyses,
    // State from store (using computed to ensure reactivity)
    isAnalyzing: computed(() => analysisStore.isAnalyzing),
    uploadProgress: computed(() => analysisStore.uploadProgress),
    currentAnalysis: computed(() => analysisStore.currentAnalysis),
    analyses: computed(() => analysisStore.analyses),
  };
};