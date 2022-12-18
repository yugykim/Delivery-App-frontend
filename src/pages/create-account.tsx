import { gql, useMutation } from "@apollo/client";
import React from "react"
import Helmet from "react-helmet"
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { CreateAccountInput, CreateAccountOutput, UserRole } from '../gql/graphql'
import nuberLogo from "../imges/logo.svg"

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const SignUp = () => {
  const { register, getValues, watch, formState: { errors, isValid }, handleSubmit } = useForm<ICreateAccountForm>({
    mode: "onChange"
  }); 
  const [createAccountMutation] = useMutation<CreateAccountInput, CreateAccountOutput>(CREATE_ACCOUNT_MUTATION); 
  const onSubmit = () => {};
  console.log(watch());
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Uber eat</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" />
        <h4 className="w-full text-left text-3xl mb-5 font-medium">Let's get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
          <input 
            {...register("email", {
              required: true,
            })}
            name="email"
            type="email"
            placeholder="Email" 
            className="focus:outline-none focus:border-gray-500 p-3 border-2 text-lg font-light border-gray-400" 
          />
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
          <select {...register("role", { required: true})} className="input">
            { Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
          </select>
          <Button canClick={isValid} actionText={"Create Account"} loading={false}/>
        </form>
        <div>
          Already have an account?{" "}<Link to="/" className=" text-lime-600 hover:underline">Log in now</Link>
        </div>
      </div>
    </div>
  );
} 