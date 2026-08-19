"use client";

import { useState } from "react";

type Props = {
  messageId: number;
  status: string;
};

export default function MessageActions({ messageId, status }: Props) {
  const [loading, setLoading] = useState<"read" | "archived" | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(nextStatus: "read" | "archived") {
    setLoading(nextStatus);
    setError("");

    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update message.");
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update message."
      );
      setLoading(null);
    }
  }

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <div className="flex flex-wrap gap-3">
        {status !== "read" && status !== "archived" && (
          <button
            type="button"
            onClick={() => updateStatus("read")}
            disabled={loading !== null}
            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading === "read" ? "Updating..." : "Mark as Read"}
          </button>
        )}

        {status !== "archived" && (
          <button
            type="button"
            onClick={() => updateStatus("archived")}
            disabled={loading !== null}
            className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading === "archived" ? "Archiving..." : "Archive"}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
