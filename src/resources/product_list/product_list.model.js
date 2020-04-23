const mongoose = require("mongoose");

const productListSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dimension: [
      {
        product_type: String,
        product_dimension: String,
      },
    ],
    features: [
      {
        feature: String,
      },
    ],
    availableSizes: [
      {
        size: String,
      },
    ],
    styleNumber: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    isFreeShipping: { type: Boolean, required: true },
    isSoldOut: { type: Boolean, required: true },
    dateCreated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Product_List = mongoose.model("ProductList", productListSchema);

module.exports = Product_List;
