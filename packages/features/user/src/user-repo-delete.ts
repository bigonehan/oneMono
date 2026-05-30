import type { IUserDeleteUseCase } from "./user-usecase.js";
import { userStore } from "./user-repo-read.js";

export class UserDeleteMemoryRepo implements IUserDeleteUseCase {
  async remove(email: string): Promise<void> {
    userStore.delete(email);
  }
}
