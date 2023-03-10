const {test, expect, request} = require('@playwright/test');
const {ApiUtils} = require('../Utils/ApiUtils');
const loginPayLoad = {userEmail:"anshika@gmail.com", userPassword:"Iamking@000"};
const orderPayLoad = {orders:[{country:"India", productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
let response;

test.beforeAll( async () =>
{
    const apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);    
});

test('CheckOrders', async ({page})=>
{
    page.addInitScript(value => 
        {
            window.localStorage.setItem('token',value);
        }, response.token
    );
    await page.goto('https://rahulshettyacademy.com/client/');
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const ordersItem = page.locator("tbody tr");
    console.log(ordersItem.count);
    const count = await ordersItem.count();
    for (let i=0; i<count; ++i)
    {
        const rowOrderId = await ordersItem.nth(i).locator("th").textContent();
        
        if(response.orderId.includes(rowOrderId))
        {
            await ordersItem.nth(i).locator("button").first().click();
            break;
        }
    } 
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();    
});