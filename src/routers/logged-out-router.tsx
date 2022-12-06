import React from "react"
import { useForm } from "react-hook-form";
import { isLoggedInVar } from "../apollo"


interface IForm {
  email: string;
  password: string;
}
export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, formState: { errors }} = useForm<IForm>();
  const onSubmit = () => {
    console.log("test");
    console.log(watch());
  }
  const onInvalid = () => {
    console.log("can't create account");
  }
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
          {errors.email?.message && ( <span className="font-bold text-red-600">{errors.email?.message}</span> )}
          {errors.email?.type === "pattern" && ( <span className="font-bold text-red-600">Only gamil allowed</span> )}
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