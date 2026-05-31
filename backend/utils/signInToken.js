import jwt from "jsonwebtoken";
import config from "../config/env.js";

const signInToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: "7d",
  });
};

export default signInToken;
