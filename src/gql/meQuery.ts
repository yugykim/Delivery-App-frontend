import { UserRole } from "./graphql";

export interface meQuery_me {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  verified: boolean;
}

export interface meQuery {
  me: meQuery_me;
}