import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3001),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  CLOUDINARY_API_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  GEMINI_API_KEY: Joi.string().required(),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation failed: ${error.message}`);
}

const config = {
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  jwtSecret: envVars.JWT_SECRET,
  env: envVars.NODE_ENV,
  cloudinary: {
    cloudName: envVars.CLOUDINARY_API_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
  geminiApiKey: envVars.GEMINI_API_KEY,
};

export default Object.freeze(config);
