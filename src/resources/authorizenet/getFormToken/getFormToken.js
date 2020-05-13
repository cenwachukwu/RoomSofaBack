// the formToken is used to represent the transaction itself.
// we will Call getHostedPaymentPageRequest() to request the form token.
// This request contains transaction information and form parameter settings.
// so in the frontend we will direct the customer to the payment form by sending a POST containing the form token to
// https://accept.authorize.net/payment/payment.
// once Your customer completes and submits the payment form. The API sends the transaction to Authorize.Net for processing.
// The customer is returned to your site, which displays a result page based on the URL followed or the response details sent.
// Using the form token ensures that the payment form request comes from you and that the transaction details remain unchanged by the customer or a third party
// The form token is valid for 15 minutes. You must display the payment form within that time.
// If the browser makes a request for the payment form using an expired form token, an error is displayed.

const authorizenet = require("authorizenet");

const utills = require("../utills/utills");

const ApiContracts = authorizenet.APIContracts;
const ApiControllers = authorizenet.APIControllers;
const SDKConstants = authorizenet._SDKConstants;

const getHostedPaymentPageRequest = (callBack) => {
  // merchantAuthenticationType Contains merchant authentication information.
  // and we use it to set the apiloginkey and transactionKey
  const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.Api_Login_Key);
  merchantAuthenticationType.setTransactionKey(process.env.Transaction_Key);

  //   transactionRequest: Contains information about the transaction.
  // The transactionRequest element contains transaction details and values that can be used to populate the form fields.
  // Only the transactionType and amount elements are required.
  const transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setAmount(utils.getRandomAmount());

  //   You can present up to four payment options depending on which values you use in the hosted form parameters settings eg. creditcard
  //    they use the hostedPaymentPaymentOptions parameter

  //   Use to set the text on the payment button.
  const setting1 = new ApiContracts.SettingType();
  setting1.setSettingName("hostedPaymentButtonOptions");
  setting1.setSettingValue('{"text": "Pay"}');

  const setting2 = new ApiContracts.SettingType();
  setting2.setSettingName("hostedPaymentOrderOptions");
  setting2.setSettingValue('{"show": true, "merchantName": "Cozi Furniture"}');

  //   Use these options to control the receipt page, return URLs, and buttons for both the payment form and the receipt page.
  //   Use showReceipt to enable or disable the default receipt page after the transaction, with a continue button labeled using the value of urlText.
  // The continue button redirects the customer to the URL set by url. The urlText parameter defaults to "Continue".
  //   Use cancelUrlText to label a cancel button that redirects the customer to the URL set by cancelUrl.
  // The button appears on the payment form and enables the customer to cancel the order and return to the merchant's site.
  // The cancelUrlText parameter defaults to "Cancel".
  const setting3 = new ApiContracts.SettingType();
  setting3.setSettingName("hostedPaymentReturnOptions");
  setting3.setSettingValue(
    '{"showReceipt": true, "url": "http://localhost:1234/receipt", "urlText": "Continue", "cancelUrl": "http://localhost:1234/", "cancelUrlText": "Cancel"}'
  );

  //   Use to control which payment options to display on the hosted payment form.
  //   To require Card Code Verification set cardCodeRequired to true.
  //   Note that the merchant must add eCheck.Net to their payment gateway to enable bank account fields on the payment form.
  const setting4 = new ApiContracts.SettingType();
  setting4.setSettingName("hostedPaymentPaymentOptions");
  setting4.setSettingValue(
    '{"cardCodeRequired": true, "showCreditCard": true, "showBankAccount": false, "customerProfileId": false}'
  );

  //   Adds Visa SRC as a payment option
  const setting5 = new ApiContracts.SettingType();
  setting5.setSettingName("hostedPaymentVisaCheckoutOptions");
  setting5.setSettingValue(
    '{"apiKey":"Your Visa SRC API key","displayName":"DISPNAME","message":"MESSAGE"}'
  );

  // Use to enable or disable CAPTCHA security on the form.
  const setting6 = new ApiContracts.SettingType();
  setting6.setSettingName("hostedPaymentSecurityOptions");
  setting6.setSettingValue('{"captcha": true}');

  //   Use show to enable or disable the shipping address on the form. Use required to require the shipping address.
  const setting7 = new ApiContracts.SettingType();
  setting7.setSettingName("hostedPaymentShippingAddressOptions");
  setting7.setSettingValue('{"show": true, "required": true}');

  //   Use show to enable or disable the billing address on the form. Defaults to true. Use required to require the billing address. Defaults to false.
  const setting8 = new ApiContracts.SettingType();
  setting8.setSettingName("hostedPaymentBillingAddressOptions");
  setting8.setSettingValue('{"show": true, "required": true}');

  //   Use showEmail to enable or disable the email address on the form.
  // Use requiredEmail to require the email address.
  // we will add these later: because we havent created a customer profile thingy
  // Use addPaymentProfile to enable the customer to add a new form of payment to their customer profile.
  // Applies when a customerProfileId has been sent with the form token request. Defaults to true.
  //   i changed it to false
  const setting9 = new ApiContracts.SettingType();
  setting9.setSettingName("hostedPaymentCustomerOptions");
  setting9.setSettingValue(
    '{"showEmail": true, "requiredEmail": true, "addPaymentProfile": false}'
  );

  const settingList = [];
  settingList.push(setting1);
  settingList.push(setting2);
  settingList.push(setting3);
  settingList.push(setting4);
  settingList.push(setting5);
  settingList.push(setting6);
  settingList.push(setting7);
  settingList.push(setting8);
  settingList.push(setting9);

  const alist = new ApiContracts.ArrayOfSetting();
  alist.setSetting(settingList);

  const getRequest = new ApiContracts.GetHostedPaymentPageRequest();
  getRequest.setMerchantAuthentication(merchantAuthenticationType);
  getRequest.setTransactionRequest(transactionRequestType);
  getRequest.setHostedPaymentSettings(alist);

  //console.log(JSON.stringify(getRequest.getJSON(), null, 2));

  const ctrl = new ApiControllers.GetHostedPaymentPageController(
    getRequest.getJSON()
  );
  //   sets it to be in production if not it will remain in development
  ctrl.setEnvironment(SDKConstants.endpoint.production);

  ctrl.execute(function () {
    const apiResponse = ctrl.getResponse();

    const response = new ApiContracts.GetHostedPaymentPageResponse(apiResponse);

    //pretty print response
    //console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log("Hosted payment page token :");
        console.log(response.getToken());
      } else {
        //console.log('Result Code: ' + response.getMessages().getResultCode());
        console.log(
          "Error Code: " + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          "Error message: " + response.getMessages().getMessage()[0].getText()
        );
      }
    } else {
      console.log("Null response received");
    }

    callback(response);
  });
};

if (require.main === module) {
  getAnAcceptPaymentPage(function () {
    console.log("getAnAcceptPaymentPage call complete.");
  });
}

module.exports = getHostedPaymentPageRequest;
