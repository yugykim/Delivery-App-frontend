import { gql, useMutation } from "@apollo/client";
import React from "react"
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { LoginInput, LoginOutput } from '../gql/graphql'
import nuberLogo from "../imges/logo.svg"

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;
interface ILoginForm {
  email: string;
  password: string
  resultError?: string;
}

export const Login = () => {
  const { register, getValues, watch, formState: { errors }, handleSubmit } = useForm<ILoginForm>(); 
  //to protect mutation, need type 
  const onCompleted = (data: LoginOutput) => {
    const { ok, token } = data;
    if (ok) {
      console.log(token);
    } 
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<LoginOutput, LoginInput>(LOGIN_MUTATION
    , {
      onCompleted,
  }); 
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          email,
          password,
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" />
        <h4 className="w-full text-left text-3xl mb-5 font-medium">Welcome Back</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full">
          <input 
            {...register("email", {
              required: true,
            })}
            name="email"
            type="email"
            placeholder="Email" 
            className="focus:outline-none focus:border-gray-500 p-3 border-2 text-lg font-light border-gray-400" 
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message}/>
          )}
          <input 
            {...register("password", {
              required: true,
              minLength: 10
            })} 
            name="password"
            type="password"
            placeholder="Password" 
            className="focus:outline-none focus:border-gray-500 p-3 border-2 text-lg font-light border-gray-200 transition-colors " 
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message}/>
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <button 
          className=
            "mt-3 text-lg font-medium text-white py-4 bg-green-600 hover:bg-green-700 transition-colors"
          >
            {loading ? "Loading..." : "Log In"}
          </button>
          {loginMutationResult?.error && (
            <FormError errorMessage={loginMutationResult.error} />
          )}
        </form>
      </div>
    </div>
  );
} 