export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
  url: string | null;
  bio: string | null;
};

export type EditUseFormInput = {
  name?: string;
  email?: string;
  url?: string;
  bio?: string;
};

export type UserWithOptionalUrlAndBio = Omit<User, "url" | "bio"> &
  Partial<Omit<Pick<User, "url" | "bio">, "null">>;

export type UserWithoutId = Partial<Omit<User, "id">> & {
  name: string;
  email: string;
};

export type UpdateUserRole = {
  id: number;
  role: string;
};
