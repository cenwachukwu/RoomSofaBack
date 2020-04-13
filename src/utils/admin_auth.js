const jwt = require("jsonwebtoken");
const Admin = require("../resources/admin/admin.model");

const adminAuth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  try {
    const admin = await Admin.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.admin = admin;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

module.exports = adminAuth;
