const express = require("express");
const {
  validateSignup,
  validateSignIn,
} = require("../middleware/auth-middleware");

const { signUp, signIn, signOut } = require("../controllers/auth-controller");

const router = express.Router();

router.post("/register", validateSignup, signUp);
router.post("/login", validateSignIn, signIn);
router.post("/logout", signOut);

module.exports = router;
