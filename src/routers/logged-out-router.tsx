import React from "react"
import { useForm } from "react-hook-form";
import { isLoggedInVar } from "../apollo"

export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, formState: { errors }} = useForm();
  const onSubmit = () => {
    console.log(watch());
  }
  const onInvalid = () => {
    console.log("can't create account");
  }
  console.log(errors);
  return (
    <div>
      <h1>Log Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register(
              "email",
              {
                required: true,
                validate: (email) => email.includes("@gamil.com"),
              },
            )}
            placeholder="email"
            type= "email"
          />
        </div>
        <div>
          <input
            {...register(
              "password",
              {
                required: true,
              },
            )}
            placeholder="password"
            type= "password"
          ></input>
        </div>
        <button className="bg-yellow-300 text-white">Submit</button>
      </form>
    </div>
  )
} 