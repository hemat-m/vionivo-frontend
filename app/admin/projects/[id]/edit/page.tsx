import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../lib/prisma";
import ProjectForm from "../../ProjectForm";
import LogoutButton from "../../../LogoutButton";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId < 1) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              VIONIVO Admin
            </p>

            <h1 className="mt-3 text-3xl font-bold">Edit Project</h1>

            <p className="mt-2 text-sm text-gray-400">
              Update the project shown on the VIONIVO website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects"
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              Back to Projects
            </Link>

            <LogoutButton />
          </div>
        </header>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <ProjectForm mode="edit" project={project} />
        </section>
      </div>
    </main>
  );
}
