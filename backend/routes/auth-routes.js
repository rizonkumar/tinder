import express from "express";
import { protectRoute } from "../middleware/auth-middleware.js";
import validate from "../middleware/validation-middleware.js";
import { signupSchema, signinSchema } from "../validators/auth-validator.js";
import {
  signUp,
  signIn,
  signOut,
  userInformation,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/register", validate(signupSchema), signUp);
router.post("/login", validate(signinSchema), signIn);
router.post("/logout", signOut);

router.get("/me", protectRoute, userInformation);

export default router;
