import type { IUserCreateUseCase, UserRecord } from "./user-usecase";
import { userStore } from "./user-repo-read";

export class UserCreateMemoryRepo implements IUserCreateUseCase {
  async create(email: string, passwordHash: string): Promise<UserRecord> {
    if (userStore.has(email)) {
      throw new Error("email already exists");
    }

    const user: UserRecord = {
      id: crypto.randomUUID(),
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
