const Product_List = require("./product_list.model");

module.exports = {
  // get all products
  allProducts: async (req, res) => {
    try {
      const doc = await Product_List.find().lean().exec();

      if (!doc) {
        return res.status(400).end();
      }

      res.status(200).json({ data: doc });
    } catch (error) {
      console.error(e);
      res.status(400).end();
    }
  },
  // find one product
  oneProductById: async (req, res) => {
    try {
      const doc = await Blog.findOne({ _id: req.params.id }).lean().exec();

      if (!doc) {
        return res.status(400).end();
      }

      res.status(200).json({ data: doc });
    } catch (error) {
      console.error(error);
      res.status(400).end();
    }
  },
  // find products by category
  productsByCategory: async (req, res) => {
    try {
      const doc = await Product_List.findOne({ category: req.params.category })
        .lean()
        .exec();

      if (!doc) {
        return res.status(400).end();
      }

      res.status(200).json({ data: doc });
    } catch (error) {
      console.error(error);
      res.status(400).end();
    }
  },
  // only admin creates products
  createProduct: async (req, res) => {
    // const createdBy = req.user._id;
    try {
      const doc = await Product_List.create(req.body);
      res.status(201).json({ data: doc });
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  },
  // only admin updates products
  updateProduct: async (req, res) => {
    try {
      const updatedDoc = await Product_List.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        { new: true }
      )
        .lean()
        .exec();

      if (!updatedDoc) {
        return res.status(400).end();
      }

      res.status(200).json({ data: updatedDoc });
    } catch (error) {
      console.error(error);
      res.status(400).end();
    }
  },
  // only admin deletes products
  deleteProduct: async (req, res) => {
    try {
      await Product_List.findOneAndRemove({
        createdBy: req.user._id,
        _id: req.params.id,
      });

      return res.status(200).json({ data: "The product has been deleted" });
    } catch (error) {
      console.error(error);
      res.status(400).end();
    }
  },
};
