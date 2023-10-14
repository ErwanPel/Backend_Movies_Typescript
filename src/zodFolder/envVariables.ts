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
});

export const envVariables = schemaEnv.parse(process.env);
