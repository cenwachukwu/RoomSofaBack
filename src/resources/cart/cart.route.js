const express = require("express");

const cartController = require("./cart.controllers");

const router = express.Router();

// create new blog = post
router.post("/cart", productController.createProduct);

module.exports = router;
