import { test, expect } from '@playwright/test';

test.describe('Footer and Modals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display footer on homepage', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check footer content
    await expect(page.getByText('© 2025 How Are U. Todos los derechos reservados.')).toBeVisible();

    // Check footer links
    await expect(page.getByRole('button', { name: 'Términos y Condiciones' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Política de Privacidad' })).toBeVisible();
  });

  test('should display footer on beauty page', async ({ page }) => {
    await page.goto('/make-beauty');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check footer is present
    await expect(page.getByText('© 2025 How Are U. Todos los derechos reservados.')).toBeVisible();
  });

  test('should open Terms and Conditions modal', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Click Terms button
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Modal should be visible
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Check modal content
    await expect(page.getByText('Aceptación de los Términos')).toBeVisible();
    await expect(page.getByText('Descripción del Servicio')).toBeVisible();
    await expect(page.getByText('Uso de las Imágenes')).toBeVisible();

    // Check close button
    await expect(page.getByRole('button', { name: 'Cerrar modal' })).toBeVisible();
  });

  test('should close Terms modal with close button', async ({ page }) => {
    // Open modal
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Wait for modal to be visible
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Click close button
    await page.getByRole('button', { name: 'Cerrar modal' }).click();

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).not.toBeVisible();
  });

  test('should close Terms modal with Escape key', async ({ page }) => {
    // Open modal
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Wait for modal
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).not.toBeVisible();
  });

  test('should close Terms modal by clicking overlay', async ({ page }) => {
    // Open modal
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Wait for modal
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Click on overlay (backdrop)
    await page.locator('.fixed.inset-0.z-50').first().click({ position: { x: 10, y: 10 } });

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).not.toBeVisible();
  });

  test('should open Privacy Policy modal', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Click Privacy button
    await page.getByRole('button', { name: 'Política de Privacidad' }).click();

    // Modal should be visible
    await expect(page.getByRole('heading', { name: 'Política de Privacidad' })).toBeVisible();

    // Check modal content
    await expect(page.getByText('Información que Recopilamos')).toBeVisible();
    await expect(page.getByText('Cómo Utilizamos su Información')).toBeVisible();
    await expect(page.getByText('Almacenamiento y Seguridad')).toBeVisible();
    await expect(page.getByText('Sus Derechos')).toBeVisible();

    // Check last updated date
    await expect(page.getByText('Última actualización: 25 de septiembre de 2025')).toBeVisible();
  });

  test('should close Privacy modal with close button', async ({ page }) => {
    // Open modal
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Política de Privacidad' }).click();

    // Wait for modal
    await expect(page.getByRole('heading', { name: 'Política de Privacidad' })).toBeVisible();

    // Click close button
    await page.getByRole('button', { name: 'Cerrar modal' }).click();

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Política de Privacidad' })).not.toBeVisible();
  });

  test('should have scrollable content in modals', async ({ page }) => {
    // Open Terms modal
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Wait for modal
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Check if content is scrollable
    const scrollableArea = page.locator('.overflow-y-auto');
    await expect(scrollableArea).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Cerrar modal' }).click();

    // Open Privacy modal
    await page.getByRole('button', { name: 'Política de Privacidad' }).click();

    // Wait for modal
    await expect(page.getByRole('heading', { name: 'Política de Privacidad' })).toBeVisible();

    // Check scrollable area
    await expect(page.locator('.overflow-y-auto')).toBeVisible();
  });

  test('should prevent body scroll when modal is open', async ({ page }, testInfo) => {
    // Open modal
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Wait for modal
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Try to scroll the page - mobile browsers don't support mouse.wheel()
    const isMobile = testInfo.project.name.includes('Mobile') || testInfo.project.name.includes('Safari');

    if (isMobile) {
      // For mobile browsers, use programmatic scrolling
      await page.evaluate(() => {
        window.scrollBy(0, 500);
      });
    } else {
      // For desktop browsers, use mouse wheel
      await page.mouse.wheel(0, 500);
    }

    // Modal should still be visible and centered
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Close modal
    await page.keyboard.press('Escape');
  });

  test('should not close modal when clicking inside modal content', async ({ page }) => {
    // Open modal
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Wait for modal
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Click on modal content (not overlay)
    await page.getByText('Aceptación de los Términos').click();

    // Modal should still be visible
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Close modal
    await page.keyboard.press('Escape');
  });

  test('should have proper ARIA labels for accessibility', async ({ page }) => {
    // Check footer buttons have proper text
    await page.locator('footer').scrollIntoViewIfNeeded();

    const termsButton = page.getByRole('button', { name: 'Términos y Condiciones' });
    const privacyButton = page.getByRole('button', { name: 'Política de Privacidad' });

    await expect(termsButton).toBeVisible();
    await expect(privacyButton).toBeVisible();

    // Open modal and check close button accessibility
    await termsButton.click();
    await expect(page.getByRole('button', { name: 'Cerrar modal' })).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Footer should be visible
    await expect(page.getByText('© 2025 How Are U.')).toBeVisible();

    // Buttons should be clickable
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Modal should open and fit mobile screen
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Cerrar modal' }).click();
  });

  test('should animate modal open and close', async ({ page }) => {
    // Open modal
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();

    // Wait for modal to appear (animations should complete)
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Wait a bit for animation
    await page.waitForTimeout(500);

    // Modal should be fully visible
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Cerrar modal' }).click();

    // Wait for close animation
    await page.waitForTimeout(300);

    // Modal should be hidden
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).not.toBeVisible();
  });

  test('should handle multiple modal operations', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Open Terms modal
    await page.getByRole('button', { name: 'Términos y Condiciones' }).click();
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).toBeVisible();

    // Close it
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'Términos y Condiciones' })).not.toBeVisible();

    // Open Privacy modal
    await page.getByRole('button', { name: 'Política de Privacidad' }).click();
    await expect(page.getByRole('heading', { name: 'Política de Privacidad' })).toBeVisible();

    // Close it
    await page.getByRole('button', { name: 'Cerrar modal' }).click();
    await expect(page.getByRole('heading', { name: 'Política de Privacidad' })).not.toBeVisible();
  });
});