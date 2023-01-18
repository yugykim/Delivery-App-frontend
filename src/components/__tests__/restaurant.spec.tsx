import { render, screen } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant />", () => {
  it("renders OK with props", () => {
    const restaurantProps = {
      id: "1",
      name: "name",
      categoryName: "categoryName",
      coverImg: "lala",
    };
    const { debug, getByText, container } = render(
      <Router>
        <Restaurant id="1" coverImg="x" name="nameTest" categoryName="CatName" />
      </Router>
    )
    // eslint-disable-next-line testing-library/no-debugging-utils
    debug();
    screen.getByText("nameTest");
    screen.getByText("catTest");
    expect(container.firstChild).toHaveAttribute("href", "/restaurants/1")
  })
})