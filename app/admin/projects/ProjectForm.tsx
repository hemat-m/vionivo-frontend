"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProjectFormProps = {
  mode?: "create" | "edit";
  project?: {
    id: number;
    title: string;
    category: string;
    description: string;
    slug: string;
    published: boolean;
    featured: boolean;
    sortOrder: number;
  };
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProjectForm({
  mode = "create",
  project,
}: ProjectFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(project?.title ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [published, setPublished] = useState(project?.published ?? true);
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(
    String(project?.sortOrder ?? 0)
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugTouched) {
      setSlug(makeSlug(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isEdit
      ? `/api/admin/projects/${project?.id}`
      : "/api/admin/projects";

    const method = isEdit ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          description,
          slug,
          published,
          featured,
          sortOrder: Number(sortOrder),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isEdit
              ? "Unable to update project."
              : "Unable to create project.")
        );
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : isEdit
            ? "Unable to update project."
            : "Unable to create project."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block">
        <span className="mb-2 block text-sm text-gray-300">Title</span>
        <input
          required
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="Engineering Digital Solutions"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-gray-300">Category</span>
        <input
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="ENGINEERING"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-gray-300">
          Description
        </span>
        <textarea
          required
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the project..."
          className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-gray-300">Slug</span>
        <input
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value.toLowerCase());
          }}
          placeholder="my-new-project"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-cyan-400/50"
        />
        <span className="mt-2 block text-xs text-gray-600">
          Lowercase letters, numbers, and hyphens only.
        </span>
      </label>

      <label className="block max-w-xs">
        <span className="mb-2 block text-sm text-gray-300">Sort Order</span>
        <input
          type="number"
          min="0"
          max="10000"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="h-4 w-4"
          />
          <span>
            <span className="block text-sm font-semibold text-white">
              Published
            </span>
            <span className="block text-xs text-gray-500">
              Show the project on the public website.
            </span>
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="h-4 w-4"
          />
          <span>
            <span className="block text-sm font-semibold text-white">
              Featured
            </span>
            <span className="block text-xs text-gray-500">
              Include the project in Selected Projects.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex justify-end border-t border-white/10 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-cyan-400 px-7 py-3 font-semibold text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Project"}
        </button>
      </div>
    </form>
  );
}
