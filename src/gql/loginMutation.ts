export interface loginMutation_login {
  ok: string | null;
  token: string | null;
  error: string | null;
}

export interface loginMutation {
  login: loginMutation_login;
}

export interface loginMutationVariables {
  loginInput: LoginInput;
}

export interface LoginInput {
  email: string;
  password: string;
}