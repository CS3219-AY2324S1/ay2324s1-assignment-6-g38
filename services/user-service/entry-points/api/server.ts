import { Server } from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import defineRoutes from './routes';
const cors = require('cors');

let connection: Server;

function errorHandler(err, req, res, next) {
  console.error(err); // Log the error for debugging purposes

  // Handle specific errors or send a generic error response
  if (err instanceof YourCustomError) {
    // Handle a specific type of error (e.g., validation error)
    res.status(400).json({ error: err.message });
  } else {
    // Handle other types of errors with a generic response
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// ️️️✅ Best Practice: API exposes a start/stop function to allow testing control WHEN this should happen
async function startWebServer(): Promise<AddressInfo> {
  // ️️️✅ Best Practice: Declare a strict configuration schema and fail fast if the configuration is invalid
  const expressApp = express();
  expressApp.use(cors());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  defineRoutes(expressApp);
  const APIAddress = await openConnection(expressApp);
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

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const webServerPort = 2000 || 0;
    connection = expressApp.listen(webServerPort, () => {
      resolve(connection.address() as AddressInfo);
    });
  });
}



export { startWebServer, stopWebServer };