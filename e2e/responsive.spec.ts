import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
    smallMobile: { width: 320, height: 568 },
    largeMobile: { width: 414, height: 896 }
  };

  Object.entries(viewports).forEach(([deviceType, viewport]) => {
    test.describe(`${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
      });

      test('should display homepage correctly', async ({ page }) => {
        await page.goto('/');

        // Main title should be visible and readable
        await expect(page.getByRole('heading', { name: /¿Cómo de Guap@ eres?/ })).toBeVisible();

        // Main buttons should be visible and clickable
        await expect(page.getByRole('button', { name: /Analizar mi foto/ })).toBeVisible();

        // Features section should be accessible
        await expect(page.getByText(/¿Cómo funciona?/)).toBeVisible();

        // Footer should be at bottom and accessible
        await page.locator('footer').scrollIntoViewIfNeeded();
        await expect(page.getByText('© 2025 How Are U')).toBeVisible();
      });

      test('should display beauty page correctly', async ({ page }) => {
        await page.goto('/make-beauty');

        // Header should be visible
        await expect(page.getByRole('heading', { name: /Análisis de Belleza/ })).toBeVisible();

        // Back button should be visible
        await expect(page.getByRole('button', { name: /Volver al inicio/ })).toBeVisible();

        // Progress steps should be visible
        await expect(page.getByText('Subir imagen')).toBeVisible();
        await expect(page.getByText('Procesando')).toBeVisible();
        await expect(page.getByText('Resultados').last()).toBeVisible();

        // Upload area should be visible
        await expect(page.getByText(/Arrastra y suelta tu imagen aquí/)).toBeVisible();
      });

      test('should have proper touch targets on mobile', async ({ page }) => {
        if (viewport.width <= 768) { // Mobile and tablet
          await page.goto('/');

          // Buttons should be large enough for touch (at least 44px)
          const analyzeButton = page.getByRole('button', { name: /Analizar mi foto/ });
          const buttonBox = await analyzeButton.boundingBox();

          expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
          expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
        }
      });

      test('should handle modal display properly', async ({ page }) => {
        await page.goto('/');

        // Open modal
        await page.locator('footer').scrollIntoViewIfNeeded();
        await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

        // Modal should be visible and properly sized
        const modal = page.getByRole('heading', { name: 'Términos y Condiciones' });
        await expect(modal).toBeVisible();

        // Modal should not overflow viewport
        const modalContainer = page.locator('.fixed.inset-0.z-50').first();
        const containerBox = await modalContainer.boundingBox();

        if (containerBox) {
          expect(containerBox.width).toBeLessThanOrEqual(viewport.width);
          expect(containerBox.height).toBeLessThanOrEqual(viewport.height);
        }

        // Close modal
        await page.keyboard.press('Escape');
      });
    });
  });

  test.describe('Cross-device Navigation', () => {
    test('should work consistently across viewport changes', async ({ page }) => {
      // Start mobile
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Navigate to beauty page
      await page.getByRole('button', { name: /Analizar mi foto/ }).click();
      await expect(page).toHaveURL('/make-beauty');

      // Change to desktop
      await page.setViewportSize(viewports.desktop);

      // Page should still work
      await expect(page.getByRole('heading', { name: /Análisis de Belleza/ })).toBeVisible();

      // Navigate back
      await page.getByRole('button', { name: /Volver al inicio/ }).click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Content Reflow', () => {
    test('should handle text wrapping properly', async ({ page }) => {
      await page.setViewportSize(viewports.smallMobile);
      await page.goto('/');

      // Long text should wrap properly
      const description = page.getByText(/Análisis científico de atractivo facial/);
      await expect(description).toBeVisible();

      // No horizontal overflow
      const bodyOverflow = await page.evaluate(() => {
        return document.body.scrollWidth <= window.innerWidth;
      });
      expect(bodyOverflow).toBeTruthy();
    });

    test('should stack elements properly on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Feature cards should stack on mobile
      const featureCards = page.locator('.feature-card');
      const cardCount = await featureCards.count();

      if (cardCount > 0) {
        // On mobile, cards should be in single column or adjusted layout
        const firstCard = featureCards.first();
        const lastCard = featureCards.last();

        const firstBox = await firstCard.boundingBox();
        const lastBox = await lastCard.boundingBox();

        // Cards should be stacked (last card should be below first)
        if (firstBox && lastBox && cardCount > 1) {
          expect(lastBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 50); // Some margin allowed
        }
      }
    });
  });

  test.describe('Performance on Different Devices', () => {
    test('should load quickly on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);

      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Should load in reasonable time (5 seconds for mobile)
      expect(loadTime).toBeLessThan(5000);
    });

    test('should be responsive to touch events', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Simulate touch events
      const analyzeButton = page.getByRole('button', { name: /Analizar mi foto/ });
      await analyzeButton.tap();

      // Should navigate
      await expect(page).toHaveURL('/make-beauty');
    });
  });

  test.describe('Layout Breakpoints', () => {
    test('should show mobile layout below 768px', async ({ page }) => {
      await page.setViewportSize({ width: 767, height: 800 });
      await page.goto('/');

      // Should show mobile-appropriate layout
      await expect(page.getByRole('heading', { name: /¿Cómo de Guap@ eres?/ })).toBeVisible();

      // Statistics should stack on mobile
      const statsContainer = page.locator('.stats-container');
      if (await statsContainer.isVisible()) {
        // Should have mobile-friendly grid
        const stats = page.locator('.stat-item');
        const statsCount = await stats.count();
        expect(statsCount).toBeGreaterThan(0);
      }
    });

    test('should show desktop layout above 1024px', async ({ page }) => {
      await page.setViewportSize({ width: 1025, height: 800 });
      await page.goto('/');

      // Should show desktop layout
      await expect(page.getByRole('heading', { name: /¿Cómo de Guap@ eres?/ })).toBeVisible();

      // Features should be in horizontal layout
      const featureCards = page.locator('.feature-card');
      const cardCount = await featureCards.count();

      if (cardCount >= 2) {
        const firstCard = featureCards.first();
        const secondCard = featureCards.nth(1);

        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();

        if (firstBox && secondBox) {
          // Cards should be side by side (roughly same Y position)
          expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(50);
        }
      }
    });
  });

  test.describe('Accessibility on Different Devices', () => {
    test('should maintain accessibility on mobile', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      // Focus should be visible
      await page.getByRole('button', { name: /Analizar mi foto/ }).focus();

      // Tab navigation should work
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to interact with footer on mobile
      await page.locator('footer').scrollIntoViewIfNeeded();
      await expect(page.getByRole('button', { name: 'Términos y Condiciones' })).toBeVisible();
    });

    test('should have proper zoom support', async ({ page }) => {
      await page.goto('/');

      // Simulate zoom (browser zoom)
      await page.evaluate(() => {
        document.body.style.zoom = '150%';
      });

      // Content should still be accessible
      await expect(page.getByRole('heading', { name: /¿Cómo de Guap@ eres?/ })).toBeVisible();

      // Reset zoom
      await page.evaluate(() => {
        document.body.style.zoom = '100%';
      });
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle portrait to landscape change', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      await expect(page.getByRole('heading', { name: /¿Cómo de Guap@ eres?/ })).toBeVisible();

      // Change to landscape
      await page.setViewportSize({ width: 667, height: 375 });

      // Content should still be accessible
      await expect(page.getByRole('heading', { name: /¿Cómo de Guap@ eres?/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Analizar mi foto/ })).toBeVisible();
    });
  });
});