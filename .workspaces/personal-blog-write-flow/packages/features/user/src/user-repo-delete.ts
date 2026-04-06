import type { IUserDeleteUseCase } from "./user-usecase";
import { userStore } from "./user-repo-read";

export class UserDeleteMemoryRepo implements IUserDeleteUseCase {
  async remove(email: string): Promise<void> {
    userStore.delete(email);
  }
}
