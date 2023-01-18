import { render, screen } from '@testing-library/react';
import React from 'react';
import "@testing-library/jest-dom";
import { Button } from '../button';



describe("<Button />",  () => {
  it("should render OK with props", () => {
    const { debug, getByText, rerender } = render(<Button canClick={true} loading={false} actionText={"test"} />);
    screen.getByText("test")
    rerender(<Button canClick={true} loading={true} actionText={"test"} />);
    screen.getByText("Loading...")
  })
  it("should display loading", () => {
    const { debug, getByText, container } = render(<Button canClick={false} loading={true} actionText={"test"} />);
    screen.getByText("Loading...")
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass("pointer-events-none");
    // eslint-disable-next-line testing-library/no-debugging-utils
    debug(); 
  })
})