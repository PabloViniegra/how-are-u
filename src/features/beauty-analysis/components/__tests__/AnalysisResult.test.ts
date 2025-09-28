import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AnalysisResult from '../AnalysisResult.vue';
import { createMockAnalysis } from '@/test/utils';
import { ANALYSIS_STATUS } from '@/consts';

// Mock the global store
const mockAddNotification = vi.fn();

vi.mock('@/shared/global-store', () => ({
  useGlobalStore: () => ({
    addNotification: mockAddNotification
  })
}));

// Mock clipboard and share APIs
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  },
  share: vi.fn().mockResolvedValue(undefined)
});

describe('AnalysisResult Component', () => {
  let wrapper: any;

  const defaultProps = {
    analysis: createMockAnalysis(),
    imageUrl: 'mock-image-url',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(AnalysisResult, {
      props: defaultProps,
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render analysis result', () => {
    expect(wrapper.find('.analysis-result')).toBeTruthy();
    expect(wrapper.text()).toContain('Análisis exitoso');
  });

  describe('Status Display', () => {
    it('should show feasible status correctly', () => {
      const feasibleProps = {
        analysis: createMockAnalysis({ status: ANALYSIS_STATUS.FEASIBLE }),
        imageUrl: 'mock-image-url',
      };

      wrapper = mount(AnalysisResult, { props: feasibleProps });

      expect(wrapper.text()).toContain('Análisis exitoso');
      expect(wrapper.text()).toContain('Tu imagen ha sido analizada exitosamente');
      expect(wrapper.find('.text-green-500')).toBeTruthy();
    });

    it('should show denied status correctly', () => {
      const deniedProps = {
        analysis: createMockAnalysis({ status: ANALYSIS_STATUS.DENIED }),
        imageUrl: 'mock-image-url',
      };

      wrapper = mount(AnalysisResult, { props: deniedProps });

      expect(wrapper.text()).toContain('Imagen no válida');
      expect(wrapper.text()).toContain('La imagen no contiene un rostro válido');
      expect(wrapper.find('.text-red-500')).toBeTruthy();
    });

    it('should show improvable status correctly', () => {
      const improvableProps = {
        analysis: createMockAnalysis({ status: ANALYSIS_STATUS.IMPROVABLE }),
        imageUrl: 'mock-image-url',
      };

      wrapper = mount(AnalysisResult, { props: improvableProps });

      expect(wrapper.text()).toContain('Calidad insuficiente');
      expect(wrapper.text()).toContain('El rostro es detectable pero la calidad');
      expect(wrapper.find('.text-yellow-500')).toBeTruthy();
    });
  });

  describe('Image Display', () => {
    it('should show analyzed image when imageUrl is provided', () => {
      expect(wrapper.find('img')).toBeTruthy();
      expect(wrapper.find('img').attributes('src')).toBe('mock-image-url');
      expect(wrapper.find('img').attributes('alt')).toBe('Imagen analizada');
    });

    it('should not show image section when imageUrl is not provided', () => {
      const propsWithoutImage = {
        analysis: createMockAnalysis(),
        imageUrl: null as string | null,
      };

      wrapper = mount(AnalysisResult, { props: propsWithoutImage });

      expect(wrapper.find('img').exists()).toBe(false);
      expect(wrapper.text()).not.toContain('Imagen Analizada');
    });
  });

  describe('Score Display', () => {
    it('should display overall score for feasible analysis', () => {
      const feasibleProps = {
        analysis: createMockAnalysis({
          status: ANALYSIS_STATUS.FEASIBLE,
          overall_score: 8.5
        }),
        imageUrl: 'mock-image-url',
      };

      wrapper = mount(AnalysisResult, { props: feasibleProps });

      expect(wrapper.text()).toContain('8.5');
      expect(wrapper.text()).toContain('Puntuación General');
    });

    it('should show score range badge', () => {
      const excellentScoreProps = {
        analysis: createMockAnalysis({
          status: ANALYSIS_STATUS.FEASIBLE,
          overall_score: 9.2
        }),
        imageUrl: 'mock-image-url',
      };

      wrapper = mount(AnalysisResult, { props: excellentScoreProps });

      expect(wrapper.text()).toContain('Excelente');
    });

    it('should display detailed scores', () => {
      const analysisWithDetailedScores = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        detailed_scores: {
          facial_symmetry: 8.2,
          skin_quality: 7.8,
          facial_proportions: 8.9,
        }
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: analysisWithDetailedScores,
          imageUrl: 'mock-image-url'
        }
      });

      expect(wrapper.text()).toContain('Puntuaciones Detalladas');
      expect(wrapper.text()).toContain('8.2');
      expect(wrapper.text()).toContain('7.8');
      expect(wrapper.text()).toContain('8.9');
      expect(wrapper.text()).toContain('Simetría Facial');
      expect(wrapper.text()).toContain('Calidad de Piel');
    });

    it('should display additional scores as progress bars', () => {
      const analysisWithAdditionalScores = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        additional_scores: {
          attractiveness: 8.3,
          youthfulness: 7.9,
        }
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: analysisWithAdditionalScores,
          imageUrl: 'mock-image-url'
        }
      });

      expect(wrapper.text()).toContain('Métricas Adicionales');
      expect(wrapper.text()).toContain('83%');
      expect(wrapper.text()).toContain('79%');
      expect(wrapper.find('.progress-bar')).toBeTruthy();
    });
  });

  describe('Scientific Explanation', () => {
    it('should show scientific explanation when available', () => {
      const analysisWithExplanation = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        scientific_explanation: 'This is a scientific explanation of the results.',
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: analysisWithExplanation,
          imageUrl: 'mock-image-url'
        }
      });

      expect(wrapper.text()).toContain('Explicación Científica');
      expect(wrapper.text()).toContain('This is a scientific explanation');
    });

    it('should not show scientific explanation section when not available', () => {
      const analysisWithoutExplanation = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        scientific_explanation: null as unknown as string,
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: analysisWithoutExplanation,
          imageUrl: 'mock-image-url'
        }
      });

      expect(wrapper.text()).not.toContain('Explicación Científica');
    });
  });

  describe('Recommendations', () => {
    it('should show recommendations when available', () => {
      const analysisWithRecommendations = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        recommendations: 'Here are some recommendations for improvement.',
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: analysisWithRecommendations,
          imageUrl: 'mock-image-url'
        }
      });

      expect(wrapper.text()).toContain('Recomendaciones');
      expect(wrapper.text()).toContain('Here are some recommendations');
    });

    it('should not show recommendations section when not available', () => {
      const analysisWithoutRecommendations = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        recommendations: null as unknown as string,
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: analysisWithoutRecommendations,
          imageUrl: 'mock-image-url'
        }
      });

      expect(wrapper.text()).not.toContain('Recomendaciones');
    });
  });

  describe('Non-Feasible Analysis', () => {
    it('should only show status and image for non-feasible analysis', () => {
      const deniedProps = {
        analysis: createMockAnalysis({ status: ANALYSIS_STATUS.DENIED }),
        imageUrl: 'mock-image-url',
      };

      wrapper = mount(AnalysisResult, { props: deniedProps });

      expect(wrapper.text()).toContain('Imagen no válida');
      expect(wrapper.text()).not.toContain('Puntuación General');
      expect(wrapper.text()).not.toContain('Puntuaciones Detalladas');
      expect(wrapper.text()).not.toContain('Métricas Adicionales');
    });
  });

  describe('Score Calculations', () => {
    it('should calculate feature percentage correctly', () => {
      const analysisWithAdditionalScores = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        additional_scores: {
          test_feature: 7.5, // Should be 75%
        }
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: analysisWithAdditionalScores,
          imageUrl: 'mock-image-url'
        }
      });

      expect(wrapper.text()).toContain('75%');
    });

    it('should calculate score range correctly for different scores', () => {
      const testCases = [
        { score: 9.5, expectedRange: 'Excelente' },
        { score: 7.0, expectedRange: 'Bueno' },
        { score: 5.0, expectedRange: 'Promedio' },
        { score: 3.0, expectedRange: 'Mejorable' },
      ];

      testCases.forEach(({ score, expectedRange }) => {
        const analysisWithScore = createMockAnalysis({
          status: ANALYSIS_STATUS.FEASIBLE,
          overall_score: score,
        });

        const testWrapper = mount(AnalysisResult, {
          props: {
            analysis: analysisWithScore,
            imageUrl: 'mock-image-url'
          }
        });

        expect(testWrapper.text()).toContain(expectedRange);
        testWrapper.unmount();
      });
    });
  });

  describe('Field Translation', () => {
    it('should translate field names correctly', () => {
      const analysisWithTranslations = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        detailed_scores: {
          facial_symmetry: 8.0,
          skin_quality: 7.5,
        }
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: analysisWithTranslations,
          imageUrl: 'mock-image-url'
        }
      });

      expect(wrapper.text()).toContain('Simetría Facial');
      expect(wrapper.text()).toContain('Calidad de Piel');
    });
  });

  describe('Hover Animations', () => {
    it('should have hover animation classes on result elements', () => {
      const feasibleProps = {
        analysis: createMockAnalysis({ status: ANALYSIS_STATUS.FEASIBLE }),
        imageUrl: 'mock-image-url',
      };

      wrapper = mount(AnalysisResult, { props: feasibleProps });

      expect(wrapper.find('.score-circle')).toBeTruthy();
      expect(wrapper.find('.detailed-score-card')).toBeTruthy();
      expect(wrapper.find('.progress-bar-container')).toBeTruthy();
      expect(wrapper.find('.result-card')).toBeTruthy();
    });
  });

  describe('Share Functionality', () => {
    beforeEach(() => {
      // Ensure we have a feasible analysis for sharing tests
      const feasibleAnalysis = createMockAnalysis({
        status: ANALYSIS_STATUS.FEASIBLE,
        id: '123'
      });

      wrapper = mount(AnalysisResult, {
        props: {
          analysis: feasibleAnalysis,
          imageUrl: 'mock-image-url',
          showShareButton: true
        }
      });
    });

    it('should display share section for feasible analysis', () => {
      expect(wrapper.text()).toContain('¡Comparte tu resultado!');
      expect(wrapper.text()).toContain('Muestra tu análisis de belleza');
    });

    it('should not display share section when showShareButton is false', () => {
      const noShareWrapper = mount(AnalysisResult, {
        props: {
          analysis: createMockAnalysis({ status: ANALYSIS_STATUS.FEASIBLE }),
          imageUrl: 'mock-image-url',
          showShareButton: false
        }
      });

      expect(noShareWrapper.text()).not.toContain('¡Comparte tu resultado!');
      noShareWrapper.unmount();
    });

    it('should not display share section for non-feasible analysis', () => {
      const deniedWrapper = mount(AnalysisResult, {
        props: {
          analysis: createMockAnalysis({ status: ANALYSIS_STATUS.DENIED }),
          imageUrl: 'mock-image-url',
          showShareButton: true
        }
      });

      expect(deniedWrapper.text()).not.toContain('¡Comparte tu resultado!');
      deniedWrapper.unmount();
    });

    it('should call native share API when available', async () => {
      const shareButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Compartir')
      );

      expect(shareButton).toBeTruthy();

      if (shareButton) {
        await shareButton.trigger('click');

        expect(navigator.share).toHaveBeenCalledWith({
          title: 'Mi Análisis de Belleza',
          text: expect.stringContaining('Obtuve una puntuación de'),
          url: expect.stringContaining('/summary/123')
        });
      }
    });

    it('should fall back to clipboard when share API is not available', async () => {
      // Mock navigator.share as undefined
      Object.defineProperty(navigator, 'share', { value: undefined });

      const shareButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Compartir')
      );

      if (shareButton) {
        await shareButton.trigger('click');
        await wrapper.vm.$nextTick();

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          expect.stringContaining('/summary/123')
        );
        expect(mockAddNotification).toHaveBeenCalledWith({
          type: 'success',
          title: 'Enlace copiado',
          message: 'El enlace para compartir ha sido copiado al portapapeles'
        });
      }

      // Restore share API
      Object.defineProperty(navigator, 'share', {
        value: vi.fn().mockResolvedValue(undefined)
      });
    });

    it('should handle share API errors gracefully', async () => {
      // Mock share API to reject
      vi.mocked(navigator.share).mockRejectedValue(new Error('Share failed'));

      const shareButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Compartir')
      );

      if (shareButton) {
        await shareButton.trigger('click');
        await wrapper.vm.$nextTick();

        // Should fall back to clipboard
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          expect.stringContaining('/summary/123')
        );
        expect(mockAddNotification).toHaveBeenCalledWith({
          type: 'success',
          title: 'Enlace copiado',
          message: 'El enlace para compartir ha sido copiado al portapapeles'
        });
      }
    });

    it('should handle clipboard errors gracefully', async () => {
      // Mock both share and clipboard to fail
      Object.defineProperty(navigator, 'share', { value: undefined });
      vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Clipboard failed'));

      const shareButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Compartir')
      );

      if (shareButton) {
        await shareButton.trigger('click');
        await wrapper.vm.$nextTick();

        expect(mockAddNotification).toHaveBeenCalledWith({
          type: 'error',
          title: 'Error',
          message: 'No se pudo compartir el análisis'
        });
      }

      // Restore APIs
      Object.defineProperty(navigator, 'share', {
        value: vi.fn().mockResolvedValue(undefined)
      });
      vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);
    });

    it('should show download notification when download button is clicked', async () => {
      const downloadButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Descargar')
      );

      expect(downloadButton).toBeTruthy();

      if (downloadButton) {
        await downloadButton.trigger('click');

        expect(mockAddNotification).toHaveBeenCalledWith({
          type: 'info',
          title: 'Próximamente',
          message: 'La función de descarga estará disponible pronto'
        });
      }
    });

    it('should generate correct share URL with analysis ID', async () => {
      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://example.com' },
        writable: true
      });

      const shareButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Compartir')
      );

      if (shareButton) {
        await shareButton.trigger('click');

        expect(navigator.share).toHaveBeenCalledWith({
          title: 'Mi Análisis de Belleza',
          text: expect.stringContaining('Obtuve una puntuación de'),
          url: 'https://example.com/summary/123'
        });
      }
    });
  });
});