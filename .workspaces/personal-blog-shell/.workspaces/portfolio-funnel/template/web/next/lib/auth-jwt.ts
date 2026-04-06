import { jwtVerify, SignJWT } from "jose";

const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET ?? "dev-auth-secret-change-me";
const encoder = new TextEncoder();
const key = encoder.encode(AUTH_JWT_SECRET);

export const AUTH_COOKIE_NAME = "auth_token";

export type AuthPayload = {
  sub: string;
  loginId: string;
  name: string;
};

export const signAuthToken = async (payload: AuthPayload): Promise<string> =>
  new SignJWT({ loginId: payload.loginId, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

export const verifyAuthToken = async (token: string): Promise<AuthPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const sub = payload.sub;
    const loginId = payload.loginId;
    const name = payload.name;

    if (typeof sub !== "string" || typeof loginId !== "string" || typeof name !== "string") {
      return null;
    }

    return { sub, loginId, name };
  } catch {
    return null;
  }
};
