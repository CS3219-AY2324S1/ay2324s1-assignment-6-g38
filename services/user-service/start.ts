import { startWebServer } from "./entry-points/api/server";

async function start() {
  // 🦉 Array of entry point is being used to support more entry-points kinds like message queue, scheduled job,
  return Promise.all([startWebServer()]);
}

start()
  .then((startResponses) => console.log(startResponses))
  .catch((error) => {
    console.log(error);
  });
