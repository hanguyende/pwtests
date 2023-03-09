const {test, expect, request} = require('@playwright/test');
const {ApiUtils} = require('./utils/ApiUtils');
//const loginPayLoad = {userEmail:"anshika@gmail.com", userPassword:"Iamking@000"};
const loginPayLoad = {userEmail:"rahulshetty@gmail.com",userPassword:"Iamking@00"};
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};
const fakePayLoadOrders = {data:[],message:"No Orders"};

let response;
let webContext;

test.beforeAll( async ({browser}) =>
{
   const apiContext = await request.newContext();
   let apiUtils = new ApiUtils(apiContext,loginPayLoad);
   response =  await apiUtils.createOrder(orderPayLoad);

  
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

})


//Intercept Request
test('Not authorize access', async ({page})=>
{
    page.addInitScript(value => {

        window.localStorage.setItem('token',value);
    }, response.token );

await page.goto("https://rahulshettyacademy.com/client/");
await page.locator("button[routerlink*='myorders']").click();
await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6218dad22c81249b296508b9", route=> 
    route.continue({url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6262e95ae26b7e1a10e89bf0'})
)
await page.locator("button:has-text('View')").first().click();
await page.pause();
});
