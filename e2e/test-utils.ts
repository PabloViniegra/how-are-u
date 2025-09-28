import { Page, expect } from '@playwright/test';

/**
 * Utility functions for E2E tests
 */

export class TestUtils {
  constructor(private page: Page) {}

  /**
   * Create a test image buffer for file upload tests
   */
  static createTestImageBuffer(): Buffer {
    return Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, // JPEG header
      0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, // JFIF
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
      0xFF, 0xD9 // JPEG end
    ]);
  }

  /**
   * Wait for animations to complete
   */
  async waitForAnimations(timeout = 1000): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Check if element is in viewport
   */
  async isInViewport(selector: string): Promise<boolean> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }, selector);
  }

  /**
   * Check if page has horizontal scroll
   */
  async hasHorizontalScroll(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
  }

  /**
   * Get console errors (excluding known non-critical ones)
   */
  async getConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];

    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    return errors.filter(error =>
      !error.includes('favicon') &&
      !error.includes('404') &&
      !error.includes('Network request failed')
    );
  }

  /**
   * Simulate file upload via drag and drop
   */
  async simulateFileDrop(selector: string, fileName: string, fileType: string, buffer: Buffer): Promise<void> {
    const dataTransfer = await this.page.evaluateHandle(() => new DataTransfer());

    await this.page.evaluate(([sel, name, type, bufferData]) => {
      const element = document.querySelector(sel);
      if (!element) throw new Error(`Element not found: ${sel}`);

      // Create file from buffer data
      const uint8Array = new Uint8Array(bufferData);
      const file = new File([uint8Array], name, { type });

      // Create drag event
      const dragEvent = new DragEvent('drop', {
        bubbles: true,
        dataTransfer: new DataTransfer()
      });

      dragEvent.dataTransfer?.items.add(file);
      element.dispatchEvent(dragEvent);
    }, [selector, fileName, fileType, Array.from(buffer)]);
  }

  /**
   * Check accessibility basics
   */
  async checkBasicAccessibility(): Promise<void> {
    // Check for heading hierarchy
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);

    // Check for alt text on images
    const images = await this.page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (!alt) {
        console.warn('Image without alt text found');
      }
    }

    // Check for button labels
    const buttons = await this.page.locator('button').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      if (!text?.trim() && !ariaLabel) {
        console.warn('Button without text or aria-label found');
      }
    }
  }

  /**
   * Take screenshot with timestamp
   */
  async takeTimestampedScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `test-results/${name}-${timestamp}.png`,
      fullPage: true
    });
  }

  /**
   * Wait for all images to load
   */
  async waitForImagesLoad(): Promise<void> {
    await this.page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.every(img => img.complete && img.naturalHeight !== 0);
    });
  }

  /**
   * Check if element has specific CSS class
   */
  async hasClass(selector: string, className: string): Promise<boolean> {
    const element = this.page.locator(selector);
    const classes = await element.getAttribute('class');
    return classes?.includes(className) ?? false;
  }

  /**
   * Get element dimensions
   */
  async getElementDimensions(selector: string): Promise<{ width: number; height: number } | null> {
    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;

      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height
      };
    }, selector);
  }

  /**
   * Simulate slow network
   */
  async simulateSlowNetwork(): Promise<void> {
    await this.page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      route.continue();
    });
  }
}

/**
 * Common test data
 */
export const testData = {
  validImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  invalidImageTypes: ['text/plain', 'application/pdf', 'video/mp4'],
  maxFileSize: 10 * 1024 * 1024, // 10MB

  // Sample text content to check for
  homePageTexts: {
    title: /¿Cómo de Guap@ eres?/,
    description: /Análisis científico de atractivo facial/,
    analyzeButton: /Analizar mi foto/,
    examplesButton: /Ver ejemplos/,
  },

  beautyPageTexts: {
    title: /Crea un análisis/,
    description: /Sube una foto/,
    uploadText: /Arrastra tu imagen aquí/,
    backButton: /Volver/,
  },

  modalTexts: {
    termsTitle: /Términos y Condiciones/,
    privacyTitle: /Política de Privacidad/,
    closeButton: /Cerrar modal/,
  }
};

/**
 * Common viewport sizes for testing
 */
export const viewports = {
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1366, height: 768 },
  desktop: { width: 1920, height: 1080 },
  ultrawide: { width: 2560, height: 1080 },
} as const;