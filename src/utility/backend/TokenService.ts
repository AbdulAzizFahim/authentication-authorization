import jwt from "jsonwebtoken";
import {NextRequest, NextResponse} from "next/server";

import {generateJwtToken} from "./HashService";

const hasAccessToken = (request: NextRequest): boolean => {
  const token: string|null = request.cookies.get("access-token")?.value || null;
  return token !== null;
};

const getAccessToken = (request: NextRequest): string|null => {
  const token: string|null = request.cookies.get("access-token")?.value || null;
  if (!token)
    return null;
  return token;
};

const setAccessTokenToCookies = async(email: string, response: NextResponse): Promise<NextResponse> => {
  try {
    response.cookies.delete("access-token");
    const newToken: string = await generateJwtToken(email);
    response.cookies.set("access-token", newToken.valueOf());
    return response;
  }
  catch (error) {
    throw new Error("Can not set access token to cookies!");
  }
};

const verifyAccessToken = (token: string): boolean => {
  const decodedJwt = jwt.verify(token, process.env.SECRET_TOKEN!);
  return decodedJwt !== null;
};

export {hasAccessToken, getAccessToken, setAccessTokenToCookies, verifyAccessToken};
