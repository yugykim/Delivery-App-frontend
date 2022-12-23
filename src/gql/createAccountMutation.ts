import { UserRole } from "./graphql";

export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface createAccountMutation_createAccount {
  __typename: "CreateAccountOutput";
  ok: boolean;
  error: string | null;
}

export interface createAccountMutation {
  createAccount: createAccountMutation_createAccount;
}

export interface createAccountMutationVariables {
  createAccountInput: CreateAccountInput;
}
 
