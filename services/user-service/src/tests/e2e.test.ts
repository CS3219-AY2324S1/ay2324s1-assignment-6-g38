// eslint-disable-next-line import/no-extraneous-dependencies
import { getToken } from "next-auth/jwt";

import { loadEnvConfig } from "../commons/utils/env-config";
import { getPrismaClient } from "../data-access/prisma-client-factory";
import { createWebApplication } from "../entry-points/api/server";

import resetDb from "./helper/resetDb";

const request = require("supertest");

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

const invalidEmail = "che@ky";

const invalidUserInputOnlyName = { name: "wei jun" };
const invalidUserInputOnlyEmail = { email: "weijun@gmail.com" };
const createUserInputFull = {
  name: "james chua",
  email: "james@gmail.com",
  bio: "Chicken Nuggs",
  url: "https://chat.openai.com/",
};
const createUserInput = { name: "wei jun", email: "weijun@gmail.com" };
const createUserInput1 = { name: "wei jun", email: "weijun1@gmail.com" };
const createUserInput2 = { name: "wei ming", email: "weiming@gmail.com" };
const adminJwt = { role: "ADMIN" };
const userJwt = { role: "USER" };

describe("POST /user", () => {
  test("when valid name, email, bio, url and valid permission are provided , return status 200 OK", async () => {
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    const res = await mockApp.post("/user").send(createUserInputFull);
    const user = await prisma.user.findUnique({
      where: { ...createUserInputFull },
    });
    // assert
    expect(res.status).toBe(200);
    expect(user).not.toBe(null);
    expect(user?.role).toBe("ADMIN");
  });

  test("when name, email and valid permission are provided, return status 200 OK", async () => {
    // act
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    const res = await mockApp.post("/user").send(createUserInput);
    const user = await prisma.user.findUnique({
      where: { ...createUserInput },
    });
    // assert
    expect(res.status).toBe(200);
    expect(user).not.toBe(null);
  });

  test("when valid name and email are provided but no valid permission, return status 401", async () => {
    // act
    const res = await mockApp.post("/user").send(createUserInput);
    await prisma.user.findUnique({
      where: { ...createUserInput },
    });
    // assert
    expect(res.status).toBe(401);
  });

  test("when only email and valid permission is provided, return status 400 Bad Request", async () => {
    // act
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    const res = await mockApp.post("/user").send(invalidUserInputOnlyEmail);
    const user = await prisma.user.findUnique({
      where: { ...invalidUserInputOnlyEmail },
    });
    // assert
    expect(res.status).toBe(400);
    expect(user).toBe(null);
  });

  test("when only name and valid permission is provided, return status 400 Bad Request", async () => {
    // act
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    const res = await mockApp.post("/user").send(invalidUserInputOnlyName);
    const user = await prisma.user.findMany({
      where: { ...invalidUserInputOnlyName },
    });
    // assert
    expect(res.status).toBe(400);
    expect(user).toEqual([]);
  });

  test("when invalid email is provided, return status 400 Bad Request", async () => {
    // act
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    const res = await mockApp.post("/user").send(invalidUserInputOnlyName);
    const user = await prisma.user.findMany({
      where: { ...createUserInput, email: invalidEmail },
    });
    // assert
    expect(res.status).toBe(400);
    expect(user).toEqual([]);
  });

  test("when invalid url is provided, return status 400 Bad Request", async () => {
    // act
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    const res = await mockApp.post("/user").send(invalidUserInputOnlyName);
    const user = await prisma.user.findMany({
      where: { ...createUserInputFull, url: "help" },
    });
    // assert
    expect(res.status).toBe(400);
    expect(user).toEqual([]);
  });

  test("when there is already a user with the same email, return status 409 Conflict", async () => {
    // arrange
    (getToken as jest.Mock).mockResolvedValue(userJwt);
    await prisma.user.create({ data: createUserInput });
    // act
    const res = await mockApp.post("/user").send(createUserInput);
    const users = await prisma.user.findMany({ where: { ...createUserInput } });
    // assert
    expect(res.status).toBe(409);
    expect(users.length).toBe(1);
  });
});

describe("GET /user", () => {
  test("when calling the api, return status 200 OK", async () => {
    // arrange
    await prisma.user.create({ data: createUserInput });
    const user = await prisma.user.findMany();
    // action
    const res = await mockApp.get("/user");
    // assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
  });

  test("when adding email filter, return status 200 OK", async () => {
    const findEmail = "weijun@gmail.com";
    // arrange
    await prisma.user.createMany({
      data: [createUserInput, createUserInput1, createUserInput2],
    });
    const users = await prisma.user.findMany({
      where: { email: findEmail },
    });
    // action
    const res = await mockApp.get(`/user?email=${findEmail}`);
    // assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual(users);
  });
});

describe("PUT /user", () => {
  test("When editing user with valid permission, return status 200 OK", async () => {
    // arrange
    await prisma.user.create({ data: createUserInput });
    const beforeModified = await prisma.user.findUnique({
      where: createUserInput,
    });
    (getToken as jest.Mock).mockResolvedValue({
      userId: beforeModified!.id,
      ...adminJwt,
    });
    // action

    const res = await mockApp
      .put(`/user/${beforeModified!.id}`)
      .send({ ...beforeModified, name: "new name" });

    const afterModified = await prisma.user.findUnique({
      where: {
        id: beforeModified!.id,
      },
    });
    // assert
    expect(res.status).toBe(200);
    expect(afterModified?.name).toBe("new name");
  });

  test("When editing user with valid permission, return status 401 UNAUTHORIZED", async () => {
    // arrange
    await prisma.user.create({ data: createUserInput });
    const beforeModified = await prisma.user.findUnique({
      where: createUserInput,
    });
    (getToken as jest.Mock).mockResolvedValue({
      userId: beforeModified!.id + 1,
      ...userJwt,
    });
    // action

    const res = await mockApp
      .put(`/user/${beforeModified!.id}`)
      .send({ ...beforeModified, name: "new name" });

    const afterModified = await prisma.user.findUnique({
      where: {
        id: beforeModified!.id,
      },
    });
    // assert
    expect(res.status).toBe(401);
    expect(afterModified?.name).toBe(createUserInput.name);
  });

  test("When editing non-existant user, return status 404 NOT FOUND", async () => {
    // action
    (getToken as jest.Mock).mockResolvedValue({
      ...adminJwt,
    });
    const res = await mockApp
      .put(`/user/${0}`)
      .send({ id: 0, name: "new name" });

    // assert
    expect(res.status).toBe(404);
  });
});

describe("GET /user/id", () => {
  test("when retrieving existing user based on their id, return 200 OK", async () => {
    // arrange
    const user = await prisma.user.create({ data: createUserInput });
    const { id } = user;

    // action
    const res = await mockApp.get(`/user/${id}`);

    // assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
  });

  test("when retrieving non-existing user based on their id, return 200 OK", async () => {
    // action
    const res = await mockApp.get(`/user/${0}`);
    // assert
    expect(res.status).toBe(404);
  });
});

describe("DELETE /user/:id", () => {
  test("When user delete his account, return 200 OK", async () => {
    // arrange
    const user = await prisma.user.create({ data: createUserInput });
    const { id } = user;
    (getToken as jest.Mock).mockResolvedValue({
      userId: id,
      ...userJwt,
    });

    // action
    const res = await mockApp.delete(`/user/${id}`);
    const checkUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    // assert
    expect(res.status).toBe(200);
    expect(checkUser).toBe(null);
  });

  test("When someone with incorrect permission try to delete his account, return 401 Unauthorized", async () => {
    // arrange
    const user = await prisma.user.create({ data: createUserInput });
    const { id } = user;
    (getToken as jest.Mock).mockResolvedValue({
      userId: id + 1,
      ...userJwt,
    });

    // action
    const res = await mockApp.delete(`/user/${id}`);
    const checkUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    // assert
    expect(res.status).toBe(401);
    expect(checkUser).toBe(checkUser);
  });

  test("When admin deletes a account, return 200 OK", async () => {
    // arrange
    const user = await prisma.user.create({ data: createUserInput });
    const { id } = user;
    (getToken as jest.Mock).mockResolvedValue({
      ...adminJwt,
    });

    // action
    const res = await mockApp.delete(`/user/${id}`);
    const checkUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    // assert
    expect(res.status).toBe(200);
    expect(checkUser).toBe(null);
  });

  test("When admin deletes a user that does not exist, return 404 Not Found", async () => {
    // action
    (getToken as jest.Mock).mockResolvedValue({
      ...adminJwt,
    });
    const res = await mockApp.delete(`/user/${0}`);
    // assert
    expect(res.status).toBe(404);
  });

  test("When admin modifies the user role, return 200 OK", async () => {
    (getToken as jest.Mock).mockResolvedValue({
      ...adminJwt,
    });
    const { id } = await prisma.user.create({ data: createUserInput });
    // act
    const res = await mockApp.put(`/user/${id}/role`).send({
      role: "ADMIN",
    });
    // assert
    const modifiedUser = await prisma.user.findUnique({ where: { id } });
    expect(res.status).toBe(200);
    expect(modifiedUser!.role).toBe("ADMIN");
  });

  test("When user modifies the user role, return 401 Unauthorize", async () => {
    (getToken as jest.Mock).mockResolvedValue({
      ...userJwt,
    });
    const { id } = await prisma.user.create({ data: createUserInput });
    // act
    const res = await mockApp.put(`/user/${id}/role`).send({
      role: "ADMIN",
    });
    // assert
    const modifiedUser = await prisma.user.findUnique({ where: { id } });
    expect(res.status).toBe(401);
    expect(modifiedUser!.role).toBe("USER");
  });
});

// Test validation
