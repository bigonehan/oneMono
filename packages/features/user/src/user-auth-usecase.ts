import type { IUserAuthUseCase, UserRecord } from "./user-usecase";
import { UserCreateMemoryRepo } from "./user-repo-create";
import { UserReadMemoryRepo } from "./user-repo-read";
import { UserUpdateMemoryRepo } from "./user-repo-update";

export class UserAuthMemoryUseCase implements IUserAuthUseCase {
  private readonly createRepo = new UserCreateMemoryRepo();
  private readonly readRepo = new UserReadMemoryRepo();
  private readonly updateRepo = new UserUpdateMemoryRepo();

  async signUp(email: string, passwordHash: string): Promise<UserRecord> {
    return this.createRepo.create(email, passwordHash);
  }

  async verify(email: string): Promise<UserRecord> {
    return this.updateRepo.update(email, { verified: true });
  }

  async login(email: string, passwordHash: string): Promise<UserRecord> {
    const user = await this.readRepo.getByEmail(email);
    if (!user) {
      throw new Error("invalid credential");
    }
    if (user.locked) {
      throw new Error("account locked");
    }
    if (!user.verified) {
      throw new Error("email not verified");
    }

    if (user.passwordHash !== passwordHash) {
      const failedCount = user.failedCount + 1;
      await this.updateRepo.update(email, {
        failedCount,
        locked: failedCount >= 5,
      });
      throw new Error("invalid credential");
    }

    return this.updateRepo.update(email, { failedCount: 0 });
  }
}
