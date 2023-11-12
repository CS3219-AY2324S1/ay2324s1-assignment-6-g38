import type { User } from "@/features/users/types/user.type";

export type AuthenticationDetails = {
  currentUser: User | null;
  image: string | null;
  isLoggedIn: Boolean;
};
