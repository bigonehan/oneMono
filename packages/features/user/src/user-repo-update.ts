import type { IUserUpdateUseCase, UserRecord } from "./user-usecase";
import { userStore } from "./user-repo-read";

export class UserUpdateMemoryRepo implements IUserUpdateUseCase {
  async update(email: string, patch: Partial<UserRecord>): Promise<UserRecord> {
    const current = userStore.get(email);
    if (!current) {
      throw new Error("user not found");
    }

    const next = { ...current, ...patch };
    userStore.set(email, next);
    return next;
  }
}
