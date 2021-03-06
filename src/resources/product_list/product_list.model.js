const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: [
      {
        brandName: {
          type: String,
          required: true,
          trim: true,
        },
        productId: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    price: {
      type: Number,
      required: true,
      trim: true,
    },

    description: [
      {
        descriptionFeatures: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    dimension: [
      {
        product_type: { type: String, required: true, trim: true },
        product_dimension: { type: String, required: true, trim: true },
      },
    ],

    images: [
      {
        image: { type: String, required: true, trim: true },
      },
    ],

    category: { type: String, required: true, trim: true },

    isFreeShipping: { type: Boolean, required: true },

    isSoldOut: { type: Boolean, required: true },

    dateCreated: { type: Date, default: Date.now },

    // this is how you set up relationships in mongo using mongoose
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      // so that mongo knows what model to look for this id
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ user: 1, name: 1 }, { unique: true });

const Product = mongoose.model("ProductList", productSchema);

module.exports = Product;
