import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import ProjectForm from "../ProjectForm";
import LogoutButton from "../../LogoutButton";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              VIONIVO Admin
            </p>

            <h1 className="mt-3 text-3xl font-bold">Add Project</h1>

            <p className="mt-2 text-sm text-gray-400">
              Create a new project for the VIONIVO website.
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
          <ProjectForm />
        </section>
      </div>
    </main>
  );
}
