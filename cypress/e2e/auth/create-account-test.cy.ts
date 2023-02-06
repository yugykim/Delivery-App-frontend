/** @format */

describe('Create Account', () => {
	const user = cy;
	it('should see email / password validation errors', () => {
		user.visit('/');
		user.findByText(/create an account/i).click();
		user.findByPlaceholderText(/email/i).type('bad@email');
		user.findByPlaceholderText(/password/i).type('Test123456');
		user.findByRole('alert').should('have.text', 'Please enter a valid email');
		user.findByPlaceholderText(/email/i).clear();
		user.findByPlaceholderText(/password/i).clear();
		user.findByPlaceholderText(/email/i).type('bad@email.com');
		user.findByPlaceholderText(/password/i).type('a');
    user.findByRole('alert').should('have.text', 'Password must be more than 10 chars.');
	});
	it('should be able to create account', () => {

		user.intercept('http://localhost:4000/graphql', (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccount") {
        req.reply((res) => {
          res.send(
            {
              fixture: 'auth/create-account.json',
            }
          );
        })
      }
    });
		user.visit('/create-account');
		user.findByPlaceholderText(/email/i).type('nico@nomadcoders.co');
		user.findByPlaceholderText(/password/i).type('121212121212');
		user.findByRole('button').click();
		user.wait(1000);
    user.login('test@gmail.com', 'Test123456');
	});
});
