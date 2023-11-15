import express from "express";
import type { Server } from "http";
import type { AddressInfo } from "net";
import pinoHttp from "pino-http";

import { errorHandler } from "../../../errorHandler";

import defineRoutes from "./routes";

const httpLogger = pinoHttp({
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});

const cors = require("cors");

let connection: Server;

// ️️️✅ Best Practice: API exposes a start/stop function to allow testing control WHEN this should happen
async function openConnection(
  expressApp: express.Application,
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const webServerPort = 2001;
    connection = expressApp.listen(webServerPort, () => {
      resolve(connection.address() as AddressInfo);
    });
  });
}

function createWebApplication() {
  const expressApp = express();
  expressApp.use(httpLogger);
  expressApp.use(cors());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  defineRoutes(expressApp);
  expressApp.use(errorHandler);
  return expressApp;
}

async function startWebServer(): Promise<AddressInfo> {
  const APIAddress = await openConnection(createWebApplication());
  return APIAddress;
}

async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

export { createWebApplication, startWebServer, stopWebServer };
