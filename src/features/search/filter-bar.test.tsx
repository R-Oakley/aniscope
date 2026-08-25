import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FilterBar } from "./filter-bar";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("FilterBar", () => {
  const replace = jest.fn();

  beforeEach(() => {
    replace.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ replace });
    (usePathname as jest.Mock).mockReturnValue("/search");
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  // Unlike SearchInput, selecting a dropdown option is one discrete event,
  // not a stream of keystrokes — no debounce, so no fake timers needed here.
  it("writes the selected value to the URL immediately", async () => {
    const user = userEvent.setup();
    render(<FilterBar />);

    await user.selectOptions(screen.getByLabelText("Genre"), "Action");

    expect(replace).toHaveBeenCalledWith("/search?genre=Action", {
      scroll: false,
    });
  });

  it("removes the param when reset back to All", async () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("genre=Action"),
    );
    const user = userEvent.setup();
    render(<FilterBar />);

    await user.selectOptions(screen.getByLabelText("Genre"), "");

    expect(replace).toHaveBeenCalledWith("/search", { scroll: false });
  });

  it("preserves other active filters when changing one", async () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("genre=Action"),
    );
    const user = userEvent.setup();
    render(<FilterBar />);

    await user.selectOptions(screen.getByLabelText("Format"), "MOVIE");

    expect(replace).toHaveBeenCalledWith("/search?genre=Action&format=MOVIE", {
      scroll: false,
    });
  });
});
