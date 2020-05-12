// const Cart = require("./cart.model");

// we are creating our cart with stripe
const stripe = require("stripe")(process.env.Stripe_Secret_Key);

// we also require uuid version4
const uuid = require("uuid/v4");

module.exports = {
  // charges user account and sends to stripe
  makePayment: async (req, res) => {
    const { product, token } = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    // this idempontencyKey keeps track so that user is not charged twice for the same product
    const idempontencyKey = uuid();

    // stripe.customers.creates  creates the customers
    // the customer objects allow you to perform recurring charges, and to track multiple charges,
    // that are associated with the same customer.
    // The API allows you to create, delete, and update your customers.
    // You can retrieve individual customers as well as a list of all your customers.

    // Tokenization is the process Stripe uses to collect sensitive card or bank account details,
    // or personally identifiable information (PII), directly from your customers in a secure manner.
    // A token representing this information is returned to your server to use.
    return (
      stripe.customers
        .create({
          email: token.email,
          source: token.id,
        })
        //   if it's successful then we want to make a promise with .then
        .then((customer) => {
          // this stripe.charges.create will take two arguements, the info you want stripe to charge based on and the idempontencyKey
          stripe.charges.create(
            {
              // we are also doing this based on the product arguement we passed in
              // we multipy amount by 100 b/c stripe works with the smallest possible currency and in the case its cents
              // we if we have 10$ multiply by 100, we have 1000cents which is still 10dollars
              amount: product.price * 100,
              currency: "usd",
              //   we use the costumer.id which is the Unique identifier for the customer to name the customer
              customer: customer.id,
              //   we also want to send an email to the customer, so like a receipt
              receipt_email: token.email,
              description: `For the purchase of ${product.name}`,
              shipping: {
                name: token.card.name,
                address: {
                  country: token.card.address_country,
                  zip: token.card.address_zip,
                  state: token.card.address_state,
                  city: token.card.address_city,
                  address_line2: token.card.address_line2,
                  address_line1: token.card.address_line1,
                },
              },
            },
            { idempontencyKey }
          );
        })
        // if that one is successful, then:
        .then((result) => res.status(200).json(result))
        .catch((error) => console.log(error))
    );
  },
};
