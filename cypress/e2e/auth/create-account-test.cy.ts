import { describe } from "mocha";

describe('Create Account', () => {
  const user = cy;
  it('should see email / password validation errors', () => {
    user.visit('/')
    user.findByText(/create an account/i).click()
  })
})