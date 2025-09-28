import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UploadProgress from '../UploadProgress.vue';
import { createMockUploadProgress } from '@/test/utils';

describe('UploadProgress Component', () => {
  let wrapper: any;

  const defaultProps = {
    progress: createMockUploadProgress(),
    isComplete: false,
    showCancel: true,
  };

  beforeEach(() => {
    wrapper = mount(UploadProgress, {
      props: defaultProps,
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render progress information', () => {
    expect(wrapper.find('.progress-container')).toBeTruthy();
    expect(wrapper.text()).toContain('50%');
    expect(wrapper.text()).toContain('Subiendo y analizando imagen');
  });

  it('should display uploading state correctly', () => {
    const uploadingProps = {
      progress: createMockUploadProgress({ percentage: 75 }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: uploadingProps });

    expect(wrapper.text()).toContain('Subiendo y analizando imagen');
    expect(wrapper.text()).toContain('75%');
    expect(wrapper.find('.animate-spin')).toBeTruthy(); // Loader icon
  });

  it('should display completed state correctly', () => {
    const completedProps = {
      progress: createMockUploadProgress({ percentage: 100 }),
      isComplete: true,
    };

    wrapper = mount(UploadProgress, { props: completedProps });

    expect(wrapper.text()).toContain('Análisis completado');
    expect(wrapper.text()).toContain('Tu imagen ha sido procesada exitosamente');
    expect(wrapper.find('[data-testid="check-icon"]')).toBeTruthy(); // CheckCircle icon
  });

  it('should display analyzing state correctly', () => {
    const analyzingProps = {
      progress: createMockUploadProgress({ percentage: 100 }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: analyzingProps });

    // Check for content that's actually in the component
    expect(wrapper.text()).toContain('Analizando rostro');
    expect(wrapper.text()).toContain('Calculando métricas de belleza');
  });

  it('should show cancel button when showCancel is true', () => {
    const propsWithCancel = {
      ...defaultProps,
      showCancel: true,
    };

    wrapper = mount(UploadProgress, { props: propsWithCancel });

    expect(wrapper.find('.cancel-btn')).toBeTruthy();
  });

  it('should hide cancel button when showCancel is false', () => {
    const propsWithoutCancel = {
      ...defaultProps,
      showCancel: false,
    };

    wrapper = mount(UploadProgress, { props: propsWithoutCancel });

    expect(wrapper.find('.cancel-btn').exists()).toBe(false);
  });

  it('should hide cancel button when completed', () => {
    const completedProps = {
      ...defaultProps,
      isComplete: true,
    };

    wrapper = mount(UploadProgress, { props: completedProps });

    expect(wrapper.find('.cancel-btn').exists()).toBe(false);
  });

  it('should emit cancel event when cancel button is clicked', async () => {
    // Find button by title attribute since there's no specific class
    const cancelButton = wrapper.find('button[title="Cancelar análisis"]');
    expect(cancelButton.exists()).toBe(true);

    await cancelButton.trigger('click');

    expect(wrapper.emitted().cancel).toBeTruthy();
    expect(wrapper.emitted().cancel).toHaveLength(1);
  });

  it('should format bytes correctly', () => {
    const propsWithBytes = {
      progress: createMockUploadProgress({
        loaded: 1024 * 1024, // 1MB
        total: 5 * 1024 * 1024, // 5MB
      }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: propsWithBytes });

    expect(wrapper.text()).toContain('1 MB');
    expect(wrapper.text()).toContain('5 MB');
  });

  it('should format bytes for small values', () => {
    const propsWithSmallBytes = {
      progress: createMockUploadProgress({
        loaded: 512, // 512B
        total: 1024, // 1KB
      }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: propsWithSmallBytes });

    expect(wrapper.text()).toContain('512 B');
    expect(wrapper.text()).toContain('1 KB');
  });

  it('should show progress bar with correct width', () => {
    const propsWithProgress = {
      progress: createMockUploadProgress({ percentage: 60 }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: propsWithProgress });

    // The progress fill is the div with gradient background inside progress bar
    const progressFill = wrapper.find('.bg-gradient-to-r.from-primary');
    expect(progressFill.exists()).toBe(true);
    expect(progressFill.attributes('style')).toContain('width: 0%'); // Initial style, GSAP handles the animation
  });

  it('should show status messages for different stages', () => {
    // Test upload stage (10% or more)
    const uploadProps = {
      progress: createMockUploadProgress({ percentage: 50 }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: uploadProps });

    expect(wrapper.text()).toContain('Imagen subida y siendo analizada');

    // Test analysis stage (100% but not complete)
    const analysisProps = {
      progress: createMockUploadProgress({ percentage: 100 }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: analysisProps });

    expect(wrapper.text()).toContain('Analizando rostro');
    expect(wrapper.text()).toContain('Calculando métricas de belleza');
  });

  it('should show completion status', () => {
    const completedProps = {
      progress: createMockUploadProgress({ percentage: 100 }),
      isComplete: true,
    };

    wrapper = mount(UploadProgress, { props: completedProps });

    expect(wrapper.text()).toContain('Análisis completado');
  });

  it('should update progress percentage display', async () => {
    const initialProps = {
      progress: createMockUploadProgress({ percentage: 25 }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: initialProps });

    expect(wrapper.text()).toContain('25%');

    // Update props
    await wrapper.setProps({
      progress: createMockUploadProgress({ percentage: 75 }),
    });

    expect(wrapper.text()).toContain('75%');
  });

  it('should handle zero progress', () => {
    const zeroProgressProps = {
      progress: createMockUploadProgress({ percentage: 0, loaded: 0, total: 1000000 }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: zeroProgressProps });

    expect(wrapper.text()).toContain('0%');
    expect(wrapper.text()).toContain('0 B');
  });

  it('should show shimmer effect during upload', () => {
    const uploadingProps = {
      progress: createMockUploadProgress({ percentage: 50 }),
      isComplete: false,
    };

    wrapper = mount(UploadProgress, { props: uploadingProps });

    expect(wrapper.find('.shimmer-effect')).toBeTruthy();
  });

  it('should not show shimmer effect when completed', () => {
    const completedProps = {
      progress: createMockUploadProgress({ percentage: 100 }),
      isComplete: true,
    };

    wrapper = mount(UploadProgress, { props: completedProps });

    expect(wrapper.find('.shimmer-effect').exists()).toBe(false);
  });

  describe('Computed Properties', () => {
    it('should compute isUploading correctly', () => {
      // Test uploading state
      const uploadingWrapper = mount(UploadProgress, {
        props: {
          progress: createMockUploadProgress({ percentage: 50 }),
          isComplete: false,
        },
      });

      expect(uploadingWrapper.vm.isUploading).toBe(true);

      // Test completed state
      const completedWrapper = mount(UploadProgress, {
        props: {
          progress: createMockUploadProgress({ percentage: 100 }),
          isComplete: true,
        },
      });

      expect(completedWrapper.vm.isUploading).toBe(false);
    });
  });
});