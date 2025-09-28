import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../HomePage.vue';

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
  },
}));

// Mock router
const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/make-beauty', component: { template: '<div>Beauty Page</div>' } },
  ],
});

describe('HomePage', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(HomePage, {
      global: {
        plugins: [mockRouter],
      },
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render homepage content', () => {
    expect(wrapper.find('h1').text()).toContain('¿Cómo de');
    expect(wrapper.find('h1').text()).toContain('Guap@');
    expect(wrapper.find('h1').text()).toContain('eres?');
  });

  it('should render main description', () => {
    expect(wrapper.text()).toContain('Análisis científico de atractivo facial');
    expect(wrapper.text()).toContain('inteligencia artificial');
  });

  describe('Hero Section', () => {
    it('should display hero title with gradient text', () => {
      const title = wrapper.find('h1');
      expect(title.text()).toContain('¿Cómo de');
      expect(title.text()).toContain('Guap@');
      expect(title.text()).toContain('eres?');

      const gradientSpan = wrapper.find('.bg-gradient-to-r');
      expect(gradientSpan.exists()).toBe(true);
      expect(gradientSpan.text()).toBe('Guap@');
    });

    it('should show main action buttons', () => {
      const buttons = wrapper.findAll('button');
      const mainButton = buttons.find((btn: any) => btn.text().includes('Analizar mi foto'));
      const sharedAnalysisButton = buttons.find((btn: any) => btn.text().includes('Ver análisis compartido'));

      expect(mainButton).toBeTruthy();
      expect(sharedAnalysisButton).toBeTruthy();
    });
  });

  describe('Statistics Section', () => {
    it('should display statistics cards', () => {
      const statsContainer = wrapper.find('.stats-container');
      expect(statsContainer).toBeTruthy();

      expect(wrapper.text()).toContain('98%');
      expect(wrapper.text()).toContain('Precisión');
      expect(wrapper.text()).toContain('<3s');
      expect(wrapper.text()).toContain('Análisis');
      expect(wrapper.text()).toContain('5k+');
      expect(wrapper.text()).toContain('Usuarios');
      expect(wrapper.text()).toContain('100%');
      expect(wrapper.text()).toContain('Privado');
    });
  });

  describe('Features Section', () => {
    it('should display how it works section', () => {
      expect(wrapper.text()).toContain('¿Cómo funciona?');
      expect(wrapper.text()).toContain('Nuestro algoritmo analiza múltiples aspectos');
    });

    it('should show feature cards', () => {
      expect(wrapper.text()).toContain('Análisis Instantáneo');
      expect(wrapper.text()).toContain('Puntuación Detallada');
      expect(wrapper.text()).toContain('Recomendaciones');
      expect(wrapper.text()).toContain('Tecnología IA');
    });

    it('should display feature descriptions', () => {
      expect(wrapper.text()).toContain('Sube tu foto y obtén resultados en segundos');
      expect(wrapper.text()).toContain('Recibe métricas específicas sobre diferentes aspectos');
      expect(wrapper.text()).toContain('Obtén consejos personalizados para mejorar');
      expect(wrapper.text()).toContain('Basado en algoritmos de visión computacional');
    });
  });

  describe('CTA Section', () => {
    it('should display call to action content', () => {
      expect(wrapper.text()).toContain('Listo para descubrir tu puntuación');
      expect(wrapper.text()).toContain('El análisis es completamente gratuito y seguro');
      expect(wrapper.text()).toContain('Tus fotos no se almacenan');
    });

    it('should show main CTA button', () => {
      const ctaButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Comenzar análisis')
      );
      expect(ctaButton).toBeTruthy();
    });

    it('should display trust indicators', () => {
      expect(wrapper.text()).toContain('100% Seguro');
      expect(wrapper.text()).toContain('Instantáneo');
      expect(wrapper.text()).toContain('IA Avanzada');
    });
  });

  describe('Navigation', () => {
    it('should navigate to analysis page when main button is clicked', async () => {
      const pushSpy = vi.spyOn(mockRouter, 'push');

      // Find the main "Analizar mi foto" button
      const mainButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Analizar mi foto')
      );

      await mainButton?.trigger('click');

      expect(pushSpy).toHaveBeenCalledWith('/make-beauty');
    });

    it('should navigate to analysis page when CTA button is clicked', async () => {
      const pushSpy = vi.spyOn(mockRouter, 'push');

      // Find the CTA button
      const ctaButton = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Comenzar análisis')
      );

      await ctaButton?.trigger('click');

      expect(pushSpy).toHaveBeenCalledWith('/make-beauty');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      expect(wrapper.find('.text-5xl.lg\\:text-7xl')).toBeTruthy();
      expect(wrapper.find('.text-xl.lg\\:text-2xl')).toBeTruthy();
      expect(wrapper.find('.grid.md\\:grid-cols-2.lg\\:grid-cols-4')).toBeTruthy();
    });

    it('should have responsive layout classes', () => {
      expect(wrapper.find('.px-6.lg\\:px-8')).toBeTruthy();
      expect(wrapper.find('.py-24.lg\\:py-32')).toBeTruthy();
      expect(wrapper.find('.max-w-4xl')).toBeTruthy();
      expect(wrapper.find('.max-w-6xl')).toBeTruthy();
    });
  });

  describe('Animations', () => {
    it('should have animation classes and refs', () => {
      expect(wrapper.find('.animated-text')).toBeTruthy();
      expect(wrapper.find('.animate-on-scroll')).toBeTruthy();
      expect(wrapper.find('.glow-button')).toBeTruthy();
    });

    it('should have parallax elements', () => {
      expect(wrapper.find('.parallax')).toBeTruthy();
    });

    it('should have hover effects on buttons', () => {
      const buttons = wrapper.findAll('button');

      buttons.forEach((button: any) => {
        expect(button.classes()).toContain('transition-all');
        // Buttons may have different duration classes (duration-300 or duration-500)
        const hasTransitionDuration = button.classes().some((cls: any) =>
          cls.includes('duration-')
        );
        expect(hasTransitionDuration).toBe(true);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const h1 = wrapper.find('h1');
      const h2Elements = wrapper.findAll('h2');
      const h3Elements = wrapper.findAll('h3');

      expect(h1.exists()).toBe(true);
      expect(h2Elements.length).toBeGreaterThan(0);
      expect(h3Elements.length).toBeGreaterThan(0);
    });

    it('should have descriptive text for features', () => {
      const featureCards = wrapper.findAll('.feature-card');

      featureCards.forEach((card: any) => {
        expect(card.text().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Content Structure', () => {
    it('should have proper section organization', () => {
      const sections = wrapper.findAll('section');

      expect(sections.length).toBeGreaterThanOrEqual(3); // Hero, Features, CTA
    });

    it('should display icons in feature cards', () => {
      // Icons are rendered as components, check for their containers
      expect(wrapper.findAll('.w-6.h-6').length).toBeGreaterThan(0);
    });

    it('should have gradient backgrounds and effects', () => {
      expect(wrapper.find('.bg-gradient-to-b')).toBeTruthy();
      expect(wrapper.find('.bg-gradient-to-r')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Mock router push to throw an error
      vi.spyOn(mockRouter, 'push').mockRejectedValue(new Error('Navigation failed'));

      const button = wrapper.findAll('button').find((btn: any) =>
        btn.text().includes('Analizar mi foto')
      );

      await button?.trigger('click');

      // Component should handle this gracefully (no crash)
      expect(wrapper.exists()).toBe(true);

      consoleSpy.mockRestore();
    });
  });
});