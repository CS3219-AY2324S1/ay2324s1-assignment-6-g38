import { loadEnvConfig } from "../../commons/utils/env-config";
import { getPrismaClient } from "../../commons/utils/prisma-client-factory";
import { createWebApplication } from "../../entry-points/api/history-server";
import {
  getAllQuestions,
  getQuestionById,
} from "../../services/question-service";
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
  await prisma.history.createMany({
    data: [
      {
        userId: 1,
        questionId: "Q1",
        submittedCode: "C1",
        timestamp: new Date("2023-11-06T00:00:00Z"),
      },
      {
        userId: 1,
        questionId: "Q2",
        submittedCode: "C2",
        timestamp: new Date("2023-11-10T00:00:00Z"),
      },
      {
        userId: 2,
        questionId: "Q1",
        submittedCode: "C1",
        timestamp: new Date("2023-11-12T00:00:00Z"),
      },
    ],
  });
});

afterAll(async () => {
  await prisma.history.deleteMany({});
  await prisma.$disconnect();
});

describe("GET /history", () => {
  test("without filters, return status 200 OK", async () => {
    // mock responses
    (getUserById as jest.Mock).mockResolvedValue({ id: 1 });
    (getAllQuestions as jest.Mock).mockResolvedValue([
      { id: "Q1", title: "Question 1" },
      { id: "Q2", title: "Question 2" },
    ]);

    const response = await mockApp.get("/history");
    expect(response.body).toEqual([
      expect.objectContaining({
        userId: 1,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
      }),
      expect.objectContaining({
        userId: 1,
        questionId: "Q2",
        question: {
          id: "Q2",
          title: "Question 2",
        },
        submittedCode: "C2",
      }),
      expect.objectContaining({
        userId: 2,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
      }),
    ]);
  });

  test("with date range filter, return status 200 OK", async () => {
    // mock responses
    (getUserById as jest.Mock).mockResolvedValue({ id: 1 });
    (getAllQuestions as jest.Mock).mockResolvedValue([
      { id: "Q1", title: "Question 1" },
      { id: "Q2", title: "Question 2" },
    ]);

    const response = await mockApp.get(
      `/history?startDate=${new Date(
        "2023-11-06T00:00:00Z",
      ).toISOString()}&endDate=${new Date(
        "2023-11-09T00:00:00Z",
      ).toISOString()}`,
    );

    expect(response.body).toEqual([
      expect.objectContaining({
        userId: 1,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: new Date("2023-11-06T00:00:00Z").toISOString(),
      }),
    ]);
  });

  test("with date range filter (startDate only), return status 200 OK", async () => {
    // mock responses
    (getUserById as jest.Mock).mockResolvedValue({ id: 1 });
    (getAllQuestions as jest.Mock).mockResolvedValue([
      { id: "Q1", title: "Question 1" },
      { id: "Q2", title: "Question 2" },
    ]);

    const response = await mockApp.get(
      `/history?startDate=${new Date("2023-11-06T00:00:00Z").toISOString()}`,
    );

    expect(response.body).toEqual([
      expect.objectContaining({
        userId: 1,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: new Date("2023-11-06T00:00:00Z").toISOString(),
      }),
      expect.objectContaining({
        userId: 1,
        questionId: "Q2",
        question: {
          id: "Q2",
          title: "Question 2",
        },
        submittedCode: "C2",
        timestamp: new Date("2023-11-10T00:00:00Z").toISOString(),
      }),
      expect.objectContaining({
        userId: 2,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: new Date("2023-11-12T00:00:00Z").toISOString(),
      }),
    ]);
  });

  test("with date range filter invalid date, return status 400 Bad Request", async () => {
    // mock responses
    (getUserById as jest.Mock).mockResolvedValue({ id: 1 });
    (getAllQuestions as jest.Mock).mockResolvedValue([
      { id: "Q1", title: "Question 1" },
      { id: "Q2", title: "Question 2" },
    ]);

    const response = await mockApp.get(
      `/history?startDate=${"2023-11-sdcd06T00:00:00Z"}`,
    );

    expect(response.status).toEqual(400);
  });

  test("with userId filter, should return histories matching userId", async () => {
    // mock user-service and question-service responses
    const userId = 2;
    (getUserById as jest.Mock).mockResolvedValue({ id: userId });
    (getAllQuestions as jest.Mock).mockResolvedValue([
      { id: "Q1", title: "Question 1" },
      { id: "Q2", title: "Question 2" },
    ]);

    // Send the request to the server
    const response = await mockApp.get(`/history?userId=${userId}`);

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        userId,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: expect.any(String),
      }),
    ]);
  });

  test("with date range filter (startDate only), return status 200 OK", async () => {
    // mock responses
    (getUserById as jest.Mock).mockResolvedValue({ id: 1 });
    (getAllQuestions as jest.Mock).mockResolvedValue([
      { id: "Q1", title: "Question 1" },
      { id: "Q2", title: "Question 2" },
    ]);

    const response = await mockApp.get(
      `/history?startDate=${new Date("2023-11-06T00:00:00Z").toISOString()}`,
    );

    expect(response.body).toEqual([
      expect.objectContaining({
        userId: 1,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: new Date("2023-11-06T00:00:00Z").toISOString(),
      }),
      expect.objectContaining({
        userId: 1,
        questionId: "Q2",
        question: {
          id: "Q2",
          title: "Question 2",
        },
        submittedCode: "C2",
        timestamp: new Date("2023-11-10T00:00:00Z").toISOString(),
      }),
      expect.objectContaining({
        userId: 2,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: new Date("2023-11-12T00:00:00Z").toISOString(),
      }),
    ]);
  });

  test("with date range filter (endDate only), return status 200 OK", async () => {
    // mock responses
    (getUserById as jest.Mock).mockResolvedValue({ id: 1 });
    (getAllQuestions as jest.Mock).mockResolvedValue([
      { id: "Q1", title: "Question 1" },
      { id: "Q2", title: "Question 2" },
    ]);

    const response = await mockApp.get(
      `/history?endDate=${new Date("2023-11-10T00:00:00Z").toISOString()}`,
    );

    expect(response.body).toEqual([
      expect.objectContaining({
        userId: 1,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: new Date("2023-11-06T00:00:00Z").toISOString(),
      }),
      expect.objectContaining({
        userId: 1,
        questionId: "Q2",
        question: {
          id: "Q2",
          title: "Question 2",
        },
        submittedCode: "C2",
        timestamp: new Date("2023-11-10T00:00:00Z").toISOString(),
      }),
    ]);
  });

  test("with userId filter, should return histories matching userId", async () => {
    // mock user-service and question-service responses
    const userId = 2;
    (getUserById as jest.Mock).mockResolvedValue({ id: userId });
    (getAllQuestions as jest.Mock).mockResolvedValue([
      { id: "Q1", title: "Question 1" },
      { id: "Q2", title: "Question 2" },
    ]);

    // Send the request to the server
    const response = await mockApp.get(`/history?userId=${userId}`);

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        userId,
        questionId: "Q1",
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: expect.any(String),
      }),
    ]);
  });
  test("with questionId filter, should return histories matching questionId", async () => {
    // Mock the user-service and question-service responses
    const questionId = "Q1";
    (getUserById as jest.Mock).mockImplementation((id) => {
      return Promise.resolve({ id });
    });
    (getQuestionById as jest.Mock).mockImplementation((id) => {
      const questions = {
        Q1: { id: "Q1", title: "Question 1" },
        Q2: { id: "Q2", title: "Question 2" },
      };
      return Promise.resolve(questions[id]);
    });

    // Send the request to the server
    const response = await mockApp.get(`/history?questionId=${questionId}`);

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        userId: 1,
        questionId,
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: expect.any(String),
      }),
      expect.objectContaining({
        id: expect.any(Number),
        userId: 2,
        questionId,
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: expect.any(String),
      }),
    ]);
  });

  test("with userId and questionId filter, should return histories matching both", async () => {
    // Mock the user-service and question-service responses
    const userId = 1;
    const questionId = "Q1";
    (getUserById as jest.Mock).mockResolvedValue({ id: userId });
    (getQuestionById as jest.Mock).mockResolvedValue({
      id: questionId,
      title: "Question 1",
    });

    // Send the request to the server
    const response = await mockApp.get(
      `/history?userId=${userId}&questionId=${questionId}`,
    );

    // Validate the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        userId,
        questionId,
        question: {
          id: "Q1",
          title: "Question 1",
        },
        submittedCode: "C1",
        timestamp: expect.any(String),
      }),
    ]);
  });
});
