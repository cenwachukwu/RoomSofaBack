const charge = require("./charge");

module.exports = {
  chargeCard: async (req, res) => {
    try {
      charge;
      res.status(201).json({ data: charge });
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  },
};
