const express = require("express");

const userController = require("./admin.controllers");

const router = express.Router();

const auth = require("../../utils/admin_auth");

// create new user (signup) = post
router.post("/admin/signup", userController.signup);

// login user = post
router.post("/admin/signin", userController.signin);

// logout
router.post("/admin/logout", auth, userController.logout);

// logoutAll
router.post("/admin/logoutall", auth, userController.logoutAllDevice);

// find one user = get
router.get("/admin", auth, userController.person);

// update user = put
router.put("/admin/:id", auth, userController.updatePerson);

// delete user = delete
router.delete("/admin/:id", auth, userController.deletePerson);

module.exports = router;
