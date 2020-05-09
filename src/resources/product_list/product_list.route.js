const express = require("express");

const productController = require("./product_list.controllers");

const router = express.Router();

const auth = require("../../utils/admin_auth");

// find multiple blogs = get
router.get("/products", productController.allProducts);

// create new blog = post
router.post("/products", auth, productController.createProduct);

// find one blog by category = get
router.get("/products/:category", productController.productsByCategory);

router.get("/products/:id", productController.oneProductById);

router
  .route("/products/:id")

  // update blog= put
  .put(auth, productController.updateProduct)

  // delete blog = delete
  .delete(auth, productController.deleteProduct);

module.exports = router;
