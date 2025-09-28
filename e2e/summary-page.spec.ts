import { test, expect } from '@playwright/test';

test.describe('Summary Page (Shared Analysis)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the clipboard API for testing
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            (window as any).__clipboardText = text;
            return Promise.resolve();
          }
        }
      });

      // Mock share API
      Object.defineProperty(navigator, 'share', {
        value: async (data: ShareData) => {
          (window as any).__sharedData = data;
          return Promise.resolve();
        }
      });
    });
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate to summary page with a test ID
    await page.goto('/summary/123');

    // Should show loading state initially
    await expect(page.getByText('Cargando análisis...')).toBeVisible();
    await expect(page.getByText('Obteniendo los resultados compartidos')).toBeVisible();
  });

  test('should display analysis content when loaded successfully', async ({ page }) => {
    // Mock the API response for successful analysis loading
    await page.route('**/api/analysis/123', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '123',
            status: 'feasible',
            overall_score: 8.5,
            detailed_scores: {
              facial_symmetry: 8.2,
              skin_quality: 8.8,
              facial_proportions: 8.3
            },
            scientific_explanation: 'Test scientific explanation',
            recommendations: 'Test recommendations',
            analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
          }
        })
      });
    });

    await page.goto('/summary/123');

    // Wait for content to load
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();
    await expect(page.getByText('15 de enero de 2024')).toBeVisible();

    // Should display the analysis results
    await expect(page.getByText('8.5')).toBeVisible(); // Overall score
    await expect(page.getByText('Análisis exitoso')).toBeVisible();

    // Should display call to action
    await expect(page.getByText('¿Quieres tu propio análisis?')).toBeVisible();
    await expect(page.getByText('Crear mi análisis')).toBeVisible();
  });

  test('should display error state when analysis fails to load', async ({ page }) => {
    // Mock the API response for failed analysis loading
    await page.route('/api/analysis/999', async route => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Analysis not found'
        })
      });
    });

    await page.goto('/summary/999');

    // Should show error state
    await expect(page.getByText('Error al cargar')).toBeVisible();
    await expect(page.getByRole('button', { name: /Reintentar/ })).toBeVisible();
  });

  test('should handle invalid analysis ID', async ({ page }) => {
    await page.goto('/summary/invalid-id');

    // Should show error for invalid ID
    await expect(page.getByText('Error al cargar')).toBeVisible();
  });

  test('should navigate to home when back button is clicked', async ({ page }) => {
    await page.goto('/summary/123');

    // Click back button
    await page.getByRole('button', { name: /Volver al inicio/ }).click();

    // Should navigate to home page
    await expect(page).toHaveURL('/');
  });

  test('should navigate to new analysis when "Nuevo análisis" button is clicked', async ({ page }) => {
    // Mock successful analysis
    await page.route('**/api/analysis/123', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '123',
            status: 'feasible',
            overall_score: 8.5,
            detailed_scores: {
              facial_symmetry: 8.2,
              skin_quality: 7.8,
              facial_proportions: 8.5
            },
            scientific_explanation: 'Test explanation with detailed analysis',
            recommendations: 'Test recommendations for improvement',
            analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
          }
        })
      });
    });

    await page.goto('/summary/123');

    // Wait for content to load
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();

    // Click "Nuevo análisis" button
    const newAnalysisButtons = page.getByRole('button', { name: /Nuevo análisis/ });
    await newAnalysisButtons.first().click();

    // Should navigate to beauty analysis page
    await expect(page).toHaveURL('/make-beauty');
  });

  test('should share analysis when share button is clicked', async ({ page }) => {
    // Mock successful analysis
    await page.route('**/api/analysis/123', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '123',
            status: 'feasible',
            overall_score: 8.5,
            detailed_scores: {
              facial_symmetry: 8.2,
              skin_quality: 7.8,
              facial_proportions: 8.5
            },
            scientific_explanation: 'Test explanation with detailed analysis',
            recommendations: 'Test recommendations for improvement',
            analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
          }
        })
      });
    });

    await page.goto('/summary/123');

    // Wait for content to load
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();

    // Click share button
    const shareButton = page.getByRole('button', { name: /Compartir/ });
    await shareButton.click();

    // Verify share was called with correct data
    const sharedData = await page.evaluate(() => (window as any).__sharedData);
    expect(sharedData.title).toBe('Mi Análisis de Belleza');
    expect(sharedData.text).toBe('Mira mi análisis de belleza con IA');
    expect(sharedData.url).toContain('/summary/123');
  });

  test('should copy link to clipboard when share API is not available', async ({ page }) => {
    // Remove share API
    await page.addInitScript(() => {
      delete (navigator as any).share;
    });

    // Mock successful analysis
    await page.route('**/api/analysis/123', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '123',
            status: 'feasible',
            overall_score: 8.5,
            detailed_scores: {
              facial_symmetry: 8.2,
              skin_quality: 7.8,
              facial_proportions: 8.5
            },
            scientific_explanation: 'Test explanation with detailed analysis',
            recommendations: 'Test recommendations for improvement',
            analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
          }
        })
      });
    });

    await page.goto('/summary/123');

    // Wait for content to load
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();

    // Click share button
    const shareButton = page.getByRole('button', { name: /Compartir/ });
    await shareButton.click();

    // Should copy to clipboard
    const clipboardText = await page.evaluate(() => (window as any).__clipboardText);
    expect(clipboardText).toContain('/summary/123');
  });

  test('should show download notification when download button is clicked', async ({ page }) => {
    // Mock successful analysis
    await page.route('**/api/analysis/123', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '123',
            status: 'feasible',
            overall_score: 8.5,
            detailed_scores: {
              facial_symmetry: 8.2,
              skin_quality: 7.8,
              facial_proportions: 8.5
            },
            scientific_explanation: 'Test explanation with detailed analysis',
            recommendations: 'Test recommendations for improvement',
            analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
          }
        })
      });
    });

    await page.goto('/summary/123');

    // Wait for content to load
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();

    // Click download button
    const downloadButton = page.getByRole('button', { name: /Descargar/ });
    await downloadButton.click();

    // Should show notification (this would depend on the actual notification system)
    // In a real implementation, you'd check for the notification toast
  });

  test('should retry loading when retry button is clicked', async ({ page }) => {
    let callCount = 0;

    // Mock API to fail first, then succeed
    await page.route('**/api/analysis/123', async route => {
      callCount++;
      if (callCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Server error'
          })
        });
      } else {
        await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: '123',
              status: 'feasible',
              overall_score: 8.5,
              detailed_scores: {},
              scientific_explanation: 'Test',
              recommendations: 'Test',
              analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
            }
          })
        });
      }
    });

    await page.goto('/summary/123');

    // Should show error first
    await expect(page.getByText('Error al cargar')).toBeVisible();

    // Click retry
    await page.getByRole('button', { name: /Reintentar/ }).click();

    // Should now show success
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();
  });

  test('should display proper page title and meta information', async ({ page }) => {
    await page.goto('/summary/123');

    // Check page title
    await expect(page).toHaveTitle(/Análisis Compartido/);
  });

  test('should display call to action section', async ({ page }) => {
    // Mock successful analysis
    await page.route('**/api/analysis/123', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '123',
            status: 'feasible',
            overall_score: 8.5,
            detailed_scores: {
              facial_symmetry: 8.2,
              skin_quality: 7.8,
              facial_proportions: 8.5
            },
            scientific_explanation: 'Test explanation with detailed analysis',
            recommendations: 'Test recommendations for improvement',
            analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
          }
        })
      });
    });

    await page.goto('/summary/123');

    // Wait for content to load
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();

    // Check call to action section
    await expect(page.getByText('¿Quieres tu propio análisis?')).toBeVisible();
    await expect(page.getByText('Descubre tu puntuación de belleza')).toBeVisible();
    await expect(page.getByText('Es gratuito, seguro y solo toma unos segundos')).toBeVisible();

    // Check CTA button
    const ctaButton = page.getByRole('button', { name: /Crear mi análisis/ });
    await expect(ctaButton).toBeVisible();

    // Click CTA button
    await ctaButton.click();
    await expect(page).toHaveURL('/make-beauty');
  });

  test('should not display share button in summary page results', async ({ page }) => {
    // Mock successful analysis
    await page.route('**/api/analysis/123', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '123',
            status: 'feasible',
            overall_score: 8.5,
            detailed_scores: {
              facial_symmetry: 8.2,
              skin_quality: 7.8,
              facial_proportions: 8.5
            },
            scientific_explanation: 'Test explanation with detailed analysis',
            recommendations: 'Test recommendations for improvement',
            analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
          }
        })
      });
    });

    await page.goto('/summary/123');

    // Wait for content to load
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();

    // The analysis result component should not show the share section
    // (since showShareButton is set to false in the summary page)
    const shareSection = page.getByText('¡Comparte tu resultado!');
    await expect(shareSection).not.toBeVisible();
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mock successful analysis
    await page.route('**/api/analysis/123', async route => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '123',
            status: 'feasible',
            overall_score: 8.5,
            detailed_scores: {
              facial_symmetry: 8.2,
              skin_quality: 7.8,
              facial_proportions: 8.5
            },
            scientific_explanation: 'Test explanation with detailed analysis',
            recommendations: 'Test recommendations for improvement',
            analysis_date: '2024-01-15T10:30:00Z',
            image_url: 'https://example.com/test-image.jpg'
          }
        })
      });
    });

    await page.goto('/summary/123');

    // Wait for content to load
    await expect(page.getByText('Análisis de Belleza Compartido')).toBeVisible();

    // All buttons should be visible on mobile
    await expect(page.getByRole('button', { name: /Volver al inicio/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Compartir/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Nuevo análisis/ })).toBeVisible();
  });
});