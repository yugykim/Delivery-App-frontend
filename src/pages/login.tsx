import { gql, useMutation } from "@apollo/client";
import React from "react"
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password:String!) {
    login(input: {
      emial: $email,
      password: $password
    }) {
      ok
      token
      error
    }
  }
`;
interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, getValues, formState: { errors }, handleSubmit } = useForm<ILoginForm>(); 
  //to protect mutation, need type 
  const [login, {loading, error, data}] = useMutation(LOGIN_MUTATION); 
  const onSubmit = () => {
    const { email, password } = getValues();
    login({
      variables: {
        email,
        password,
      }
    })
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-screen-sm pt-5 pb-7 rounded-lg text-center">
        <h3 className="font-bold text-lg text-gray-800">Log In</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
          <input 
            {...register("email", {
              required: true,
            })}
            name="email"
            type="email"
            placeholder="Email" 
            className="bg-gray-100 mt-5 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-600 focus: ring-opacity-90 mb-3 py-3 px-5 rounded-lg" 
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
            className="bg-gray-100 shadow-inner focus:outline-none  focus:ring-2 focus:ring-green-600 focus: ring-opacity-90 mb-3 py-3 px-5 rounded-lg" 
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message}/>
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <button 
          className=
            "bg-gray-800 py-3 px-5 text-white mt-3 text-medium rounded-lg focus:outline-none hover:opacity-90"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
} 