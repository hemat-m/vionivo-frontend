import { prisma } from "./prisma";

type AuditInput = {
  action: string;
  entity: string;
  entityId?: string | number;
  actorId?: string;
  actorEmail?: string;
  details?: Record<string, unknown>;
};

export async function writeAuditLog(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        entity: input.entity,
        entityId:
          input.entityId === undefined
            ? undefined
            : String(input.entityId),
        actorId: input.actorId,
        actorEmail: input.actorEmail,
        details: input.details
          ? JSON.stringify(input.details)
          : undefined,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
