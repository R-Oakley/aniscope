import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SearchInput } from "./search-input";

// SearchInput calls the real next/navigation hooks, but those only work
// inside an actual Next.js router — outside the app, they'd throw. Mocking
// the module lets us test the component's own logic (the debounce) in
// isolation from Next's router internals.
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("SearchInput", () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    replace.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ replace });
    (usePathname as jest.Mock).mockReturnValue("/search");
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not update the URL before the debounce delay elapses", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchInput />);

    await user.type(screen.getByPlaceholderText("Search anime..."), "naruto");

    expect(replace).not.toHaveBeenCalled();
  });

  it("commits the debounced value to the URL once typing stops", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchInput />);

    await user.type(screen.getByPlaceholderText("Search anime..."), "naruto");
    jest.advanceTimersByTime(400);

    // Exactly one commit for the whole word, not one per keystroke — this is
    // the debounce doing its job.
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/search?q=naruto", {
      scroll: false,
    });
  });

  it("removes the q param entirely when the input is cleared", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search anime...");
    await user.type(input, "a");
    jest.advanceTimersByTime(400);
    await user.clear(input);
    jest.advanceTimersByTime(400);

    expect(replace).toHaveBeenLastCalledWith("/search", { scroll: false });
  });

  it("resyncs the displayed value when the URL's q changes externally", () => {
    // Simulates the browser back button: searchParams changes without
    // SearchInput's own debounce having caused it. Local `value` state
    // (needed for instant keystroke echo) must not be left stale once that
    // happens.
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("q=naruto"));
    const { rerender } = render(<SearchInput />);
    expect(screen.getByPlaceholderText("Search anime...")).toHaveValue(
      "naruto",
    );

    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    rerender(<SearchInput />);

    expect(screen.getByPlaceholderText("Search anime...")).toHaveValue("");
  });
});
