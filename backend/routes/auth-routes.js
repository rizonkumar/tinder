const express = require("express");
const { validateSignup } = require("../middleware/validateRequest");
const { signUp } = require("../controllers/auth-controller");

const router = express.Router();

router.post("/register", validateSignup, signUp);

// router.post("/login", signIn);
// router.post("/logout", signOut);

module.exports = router;
