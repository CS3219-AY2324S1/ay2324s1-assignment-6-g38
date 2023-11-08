// eslint-disable-next-line import/no-extraneous-dependencies
import { getToken } from "next-auth/jwt";
import request from "supertest";

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
});

afterEach(async () => {
  jest.clearAllMocks();
});

// const createQuestionInputFull = {
//   title: "question-title",
//   categories: [Category.Algorithms],
//   description: "question-description",
//   difficulty: Difficulty.Easy,
//   link: "http://www.question-url.com",
// };
// const adminJwt = { role: "ADMIN" };
// const userJwt = { role: "USER" };

test("should run", () => {
  expect(true).toBe(true);
});
// describe("POST /question", () => {
//   test("when valid title, categories, description, difficulty and link are provided with valid permissions, return status 200 OK", async () => {
//     (getToken as jest.Mock).mockResolvedValue(adminJwt);
//     const res = await mockApp.post("/question").send(createQuestionInputFull);
//     const question = await prisma.question.findUnique({
//       where: { title: createQuestionInputFull.title },
//     });
//     expect(res.status).toBe(200);
//     expect(question).not.toBe(null);
//   });

//   test("when valid name and email are provided but no valid permission, return status 401", async () => {
//     (getToken as jest.Mock).mockResolvedValue(adminJwt);
//     const res = await mockApp.post("/question").send(createQuestionInputFull);
//     expect(res.status).toBe(401);
//   });

//   test("when only email and valid permission is provided, return status 400 Bad Request", async () => {
//     // act
//     (getToken as jest.Mock).mockResolvedValue(userJwt);
//     const res = await mockApp.post("/question").send(invalidUserInputOnlyEmail);
//     const user = await prisma.question.findUnique({
//       where: { ...invalidUserInputOnlyEmail },
//     });
//     // assert
//     expect(res.status).toBe(400);
//     expect(user).toBe(null);
//   });

//   test("when only name and valid permission is provided, return status 400 Bad Request", async () => {
//     // act
//     (getToken as jest.Mock).mockResolvedValue(userJwt);
//     const res = await mockApp.post("/question").send(invalidUserInputOnlyName);
//     const user = await prisma.question.findMany({
//       where: { ...invalidUserInputOnlyName },
//     });
//     // assert
//     expect(res.status).toBe(400);
//     expect(user).toEqual([]);
//   });

//   test("when invalid email is provided, return status 400 Bad Request", async () => {
//     // act
//     (getToken as jest.Mock).mockResolvedValue(userJwt);
//     const res = await mockApp.post("/question").send(invalidUserInputOnlyName);
//     const user = await prisma.question.findMany({
//       where: { ...createUserInput, email: invalidEmail },
//     });
//     // assert
//     expect(res.status).toBe(400);
//     expect(user).toEqual([]);
//   });

//   test("when invalid url is provided, return status 400 Bad Request", async () => {
//     // act
//     (getToken as jest.Mock).mockResolvedValue(userJwt);
//     const res = await mockApp.post("/question").send(invalidUserInputOnlyName);
//     const user = await prisma.question.findMany({
//       where: { ...createUserInputFull, url: "help" },
//     });
//     // assert
//     expect(res.status).toBe(400);
//     expect(user).toEqual([]);
//   });

//   test("when there is already a user with the same email, return status 409 Conflict", async () => {
//     // arrange
//     (getToken as jest.Mock).mockResolvedValue(userJwt);
//     await mockApp.post("/question").send(createUserInput);
//     // act
//     const res = await mockApp.post("/question").send(createUserInput);
//     const users = await prisma.question.findMany({
//       where: { ...createUserInput },
//     });
//     // assert
//     expect(res.status).toBe(409);
//     expect(users.length).toBe(1);
//   });
// });

// describe("GET /question", () => {
//   test("when calling the api, return status 200 OK", async () => {
//     // arrange
//     await prisma.question.create({ data: createUserInput });
//     const user = await prisma.question.findMany();
//     // action
//     const res = await mockApp.get("/question");
//     // assert
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(user);
//   });

//   test("when adding email filter, return status 200 OK", async () => {
//     const findEmail = "weijun@gmail.com";
//     // arrange
//     await prisma.question.createMany({
//       data: [createUserInput, createUserInput1, createUserInput2],
//     });
//     const users = await prisma.question.findMany({
//       where: { email: findEmail },
//     });
//     // action
//     const res = await mockApp.get(`/question?email=${findEmail}`);
//     // assert
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(users);
//   });
// });

// describe("PUT /question", () => {
//   test("When editing user with valid permission, return status 200 OK", async () => {
//     // arrange
//     await prisma.question.create({ data: createUserInput });
//     const beforeModified = await prisma.question.findUnique({
//       where: createUserInput,
//     });
//     (getToken as jest.Mock).mockResolvedValue({
//       userId: beforeModified!.id,
//       ...adminJwt,
//     });
//     // action

//     const res = await mockApp
//       .put(`/question/${beforeModified!.id}`)
//       .send({ ...beforeModified, name: "new name" });

//     const afterModified = await prisma.question.findUnique({
//       where: {
//         id: beforeModified!.id,
//       },
//     });
//     // assert
//     expect(res.status).toBe(200);
//     expect(afterModified?.name).toBe("new name");
//   });

//   test("When editing user with valid permission, return status 401 UNAUTHORIZED", async () => {
//     // arrange
//     await prisma.question.create({ data: createUserInput });
//     const beforeModified = await prisma.question.findUnique({
//       where: createUserInput,
//     });
//     (getToken as jest.Mock).mockResolvedValue({
//       userId: beforeModified!.id + 1,
//       ...questionJwt,
//     });
//     // action

//     const res = await mockApp
//       .put(`/question/${beforeModified!.id}`)
//       .send({ ...beforeModified, name: "new name" });

//     const afterModified = await prisma.question.findUnique({
//       where: {
//         id: beforeModified!.id,
//       },
//     });
//     // assert
//     expect(res.status).toBe(401);
//     expect(afterModified?.name).toBe(createUserInput.name);
//   });

//   test("When editing non-existant user, return status 404 NOT FOUND", async () => {
//     // action
//     (getToken as jest.Mock).mockResolvedValue({
//       ...adminJwt,
//     });
//     const res = await mockApp
//       .put(`/question/${0}`)
//       .send({ id: 0, name: "new name" });

//     // assert
//     expect(res.status).toBe(404);
//   });
// });

// describe("GET /question/id", () => {
//   test("when retrieving existing user based on their id, return 200 OK", async () => {
//     // arrange
//     const user = await prisma.question.create({ data: createUserInput });
//     const { id } = user;

//     // action
//     const res = await mockApp.get(`/question/${id}`);

//     // assert
//     expect(res.status).toBe(200);
//     expect(res.body).toEqual(user);
//   });

//   test("when retrieving non-existing user based on their id, return 200 OK", async () => {
//     // action
//     const res = await mockApp.get(`/question/${0}`);
//     // assert
//     expect(res.status).toBe(404);
//   });
// });

// describe("DELETE /question/:id", () => {
//   test("When user delete his account, return 200 OK", async () => {
//     // arrange
//     const user = await prisma.question.create({ data: createUserInput });
//     const { id } = user;
//     (getToken as jest.Mock).mockResolvedValue({
//       userId: id,
//       ...questionJwt,
//     });

//     // action
//     const res = await mockApp.delete(`/question/${id}`);
//     const checkUser = await prisma.question.findUnique({
//       where: {
//         id,
//       },
//     });
//     // assert
//     expect(res.status).toBe(200);
//     expect(checkUser).toBe(null);
//   });

//   test("When someone with incorrect permission try to delete his account, return 401 Unauthorized", async () => {
//     // arrange
//     const user = await prisma.question.create({ data: createUserInput });
//     const { id } = user;
//     (getToken as jest.Mock).mockResolvedValue({
//       userId: id + 1,
//       ...questionJwt,
//     });

//     // action
//     const res = await mockApp.delete(`/question/${id}`);
//     const checkUser = await prisma.question.findUnique({
//       where: {
//         id,
//       },
//     });
//     // assert
//     expect(res.status).toBe(401);
//     expect(checkUser).toBe(checkUser);
//   });

//   test("When admin deletes a account, return 200 OK", async () => {
//     // arrange
//     const user = await prisma.question.create({ data: createUserInput });
//     const { id } = user;
//     (getToken as jest.Mock).mockResolvedValue({
//       userId: id,
//       ...adminJwt,
//     });

//     // action
//     const res = await mockApp.delete(`/question/${id}`);
//     const checkUser = await prisma.question.findUnique({
//       where: {
//         id,
//       },
//     });
//     // assert
//     expect(res.status).toBe(200);
//     expect(checkUser).toBe(null);
//   });

//   test("When admin deletes a user that does not exist, return 404 Not Found", async () => {
//     // action
//     (getToken as jest.Mock).mockResolvedValue({
//       userId: 0,
//       ...adminJwt,
//     });
//     const res = await mockApp.delete(`/question/${0}`);
//     // assert
//     expect(res.status).toBe(404);
//   });
// });

// Test validation
