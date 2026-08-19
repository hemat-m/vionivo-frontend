"use client";

import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
    >
      Sign out
    </button>
  );
}
