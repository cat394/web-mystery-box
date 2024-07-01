import { test, expect, type BrowserContext, type Browser } from '@playwright/test';
import { chromium } from 'playwright';

test.describe('Categories page test', () => {
	let context: BrowserContext;
	let browser: Browser;

	test.beforeAll(async () => {
		browser = await chromium.launch();
		context = await browser.newContext();
	});

	test.beforeEach(async ({ page }) => {
		await page.goto('/categories');
	});

	test.afterAll(async () => {
		await browser.close();
	});

	test.afterEach(async () => {
		await context.addInitScript(() => {
			const dbName = 'todoApp';
			const dbVersion = 1;

			const request = indexedDB.open(dbName, dbVersion);
			request.onsuccess = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				const transaction = db.transaction('todos', 'readwrite');
				const objectStore = transaction.objectStore('todos');
				objectStore.clear();
			};
		});
	});

	test('should add a category and display it', async ({ page }) => {
		await page.getByLabel('Category name:').click();
		await page.getByLabel('Category name:').fill('Category1');
		await page.getByRole('button', { name: 'Add category' }).click();
		await expect(
			page.getByRole('link', { name: 'Category1'})
		).toBeVisible();
	});

	test('should navigate to the correct category URL when a genre link is clicked', async ({ page }) => {
		await page.getByLabel('Category name:').click();
		await page.getByLabel('Category name:').fill('Category1');
		await page.getByRole('button', { name: 'Add category' }).click();
		await page.getByRole('link', { name: 'Category1' }).click()
    await expect(page).toHaveURL(/\/categories\/.*/);
	});
});
