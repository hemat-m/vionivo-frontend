import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";
import LogoutButton from "../../LogoutButton";
import MessageActions from "../MessageActions";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
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

export default async function ContactMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const messageId = Number(id);

  if (!Number.isInteger(messageId) || messageId < 1) {
    notFound();
  }

  const message = await prisma.contactMessage.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              VIONIVO Admin
            </p>

            <h1 className="mt-3 text-3xl font-bold">Message Details</h1>

            <p className="mt-2 text-sm text-gray-400">
              Signed in as {session.user.email}
            </p>
          </div>

          <LogoutButton />
        </header>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-gray-400 transition hover:text-cyan-300"
          >
            ← Back to Dashboard
          </Link>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusClass(
              message.status
            )}`}
          >
            {message.status}
          </span>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-white/10 p-7 md:border-r">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Name
              </p>
              <p className="mt-2 text-lg font-semibold">{message.name}</p>
            </div>

            <div className="border-b border-white/10 p-7">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Email
              </p>
              <p className="mt-2 break-all text-lg text-gray-200">
                {message.email}
              </p>
            </div>

            <div className="border-b border-white/10 p-7 md:border-r">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Company
              </p>
              <p className="mt-2 text-lg text-gray-200">
                {message.company || "—"}
              </p>
            </div>

            <div className="border-b border-white/10 p-7">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Project Type
              </p>
              <p className="mt-2 text-lg text-gray-200">
                {message.projectType || "—"}
              </p>
            </div>

            <div className="border-b border-white/10 p-7 md:border-r">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Received
              </p>
              <p className="mt-2 text-lg text-gray-200">
                {formatDate(message.createdAt)}
              </p>
            </div>

            <div className="border-b border-white/10 p-7">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Last Updated
              </p>
              <p className="mt-2 text-lg text-gray-200">
                {formatDate(message.updatedAt)}
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-9">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Message
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-6">
              <p className="whitespace-pre-wrap text-base leading-8 text-gray-200">
                {message.message}
              </p>
            </div>

            <MessageActions
              messageId={message.id}
              status={message.status}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
