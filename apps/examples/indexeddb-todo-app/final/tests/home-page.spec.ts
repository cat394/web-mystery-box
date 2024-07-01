import { test, expect, type BrowserContext, type Browser } from '@playwright/test';
import { chromium } from 'playwright';

test.describe('Home page test', () => {
	let context: BrowserContext;
	let browser: Browser;

	test.beforeAll(async () => {
		browser = await chromium.launch();
		context = await browser.newContext();
	});

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
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

	test('should add a todo and display it', async ({ page }) => {
		await page.getByLabel('Todo:').click();
		await page.getByLabel('Todo:').fill('Todo1');
		await page.getByRole('button', { name: 'Add todo' }).click();
		await expect(
			page.getByTestId('Remaining:').getByRole('listitem').getByText('Todo1')
		).toBeVisible();
	});

	test('should mark a todo as completed and move it to the completed list', async ({ page }) => {
		await page.getByLabel('Todo:').click();
		await page.getByLabel('Todo:').fill('Todo3');
		await page.getByRole('button', { name: 'Add todo' }).click();
		await page.getByTestId('Remaining:').getByLabel('Todo is completed').click();
		await expect(
			page.getByTestId('Finished:').getByRole('listitem').getByText('Todo3')
		).toBeVisible();
	});

	test('should remove a specific todo when the trash icon is clicked', async ({ page }) => {
		await page.getByLabel('Todo:').click();
		await page.getByLabel('Todo:').fill('Todo3');
		await page.getByRole('button', { name: 'Add todo' }).click();

		await page
			.getByTestId('Remaining:')
			.getByRole('listitem')
			.getByRole('button', { name: 'Remove todo' })
			.click();

		await expect(page.getByTestId('Remaining:')).toBeEmpty();
	});
});
