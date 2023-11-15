import { config } from "dotenv";
import path from "path";
import pino from "pino";

const logger = pino();

export function loadEnvConfig() {
  const envFileName = path.resolve(
    __dirname,
    "../../",
    `.env.${process.env.NODE_ENV || "development"}`,
  );
  config({ path: envFileName });
  logger.info("Loaded env file:", envFileName);
  logger.debug("Connected to Database URL:", process.env.RABBITMQ_URL);
}
