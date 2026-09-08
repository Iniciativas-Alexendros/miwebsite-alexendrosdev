import { test, expect } from '@playwright/test';

test('contact form validacion Zod y envio', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true })
      });
      return;
    }
    await route.continue();
  });

  await page.goto('/contacto');
  await page.getByLabel('Nombre*').fill('A');
  await page.getByRole('button', { name: /Enviar/ }).click();
  await expect(page.getByRole('alert')).toBeVisible();

  await page.getByLabel('Nombre*').fill('Test Cliente');
  await page.getByLabel('Email*').fill('test@example.com');
  await page.getByLabel(/Mensaje\*/).fill(
    'Proyecto ecommerce Stripe presupuesto 5k deadline 1 mes web actual https://example.com'
  );
  await page.getByLabel(/Acepto/).check();
  await page.getByRole('button', { name: /Enviar/ }).click();
  await expect(page.getByRole('status')).toContainText(/Mensaje enviado/i, { timeout: 10000 });
});
