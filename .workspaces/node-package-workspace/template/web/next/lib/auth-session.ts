import { AUTH_COOKIE_NAME, verifyAuthToken } from "./auth-jwt";
import { findUserById } from "./auth-store";

export type SessionUser = {
  userId: string;
  loginId: string;
  name: string;
};

export const getSessionUser = async (request: Request): Promise<SessionUser | null> => {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.slice(`${AUTH_COOKIE_NAME}=`.length);

  if (!token) {
    return null;
  }

  const payload = await verifyAuthToken(token);
  if (!payload) {
    return null;
  }

  const found = findUserById(payload.sub);
  if (!found) {
    return null;
  }

  return {
    userId: found.userId,
    loginId: found.loginId,
    name: found.name,
  };
};
