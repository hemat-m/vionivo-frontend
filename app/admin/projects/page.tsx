import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "../../lib/prisma";
import ProjectActions from "./ProjectActions";
import ProjectDeleteButton from "./ProjectDeleteButton";
import LogoutButton from "../LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              VIONIVO Admin
            </p>

            <h1 className="mt-3 text-3xl font-bold">Projects</h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage projects shown on the public website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/projects/new"
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300"
            >
              + Add Project
            </Link>

            <LogoutButton />
          </div>
        </header>

        <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-semibold">All Projects</h2>
            <p className="mt-1 text-sm text-gray-500">
              {projects.length} project{projects.length === 1 ? "" : "s"} in
              the database.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-500">
              No projects found.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between sm:px-8"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-cyan-400/70">
                        #{project.sortOrder}
                      </span>

                      <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                        {project.category}
                      </span>

                      {project.published ? (
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-500">
                          Hidden
                        </span>
                      )}

                      {project.featured && (
                        <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
                          Featured
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 text-xl font-semibold text-white">
                      {project.title}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-400">
                      {project.description}
                    </p>

                    <p className="mt-3 text-xs text-gray-600">
                      /{project.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
                    >
                      Edit
                    </Link>

                    <ProjectActions
                      projectId={project.id}
                      published={project.published}
                      featured={project.featured}
                    />

                    <ProjectDeleteButton
                      projectId={project.id}
                      projectTitle={project.title}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
