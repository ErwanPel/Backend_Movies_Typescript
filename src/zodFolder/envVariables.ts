import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const schemaEnv = z.object({
  PORT: z.string().nonempty(),
  NODE_ENV: z
    .string()
    .refine((value) => value === "production" || value === "development", {
      message: "NODE_ENV must be 'production' or 'development",
    }),
  APIKEY: z.string(),
  MONGOOSE_URL: z.string(),
  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_APIKEY: z.string(),
  CLOUDINARY_APISECRET: z.string(),
});

export const envVariables = schemaEnv.parse(process.env);
