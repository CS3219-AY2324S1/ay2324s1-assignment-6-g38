import express from "express";

import { authenticationCheck } from "../../commons/auth/authenticator";
import * as userUseCase from "../../domain/user-use-case";

import { validateAddUserInput, validateUpdateUserInput } from "./validators";

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post("/", [validateAddUserInput], async (req, res, next) => {
    try {
      await authenticationCheck(req);
      const addUserResponse = await userUseCase.addUser(req.body);
      res.json(addUserResponse);
    } catch (error) {
      next(error);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const response = await userUseCase.getAllUser({
        email: req.query.email as string,
      });
      res.json(response.length === 0 ? null : response);
    } catch (error) {
      next(error);
    }
  });

  // get existing user by id
  router.get("/:id", async (req, res, next) => {
    try {
      const response = await userUseCase.getUserById(
        parseInt(req.params.id, 10),
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  // update user by id
  router.put("/:id", [validateUpdateUserInput], async (req, res, next) => {
    try {
      await authenticationCheck(req);
      const response = await userUseCase.updateUser(
        parseInt(req.params.id, 10),
        req.body,
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  // delete user by id
  router.delete("/:id", async (req, res, next) => {
    try {
      await authenticationCheck(req);
      await userUseCase.deleteUser(parseInt(req.params.id, 10));
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  });

  expressApp.use("/user", router);

  expressApp.get("/health", async (req, res, next) => {
    try {
      res.status(200).end("Healthy");
    } catch (error) {
      next(error);
    }
  });
}
