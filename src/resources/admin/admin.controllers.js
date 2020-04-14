const Admin = require("./admin.model");

module.exports = {
  // logout:
  // logoutOneDevice will remove the token connected to the signin of the device
  logout: async (req, res) => {
    try {
      req.admin.tokens = req.admin.tokens.filter((token) => {
        return token.token != req.token;
      });
      await req.admin.save();
      res.send();
    } catch (e) {
      console.error(e);
      res.status(400).send(error);
    }
  },
  // logoutAllDevice will remove all the tokens
  logoutAllDevice: async (req, res) => {
    try {
      req.admin.tokens.splice(0, req.admin.tokens.length);
      await req.admin.save();
      res.send();
    } catch (e) {
      console.error(e);
      res.status(400).send(error);
    }
  },
  // signup
  // here we are implementing the signup logic using a controller:
  // accepts an email and password
  signup: async (req, res) => {
    // if no email and password we want to return a 400 error and say "needs email and password"
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: "needs email and password" });
    }
    // try/catch because:
    // if we have the email and password we want to try to create a new user and token and returns the token with .send()
    try {
      const admin = await Admin.create(req.body);
      await admin.save();
      const token = await admin.generateAuthToken();
      res.status(201).send({ admin, token });

      // we also want to be able to catch any errors and end the req without sending a message with .end()
    } catch (e) {
      console.error(e);
      res.status(400).send(error);
    }
  },
  // signin
  // signin logic using controllers:
  // users must be real and not invalid and passwords must match
  signin: async (req, res) => {
    // if no email and password we want to return a 400 error and say "needs email and password"
    try {
      const { email, password } = req.body;
      const admin = await Admin.findByCredentials(email, password);
      if (!admin) {
        return res
          .status(401)
          .send({ error: "Login failed! Check authentication credentials" });
      }
      const token = await admin.generateAuthToken();
      res.send({ admin, token });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  // get admin infomation
  admin: async (req, res) => {
    res.status(200).send({ data: req.admin });
  },
  // trying out code for getting all the users
  getAllAdmin: async (req, res) => {
    try {
      const allAdmin = await Admin.find().lean().exec();
      res.status(200).json({ data: allAdmin });
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  },
  // updating an autheticated user by an autheticated user
  updateAdmin: async (req, res) => {
    try {
      const admin = await Admin.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      )
        .lean()
        .exec();

      res.status(200).json({ data: admin });
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  },
  // deleting an autheticated user by an autheticated user
  deletePerson: async (req, res) => {
    try {
      await Admin.findByIdAndDelete({ _id: req.params.id });

      return res
        .status(200)
        .json({ data: "Your Admin profile has been deleted" });
    } catch (e) {
      console.error(e);
      res.status(400).end();
    }
  },
};
