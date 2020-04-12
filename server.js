const express = require("express");
const cors = require("cors");

require("./src/config/connection");

const app = express();

app.get("/testing", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());
app.use(cors());