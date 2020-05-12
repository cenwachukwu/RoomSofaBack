const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
