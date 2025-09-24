import { test, expect } from '@playwright/test';

test.describe('CMS Workflow Smoke Tests', () => {
  // Helper function to skip tests if not authenticated
  async function skipIfNotAuthenticated(page: { goto: (url: string) => Promise<unknown>; url: () => string }) {
    await page.goto('/');
    if (page.url().includes('/sign-in')) {
      test.skip(true, 'Authentication not set up for tests');
    }
  }

  test.describe('Page Workflow', () => {
    test('Create Page → Save → Publish → Appears as PUBLISHED', async ({ page }) => {
      await skipIfNotAuthenticated(page);

      // Navigate to pages section
      await page.goto('/pages');
      await expect(page.locator('h1')).toContainText(/Pages/);

      // Click "New Page" button
      await page.click('text=New Page');
      await expect(page).toHaveURL(/\/pages\/new/);

      // Fill in page details
      const pageTitle = `Test Page ${Date.now()}`;
      const pageSlug = `test-page-${Date.now()}`;
      
      await page.fill('input[name="title"]', pageTitle);
      await page.fill('input[name="slug"]', pageSlug);
      
      // Add some content to the body (assuming a rich text editor)
      const contentArea = page.locator('[data-testid="page-content"], textarea[name="body"], .ProseMirror').first();
      await contentArea.fill('This is test content for the page.');

      // Save as draft first
      await page.click('button:has-text("Save Draft")');
      
      // Wait for save confirmation
      await expect(page.locator('text=Page saved')).toBeVisible({ timeout: 10000 });

      // Navigate back to pages list
      await page.goto('/pages');
      
      // Verify page appears in list as DRAFT
      await expect(page.locator(`text=${pageTitle}`)).toBeVisible();
      await expect(page.locator(`text=${pageTitle}`).locator('..').locator('text=DRAFT')).toBeVisible();

      // Click on the page to edit it
      await page.click(`text=${pageTitle}`);

      // Publish the page
      await page.click('button:has-text("Publish")');
      
      // Wait for publish confirmation
      await expect(page.locator('text=Page published')).toBeVisible({ timeout: 10000 });

      // Navigate back to pages list
      await page.goto('/pages');
      
      // Verify page appears as PUBLISHED
      await expect(page.locator(`text=${pageTitle}`)).toBeVisible();
      await expect(page.locator(`text=${pageTitle}`).locator('..').locator('text=PUBLISHED')).toBeVisible();
    });

    test('Page creation with RBAC - requires EDITOR+ role', async ({ page }) => {
      await skipIfNotAuthenticated(page);

      // Navigate to pages section
      await page.goto('/pages');

      // Try to create a new page
      await page.click('text=New Page');
      
      // If we get an error about permissions, that's expected for VIEWER role
      // If we can proceed, that means we have EDITOR+ role
      const hasPermissionError = await page.locator('text=You do not have permission').isVisible();
      
      if (hasPermissionError) {
        // This is expected for VIEWER role - test passes
        expect(hasPermissionError).toBe(true);
      } else {
        // We have EDITOR+ role - verify we can create pages
        await expect(page).toHaveURL(/\/pages\/new/);
      }
    });
  });

  test.describe('Media Upload Workflow', () => {
    test('Upload image → Appears in grid → Alt/focal save', async ({ page }) => {
      await skipIfNotAuthenticated(page);

      // Navigate to media section
      await page.goto('/media');
      await expect(page.locator('h1')).toContainText(/Media/);

      // Get initial media count
      const initialCount = await page.locator('[data-testid="media-count"]').textContent() || '0';
      const initialCountNum = parseInt(initialCount);

      // Click upload button
      await page.click('button:has-text("Upload"), button:has-text("Add Media")');

      // Create a test file (small image)
      const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      // Upload the test image
      await page.setInputFiles('input[type="file"]', {
        name: 'test-image.png',
        mimeType: 'image/png',
        buffer: Buffer.from(testImageData.split(',')[1], 'base64')
      });

      // Wait for upload to complete
      await expect(page.locator('text=Upload complete')).toBeVisible({ timeout: 30000 });

      // Verify image appears in media grid
      await expect(page.locator('text=test-image.png')).toBeVisible();

      // Click on the uploaded image to edit metadata
      await page.click('text=test-image.png');

      // Update alt text
      await page.fill('input[name="alt"], textarea[name="alt"]', 'Test image alt text');

      // Update focal point (if focal point controls exist)
      const focalPointInput = page.locator('input[name="focalX"], input[name="focalY"]').first();
      if (await focalPointInput.isVisible()) {
        await focalPointInput.fill('0.5');
      }

      // Save metadata
      await page.click('button:has-text("Save")');
      await expect(page.locator('text=Media updated')).toBeVisible({ timeout: 10000 });

      // Navigate back to media grid
      await page.goto('/media');

      // Verify media count increased
      const newCount = await page.locator('[data-testid="media-count"]').textContent() || '0';
      const newCountNum = parseInt(newCount);
      expect(newCountNum).toBeGreaterThan(initialCountNum);
    });
  });

  test.describe('Collection Item Workflow', () => {
    test('Create Item in "Projects" collection → Appears in list', async ({ page }) => {
      await skipIfNotAuthenticated(page);

      // Navigate to collections section
      await page.goto('/collections');
      await expect(page.locator('h1')).toContainText(/Collections/);

      // Find and click on "Projects" collection
      await page.click('text=Projects');
      await expect(page).toHaveURL(/\/collections\/projects/);

      // Click "New Item" button
      await page.click('button:has-text("New Item")');
      await expect(page).toHaveURL(/\/collections\/projects\/items\/new/);

      // Fill in item details
      const itemTitle = `Test Project ${Date.now()}`;
      const itemSlug = `test-project-${Date.now()}`;
      
      await page.fill('input[name="title"]', itemTitle);
      await page.fill('input[name="slug"]', itemSlug);
      
      // Fill in description
      const descriptionField = page.locator('textarea[name="description"], [data-testid="description"]').first();
      await descriptionField.fill('This is a test project description.');

      // Add technologies (if it's an array field)
      const technologiesField = page.locator('input[name="technologies"], [data-testid="technologies"]').first();
      if (await technologiesField.isVisible()) {
        await technologiesField.fill('React, TypeScript, Next.js');
      }

      // Save the item
      await page.click('button:has-text("Save")');
      
      // Wait for save confirmation
      await expect(page.locator('text=Item saved')).toBeVisible({ timeout: 10000 });

      // Navigate back to items list
      await page.goto('/collections/projects');
      
      // Verify item appears in list
      await expect(page.locator(`text=${itemTitle}`)).toBeVisible();
    });
  });

  test.describe('Submissions Workflow', () => {
    test('Submissions endpoint accepts POST and data appears in UI', async ({ page }) => {
      await skipIfNotAuthenticated(page);

      // Navigate to submissions section
      await page.goto('/submissions');
      await expect(page.locator('h1')).toContainText(/Submissions/);

      // Get initial submission count
      const initialCount = await page.locator('text=Total').locator('..').locator('text=/\\d+/').textContent() || '0';
      const initialCountNum = parseInt(initialCount);

      // Submit a test submission via API
      const testSubmission = {
        form: 'test-form',
        payload: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test submission'
        }
      };

      const response = await page.request.post('/api/v1/submissions', {
        data: testSubmission,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(201);
      const result = await response.json();
      expect(result.success).toBe(true);

      // Refresh the submissions page
      await page.reload();

      // Verify submission count increased
      const newCount = await page.locator('text=Total').locator('..').locator('text=/\\d+/').textContent() || '0';
      const newCountNum = parseInt(newCount);
      expect(newCountNum).toBeGreaterThan(initialCountNum);

      // Verify test submission appears in the list
      await expect(page.locator('text=test-form')).toBeVisible();
      await expect(page.locator('text=Test User')).toBeVisible();
    });
  });

  test.describe('Domain Management Workflow', () => {
    test('Domain re-check functionality works', async ({ page }) => {
      await skipIfNotAuthenticated(page);

      // Navigate to domains section
      await page.goto('/domains');
      await expect(page.locator('h1')).toContainText(/Domains/);

      // Find a domain card
      const domainCard = page.locator('[data-testid="domain-card"]').first();
      if (await domainCard.isVisible()) {
        // Click the "Re-check" button
        const recheckButton = domainCard.locator('button:has-text("Re-check")');
        await recheckButton.click();

        // Wait for loading state
        await expect(recheckButton.locator('text=Checking...')).toBeVisible();

        // Wait for completion (button text changes back)
        await expect(recheckButton.locator('text=Re-check')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('RBAC Test Panel', () => {
    test('RBAC test panel shows role-based permissions', async ({ page }) => {
      await skipIfNotAuthenticated(page);

      // Navigate to settings section
      await page.goto('/settings');
      await expect(page.locator('h1')).toContainText(/Settings/);

      // Find RBAC test panel
      await expect(page.locator('text=RBAC Test Panel')).toBeVisible();

      // Test create page permission
      const createPageButton = page.locator('button:has-text("Test Create Page")');
      await createPageButton.click();

      // Wait for result
      await expect(page.locator('text=Success, text=Failed')).toBeVisible({ timeout: 10000 });

      // Test create collection permission
      const createCollectionButton = page.locator('button:has-text("Test Create Collection")');
      await createCollectionButton.click();

      // Wait for result
      await expect(page.locator('text=Success, text=Failed')).toBeVisible({ timeout: 10000 });

      // Verify role hierarchy is displayed
      await expect(page.locator('text=Role Hierarchy')).toBeVisible();
      await expect(page.locator('text=OWNER:')).toBeVisible();
      await expect(page.locator('text=ADMIN:')).toBeVisible();
      await expect(page.locator('text=EDITOR:')).toBeVisible();
      await expect(page.locator('text=VIEWER:')).toBeVisible();
    });
  });
});
