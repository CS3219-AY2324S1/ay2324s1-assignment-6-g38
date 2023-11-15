import express from "express";
import { createServer } from "http";
import pino from "pino";
import { Server } from "socket.io";

import { loadEnvConfig } from "../../commons/env-config";

import { defineEventListeners } from "./controller";

loadEnvConfig();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const logger = pino();
const port = process.env.PORT || 6001;

defineEventListeners(io);

httpServer.listen(port, () => {
  logger.info(`Matching service running on port ${port}`);
});
