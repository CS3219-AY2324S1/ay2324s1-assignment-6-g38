import { loadEnvConfig } from "../../commons/utils/env-config";
import { getPrismaClient } from "../../commons/utils/prisma-client-factory";
import { createWebApplication } from "../../entry-points/api/history-server";
import { clearPostgres } from "../helper/resetDb";

const request = require("supertest");

const app = createWebApplication();
const mockApp = request(app);
const prisma = getPrismaClient();

loadEnvConfig();

beforeEach(async () => {
  await clearPostgres();
});

beforeAll(async () => {
  await prisma.history.createMany({
    data: [
      { userId: 1, questionId: "Q123", submittedCode: "C123" },
      { userId: 1, questionId: "Q456", submittedCode: "C456" },
      { userId: 2, questionId: "Q123", submittedCode: "C123" },
    ],
  });
});

afterAll(async () => {
  // Clean up data after tests
  await prisma.history.deleteMany({});
  await prisma.$disconnect();
});

describe("DELETE /history", () => {
  test("deleting a history record with valid id | should return 200 OK and resource is deleted", async () => {
    // Create a record to delete
    const newHistory = await prisma.history.create({
      data: { userId: 1, questionId: "Q789", submittedCode: "C789" },
    });

    const response = await mockApp.delete(`/history/${newHistory.id}`);
    const history = await prisma.history.findUnique({
      where: { id: newHistory.id },
    });

    expect(response.status).toBe(200);
    expect(history).toBeNull();
  });

  test("deleting a history record with non-existent id | should return 404 Not Found and no change in database", async () => {
    const nonExistentId = 999;
    const response = await mockApp.delete(`/history/${nonExistentId}`);
    const history = await prisma.history.findUnique({
      where: { id: nonExistentId },
    });

    expect(response.status).toBe(404);
    expect(history).toBeNull();
  });

  test("deleting a history record without providing id | should return 400 Bad Request and no change in database", async () => {
    const response = await mockApp.delete("/history");
    const historiesBefore = await prisma.history.findMany();
    const historiesAfter = await prisma.history.findMany();

    expect(response.status).toBe(400);
    expect(historiesAfter).toEqual(historiesBefore);
  });
});
