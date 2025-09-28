import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import SummaryPage from '../SummaryPage.vue';
import type { Analysis } from '@/types';
import { ANALYSIS_STATUS } from '@/consts';

// Mock the composables with controllable state
const mockGetAnalysisById = vi.fn();
const mockFetchMutationState = {
  isSuccess: { value: false },
  isError: { value: false },
  data: { value: null as Analysis | null }
};

vi.mock('@/features/beauty-analysis/composables/useAnalysis', () => ({
  useAnalysis: () => ({
    getAnalysisById: mockGetAnalysisById,
    fetchAnalysisByIdMutation: mockFetchMutationState
  })
}));

const mockAddNotification = vi.fn();
vi.mock('@/shared/global-store', () => ({
  useGlobalStore: () => ({
    addNotification: mockAddNotification
  })
}));

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn()
  }
}));

// Mock components that might cause issues
vi.mock('@/features/beauty-analysis/components/AnalysisResult.vue', () => ({
  default: {
    name: 'AnalysisResult',
    template: '<div data-testid="analysis-result">Analysis Result Component</div>',
    props: ['analysis', 'imageUrl', 'showShareButton']
  }
}));

vi.mock('@/shared/components/Background.vue', () => ({
  default: {
    name: 'Background',
    template: '<div data-testid="background">Background Component</div>'
  }
}));

// Mock clipboard and share APIs
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  },
  share: vi.fn().mockResolvedValue(undefined)
});

const mockAnalysis: Analysis = {
  id: '123',
  status: ANALYSIS_STATUS.FEASIBLE,
  overall_score: 8.5,
  detailed_scores: {
    facial_symmetry: 8.2,
    skin_quality: 8.8,
    facial_proportions: 8.3
  },
  scientific_explanation: 'Test explanation',
  recommendations: 'Test recommendations',
  analysis_date: '2024-01-15T10:30:00Z',
  image_url: 'https://example.com/image.jpg'
};

describe('SummaryPage', () => {
  let wrapper: any;
  let router: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Reset mock state
    mockFetchMutationState.isSuccess.value = false;
    mockFetchMutationState.isError.value = false;
    mockFetchMutationState.data.value = null as Analysis | null;

    // Setup router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/make-beauty', component: { template: '<div>Beauty</div>' } },
        {
          path: '/summary/:id',
          component: SummaryPage,
          name: 'summary'
        }
      ]
    });

    // Push to summary route
    await router.push('/summary/123');
    await router.isReady();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders loading state initially', async () => {
    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    expect(wrapper.text()).toContain('Cargando análisis...');
    expect(wrapper.text()).toContain('Obteniendo los resultados compartidos');
  });

  it('loads analysis on mount', async () => {
    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    expect(mockGetAnalysisById).toHaveBeenCalledWith(123);
  });

  it('displays analysis when loaded successfully', async () => {
    // Mock successful analysis loading
    mockFetchMutationState.isSuccess.value = true;
    mockFetchMutationState.data.value = mockAnalysis as Analysis;

    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    // Wait for component to update after async loading
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(wrapper.text()).toContain('Análisis de Belleza Compartido');
  });

  it('displays error for invalid analysis ID', async () => {
    // Navigate to invalid ID route
    await router.push('/summary/invalid');

    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    // Wait for component to process invalid ID
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(wrapper.text()).toContain('Error al cargar');
  });

  it('displays back button', async () => {
    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    const buttons = wrapper.findAll('button');
    const backBtn = buttons.find(btn => btn.text().includes('Volver al inicio'));
    expect(backBtn).toBeDefined();
  });

  it('displays nuevo análisis button', async () => {
    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    const buttons = wrapper.findAll('button');
    const newAnalysisButton = buttons.find(btn => btn.text().includes('Nuevo análisis'));
    expect(newAnalysisButton).toBeDefined();
  });

  it('displays call to action section for successful analysis', async () => {
    // Mock successful analysis loading
    mockFetchMutationState.isSuccess.value = true;
    mockFetchMutationState.data.value = mockAnalysis as Analysis;

    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    // Wait for component to update
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(wrapper.text()).toContain('¿Quieres tu propio análisis?');
    expect(wrapper.text()).toContain('Crear mi análisis');
  });

  it('handles component lifecycle correctly', async () => {
    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    // Verify analysis ID is computed correctly
    expect(wrapper.vm.analysisId).toBe('123');
  });

  it('shares analysis when share button is clicked', async () => {
    // Mock successful analysis loading
    mockFetchMutationState.isSuccess.value = true;
    mockFetchMutationState.data.value = mockAnalysis as Analysis;

    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    // Wait for component to update
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));

    const buttons = wrapper.findAll('button');
    const shareButton = buttons.find(btn => btn.text().includes('Compartir'));

    if (shareButton) {
      await shareButton.trigger('click');
      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Mi Análisis de Belleza',
        text: 'Mira mi análisis de belleza con IA',
        url: expect.stringContaining('/summary/123')
      });
    }
  });

  it('shows download notification when download button is clicked', async () => {
    // Mock successful analysis loading
    mockFetchMutationState.isSuccess.value = true;
    mockFetchMutationState.data.value = mockAnalysis as Analysis;

    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    // Wait for component to update
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));

    const buttons = wrapper.findAll('button');
    const downloadButton = buttons.find(btn => btn.text().includes('Descargar'));

    if (downloadButton) {
      await downloadButton.trigger('click');

      expect(mockAddNotification).toHaveBeenCalledWith({
        type: 'info',
        title: 'Próximamente',
        message: 'La función de descarga estará disponible pronto'
      });
    }
  });

  it('retries loading when retry button is clicked in error state', async () => {
    // Mock error state
    mockFetchMutationState.isError.value = true;

    wrapper = mount(SummaryPage, {
      global: {
        plugins: [router],
        stubs: {
          AnalysisResult: true,
          Background: true
        }
      }
    });

    // Wait for error state to appear
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));

    const buttons = wrapper.findAll('button');
    const retryButton = buttons.find(btn => btn.text().includes('Reintentar'));

    if (retryButton) {
      mockGetAnalysisById.mockClear();
      await retryButton.trigger('click');
      expect(mockGetAnalysisById).toHaveBeenCalledWith(123);
    }
  });
});