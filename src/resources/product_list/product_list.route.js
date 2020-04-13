const express = require("express");

const productController = require("./product_list.controllers");

const router = express.Router();

// find multiple blogs = get
router.get("/products", productController.allProducts);

// create new blog = post
router.post("/products", productController.createProduct);

// find one blog by category = get
router.get("/products/:category", productController.productsByCategory);

router
  .route("/products/:id")

  // find one blog = get
  .get(productController.oneProductById)

  // update blog= put
  .put(productController.updateProduct)

  // delete blog = delete
  .delete(productController.deleteProduct);

module.exports = router;
