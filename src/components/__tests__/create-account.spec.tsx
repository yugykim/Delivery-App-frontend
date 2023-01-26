import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { MockApolloClient, createMockClient } from 'mock-apollo-client';
import { SignUp, CREATE_ACCOUNT_MUTATION } from '../../pages/create-account';
import { RenderResult, render, waitFor, screen } from "../../test-utils";
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../gql/graphql';

const mockPush = jest.fn()

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useNative: () => {
      return {
        mockPush,
      }
    }
  }
})

describe('<SignUp />', () => {
  let mockedClient: MockApolloClient
  let renderResult: RenderResult;
  mockedClient = createMockClient();
  render(
    <ApolloProvider client={mockedClient}>
      <SignUp />
    </ApolloProvider>
  );
  it('renders OK', async () => {
    await waitFor(() => 
      expect(document.title).toBe("Create Account | Uber eat") 
    )
  });
  it('renders validation errors', async() => {
    const email = screen.getByPlaceholderText(/email/i)
    const password = screen.getByPlaceholderText(/password/i)
    const button = screen.getByRole("button")
    userEvent.type(email, 'wont@work');
    let errorMessage = screen.getByRole('alert');
    await waitFor(() => {
      expect(errorMessage).toHaveTextContent(/please enter a valid email/i)
    });
    userEvent.clear(email)
    errorMessage = screen.getByRole('alert');
    await waitFor(() => {
      expect(errorMessage).toHaveTextContent(/email is required/i);
    })

    userEvent.type(email, "working@email.com")
    userEvent.click(button)
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
    userEvent.type(email, formData.email)
    userEvent.type(password, formData.password)
    userEvent.click(button)
    await waitFor(() => {
      expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1)
    });
    await waitFor(() => {
      expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
        createAccountInput: {
          email: formData.email,
          password: formData.password,
          role: formData.role
        }
      });
    });
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
    });
    const mutationError = screen.getByRole("alert");
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
    await waitFor(() => {
      expect(mutationError).toHaveTextContent("mutation-error");
    });
  });
  afterAll(() => {
    jest.clearAllMocks();
  })
});
