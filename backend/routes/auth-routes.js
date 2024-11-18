const express = require("express");
const {
  validateSignup,
  validateSignIn,
  protectRoute,
} = require("../middleware/auth-middleware");

const {
  signUp,
  signIn,
  signOut,
  userInformation,
} = require("../controllers/auth-controller");

const router = express.Router();

router.post("/register", validateSignup, signUp);
router.post("/login", validateSignIn, signIn);
router.post("/logout", signOut);

router.get("/me", protectRoute, userInformation);

module.exports = router;
