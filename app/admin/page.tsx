import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { prisma } from "../lib/prisma";
import LogoutButton from "./LogoutButton";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusClass(status: string) {
  switch (status) {
    case "new":
      return "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";
    case "read":
      return "border-white/10 bg-white/[0.04] text-gray-300";
    case "archived":
      return "border-white/10 bg-white/[0.02] text-gray-500";
    default:
      return "border-white/10 bg-white/[0.04] text-gray-300";
  }
}

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const [totalMessages, newMessages, readMessages, archivedMessages, messages] =
    await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({
        where: { status: "new" },
      }),
      prisma.contactMessage.count({
        where: { status: "read" },
      }),
      prisma.contactMessage.count({
        where: { status: "archived" },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              VIONIVO Admin
            </p>

            <h1 className="mt-3 text-3xl font-bold">Dashboard</h1>

            <p className="mt-2 text-sm text-gray-400">
              Signed in as {session.user.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AdminNav />
            <LogoutButton />
          </div>
        </header>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-gray-400">All Messages</p>
            <p className="mt-3 text-4xl font-bold text-white">
              {totalMessages}
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-7">
            <p className="text-sm text-gray-400">New</p>
            <p className="mt-3 text-4xl font-bold text-cyan-300">
              {newMessages}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-gray-400">Read</p>
            <p className="mt-3 text-4xl font-bold text-white">
              {readMessages}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <p className="text-sm text-gray-400">Archived</p>
            <p className="mt-3 text-4xl font-bold text-white">
              {archivedMessages}
            </p>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-semibold">Contact Messages</h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest messages received from the public website.
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-500">
              No contact messages yet.
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/10 bg-white/[0.02]">
                    <tr className="text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Received</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {messages.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-5">
                          <div className="font-medium text-white">
                            {item.name}
                          </div>
                          {item.company && (
                            <div className="mt-1 text-xs text-gray-500">
                              {item.company}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-300">
                          {item.email}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-300">
                          {item.projectType || "—"}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-400">
                          <div>{formatDate(item.createdAt)}</div>
                          <Link
                            href={`/admin/messages/${item.id}`}
                            className="mt-2 inline-block text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                          >
                            View message →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-white/10 lg:hidden">
                {messages.map((item) => (
                  <article key={item.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          {item.email}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm">
                      <p className="text-gray-400">
                        Project:{" "}
                        <span className="text-gray-200">
                          {item.projectType || "—"}
                        </span>
                      </p>

                      {item.company && (
                        <p className="text-gray-400">
                          Company:{" "}
                          <span className="text-gray-200">
                            {item.company}
                          </span>
                        </p>
                      )}

                      <p className="text-gray-500">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>

                    <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-7 text-gray-300">
                      {item.message}
                    </p>

                    <Link
                      href={`/admin/messages/${item.id}`}
                      className="mt-4 inline-block text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                    >
                      View message →
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
