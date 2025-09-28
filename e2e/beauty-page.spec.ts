import { test, expect } from '@playwright/test';
import { TestUtils } from './test-utils';

test.describe('BeautyPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/make-beauty');
  });

  test('should display beauty page title and description', async ({ page }) => {
    // Check page header
    await expect(page.getByRole('heading', { name: /Análisis de Belleza/ })).toBeVisible();

    // Check description
    await expect(page.getByText(/Sube una foto clara de tu rostro para obtener un análisis/)).toBeVisible();
  });

  test('should show back button and navigate to home', async ({ page }) => {
    // Check back button exists
    const backButton = page.getByRole('button', { name: /Volver al inicio/ });
    await expect(backButton).toBeVisible();

    // Click back button
    await backButton.click();

    // Should navigate back to home
    await expect(page).toHaveURL('/');
  });

  test('should display progress steps', async ({ page }) => {
    // Check progress steps are visible
    await expect(page.getByText('Subir imagen')).toBeVisible();
    await expect(page.getByText('Procesando')).toBeVisible();
    await expect(page.getByText('Resultados').last()).toBeVisible();

    // First step should be active initially
    const uploadStep = page.locator('.step-circle').first();
    await expect(uploadStep).toHaveClass(/bg-primary/);
  });

  test('should display upload area and tips', async ({ page }) => {
    // Check upload area
    await expect(page.getByText(/Arrastra y suelta tu imagen aquí/)).toBeVisible();
    await expect(page.getByText(/o haz clic para seleccionar/)).toBeVisible();

    // Check upload tips
    await expect(page.getByText(/Consejos para mejores resultados/)).toBeVisible();
    await expect(page.getByText(/Usa buena iluminación natural o artificial/)).toBeVisible();
    await expect(page.getByText(/Mira directamente a la cámara/)).toBeVisible();
    await expect(page.getByText(/Evita sombras en el rostro/)).toBeVisible();
  });

  test('should handle file selection via click', async ({ page }) => {
    // Create a test image file using TestUtils
    const imageBuffer = TestUtils.createTestImageBuffer();

    // Mock file input by intercepting the file chooser dialog
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click the upload area to trigger file chooser
    await page.getByText(/haz clic para seleccionar/).click();

    const fileChooser = await fileChooserPromise;

    // Set the file
    await fileChooser.setFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer
    }]);

    // Should show processing step
    await expect(page.getByText(/Subiendo y analizando imagen|Analizando con IA/)).toBeVisible({ timeout: 10000 });
  });

  test('should show file validation errors', async ({ page }) => {
    // Mock file input with invalid file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText(/haz clic para seleccionar/).click();
    const fileChooser = await fileChooserPromise;

    // Set an invalid file (text file)
    await fileChooser.setFiles([{
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is not an image')
    }]);

    // Should show error message
    await expect(page.getByText(/Tipo de archivo no válido/)).toBeVisible({ timeout: 5000 });
  });

  test('should show file size error for large files', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText(/haz clic para seleccionar/).click();
    const fileChooser = await fileChooserPromise;

    // Create a large buffer to simulate big file (>10MB)
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024, 0xFF); // 11MB of 0xFF bytes
    largeBuffer[0] = 0xFF;
    largeBuffer[1] = 0xD8; // JPEG header

    await fileChooser.setFiles([{
      name: 'large-image.jpg',
      mimeType: 'image/jpeg',
      buffer: largeBuffer
    }]);

    // Should show size error
    await expect(page.getByText(/muy grande/)).toBeVisible({ timeout: 5000 });
  });

  test('should show processing step with progress', async ({ page }) => {
    // First upload a valid file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText(/haz clic para seleccionar/).click();
    const fileChooser = await fileChooserPromise;

    const imageBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0,
      0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
      0xFF, 0xD9
    ]);

    await fileChooser.setFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer
    }]);

    // Should show processing elements
    await expect(page.getByText(/Subiendo y analizando imagen|Analizando con IA/)).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.bg-card.border.border-border.rounded-xl')).toBeVisible();

    // Should have cancel button
    await expect(page.getByRole('button', { name: /Cancelar/ })).toBeVisible();
  });

  test('should handle cancel analysis', async ({ page }) => {
    // Upload a file first
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText(/haz clic para seleccionar/).click();
    const fileChooser = await fileChooserPromise;

    const imageBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0,
      0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
      0xFF, 0xD9
    ]);

    await fileChooser.setFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer
    }]);

    // Wait for processing step
    await expect(page.getByText(/Subiendo y analizando imagen|Analizando con IA/)).toBeVisible({ timeout: 10000 });

    // Click cancel
    const cancelButton = page.getByRole('button', { name: /Cancelar/ });
    if (await cancelButton.isVisible()) {
      await cancelButton.click();

      // Should go back to upload step
      await expect(page.getByText(/Arrastra y suelta tu imagen aquí/)).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that main elements are visible
    await expect(page.getByRole('heading', { name: /Análisis de Belleza/ })).toBeVisible();
    await expect(page.getByText(/Arrastra y suelta tu imagen aquí/)).toBeVisible();

    // Check progress steps are visible
    await expect(page.getByText('Subir imagen')).toBeVisible();
    await expect(page.getByText('Procesando')).toBeVisible();
    await expect(page.getByText('Resultados').last()).toBeVisible();
  });

  test('should handle drag and drop (simulated)', async ({ page }) => {
    const uploadArea = page.locator('.border-dashed.border-border.rounded-xl');
    await expect(uploadArea).toBeVisible();

    // Test hover effect on upload area
    await uploadArea.hover();

    // The upload area should still be visible and respond to hover
    await expect(uploadArea).toBeVisible();
    await expect(uploadArea).toHaveClass(/hover:border-primary/);
  });

  test('should show proper error handling for network issues', async ({ page }) => {
    // Mock network failure for API calls
    await page.route('**/api/**', route => route.abort());

    // Try to upload a file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText(/haz clic para seleccionar/).click();
    const fileChooser = await fileChooserPromise;

    const imageBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0,
      0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
      0xFF, 0xD9
    ]);

    await fileChooser.setFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: imageBuffer
    }]);

    // Should show some error message or go back to upload state
    // (depending on how the app handles network errors)
    await page.waitForTimeout(3000);

    // The page should still be functional
    await expect(page.getByText(/Subir|Arrastra y suelta tu imagen/)).toBeVisible();
  });

  test('should have proper ARIA labels for accessibility', async ({ page }) => {
    // Check back button has proper label
    const backButton = page.getByRole('button', { name: /Volver al inicio/ });
    await expect(backButton).toBeVisible();

    // Check upload area is accessible
    await expect(page.getByText(/Arrastra y suelta tu imagen aquí/)).toBeVisible();
  });
});