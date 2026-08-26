import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ErrorPage from "./error";

describe("Error (root)", () => {
  it("shows a message and calls retry when the button is clicked", async () => {
    const retry = jest.fn();
    const user = userEvent.setup();

    render(<ErrorPage error={new Error("boom")} retry={retry} />);

    expect(
      screen.getByText("We couldn't load trending anime right now."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });
});
