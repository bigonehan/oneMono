import type { NewUser, User } from "../models/user.js";

export const createUserModel = (input: NewUser, id: string): User => {
  const now = new Date().toISOString();

  return {
    id,
    name: input.name,
    pw: input.pw,
    created_at: now,
    modified_at: now,
  };
};
