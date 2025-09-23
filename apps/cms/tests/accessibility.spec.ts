import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('sign-in page should not have accessibility violations', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('pages section should not have accessibility violations', async ({ page }) => {
    await page.goto('/pages');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('collections section should not have accessibility violations', async ({ page }) => {
    await page.goto('/collections');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('media section should not have accessibility violations', async ({ page }) => {
    await page.goto('/media');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('settings section should not have accessibility violations', async ({ page }) => {
    await page.goto('/settings');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
