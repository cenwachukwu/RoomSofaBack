const express = require("express");

const productController = require("./product_list.controllers");

const Product_List = require("./product_list.model");

const router = express.Router();

const auth = require("../../utils/admin_auth");

// find multiple blogs = get
router.get("/products", productController.allProducts);

// create new blog = post
router.post("/products", auth, productController.createProduct);

// find one blog by category = get
router.get("/products/:category", productController.productsByCategory);

router.get("/:id", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found." });
  }
});

router
  .route("/products/:id")

  // update blog= put
  .put(auth, productController.updateProduct)

  // delete blog = delete
  .delete(auth, productController.deleteProduct);

module.exports = router;
