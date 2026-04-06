import type { User } from "@domain/user";
import type { UserPort } from "@domain/user";
import * as BetterAuthModule from "better-auth";

type BetterAuthFactory = (config: unknown) => unknown;

type AuthSession = {
  user: User;
  token: string;
};

export type AuthService = {
  signIn(id: string, pw: string): Promise<AuthSession | null>;
  signOut(token: string): Promise<void>;
  getSession(token: string): Promise<AuthSession | null>;
  betterAuth: unknown;
};

const flow_findUserById = async (userPort: UserPort, id: string): Promise<User | null> =>
  userPort.getUserById(id);

const flow_buildToken = (user: User): string => `${user.id}:${Date.now()}`;

const calc_compareCredential = (user: User, pw: string): boolean => user.pw === pw;

export const createAuthService = (userPort: UserPort): AuthService => {
  const sessions = new Map<string, AuthSession>();
  const maybeFactory = (BetterAuthModule as { betterAuth?: BetterAuthFactory }).betterAuth;
  const betterAuth = maybeFactory
    ? maybeFactory({
        emailAndPassword: {
          enabled: true,
        },
      })
    : null;

  return {
    betterAuth,
    async signIn(id: string, pw: string): Promise<AuthSession | null> {
      const found = await flow_findUserById(userPort, id);
      if (!found || !calc_compareCredential(found, pw)) {
        return null;
      }
      const token = flow_buildToken(found);
      const session = { user: found, token };
      sessions.set(token, session);
      return session;
    },
    async signOut(token: string): Promise<void> {
      sessions.delete(token);
    },
    async getSession(token: string): Promise<AuthSession | null> {
      return sessions.get(token) ?? null;
    },
  };
};

export { FormLogin } from "./components/form_login";
export type { LoginPayload } from "./components/form_login";
export { FormSignUp } from "./components/form_sign_up";
export type { SignUpPayload } from "./components/form_sign_up";
