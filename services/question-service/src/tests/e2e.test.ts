// eslint-disable-next-line import/no-extraneous-dependencies
import assert from "assert";
import { getToken } from "next-auth/jwt";
import request from "supertest";

import { Difficulty } from "@prisma/client";

import { loadEnvConfig } from "../commons/utils/env-config";
import { getPrismaClient } from "../data-access/prisma-client-factory";
import { createWebApplication } from "../entry-points/api/server";

import resetDb from "./helper/resetDb";

const app = createWebApplication();

const mockApp = request(app);

const prisma = getPrismaClient();

loadEnvConfig();

jest.mock("next-auth/jwt");

beforeEach(async () => {
  await resetDb();
  jest.clearAllMocks();
  (getToken as jest.Mock).mockResolvedValue(null);
}, 40000);

const createQuestionInputFullOne = {
  title: "question-title",
  categories: ["Algorithms"],
  description: "question-description",
  difficulty: Difficulty.Easy,
  link: "http://www.question-url.com",
};

const createQuestionInputFullTwo = {
  title: "question-title-two",
  categories: ["Arrays"],
  description: "question-description-two",
  difficulty: Difficulty.Medium,
  link: "http://www.question-url-two.com",
};

const adminJwt = { role: "ADMIN" };
const userJwt = { role: "USER" };

describe("POST /question", () => {
  test("when valid create question input are provided with valid permissions, return status 200 OK", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    // act
    const res = await mockApp
      .post("/question")
      .send(createQuestionInputFullOne);
    // expect
    const question = await prisma.question.findFirst({
      where: { title: createQuestionInputFullOne.title },
    });
    expect(res.status).toBe(200);
    expect(question).not.toBe(null);
  });

  test("when invalid create question input are provided with valid permissions, return status 400", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    // act
    const res = await mockApp
      .post("/question")
      .send({ ...createQuestionInputFullOne, title: undefined });
    // expect
    const questions = await prisma.question.findMany();
    expect(res.status).toBe(400);
    expect(questions.length).toBe(0);
  });

  test("when a existing question title is provided with valid permissions, return status 409", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    // act
    await mockApp.post("/question").send(createQuestionInputFullOne);
    const res = await mockApp.post("/question").send({
      ...createQuestionInputFullTwo,
      title: createQuestionInputFullOne.title,
    });
    // expect
    const questions = await prisma.question.findMany();
    expect(res.status).toBe(409);
    expect(questions.length).toBe(1);
  });

  test("when valid create question input are provided but no auth token, return status 401", async () => {
    // act
    const res = await mockApp
      .post("/question")
      .send(createQuestionInputFullOne);
    // expect
    expect(res.status).toBe(401);
  });

  test("when valid create question input are provided but invalid permission, return status 403", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    // act
    const res = await mockApp
      .post("/question")
      .send(createQuestionInputFullOne);
    // expect
    expect(res.status).toBe(403);
  });
});

describe("GET /question", () => {
  test("when empty get request is called, return all questions with status 200 OK", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    await prisma.question.create({ data: createQuestionInputFullOne });
    await prisma.question.create({ data: createQuestionInputFullTwo });
    const questions = await prisma.question.findMany();
    // act
    const res = await mockApp.get("/question");
    // expect
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(questions);
  });
  test("when get request with all filters, return matching question(s) with status 200 OK", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    await prisma.question.create({ data: createQuestionInputFullOne });
    await prisma.question.create({ data: createQuestionInputFullTwo });
    const question = await prisma.question.findFirst();
    assert(question != null);
    const params = new URLSearchParams({
      id: question.id,
      title: question.title,
      difficulty: question.difficulty,
      category: question.categories[0],
    });
    // act
    const res = await mockApp.get(`/question?${params.toString()}`);
    // expect
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual([question]);
  });
  test("when get request with getOne is true, return only one of the results with status 200 OK", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    await prisma.question.create({ data: createQuestionInputFullOne });
    await prisma.question.create({ data: createQuestionInputFullTwo });
    const questions = await prisma.question.findMany();
    expect(questions.length).toBe(2);
    const params = new URLSearchParams({
      getOne: "true",
    });
    // act
    const res = await mockApp.get(`/question?${params.toString()}`);
    // expect
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(undefined);
  });
  test("when get request no relevant questions with status 200 OK", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    const questions = await prisma.question.findMany();
    expect(questions.length).toBe(0);
    // act
    const res = await mockApp.get(`/question?`);
    // expect
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual([]);
  });
  test("if provided invalid filter, return status 500", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    await prisma.question.create({ data: createQuestionInputFullOne });
    const params = new URLSearchParams({
      difficulty: "invalid-difficulty",
    });
    // act
    const res = await mockApp.get(`/question?${params.toString()}`);
    // expect
    expect(res.status).toBe(500);
  });
  test("if exists question that matches input id, return status 200 OK", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    await prisma.question.create({ data: createQuestionInputFullOne });
    await prisma.question.create({ data: createQuestionInputFullTwo });
    const question = await prisma.question.findFirst({
      where: { title: createQuestionInputFullOne.title },
    });
    expect(question).not.toBe(null);
    // act
    const res = await mockApp.get(`/question/${question!.id}`);
    // expect
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(question);
  });
  test("if no question that matches input id, return status 404", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    // act
    const res = await mockApp.get(`/question/mock-id`);
    // expect
    expect(res.status).toBe(404);
  });
});

describe("PATCH /question", () => {
  test("when valid patch inputs are provided with valid permissions, return 200 OK", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    const newTitle = "new-title";
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    assert(questionsBefore[0].title !== newTitle);
    // act
    const res = await mockApp.patch(`/question/${questionsBefore[0].id}`).send({
      title: newTitle,
    });
    // expect
    expect(res.status).toBe(200);
    const questionsAfter = await prisma.question.findMany();
    assert(questionsAfter.length === 1);
    expect(questionsAfter[0].title === newTitle);
  });
  test("when invalid patch inputs are provided with valid permissions, return 400", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    // act
    const res = await mockApp.patch(`/question/${questionsBefore[0].id}`).send({
      title: 123,
    });
    // expect
    expect(res.status).toBe(400);
    const questionsAfter = await prisma.question.findMany();
    assert(questionsAfter.length === 1);
    expect(questionsAfter[0].title === questionsBefore[0].title);
  });
  test("when non-existing id is provided with valid permissions, return 404", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    const newTitle = "new-title";
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    // act
    const res = await mockApp
      .patch(`/question/${questionsBefore[0].id}-invalid`)
      .send({
        title: newTitle,
      });
    // expect
    expect(res.status).toBe(404);
    const questionsAfter = await prisma.question.findMany();
    assert(questionsAfter.length === 1);
    expect(questionsAfter[0].title === questionsBefore[0].title);
  });
  test("when valid patch inputs are provided with no auth token, return 401", async () => {
    // setup
    const newTitle = "new-title";
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    // act
    const res = await mockApp.patch(`/question/${questionsBefore[0].id}`).send({
      title: newTitle,
    });
    // expect
    expect(res.status).toBe(401);
    const questionsAfter = await prisma.question.findMany();
    assert(questionsAfter.length === 1);
    expect(questionsAfter[0].title === questionsBefore[0].title);
  });
  test("when valid patch inputs are provided with invalid permissions, return 403", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    const newTitle = "new-title";
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    // act
    const res = await mockApp.patch(`/question/${questionsBefore[0].id}`).send({
      title: newTitle,
    });
    // expect
    expect(res.status).toBe(403);
    const questionsAfter = await prisma.question.findMany();
    assert(questionsAfter.length === 1);
    expect(questionsAfter[0].title === questionsBefore[0].title);
  });
});

describe("DELETE /question", () => {
  test("when valid delete id is provided with valid permissions, return 200 OK", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    // act
    const res = await mockApp.delete(`/question/${questionsBefore[0].id}`);
    // expect
    expect(res.status).toBe(200);
    const questionsAfter = await prisma.question.findMany({
      where: { isDeleted: false },
    });
    expect(questionsAfter.length).toBe(0);
  });
  test("when invalid delete id is provided with valid permissions, return 404", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(adminJwt);
    const mockId = "mock-question-id";
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    const matchingQuestions = await prisma.question.findMany({
      where: { id: mockId },
    });
    assert(matchingQuestions.length === 0);
    // act
    const res = await mockApp.delete(`/question/${mockId}`);
    // expect
    expect(res.status).toBe(404);
    const questionsAfter = await prisma.question.findMany();
    expect(questionsAfter.length).toBe(questionsBefore.length);
  });
  test("when valid patch inputs are provided with no auth token, return 401", async () => {
    // setup
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    // act
    const res = await mockApp.delete(`/question/${questionsBefore[0].id}`);
    // expect
    expect(res.status).toBe(401);
    const questionsAfter = await prisma.question.findMany();
    expect(questionsAfter.length).toBe(questionsBefore.length);
  });
  test("when valid patch inputs are provided with invalid permissions, return 403", async () => {
    // setup
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    await prisma.question.create({ data: createQuestionInputFullOne });
    // assert before
    const questionsBefore = await prisma.question.findMany();
    assert(questionsBefore.length === 1);
    // act
    const res = await mockApp.delete(`/question/${questionsBefore[0].id}`);
    // expect
    expect(res.status).toBe(403);
    const questionsAfter = await prisma.question.findMany();
    expect(questionsAfter.length).toBe(questionsBefore.length);
  });
});
