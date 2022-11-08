import React from "react"
import { isLoggedInVar } from "../apollo"

export const LoggedOutRouter = () => {

  return (
    <div>
      <h1>Log Out</h1>
      <button onClick={() => isLoggedInVar(true)}>Log In</button>
    </div>
  )
}