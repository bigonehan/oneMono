import type { IUserReadUseCase, UserRecord } from "./user-usecase";

export const userStore = new Map<string, UserRecord>();

export class UserReadMemoryRepo implements IUserReadUseCase {
  async getByEmail(email: string): Promise<UserRecord | null> {
    return userStore.get(email) ?? null;
  }

  async getRole(email: string): Promise<"admin" | "user" | null> {
    return userStore.get(email)?.role ?? null;
  }
}
