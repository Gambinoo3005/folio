import { test, expect } from '@playwright/test';

test.describe('CMS Smoke Tests', () => {
  test('sign-in page renders authentication methods', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Check that the sign-in page loads
    await expect(page).toHaveTitle(/Sign In/);
    
    // Check for Clerk sign-in elements
    await expect(page.locator('[data-clerk-element="sign-in"]')).toBeVisible();
    
    // Check for authentication methods (these are rendered by Clerk)
    // We'll check for the presence of the sign-in form
    await expect(page.locator('form')).toBeVisible();
  });

  test('unauthenticated user is redirected to sign-in', async ({ page }) => {
    // Try to access a protected route
    await page.goto('/');
    
    // Should be redirected to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });

  test('sidebar navigation works when authenticated', async ({ page }) => {
    // This test assumes we have a way to authenticate in test environment
    // For now, we'll just check that the sidebar elements exist when we can access the dashboard
    
    // Skip this test if we can't access the dashboard (no auth setup in test)
    await page.goto('/');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Check for sidebar navigation elements
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    
    // Check for navigation links
    await expect(page.locator('a[href="/pages"]')).toBeVisible();
    await expect(page.locator('a[href="/collections"]')).toBeVisible();
    await expect(page.locator('a[href="/media"]')).toBeVisible();
  });

  test('dashboard loads with expected sections', async ({ page }) => {
    await page.goto('/');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Check for dashboard elements
    await expect(page.locator('h1')).toContainText(/Dashboard|Welcome/);
    
    // Check for quick actions section
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible();
    
    // Check for recent edits section
    await expect(page.locator('[data-testid="recent-edits"]')).toBeVisible();
  });

  test('pages section loads', async ({ page }) => {
    await page.goto('/pages');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Check for pages section
    await expect(page.locator('h1')).toContainText(/Pages/);
  });

  test('collections section loads', async ({ page }) => {
    await page.goto('/collections');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Check for collections section
    await expect(page.locator('h1')).toContainText(/Collections/);
  });

  test('media section loads', async ({ page }) => {
    await page.goto('/media');
    
    // If we're redirected to sign-in, skip the test
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
    
    // Check for media section
    await expect(page.locator('h1')).toContainText(/Media/);
  });
});
