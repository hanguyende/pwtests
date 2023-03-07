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
    console.log(await page.title());
    await username.type('rahulshettyacademy');
    await pwd.type('learning');
    await Promise.all([
        page.waitForNavigation(),
        loginBtn.click()
        ])
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

test('client login app', async ({page})=>
{
    const products = page.locator('.card-body');
    const productName = "zara coat 3";
    const userName = page.locator('#userEmail');
    const userEmail = "anshika@gmail.com";
    const pwd = page.locator('#userPassword');
    const loginBtn = page.locator('#login');
    await page.goto('https://rahulshettyacademy.com/client/');
    await userName.type(userEmail)
    await pwd.type("Iamking@000");
    await loginBtn.click();

    await page.waitForLoadState('networkidle');
    const  tittle = await page.locator('.card-body b').allTextContents();
    console.log(tittle);
    const count = await products.count();
    for (let i=0; i < count; i++)
    {
        if (await products.nth(i).locator("b").textContent() === productName)
        {
            await  products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }    
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const cardHasItem = await page.locator("h3:has-text('zara coat 3')").isVisible();
    expect(cardHasItem).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").type("ind",{delay:100});
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionCounts = await dropdown.locator("button").count();
    for (let i=0; i<optionCounts; i++)
    {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text === " India")
        {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    await expect(page.locator("label[type='text']")).toHaveText(userEmail);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText("Thankyou for the order.");

});