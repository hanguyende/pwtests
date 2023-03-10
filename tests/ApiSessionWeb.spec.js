const {test, expect} = require('@playwright/test');
const {ApiUtils} = require('../Utils/ApiUtils');
const loginPayLoad = {userEmail:"anshika@gmail.com", userPassword:"Iamking@000"};
const orderPayLoad = {orders:[{country:"Cuba", productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
let webContext;

test.beforeAll( async ({browser}) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#userEmail');
    const userEmail = "anshika@gmail.com";
    const pwd = page.locator('#userPassword');
    const loginBtn = page.locator('#login');
    await page.goto('https://rahulshettyacademy.com/client/');
    await userName.type(userEmail)
    await pwd.type("Iamking@000");
    await loginBtn.click();
    await page.waitForLoadState('networkidle');
    await context.storageState({path: 'state.json'});
    webContext = await browser.newContext({storageState: 'state.json'});

});

test('client login app', async ()=>
{
    const userEmail = "anshika@gmail.com";
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');
    const products = page.locator('.card-body');
    const productName = "zara coat 3";
    await page.waitForLoadState('networkidle');
    const  tittle = await page.locator('.card-body b').allTextContents();
    
    const count = await products.count();
    for (let i=0; i < count; i++)
    {
        if (await products.nth(i).locator("b").textContent() === productName)
        {
            console.log(productName);
            await  products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await page.locator("button label:has-text('1')").isVisible();
    await page.locator("[routerlink*='cart']").click();
    await page.waitForLoadState('networkidle');
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