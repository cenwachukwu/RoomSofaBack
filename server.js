// first we want to require our express package
const express = require("express");

// we require dotenv to access our environment variables
require("dotenv").config();

const cors = require("cors");
// we require the stripe package and next we will add a roll key
// we put our secret key in an environment variable because we want to protect it from other developers and invaders
const stripe = require("stripe")(process.env.Stripe_Secret_Key);
// we also require uuid version4
const uuid = require("uuid/v4");

// Routers
const product_listRouter = require("./src/resources/product_list/product_list.route");
const cartRouter = require("./src/resources/cart/cart.route");

// we require our mongooose connection file
require("./src/config/connection");

// we name our express() app with the label app
const app = express();

// middlewares: here we ask our express app to use these middlewares and routes
// express.json tells express to handle json for you
app.use(express.json());
app.use(cors());

app.use(product_listRouter);
app.use(cartRouter);

// Server port:
app.set("port", process.env.PORT || 8080);
// we want our app to listen on the server port 8080 in development and process.env.PORT in production
app.listen(app.get("port"), () => {
  console.log(`✅ PORT: ${app.get("port")} 🌟`);
});

// a test route to test our connection and server settings
app.get("/testing", (req, res) => {
  res.send("Hello World");
});
