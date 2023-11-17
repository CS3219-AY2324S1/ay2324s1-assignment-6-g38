import type { Request } from "express";
import type { JWT } from "next-auth/jwt";
// eslint-disable-next-line import/no-extraneous-dependencies
import { getToken } from "next-auth/jwt";
import pino from "pino";

import HttpError from "../error";

const logger = pino();

export async function extractToken(req: Request) {
  const token = await getToken({
    req,
  });

  if (token == null) {
    logger.info(`TOKEN: NO TOKEN`);
    throw new HttpError("This is a protected route", 401);
  }
  return token;
}

// assertIsAuthenticated
export async function assertIsAuthenticated(req: Request) {
  await extractToken(req);
}

function isAdmin(token: JWT) {
  return token.role === "ADMIN";
}

// assertIsAdmin
export async function assertIsAdmin(req: Request) {
  const token = await extractToken(req);
  logger.info(`TOKEN: ${JSON.stringify(token)}`);
  if (!isAdmin(token)) {
    logger.info(`AUTH RESULT: NO PERMISSIONS (NOT ADMIN)`);
    throw new HttpError("This requires admin permission", 403);
  } else {
    logger.info(`AUTH RESULT: YES PERMISSION (ADMIN)`);
  }
}
