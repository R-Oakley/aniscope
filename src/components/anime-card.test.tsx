import { render, screen } from "@testing-library/react";

import { AnimeCard } from "./anime-card";

describe("AnimeCard", () => {
  it("prefers the English title over romaji", () => {
    render(
      <AnimeCard
        anime={{ id: 1, title: { romaji: "Wan Pisu", english: "One Piece" } }}
      />,
    );

    expect(screen.getByText("One Piece")).toBeInTheDocument();
  });

  it("falls back to romaji when no English title exists", () => {
    render(
      <AnimeCard anime={{ id: 1, title: { romaji: "Wan Pisu", english: null } }} />,
    );

    expect(screen.getByText("Wan Pisu")).toBeInTheDocument();
  });

  it("falls back to Untitled when there is no title at all", () => {
    render(<AnimeCard anime={{ id: 1, title: null }} />);

    expect(screen.getByText("Untitled")).toBeInTheDocument();
  });

  it("links to the anime's detail page", () => {
    render(
      <AnimeCard anime={{ id: 42, title: { romaji: "Test", english: null } }} />,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/anime/42");
  });

  it("omits the cover image when none is provided", () => {
    render(
      <AnimeCard anime={{ id: 1, title: { romaji: "Test", english: null } }} />,
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
