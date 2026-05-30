import * as BetterAuthModule from "better-auth";

export type AuthUser = {
  id: string;
  name: string;
  pw: string;
  created_at: string;
  modified_at: string;
};

export interface AuthUserPort {
  createUser(input: { name: string; pw: string }): Promise<AuthUser>;
  getUserById(userId: string): Promise<AuthUser | null>;
  listUsers(): Promise<AuthUser[]>;
  updateUser(userId: string, input: Partial<{ name: string; pw: string }>): Promise<AuthUser | null>;
  deleteUser(userId: string): Promise<boolean>;
}

type BetterAuthFactory = (config: unknown) => unknown;

type AuthSession = {
  user: AuthUser;
  token: string;
};

export type AuthService = {
  signIn(id: string, pw: string): Promise<AuthSession | null>;
  signOut(token: string): Promise<void>;
  getSession(token: string): Promise<AuthSession | null>;
  betterAuth: unknown;
};

const flow_findUserById = async (userPort: AuthUserPort, id: string): Promise<AuthUser | null> =>
  userPort.getUserById(id);

const flow_buildToken = (user: AuthUser): string => `${user.id}:${Date.now()}`;

const calc_compareCredential = (user: AuthUser, pw: string): boolean => user.pw === pw;

export const createAuthService = (userPort: AuthUserPort): AuthService => {
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

export { FormLogin } from "./components/form_login.js";
export type { LoginPayload } from "./components/form_login.js";
export { FormSignUp } from "./components/form_sign_up.js";
export type { SignUpPayload } from "./components/form_sign_up.js";
