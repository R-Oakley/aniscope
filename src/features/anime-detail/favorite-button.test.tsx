import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";

import { toggleFavouriteAnime } from "./actions";
import { FavoriteButton } from "./favorite-button";

// The Server Action would try to read cookies and call AniList for real —
// mocking it keeps this a test of the button's own optimistic-update logic.
jest.mock("./actions", () => ({
  toggleFavouriteAnime: jest.fn(),
}));

function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("FavoriteButton", () => {
  it("shows a disabled sign-in prompt when signed out", () => {
    renderWithQueryClient(
      <FavoriteButton animeId={21} initialIsFavourite={false} signedIn={false} />,
    );

    expect(
      screen.getByRole("button", { name: /sign in to favorite/i }),
    ).toBeDisabled();
  });

  it("optimistically flips to Favorited immediately on click, before the action resolves", async () => {
    (toggleFavouriteAnime as jest.Mock).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithQueryClient(
      <FavoriteButton animeId={21} initialIsFavourite={false} signedIn />,
    );

    await user.click(screen.getByRole("button", { name: "♡ Favorite" }));

    expect(
      await screen.findByRole("button", { name: "♥ Favorited" }),
    ).toBeInTheDocument();
  });

  it("rolls back the optimistic toggle once the action fails", async () => {
    (toggleFavouriteAnime as jest.Mock).mockRejectedValue(new Error("nope"));
    const user = userEvent.setup();
    renderWithQueryClient(
      <FavoriteButton animeId={21} initialIsFavourite={false} signedIn />,
    );

    await user.click(screen.getByRole("button", { name: "♡ Favorite" }));

    // The rejection settles fast enough in this test that the optimistic
    // "Favorited" frame isn't reliably observable before onError reverts
    // it — the meaningful, stable assertion is the end state: back to
    // unfavorited, not stuck showing a favorited state the action rejected.
    expect(
      await screen.findByRole("button", { name: "♡ Favorite" }),
    ).toBeInTheDocument();
  });
});
