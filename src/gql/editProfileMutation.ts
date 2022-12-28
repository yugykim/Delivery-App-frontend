export interface editProfile {
  ok: string | null;
  error: string | null;
}

export interface editProfileVariables {
  input: editProfileInput;
}

export interface editProfileInput {
  email?: string;
  password?: string;
}