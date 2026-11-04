import { expect, test } from '@playwright/test';

test('a visitor browses the Bestiary by time slot', { tag: ['@bestiary'] }, async ({ page }) => {
  await page.goto('/');

  const slot = page.getByRole('region', { name: '09:00' });
  const oracle = slot.getByRole('article', { name: 'The Hallucinating Oracle' });
  await expect(oracle).toContainText("Ask Me Anything, I'll Answer Anyway");
  await expect(oracle).toContainText('Great Hall');
  await expect(oracle.getByRole('definition').nth(1)).toHaveText('700');
});
