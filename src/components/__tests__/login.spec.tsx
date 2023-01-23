import React from 'react';
import { RenderResult, render, waitFor, screen } from "@testing-library/react"
import { Login, LOGIN_MUTATION } from "../../pages/login";
import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe("<Login />", () => {
  let renderResult: RenderResult; //access render result
  let mockClient: MockApolloClient;
  beforeEach(async () => {
    mockClient = createMockClient();
    // eslint-disable-next-line testing-library/no-render-in-setup
    renderResult = render(
    <HelmetProvider>
      <Router>
        <ApolloProvider client={mockClient }>
          <Login />
        </ApolloProvider>
      </Router>
    </HelmetProvider>
    );
  })
  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Uber eat");
    })
  });
  it("displays email validation errors", async () =>  {
    const { getByPlaceholderText } = renderResult
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const email = getByPlaceholderText(/email/i) //case insensitive
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.type(email, "this@wont");
    });
    let errorMessage = screen.getAllByRole("alert");
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.clear(email);
    })
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });
  it("display password required errors", async() => {
    const { getByPlaceholderText, debug } = renderResult;
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const email = getByPlaceholderText(/email/i);
    const submitBtn = screen.getByRole("button");
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.type(email, "this@wont.com");
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.click(submitBtn);
    });
    let errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });
  it("submits form and calls mutation", async() => {
    const { getByPlaceholderText, getByRole } = renderResult;
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const email = getByPlaceholderText(/email/i);
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const password = getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "123"
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: "mutation-error",
        }
      }
    })
    mockClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.type(email, formData.email);
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.type(password, formData.password);
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      userEvent.click(submitBtn);
    });
    //expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).tooHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password
      },
    });
    const errorMessae = screen.getByRole('alert');
    expect(errorMessae).toHaveTextContent(/mutation-error/i);
    expect(localStorage.setItem).toHaveBeenCalledWith("uber-token", "XXX");
  });
});