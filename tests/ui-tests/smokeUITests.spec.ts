import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('create article', async ({ page }) => {
    // Unique title: the instance is shared, so a fixed title can collide with other users' articles
    const articleTitle = faker.lorem.sentence(5)

    await page.goto('/')

    await page.getByText('Sign in').click()

    await page.getByPlaceholder('Email').fill(process.env.PROD_USERNAME!);
    await page.getByPlaceholder('Password').fill(process.env.PROD_PASSWORD!);
    await page.getByRole('button', { name: 'Sign in' }).click()

    await page.getByText('New Article').click()
    await page.getByRole('textbox', { name: 'Article Title' }).fill(articleTitle)
    await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('About the Playwright')
    await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('We like to use playwright for ...')
    await page.getByRole('button', { name: 'Publish Article' }).click()

    await expect(page.locator('.article-page h1')).toContainText(articleTitle)
    await page.getByText('Home').first().click()
    await page.getByText('Global Feed').click()

    await page.getByText(articleTitle).click()
    await page.getByRole('button', { name: "Delete Article" }).first().click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('.article-preview').first()).toBeVisible()

    await expect(page.getByText(articleTitle)).toHaveCount(0)
})
