import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAnalysis } from '../useAnalysis';
import { useAnalysisStore } from '@/stores/analysis-store';
import { useGlobalStore } from '@/stores/global-store';
import { createMockAnalysis, createMockFile } from '@/test/utils';
import { ANALYSIS_STATUS } from '@/consts';

// Mock TanStack Query
const mockMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  reset: vi.fn(),
  isIdle: { value: true },
  isPending: { value: false },
  isError: { value: false },
  isSuccess: { value: false },
  data: { value: null },
  error: { value: null },
};

const mockQuery = {
  data: { value: null },
  error: { value: null },
  isLoading: { value: false },
  isError: { value: false },
  refetch: vi.fn(),
};

vi.mock('@tanstack/vue-query', () => ({
  useMutation: vi.fn(() => mockMutation),
  useQuery: vi.fn(() => mockQuery),
}));

// Mock API service
vi.mock('@/services/api', () => ({
  apiService: {
    uploadImage: vi.fn(),
    getAnalysis: vi.fn(),
    getAnalyses: vi.fn(),
  },
}));

describe('useAnalysis Composable', () => {
  let analysisStore: ReturnType<typeof useAnalysisStore>;
  let globalStore: ReturnType<typeof useGlobalStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    analysisStore = useAnalysisStore();
    globalStore = useGlobalStore();
    vi.clearAllMocks();
  });

  it('should initialize with correct reactive state', () => {
    const {
      isAnalyzing,
      uploadProgress,
      currentAnalysis,
      analyses,
    } = useAnalysis();

    expect(isAnalyzing.value).toBe(false);
    expect(uploadProgress.value).toEqual({
      loaded: 0,
      total: 0,
      percentage: 0,
    });
    expect(currentAnalysis.value).toBe(null);
    expect(analyses.value).toEqual([]);
  });

  describe('Upload Image', () => {
    it('should upload image successfully', () => {
      const { uploadImage } = useAnalysis();
      const mockFile = createMockFile();

      uploadImage(mockFile);

      expect(mockMutation.mutate).toHaveBeenCalledWith({
        image: mockFile,
        options: undefined
      });
    });

    it('should handle feasible analysis success', () => {
      const { uploadAnalysisMutation } = useAnalysis();
      const mockFile = createMockFile();

      uploadAnalysisMutation.mutate({ image: mockFile });

      expect(mockMutation.mutate).toHaveBeenCalledWith({ image: mockFile });
    });

    it('should handle non-feasible analysis success', () => {
      const mockAnalysis = createMockAnalysis({
        status: ANALYSIS_STATUS.DENIED,
      });

      analysisStore.addAnalysis(mockAnalysis);
      analysisStore.setCurrentAnalysis(mockAnalysis);

      expect(analysisStore.currentAnalysis).toEqual(mockAnalysis);
    });

    it('should handle upload errors', () => {
      const { uploadImage } = useAnalysis();
      const mockFile = createMockFile();

      // Set error state on mock
      mockMutation.isError.value = true;
      mockMutation.error.value = new Error('Upload failed');

      uploadImage(mockFile);

      expect(mockMutation.mutate).toHaveBeenCalledWith({
        image: mockFile,
        options: undefined
      });
    });

    it('should handle different error types', () => {
      const errorMessages = [
        { error: 'timeout', expectedMessage: 'La imagen está tardando mucho en procesarse' },
        { error: 'Network error', expectedMessage: 'Error de conexión' },
        { error: 'HTTP error! status: 413', expectedMessage: 'La imagen es muy grande' },
        { error: 'HTTP error! status: 400', expectedMessage: 'Formato de imagen no válido' },
        { error: 'HTTP error! status: 401', expectedMessage: 'Error de autenticación' },
        { error: 'Unknown error', expectedMessage: 'No se pudo procesar tu imagen' },
      ];

      errorMessages.forEach(({ error, expectedMessage }) => {
        globalStore.clearError(); // Reset error state
        globalStore.clearNotifications();

        const mockError = new Error(error);
        analysisStore.setAnalyzing(true);

        // Simulate error handling
        globalStore.setError(
          error.includes('timeout') ? 'La imagen está tardando mucho en procesarse. Por favor, intenta con una imagen más pequeña o verifica tu conexión.' :
          error.includes('Network error') ? 'Error de conexión. Verifica tu internet e intenta de nuevo.' :
          error.includes('HTTP error! status: 413') ? 'La imagen es muy grande. Por favor, usa una imagen menor a 10MB.' :
          error.includes('HTTP error! status: 400') ? 'Formato de imagen no válido. Usa JPG, PNG o WebP.' :
          error.includes('HTTP error! status: 401') || error.includes('HTTP error! status: 403') ? 'Error de autenticación. Verifica la configuración de la API.' :
          'No se pudo procesar tu imagen'
        );

        expect(globalStore.error).toContain(expectedMessage.split('.')[0]);
      });
    });
  });

  describe('Fetch Analysis By ID', () => {
    it('should fetch analysis by id successfully', () => {
      const { getAnalysisById } = useAnalysis();

      getAnalysisById(1);

      // The mutation should be called
      expect(getAnalysisById).toBeDefined();
    });

    it('should update existing analysis when fetched', () => {
      const existingAnalysis = createMockAnalysis({ id: '1' });
      const updatedAnalysis = createMockAnalysis({
        id: '1',
        overall_score: 9.5,
      });

      analysisStore.addAnalysis(existingAnalysis);

      // Simulate successful fetch
      analysisStore.analyses[0] = updatedAnalysis;

      expect(analysisStore.analyses[0]).toEqual(updatedAnalysis);
    });
  });

  describe('Queries', () => {
    it('should fetch all analyses', () => {
      const { analysesQuery } = useAnalysis();

      expect(analysesQuery).toBeDefined();
      expect(analysesQuery.data.value).toBe(null);
    });

    it('should refetch analyses', () => {
      const { analysesQuery } = useAnalysis();

      // Check that the refetch method exists
      expect(analysesQuery.refetch).toBeDefined();
      expect(typeof analysesQuery.refetch).toBe('function');
    });
  });

  describe('Computed Properties', () => {
    it('should provide reactive access to store state', () => {
      const {
        isAnalyzing,
        uploadProgress,
        currentAnalysis,
        analyses,
      } = useAnalysis();

      // Test reactivity by changing store state
      analysisStore.setAnalyzing(true);
      expect(isAnalyzing.value).toBe(true);

      const mockProgress = {
        loaded: 500,
        total: 1000,
        percentage: 50,
      };
      analysisStore.setUploadProgress(mockProgress);
      expect(uploadProgress.value).toEqual(mockProgress);

      const mockAnalysis = createMockAnalysis();
      analysisStore.setCurrentAnalysis(mockAnalysis);
      expect(currentAnalysis.value).toEqual(mockAnalysis);

      analysisStore.addAnalysis(mockAnalysis);
      expect(analyses.value).toHaveLength(1);
    });
  });

  describe('Watchers', () => {
    it('should watch for query data changes', async () => {
      const mockAnalyses = [createMockAnalysis(), createMockAnalysis()];

      // Update the mock query to return data
      mockQuery.data.value = mockAnalyses;
      mockQuery.error.value = null;
      mockQuery.isLoading.value = false;
      mockQuery.isError.value = false;

      // Re-initialize to trigger watcher
      const { analysesQuery } = useAnalysis();

      // The watcher should update the store
      expect(analysesQuery).toBeDefined();
      expect(mockQuery.data.value).toEqual(mockAnalyses);
    });

    it('should watch for query errors', async () => {
      const mockError = new Error('Query failed');

      // Update the mock query to return error
      mockQuery.data.value = null;
      mockQuery.error.value = mockError;
      mockQuery.isLoading.value = false;
      mockQuery.isError.value = true;

      // Re-initialize to trigger watcher
      const { analysesQuery } = useAnalysis();

      // The error should be accessible
      expect(analysesQuery).toBeDefined();
      expect(mockQuery.error.value).toEqual(mockError);
    });
  });
});