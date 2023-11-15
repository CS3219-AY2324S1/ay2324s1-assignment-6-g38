import { createServer } from "http";
import type { AddressInfo } from "net";
import { Server } from "socket.io";
import { io as ioc } from "socket.io-client";

import { loadEnvConfig } from "../commons/env-config";
import { deleteQueue } from "../data-access/queue-repository";
import { defineEventListeners } from "../entry-points/socket/controller";
import { getQuestion } from "../services/question-service";

jest.mock("../services/question-service");

const user1 = {
  difficulty: "Easy",
  categories: ["Strings"],
  language: "JavaScript",
};
const user2 = {
  difficulty: "Easy",
  categories: ["Algorithms"],
  language: "JavaScript",
};

function waitFor(socket, event) {
  return new Promise((resolve) => {
    console.log("Event Received", socket.id, event);
    socket.once(event, resolve);
  });
}

describe("Matching Service E2E Test", () => {
  let io;
  let clientSocket1;
  let clientSocket2;

  beforeAll((done) => {
    loadEnvConfig();
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;

      defineEventListeners(io);

      clientSocket1 = ioc(`http://localhost:${port}`);
      clientSocket2 = ioc(`http://localhost:${port}`);

      let connections = 0;
      const onConnect = (clientSocket, user) => {
        return () => {
          connections += 1;
          clientSocket.emit("register", user);
          console.log(
            `Test: Client ${connections} connected, emitting register event`,
          );
          if (connections === 2) done();
        };
      };

      clientSocket1.on("connect", onConnect(clientSocket1, user1));
      clientSocket2.on("connect", onConnect(clientSocket2, user2));
    });

    (getQuestion as jest.Mock).mockResolvedValue({
      id: 1,
      title: "test question",
      categories: ["Strings"],
      difficulty: "Easy",
      description: "test description",
      link: "https://test.com",
    });
  });

  afterAll(() => {
    io.close();
    clientSocket1.disconnect();
    clientSocket2.disconnect();
  });

  test("should match two users", async () => {
    await waitFor(clientSocket1, "connection_ack");
    await waitFor(clientSocket2, "connection_ack");

    // wait for queue_name events
    const data1 = await waitFor(clientSocket1, "queue_name");
    const data2 = await waitFor(clientSocket2, "match");

    console.log("received queue_name 1!", data1);
    console.log("received queue_name 2!", data2);

    // check the data received
    expect(data1).toBe("Easy_Algorithms_JavaScript");
    expect(data2).toBe("Easy_Algorithms_JavaScript");

    await deleteQueue("Easy_Algorithms_JavaScript");
  }, 30000);
});
