const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// hash password with bcrypt
adminSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

// add token to user model
adminSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const admin = this;
  const token = jwt.sign({ _id: admin._id }, process.env.JWT_KEY);
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};

// compare password with bcrypt and we would use this in the signin authe
adminSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return admin;
};

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
