const express = require("express");

const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/logout", signOut);

module.exports = router;
