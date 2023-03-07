const {test, expect} = require('@playwright/test');

test('Popup validation', async ({page})=>
{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice');
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    //await page.pause();

    await expect(page.locator("#display-text")).toBeHidden();
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framePage.locator(".text h2").textContent();
    console.log(await textCheck.split(" ")[1]);

});