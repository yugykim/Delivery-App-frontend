import { gql, useMutation } from "@apollo/client";
import {Helmet} from "react-helmet-async"
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from "../imges/logo.svg"
import { authToken, isLoggedInVar } from "../apollo";
import { loginMutation, loginMutationVariables } from "../gql/loginMutation";
import { LOCAL_STORAGE_TOKEN } from "../constant";

const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
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
}

export const Login = () => {
  const { register, getValues, formState: { errors, isValid }, handleSubmit } = useForm<ILoginForm>({
    mode: "onBlur"
  }); 
  //to protect mutation, need type 
  const onCompleted = (data: loginMutation) => {
    const { ok, token } = data.login;
    if (ok && token) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
      authToken(token);
      isLoggedInVar(true);
    } 
  };
  const [login, { data: loginMutationResult, loading }] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
    onCompleted,
  }); 
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      login({
        variables: {
          loginInput: {
            email,
            password,
          }
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Uber eat</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" />
        <h4 className="w-full text-left text-3xl mb-5 font-medium">Welcome Back</h4>
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
          <Button canClick={isValid} loading={loading} actionText={"Log In"}/>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Uber? <Link to="/signup" className=" text-lime-600 hover:underline">Create an Account</Link>
        </div>
      </div>
    </div>
  );
} 