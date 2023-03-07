const {test, expect, request} = require('@playwright/test');
const loginPayLoad = {userEmail:"anshika@gmail.com", userPassword:"Iamking@000"};
const orderPayLoad = {orders:[{country:"India", productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
let orderId;
let token;

test.beforeAll( async () =>
{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
    {
        data:loginPayLoad
    })
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);

    const orderRespone = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
        data:orderPayLoad,
        headers:
        {
            'Authorization' :token,
            'Content-Type' :'application/json'
        },
    })
    const orderJsonResponse = await orderRespone.json();
    console.log(orderJsonResponse);
    orderId = orderJsonResponse.orders[0];

});

test('CheckOrders', async ({page})=>
{
    page.addInitScript(value => 
        {
            window.localStorage.setItem('token',value);
        }, token
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
        
        if(orderId.includes(rowOrderId))
        {
            await ordersItem.nth(i).locator("button").first().click();
            break;
        }
    } 
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();    
});