import { expect, test } from '@playwright/test';

test(
  'a visitor builds an encounter',
  { tag: ['@bestiary', '@encounter-builder'] },
  async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Encounter builder' }).click();

    const summary = page.getByRole('region', { name: 'Encounter summary' });
    await expect(summary).toContainText('XP total: 0');

    const oracle = page
      .getByRole('region', { name: '09:00' })
      .getByRole('article', { name: 'The Hallucinating Oracle' });
    await oracle.getByRole('button', { name: 'Add to encounter' }).click();

    await expect(summary).toContainText('1 talk');
    await expect(summary).toContainText('XP total: 700');

    // The encounter lives in the browser, so it survives a reload.
    await page.reload();
    await expect(summary).toContainText('XP total: 700');
  },
);
