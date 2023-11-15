import { pino } from "pino";

// Configure Pino options as needed
const loggerOptions: pino.LoggerOptions = {
  level: "info", // Set the default logging level to 'info'
  timestamp: pino.stdTimeFunctions.isoTime, // Include timestamps in log messages
  messageKey: "message", // Use 'message' as the log message key
  redact: ["password", "api_key"], // Redact sensitive fields like 'password' and 'api_key'
};

// Create a Pino logger instance
const pinoLogger = pino(loggerOptions);

// Define your logger interface
export interface Logger {
  info(message: string): void;
  error(message: string, error?: Error): void;
  warn(message: string): void;
  debug(message: string): void;
}

// Create a logger wrapper
export const logger: Logger = {
  info: (message: string) => {
    pinoLogger.info(message);
  },
  error: (message: string, error?: Error) => {
    if (error) {
      pinoLogger.error({ message, error });
    } else {
      pinoLogger.error(message);
    }
  },
  warn: (message: string) => {
    pinoLogger.warn(message);
  },
  debug: (message: string) => {
    pinoLogger.debug(message);
  },
};
