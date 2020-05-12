const express = require("express");
const router = express.Router();
const charge = require("./charge");

router.post("/payment", async (req, res) => {
  try {
    charge;
    res.status(201).json({ data: charge });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
});

module.exports = router;
