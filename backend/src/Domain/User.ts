export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl: string | null;
  bio: string | null;
  preferences: string | null;
  createdAt: Date;
  updatedAt: Date;
};
