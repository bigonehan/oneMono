export type StoredUser = {
  userId: string;
  loginId: string;
  name: string;
  pw: string;
};

const usersByLoginId = new Map<string, StoredUser>();
const usersById = new Map<string, StoredUser>();

const createUserId = (): string => {
  const rand = Math.random().toString(36).slice(2, 10);
  return `usr_${Date.now()}_${rand}`;
};

export const findUserByLoginId = (loginId: string): StoredUser | null =>
  usersByLoginId.get(loginId) ?? null;

export const findUserById = (userId: string): StoredUser | null => usersById.get(userId) ?? null;

export const createUser = (input: { loginId: string; name: string; pw: string }): StoredUser | null => {
  if (usersByLoginId.has(input.loginId)) {
    return null;
  }

  const next: StoredUser = {
    userId: createUserId(),
    loginId: input.loginId,
    name: input.name,
    pw: input.pw,
  };

  usersByLoginId.set(next.loginId, next);
  usersById.set(next.userId, next);

  return next;
};

export const validateCredential = (loginId: string, pw: string): StoredUser | null => {
  const found = findUserByLoginId(loginId);
  if (!found) {
    return null;
  }

  if (found.pw !== pw) {
    return null;
  }

  return found;
};
