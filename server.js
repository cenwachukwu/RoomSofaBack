const express = require("express");
const cors = require("cors");

const app = express();

app.get("/testing", (req, res) => {
  res.send("Hello World");
});