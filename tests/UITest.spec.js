const {test, expect} = require('@playwright/test');

test('browser context Playwright Test', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://bequalified-gmbh.personio.de/');
    console.log(await page.title());
});

test('page context Playwright Test', async ({page})=>
{
    await page.goto('https://github.com/login');
    console.log(await page.title());
    await expect(page).toHaveTitle("Sign in to GitHub · GitHub")
});
