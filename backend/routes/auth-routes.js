const express = require("express");
const { protectRoute } = require("../middleware/auth-middleware");
const validate = require("../middleware/validation-middleware");
const { signupSchema, signinSchema } = require("../validators/auth-validator");
const {
  signUp,
  signIn,
  signOut,
  userInformation,
} = require("../controllers/auth-controller");

const router = express.Router();

router.post("/register", validate(signupSchema), signUp);
router.post("/login", validate(signinSchema), signIn);
router.post("/logout", signOut);

router.get("/me", protectRoute, userInformation);

module.exports = router;
