const {test, expect, request} = require('@playwright/test');
const {ApiUtils} = require('./Utils/ApiUtils');
const loginPayLoad = {userEmail:"anshika@gmail.com", userPassword:"Iamking@000"};
const orderPayLoad = {orders:[{country:"India", productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
const fakePayload = {data:[],message:"No Orders"};
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
    console.log(fakePayload);
    await page.goto("https://rahulshettyacademy.com/client/");
   
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/620c7bf148767f1f1215d2ca", async route=>
    {
      const response =  await page.request.fetch(route.request());
      let body = fakePayload;
       route.fulfill(
          {
            response,
            body,
    
          });
    });
    
    await page.pause();
    await page.locator("button[routerlink*='myorders']").click();
    console.log(await page.locator(".mt-4").textContent());    
});

test('Place the order', async ({page})=>
{
    await page.addInitScript(value => {

        window.localStorage.setItem('token',value);
    }, response.token );
await page.goto("https://rahulshettyacademy.com/client/");
await page.locator("button[routerlink*='myorders']").click();
await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6218dad22c81249b296508b9", route=> 
    route.continue({url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6'})
)
await page.pause();
await page.locator("button:has-text('View')").first().click();


});
