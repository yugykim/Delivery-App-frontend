/** @format */

describe('First Test', () => {
  const user = cy;
	it('should see login page', () => {
		user.visit('http://localhost:3000').title().should('eq', 'Login | Uber eat');
	});
	it('can fill out the form', () => {
		user.visit('/')
    user.findByPlaceholderText(/email/i).type('test@gmail.com')
    user.findByPlaceholderText(/password/i).type('Test123456')
    user.findByRole('button').should('not.have.class', 'pointer-events-none');
		// to do can log in
	});
	it('can see emial / password validation', () => {
		user.visit('/')
    user.findByPlaceholderText(/email/i).type('bad@email')
    user.findByPlaceholderText(/password/i).type('Test123456')
    user.findByRole('alert').should('have.text', 'Please enter a valid email');
    user.findByPlaceholderText(/email/i).clear()
    user.findByPlaceholderText(/password/i).clear()
    user.findByPlaceholderText(/email/i).type("bad@email.com")
    user.findByPlaceholderText(/password/i).type('a');
    user.findByRole('alert').should('have.text', 'Password must be more than 10 chars.');
	});
  it('can fill out the form', () => {
    user.visit('/')
    user.findByPlaceholderText(/email/i).type('test@gmail.com')
    user.findByPlaceholderText(/password/i).type('Test123456')
    user.findByRole('button').should('not.have.class', 'pointer-events-none').click();
    user.window().its("localStorage.uber-token").should("be.a", "string");
   });
  it('sing up', () => {
    user.visit('/create-account');
  })
});

