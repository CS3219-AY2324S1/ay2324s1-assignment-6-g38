import { loadEnvConfig } from "./commons/utils/env-config";
import { startWebServer } from "./entry-points/api/history-server";

loadEnvConfig();

async function start() {
  // 🦉 Array of entry point is being used to support more entry-points kinds like message queue, scheduled job,
  return Promise.all([startWebServer()]);
}

start()
  .then((startResponses) => console.log(startResponses))
  .catch((error) => {
    console.log(error);
  });
