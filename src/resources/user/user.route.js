const express = require("express");

const cartController = require("./cart.controllers");

const router = express.Router();

// create new blog = post
router.post("/payment", cartController.makePayment);

module.exports = router;
