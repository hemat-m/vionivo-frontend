import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "../../lib/prisma";
import LogoutButton from "../LogoutButton";

export const dynamic = "force-dynamic";

type SearchParams = {
  action?: string;
  entity?: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function parseDetails(details: string | null) {
  if (!details) {
    return null;
  }

  try {
    return JSON.parse(details) as Record<string, unknown>;
  } catch {
    return { raw: details };
  }
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const action = params.action?.trim() || "";
  const entity = params.entity?.trim() || "";

  const where = {
    ...(action ? { action } : {}),
    ...(entity ? { entity } : {}),
  };

  const [logs, actions, entities] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),

    prisma.auditLog.findMany({
      distinct: ["action"],
      select: { action: true },
      orderBy: { action: "asc" },
    }),

    prisma.auditLog.findMany({
      distinct: ["entity"],
      select: { entity: true },
      orderBy: { entity: "asc" },
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

            <h1 className="mt-3 text-3xl font-bold">Audit Log</h1>

            <p className="mt-2 text-sm text-gray-400">
              Administrative actions recorded by the system.
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
              href="/admin/projects"
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
            >
              Projects
            </Link>

            <LogoutButton />
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
          <form className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="block flex-1">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </span>

              <select
                name="action"
                defaultValue={action}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1727] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
              >
                <option value="">All actions</option>
                {actions.map((item) => (
                  <option key={item.action} value={item.action}>
                    {item.action}
                  </option>
                ))}
              </select>
            </label>

            <label className="block flex-1">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Entity
              </span>

              <select
                name="entity"
                defaultValue={entity}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1727] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
              >
                <option value="">All entities</option>
                {entities.map((item) => (
                  <option key={item.entity} value={item.entity}>
                    {item.entity}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300"
              >
                Filter
              </button>

              <Link
                href="/admin/audit"
                className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-white/20 hover:text-white"
              >
                Reset
              </Link>
            </div>
          </form>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-semibold">Recent Activity</h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {logs.length} record{logs.length === 1 ? "" : "s"}.
            </p>
          </div>

          {logs.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-500">
              No audit events match the selected filters.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {logs.map((log) => {
                const details = parseDetails(log.details);

                return (
                  <article
                    key={log.id}
                    className="px-6 py-6 sm:px-8"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                            {log.action}
                          </span>

                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                            {log.entity}
                          </span>

                          {log.entityId && (
                            <span className="text-xs text-gray-600">
                              #{log.entityId}
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm text-gray-300">
                          {log.actorEmail || "System"}
                        </p>

                        {details && (
                          <details className="mt-4">
                            <summary className="cursor-pointer text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
                              View details
                            </summary>

                            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/10">
                              {details.before && details.after ? (
                                <div className="grid gap-px bg-white/10 md:grid-cols-2">
                                  <div className="bg-[#0a1422] p-5">
                                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                      Before
                                    </p>

                                    <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-gray-300">
                                      {JSON.stringify(
                                        details.before,
                                        null,
                                        2
                                      )}
                                    </pre>
                                  </div>

                                  <div className="bg-[#0a1422] p-5">
                                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                      After
                                    </p>

                                    <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-gray-300">
                                      {JSON.stringify(
                                        details.after,
                                        null,
                                        2
                                      )}
                                    </pre>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-5">
                                  {Object.entries(details).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="border-b border-white/10 py-3 last:border-0"
                                      >
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                          {key}
                                        </p>

                                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-gray-300">
                                          {formatValue(value)}
                                        </pre>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </details>
                        )}
                      </div>

                      <time className="shrink-0 text-xs text-gray-500">
                        {formatDate(log.createdAt)}
                      </time>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
