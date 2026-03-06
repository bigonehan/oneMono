export type UserRole = "admin" | "user";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  failedCount: number;
  locked: boolean;
  role: UserRole;
};

export interface IUserCreateUseCase {
  create(email: string, passwordHash: string): Promise<UserRecord>;
}

export interface IUserReadUseCase {
  getByEmail(email: string): Promise<UserRecord | null>;
}

export interface IUserUpdateUseCase {
  update(email: string, patch: Partial<UserRecord>): Promise<UserRecord>;
}

export interface IUserDeleteUseCase {
  remove(email: string): Promise<void>;
}

export interface IUserAuthUseCase {
  signUp(email: string, passwordHash: string): Promise<UserRecord>;
  verify(email: string): Promise<UserRecord>;
  login(email: string, passwordHash: string): Promise<UserRecord>;
}
