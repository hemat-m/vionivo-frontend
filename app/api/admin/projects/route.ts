import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";
import { writeAuditLog } from "../../../lib/audit";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
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

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const category =
    typeof data.category === "string" ? data.category.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const slug = typeof data.slug === "string" ? data.slug.trim() : "";
  const published =
    typeof data.published === "boolean" ? data.published : true;
  const featured =
    typeof data.featured === "boolean" ? data.featured : false;
  const sortOrder =
    typeof data.sortOrder === "number" && Number.isInteger(data.sortOrder)
      ? data.sortOrder
      : 0;

  if (!title || !category || !description || !slug) {
    return NextResponse.json(
      {
        success: false,
        message: "Title, category, description, and slug are required.",
      },
      { status: 400 }
    );
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json(
      { success: false, message: "Invalid slug." },
      { status: 400 }
    );
  }

  if (sortOrder < 0 || sortOrder > 10000) {
    return NextResponse.json(
      { success: false, message: "Sort order is out of range." },
      { status: 400 }
    );
  }

  const existing = await prisma.project.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, message: "A project with this slug already exists." },
      { status: 409 }
    );
  }

  const project = await prisma.project.create({
    data: {
      title,
      category,
      description,
      slug,
      published,
      featured,
      sortOrder,
    },
  });

  await writeAuditLog({
    action: "created",
    entity: "project",
    entityId: project.id,
    actorId: session.user.id,
    actorEmail: session.user.email,
    details: {
      title: project.title,
      slug: project.slug,
    },
  });

  return NextResponse.json(
    { success: true, project },
    { status: 201 }
  );
}
