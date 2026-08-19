"use client";

import { useState } from "react";

type Props = {
  projectId: number;
  published: boolean;
  featured: boolean;
};

export default function ProjectActions({
  projectId,
  published,
  featured,
}: Props) {
  const [loading, setLoading] = useState<
    "published" | "featured" | null
  >(null);
  const [error, setError] = useState("");

  async function updateProject(
    field: "published" | "featured",
    value: boolean
  ) {
    setLoading(field);
    setError("");

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update project.");
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update project."
      );
      setLoading(null);
    }
  }

  return (
    <div className="shrink-0">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateProject("published", !published)}
          disabled={loading !== null}
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "published"
            ? "Updating..."
            : published
              ? "Unpublish"
              : "Publish"}
        </button>

        <button
          type="button"
          onClick={() => updateProject("featured", !featured)}
          disabled={loading !== null}
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-gray-300 transition hover:border-blue-400/30 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "featured"
            ? "Updating..."
            : featured
              ? "Unfeature"
              : "Feature"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}
