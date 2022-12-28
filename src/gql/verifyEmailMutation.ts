export interface verifyEmail {
  ok: string | null;
  error: string | null;
}

export interface verifyEmailVariables {
  input: verifyEmailInputput;
}

export interface verifyEmailInputput {
  code: string;
}