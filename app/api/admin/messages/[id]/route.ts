import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { writeAuditLog } from "../../../../lib/audit";

const allowedStatuses = new Set(["read", "archived"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const messageId = Number(id);

  if (!Number.isInteger(messageId) || messageId < 1) {
    return NextResponse.json(
      { success: false, message: "Invalid message ID." },
      { status: 400 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON." },
      { status: 400 }
    );
  }

  const status =
    typeof body === "object" &&
    body !== null &&
    "status" in body &&
    typeof body.status === "string"
      ? body.status
      : "";

  if (!allowedStatuses.has(status)) {
    return NextResponse.json(
      { success: false, message: "Invalid status." },
      { status: 400 }
    );
  }

  const existing = await prisma.contactMessage.findUnique({
    where: { id: messageId },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Message not found." },
      { status: 404 }
    );
  }

  const updated = await prisma.contactMessage.update({
    where: { id: messageId },
    data: { status },
  });

  await writeAuditLog({
    action: status === "read" ? "marked_read" : "archived",
    entity: "contact_message",
    entityId: messageId,
    actorId: session.user.id,
    actorEmail: session.user.email,
    details: {
      previousStatus: "unknown",
      newStatus: status,
    },
  });

  return NextResponse.json({
    success: true,
    message: updated,
  });
}
