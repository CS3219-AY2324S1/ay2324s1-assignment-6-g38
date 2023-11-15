import { config } from "dotenv";
import path from "path";

export function loadEnvConfig() {
  const envFileName = path.resolve(
    __dirname,
    "../../../",
    `.env.${process.env.NODE_ENV || "development"}`,
  );
  config({ path: envFileName });
  console.log("Loaded env file:", envFileName);
  console.log("Connected to Database URL:", process.env.DATABASE_URL);
}
