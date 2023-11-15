import HttpError from "../../commons/error/HttpError";
import { loadEnvConfig } from "../../commons/utils/env-config";
import { getPrismaClient } from "../../commons/utils/prisma-client-factory";
import { createWebApplication } from "../../entry-points/api/history-server";
import { getQuestionById } from "../../services/question-service";
import { getUserById } from "../../services/user-service";

const request = require("supertest");

// Mock user and question services
jest.mock("../../services/user-service");
jest.mock("../../services/question-service");

const app = createWebApplication();
const mockApp = request(app);
const prisma = getPrismaClient();

loadEnvConfig();

beforeEach(async () => {
  await prisma.history.deleteMany({});
});

describe("POST /history", () => {
  test("with valid inputs, should create a new history entry and return 200 Created", async () => {
    (getUserById as jest.Mock).mockResolvedValue({ id: 1 });
    (getQuestionById as jest.Mock).mockResolvedValue({
      id: "Q1",
      title: "Question 1",
    });

    // Sending a POST request with the history data
    const newHistory = {
      userId: 1,
      questionId: "Q1",
      submittedCode: "C1",
    };

    const response = await mockApp.post("/history").send(newHistory);

    // validate response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(newHistory));

    // validate db
    const createdHistory = await prisma.history.findFirst({
      where: { userId: 1, questionId: "Q1" },
    });
    expect(createdHistory).toBeTruthy();
  });

  test("with invalid userId, should return 422 Bad Request", async () => {
    // Mocking getUserById to simulate an invalid user ID
    (getUserById as jest.Mock).mockRejectedValue(
      new HttpError(
        `An error occurred while fetching questions from the user service`,
        500,
      ),
    );
    (getQuestionById as jest.Mock).mockResolvedValue(null);

    const newHistory = {
      userId: 999, // invalid user ID
      questionId: "Q1",
      submittedCode: "C1",
    };

    const response = await mockApp.post("/history").send(newHistory);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: "Invalid userId: 999. User does not exist.",
    });

    // ensure the record has NOT been created in the database
    const createdHistory = await prisma.history.findFirst({
      where: { userId: 999 },
    });
    expect(createdHistory).toBeNull();
  });

  test("with invalid questionId, should return 422 Bad Request", async () => {
    // Mocking getQuestionById to simulate an invalid question ID
    (getUserById as jest.Mock).mockResolvedValue({ id: 1 });
    (getQuestionById as jest.Mock).mockRejectedValue(
      new HttpError(
        `An error occurred while fetching questions from the question service`,
        500,
      ),
    );

    const newHistory = {
      userId: 1,
      questionId: "Q999", // invalid question ID
      submittedCode: "C1",
    };

    const response = await mockApp.post("/history").send(newHistory);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: "Invalid questionId: Q999. Question does not exist.",
    });

    // ensure the record has NOT been created in the database
    const createdHistory = await prisma.history.findFirst({
      where: { questionId: "Q999" },
    });
    expect(createdHistory).toBeNull();
  });
});
