const express = require("express");
const cors = require("cors");

const product_listRouter = require("./src/resources/product_list/product_list.route");

require("dotenv").config();

require("./src/config/connection");

const app = express();

app.get("/testing", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());
app.use(cors());

app.use(product_listRouter);

app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
  console.log(`✅ PORT: ${app.get("port")} 🌟`);
});
