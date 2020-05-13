const express = require("express");
const router = express.Router();
const getFormToken = require("./getFormToken");

router.get("/getFormToken", async (req, res) => {
  try {
    getFormToken;
    res.status(201).json({ data: getFormToken });
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
});

module.exports = router;
