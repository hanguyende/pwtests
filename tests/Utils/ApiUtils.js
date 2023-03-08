const {expect} = require('@playwright/test');
class ApiUtils
{
    constructor(apiContext, loginPayLoad)
    {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken()
    {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:this.loginPayLoad
        })
        expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        console.log(token);
        return token;

    }

    async createOrder(orderPayLoad)
    {
        let response = {};
        response.token = await this.getToken();
        const orderRespone = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
        data:orderPayLoad,
        headers:
        {
            'Authorization' : response.token,
            'Content-Type' :'application/json'
        },
    })
    const orderJsonResponse = await orderRespone.json();
    console.log(orderJsonResponse);
    const orderId = orderJsonResponse.orders[0];
    response.orderId = orderId;
    return response;
    }
}
module.exports = {ApiUtils};