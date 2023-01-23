import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { MockApolloClient, createMockClient } from 'mock-apollo-client';
import { SignUp, CREATE_ACCOUNT_MUTATION } from '../../pages/create-account';
import { RenderResult, render, waitFor, screen, getByRole } from "../../test-utils";
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../gql/graphql';

describe('<SignUp />', () => {
  let mockedClient: MockApolloClient
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      // eslint-disable-next-line testing-library/no-wait-for-side-effects, testing-library/no-render-in-setup
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <SignUp />
        </ApolloProvider>
      );
    });
  });
  // eslint-disable-next-line jest/no-identical-title
  it('renders OK', async () => {
    await waitFor(() => 
      expect(document.title).toBe("Create Account | Uber eat") 
    )
  });
  it('renders validation errors', async() => {
    const email = screen.getByPlaceholderText(/email/i)
    const password = screen.getByPlaceholderText(/password/i)
    const button = screen.getByRole("button")
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.type(email, 'wont@work');
    });
    let errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i)
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.clear(email)
    })
    errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.type(email, "working@email.com")
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.click(button)
    })
  })
  it('submits mutation with form values', async() => {
    const email = screen.getByPlaceholderText(/email/i)
    const password = screen.getByPlaceholderText(/password/i)
    const button = screen.getByRole("button")
    const formData = {
      email: 'working@mail.com',
      password: '12',
      role: UserRole.Customer,
    };
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error"
        }
      }
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    ); 
    jest.spyOn(window, 'alert').mockImplementation(() => null);
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.type(email, formData.email)
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.type(password, formData.password)
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.click(button)
    });
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1)
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role
      }
    });
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
  });
});