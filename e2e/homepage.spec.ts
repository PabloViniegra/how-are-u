import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main title and description', async ({ page }) => {
    // Check main title
    await expect(page.getByRole('heading', { name: /¿Cómo de Guap@ eres?/ })).toBeVisible();

    // Check description
    await expect(page.getByText(/Análisis científico de atractivo facial/)).toBeVisible();
  });

  test('should display main action buttons', async ({ page }) => {
    // Check "Analizar mi foto" button
    const analyzeButton = page.getByRole('button', { name: /Analizar mi foto/ });
    await expect(analyzeButton).toBeVisible();

    // Check "Ver ejemplos" button
    const examplesButton = page.getByRole('button', { name: /Ver ejemplos/ });
    await expect(examplesButton).toBeVisible();
  });

  test('should navigate to beauty analysis page when clicking analyze button', async ({ page }) => {
    // Click the main analyze button
    const analyzeButton = page.getByRole('button', { name: /Analizar mi foto/ });
    await analyzeButton.click();

    // Should navigate to the beauty page
    await expect(page).toHaveURL('/make-beauty');

    // Should see the beauty page title
    await expect(page.getByRole('heading', { name: /Análisis de Belleza/ })).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    // Check statistics are displayed using more specific selectors
    await expect(page.locator('.stat-item').getByText('98%')).toBeVisible();
    await expect(page.locator('.stat-item').getByText('Precisión')).toBeVisible();

    await expect(page.locator('.stat-item').getByText('<3s')).toBeVisible();
    await expect(page.locator('.stat-item').getByText('Análisis')).toBeVisible();

    await expect(page.locator('.stat-item').getByText('5k+')).toBeVisible();
    await expect(page.locator('.stat-item').getByText('Usuarios')).toBeVisible();

    await expect(page.locator('.stat-item').getByText('100%')).toBeVisible();
    await expect(page.locator('.stat-item').getByText('Privado')).toBeVisible();
  });

  test('should display "Cómo funciona" section', async ({ page }) => {
    // Check section title
    await expect(page.getByRole('heading', { name: /¿Cómo funciona?/ })).toBeVisible();

    // Check feature cards using more specific selectors
    await expect(page.locator('.feature-card').getByText('Análisis Instantáneo')).toBeVisible();
    await expect(page.locator('.feature-card').getByText('Puntuación Detallada')).toBeVisible();
    await expect(page.locator('.feature-card').getByText('Recomendaciones')).toBeVisible();
    await expect(page.locator('.feature-card').getByText('Tecnología IA')).toBeVisible();
  });

  test('should display CTA section', async ({ page }) => {
    // Scroll to CTA section
    await page.getByText(/Listo para descubrir tu puntuación/).scrollIntoViewIfNeeded();

    // Check CTA content
    await expect(page.getByText(/Listo para descubrir tu puntuación/)).toBeVisible();
    await expect(page.getByText(/El análisis es completamente gratuito y seguro/)).toBeVisible();
  });

  test('should have responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that main elements are still visible
    await expect(page.getByRole('heading', { name: /¿Cómo de Guap@ eres?/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Analizar mi foto/ })).toBeVisible();

    // Check that feature cards are properly stacked
    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(4);
  });

  test('should have working hover effects on buttons', async ({ page }) => {
    const analyzeButton = page.getByRole('button', { name: /Analizar mi foto/ });

    // Hover over the button
    await analyzeButton.hover();

    // Check that button is still visible after hover
    await expect(analyzeButton).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check main heading (should be h1)
    await expect(page.locator('h1')).toContainText('¿Cómo de');
    await expect(page.locator('h1')).toContainText('Guap@');
    await expect(page.locator('h1')).toContainText('eres?');

    // Check section headings (should be h2) - be more specific
    await expect(page.getByRole('heading', { name: /¿Cómo funciona?/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Listo para descubrir tu puntuación/ })).toBeVisible();
  });

  test('should load without console errors', async ({ page }) => {
    const consoleMessages: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('load');

    // Allow some time for any deferred errors
    await page.waitForTimeout(2000);

    // Filter out known non-critical errors
    const criticalErrors = consoleMessages.filter(msg =>
      !msg.includes('favicon') &&
      !msg.includes('404') &&
      !msg.includes('Network request failed') && // API calls might fail in E2E
      !msg.includes('Router error') && // Vue Router expected errors in WebKit
      !msg.includes('Importing a module script failed') // Module loading issues in WebKit
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Análisis de Atractivo Facial/);
  });
});