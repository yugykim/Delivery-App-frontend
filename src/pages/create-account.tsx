import { gql, useMutation } from "@apollo/client";
import React from "react"
import {Helmet} from "react-helmet-async"
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { UserRole } from '../gql/graphql'
import nuberLogo from "../imges/logo.svg"
import { createAccountMutation, createAccountMutationVariables } from "../gql/createAccountMutation";

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($createAccountInput: createAccountInput!) {
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
  const { register, getValues, formState: { errors, isValid }, handleSubmit } = useForm<ICreateAccountForm>({
    mode: "onChange"
  }); 
  const navigate = useNavigate();
    //to protect mutation, need type 
  const onCompleted = (data: createAccountMutation) => {
    const { ok, error } = data.createAccount;
    console.log("complete");
    if (ok) {
      //redirect login page
      navigate(-1);
    } else {
      console.log("error");
    }
  };
  const [createAccount, {  data: createAccountMutationResult, loading }] = useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  }); 
  const onSubmit = () => {
    console.log("in submit");
    if (!loading) {
      const {email, password, role} = getValues();
      console.log("loading");
      createAccount({
        variables: {
          createAccountInput: {
            email, 
            password, 
            role
          },
        },
      })
    }
  };
  return (
    <div className="h-screen bg-rose-600 flex items-center flex-col justify-center">
      <Helmet>
        <title>Create Account | Here You Go</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex-col px-5 items-center mb-10">
        <h4 className="w-full text-left text-3xl mb-5 font-medium text-orange-500">Let's get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
          <input 
            {...register("email", {
              required: true,
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            })}
            name="email"
            type="email"
            placeholder="Email" 
            className="focus:outline-none focus:border-gray-500 p-3 border-2 text-lg font-light border-gray-400" 
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message}/>
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"}/>
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
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message}/>
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <select {...register("role", { required: true})} className="input">
            { Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
          </select>
          <Button canClick={isValid} actionText={"Create Account"} loading={loading}/>
          {createAccountMutationResult?.createAccount.error && <FormError errorMessage={createAccountMutationResult.createAccount.error} />}
        </form>
        <div>
          Already have an account?{" "}<Link to="/" className=" text-orange-500 hover:underline">Log in now</Link>
        </div>
      </div>
    </div>
  );
} 