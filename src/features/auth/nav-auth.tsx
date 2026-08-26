import { getViewer } from "./get-viewer";

export async function NavAuth() {
  const viewer = await getViewer();

  if (!viewer) {
    return (
      <a href="/api/auth/login" className="text-sm text-zinc-500">
        Sign in with AniList
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-zinc-500">Signed in as {viewer.name}</span>
      <a href="/api/auth/logout" className="text-zinc-500 underline">
        Sign out
      </a>
    </div>
  );
}
