import type { Request } from "express";
import type { JWT } from "next-auth/jwt";
// eslint-disable-next-line import/no-extraneous-dependencies
import { getToken } from "next-auth/jwt";

import HttpError from "../error";

export async function extractToken(req: Request) {
  const token = await getToken({
    req,
  });

  if (token == null) {
    throw new HttpError("This is a protected route", 401);
  }
  return token;
}

function isAdmin(token: JWT) {
  return token.role === "ADMIN";
}

// assertIsAuthenticated
export async function assertIsAuthenticated(req: Request) {
  await extractToken(req);
}

function isSelfOrAdmin(token: JWT, id: number) {
  return isAdmin(token) || id === token.userId;
}

// assertIsSelf
export async function assertIsSelfOrAdmin(req: Request, userId: number) {
  const token = await extractToken(req);
  if (!isSelfOrAdmin(token, userId)) {
    throw new HttpError("You do not have the correct permission", 401);
  }
}

// assertIsAdmin
export async function assertIsAdmin(req: Request) {
  const token = await extractToken(req);
  if (!isAdmin(token)) {
    throw new HttpError("This requires admin permission", 401);
  }
}
