// create an Authorize.Net payment transaction request, using the Accept Payment nonce in place of card data.

const authorizenet = require("authorizenet");

const utills = require("../utills/utills");

const ApiContracts = authorizenet.APIContracts;
const ApiControllers = authorizenet.APIControllers;
const SDKConstants = authorizenet._SDKConstants;

const createAnAcceptPaymentTransaction = (callBack) => {
  // merchantAuthenticationType Contains merchant authentication information.
  // and we use it to set the apiloginkey and transactionKey
  const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.Api_Login_Key);
  merchantAuthenticationType.setTransactionKey(process.env.Transaction_Key);

  //    because we are using accept.js on the frontend
  //    you will have a payment nonce on your server in the form of the dataValue element which is contained in the opaqueData object.
  //    Because this data represents a payment card, an opaqueData payment object can be used anywhere in the Authorize.Net API that accepts a creditCard or bankAccount payment type.
  //    The nonce is valid for 15 minutes.
  const opaqueData = new ApiContracts.OpaqueDataType();
  opaqueData.setDataDescriptor("COMMON.ACCEPT.INAPP.PAYMENT");
  opaqueData.setDataValue(
    "119eyJjb2RlIjoiNTBfMl8wNjAwMDUyN0JEODE4RjQxOUEyRjhGQkIxMkY0MzdGQjAxQUIwRTY2NjhFNEFCN0VENzE4NTUwMjlGRUU0M0JFMENERUIwQzM2M0ExOUEwMDAzNzlGRDNFMjBCODJEMDFCQjkyNEJDIiwidG9rZW4iOiI5NDkwMjMyMTAyOTQwOTk5NDA0NjAzIiwidiI6IjEuMSJ9"
  );
  const paymentType = new ApiContracts.PaymentType();
  paymentType.setOpaqueData(opaqueData);

  //   Contains information about the order.
  //   InvoiceNumber is the Merchant-defined invoice number associated with the order.
  const orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber("INV-12345");
  orderDetails.setDescription("Product Description");

  const tax = new ApiContracts.ExtendedAmountType();
  tax.setAmount("4.26");
  tax.setName("level2 tax name");
  tax.setDescription("level2 tax");

  const duty = new ApiContracts.ExtendedAmountType();
  duty.setAmount("8.55");
  duty.setName("duty name");
  duty.setDescription("duty description");

  const shipping = new ApiContracts.ExtendedAmountType();
  shipping.setAmount("8.55");
  shipping.setName("shipping name");
  shipping.setDescription("shipping description");

  const billTo = new ApiContracts.CustomerAddressType();
  billTo.setFirstName("Ellen");
  billTo.setLastName("Johnson");
  billTo.setCompany("Souveniropolis");
  billTo.setAddress("14 Main Street");
  billTo.setCity("Pecan Springs");
  billTo.setState("TX");
  billTo.setZip("44628");
  billTo.setCountry("USA");

  const shipTo = new ApiContracts.CustomerAddressType();
  shipTo.setFirstName("China");
  shipTo.setLastName("Bayles");
  shipTo.setCompany("Thyme for Tea");
  shipTo.setAddress("12 Main Street");
  shipTo.setCity("Pecan Springs");
  shipTo.setState("TX");
  shipTo.setZip("44628");
  shipTo.setCountry("USA");

  const lineItem_id1 = new ApiContracts.LineItemType();
  lineItem_id1.setItemId("1");
  lineItem_id1.setName("vase");
  lineItem_id1.setDescription("cannes logo");
  lineItem_id1.setQuantity("18");
  lineItem_id1.setUnitPrice(45.0);

  const lineItem_id2 = new ApiContracts.LineItemType();
  lineItem_id2.setItemId("2");
  lineItem_id2.setName("vase2");
  lineItem_id2.setDescription("cannes logo2");
  lineItem_id2.setQuantity("28");
  lineItem_id2.setUnitPrice("25.00");

  const lineItemList = [];
  lineItemList.push(lineItem_id1);
  lineItemList.push(lineItem_id2);

  const lineItems = new ApiContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  const userField_a = new ApiContracts.UserField();
  userField_a.setName("A");
  userField_a.setValue("Aval");

  const userField_b = new ApiContracts.UserField();
  userField_b.setName("B");
  userField_b.setValue("Bval");

  const userFieldList = [];
  userFieldList.push(userField_a);
  userFieldList.push(userField_b);

  const userFields = new ApiContracts.TransactionRequestType.UserFields();
  userFields.setUserField(userFieldList);

  const transactionSetting1 = new ApiContracts.SettingType();
  transactionSetting1.setSettingName("duplicateWindow");
  transactionSetting1.setSettingValue("120");

  const transactionSetting2 = new ApiContracts.SettingType();
  transactionSetting2.setSettingName("recurringBilling");
  transactionSetting2.setSettingValue("false");

  const transactionSettingList = [];
  transactionSettingList.push(transactionSetting1);
  transactionSettingList.push(transactionSetting2);

  const transactionSettings = new ApiContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  const transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  //   transactionRequestType.setAmount(utills.getAmount());
  transactionRequestType.setLineItems(lineItems);
  transactionRequestType.setUserFields(userFields);
  transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setTax(tax);
  transactionRequestType.setDuty(duty);
  transactionRequestType.setShipping(shipping);
  transactionRequestType.setBillTo(billTo);
  transactionRequestType.setShipTo(shipTo);
  transactionRequestType.setTransactionSettings(transactionSettings);

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  const ctrl = new ApiControllers.CreateTransactionController(
    createRequest.getJSON()
  );
  //   sets it to be in production if not it will remain in development
  ctrl.setEnvironment(SDKConstants.endpoint.production);
  ctrl.execute(() => {
    const apiResponse = ctrl.getResponse();

    const response = new ApiContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        if (response.getTransactionResponse().getMessages() != null) {
          console.log(
            "Successfully created transaction with Transaction ID: " +
              response.getTransactionResponse().getTransId()
          );
          console.log(
            "Response Code: " +
              response.getTransactionResponse().getResponseCode()
          );
          console.log(
            "Message Code: " +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getCode()
          );
          console.log(
            "Description: " +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getDescription()
          );
        } else {
          console.log("Failed Transaction.");
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              "Error Code: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode()
            );
            console.log(
              "Error message: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
            );
          }
        }
      } else {
        console.log("Failed Transaction. ");
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          console.log(
            "Error Code: " +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode()
          );
          console.log(
            "Error message: " +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText()
          );
        } else {
          console.log(
            "Error Code: " + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Error message: " + response.getMessages().getMessage()[0].getText()
          );
        }
      }
    } else {
      console.log("Null Response.");
    }
    callback(response);
  });
};

if (require.main === module) {
  createAnAcceptPaymentTransaction(() => {
    console.log("createAnAcceptPaymentTransaction call complete.");
  });
}

module.exports = chargeCreditCard;
