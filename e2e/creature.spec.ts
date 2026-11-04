import { expect, test } from '@playwright/test';

test(
  'a visitor opens a creature from the Bestiary and reads its lore',
  { tag: ['@bestiary', '@creature'] },
  async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'The Hallucinating Oracle' }).click();

    await expect(page).toHaveURL(/#\/creatures\/hallucinating-oracle$/);
    await expect(page.getByRole('heading', { name: 'The Hallucinating Oracle' })).toBeVisible();
    await expect(page.getByText("Ask Me Anything, I'll Answer Anyway")).toBeVisible();

    const statBlock = page.getByRole('region', { name: 'Stat block' });
    await expect(statBlock.getByRole('definition').nth(0)).toHaveText('3');
    await expect(statBlock.getByRole('definition').nth(1)).toHaveText('700');

    const lore = page.getByRole('region', { name: 'Lore' });
    await expect(lore).toContainText('has never said "I don\'t know"');

    await page.getByRole('link', { name: 'Bestiary' }).click();
    await expect(page.getByRole('heading', { name: 'The Buzzword Bestiary' })).toBeVisible();
  },
);
