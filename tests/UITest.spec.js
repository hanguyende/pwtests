const {test, expect} = require('@playwright/test');

test('browser context Playwright Test', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://google.com/');
    console.log(await page.title());
});

test('page context Playwright Test', async ({page})=>
{
    await page.goto('https://github.com/login');
    console.log(await page.title());
    await expect(page).toHaveTitle("Sign in to GitHub · GitHub")
});

test('test browser context-validation errror login', async ({browser})=>
{   
    const context = await browser.newContext();
    const page = await context.newPage();
    const username = page.locator('#username');
    const pwd = page.locator('#password');
    const loginBtn = page.locator('#signInBtn');
    const cardTitles =  page.locator('.card-body a');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
    await username.type('test@test.de');
    await pwd.type('test');
    await loginBtn.click();
    
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText("Incorrect")
});

test('test browser login', async ({page})=>
{
    const username = page.locator('#username');
    const pwd = page.locator('#password');
    const loginBtn = page.locator('#signInBtn');
    const cardTitles =  page.locator('.card-body a');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    page.route('**/*.{jpg, png, jpeg}', route => route.abort());

    page.on('request', request=> console.log(request.url()));
    page.on('response', response=> console.log(response.url(), response.status()));
    console.log(await page.title());
    await username.type('rahulshettyacademy');
    await pwd.type('learning');
    await Promise.all([
        page.waitForNavigation(),
        loginBtn.click()
        ])
    //await page.pause();
    const allTittle = await cardTitles.allTextContents();
    console.log(allTittle);

});

test('test new windows context', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const username = page.locator('#username');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const documentLink = page.locator("[href*='documents-request']");
    const [newPage] = await Promise.all (
        [
            context.waitForEvent('page'),
            documentLink.click(),
        ]
    )
    const text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await username.type(domain);
    console.log(await username.textContent);
});

test('take screenshoot', async ({page})=>
{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator('#displayed-text').screenshot({path:'partialScreenshot.png'});
    await page.locator("#hide-textbox").click();
    await page.screenshot({path: 'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
});

test('screenshoot compair', async ({page})=>
{   
    await page.goto('https://google.com/');
    expect(await page.screenshot()).toMatchSnapshot('google.png');
});
