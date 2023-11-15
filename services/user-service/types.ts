export type User = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  url: string | null;
};

export type UserFilter = {
  email: string;
};

export type UserWihoutId = Partial<Omit<User, "id">> & {
  name: string;
  email: string;
};

export type UpdateUser = Partial<UserWihoutId>;
