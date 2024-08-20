import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "./hashHelper";

const hasAccessToken = (request: NextRequest): boolean => {
  const token: string | null = request.cookies.get("access-token")?.value || null;
  return token !== null;
};

const getAccessToken = (request: NextRequest): string | null => {
  const token: string | null = request.cookies.get("access-token")?.value || null;
  if (!token) return null;
  return token;
};

const setAccessToken = async (email: string, response: NextResponse): Promise<NextResponse> => {
  response.cookies.delete("access-token");
  const newToken: string | null = await generateJwtToken(email);
  if (!newToken) {
    return response;
  }

  response.cookies.set("access-token", newToken.valueOf());
  return response;
};

const verifyAccessToken = (token: string): boolean => {
  const decodedJwt = jwt.verify(token, process.env.SECRET_TOKEN!);
  return decodedJwt !== null;
};

export { hasAccessToken, getAccessToken, setAccessToken, verifyAccessToken };
