import type { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextApiRequest) {
  const token = await getToken({ req, raw: true });
  if (token) {
    return Response.json(token);
  }
  return Response.redirect("/");
}
