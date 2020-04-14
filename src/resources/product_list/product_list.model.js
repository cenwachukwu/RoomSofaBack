const mongoose = require("mongoose");

const productListSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: { type: String, required: true, trim: true },
    soldOut: {
      type: Boolean,
      required: true,
    },
    dateCreated: { type: Date, default: Date.now },
    // this is how you set up relationships in mongo using mongoose
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      // so that mongo knows what model to look for this id
      ref: "admin",
      required: true,
    },
  },
  { timestamps: true }
);

productListSchema.index({ admin: 1, title: 1 }, { unique: true });

const Product_List = mongoose.model("ProductList", productListSchema);

module.exports = Product_List;
