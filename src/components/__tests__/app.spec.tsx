import { screen, render, waitFor } from '@testing-library/react';
import React from 'react';
import { App } from '../app';
import { isLoggedInVar } from '../../apollo';

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>
  }
})

jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>
  }
})

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    const { debug, getByText } = render(<App /> );
    screen.getByText("logged-out");
  })
  it("renders LoggedInRouter", async () => {
    const { debug, getByText } = render(<App /> );
    // it makes that state is able to refesh to reuse later 
    await  waitFor(() => {
      isLoggedInVar(true);
      screen.getByText("logged-in");
    });
  })
})