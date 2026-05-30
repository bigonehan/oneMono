import { randomUUID } from "node:crypto";
import type { IUserCreateUseCase, UserRecord } from "./user-usecase.js";
import { userStore } from "./user-repo-read.js";

export class UserCreateMemoryRepo implements IUserCreateUseCase {
  async create(email: string, passwordHash: string): Promise<UserRecord> {
    if (userStore.has(email)) {
      throw new Error("email already exists");
    }

    const user: UserRecord = {
      id: randomUUID(),
      email,
      passwordHash,
      verified: false,
      failedCount: 0,
      locked: false,
      role: "user",
    };

    userStore.set(email, user);
    return user;
  }
}
