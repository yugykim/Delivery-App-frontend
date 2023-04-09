import { render, screen } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant />", () => {
  it("renders OK with props", () => {
    const restaurantProps = {
      id: "1",
      name: "nametest",
      categoryName: "categoryName",
      coverImg: "lala",
    };
    const { debug, getByText, container } = render(
      <Router>
        <Restaurant coverImage={""} {...restaurantProps} />
      </Router>
    )
    screen.getByText(restaurantProps.name);
    screen.getByText(restaurantProps.categoryName);
    expect(screen.getByRole('link')).toHaveAttribute(
      "href",
      `/restaurants/${restaurantProps.id}`
    );
  })
})