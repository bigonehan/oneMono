import type { NewUser, User } from "./models/user.js";

export interface UserPort {
  createUser(input: NewUser): Promise<User>;
  getUserById(userId: string): Promise<User | null>;
  listUsers(): Promise<User[]>;
  updateUser(userId: string, input: Partial<NewUser>): Promise<User | null>;
  deleteUser(userId: string): Promise<boolean>;
}
