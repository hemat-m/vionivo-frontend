import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { writeAuditLog } from "../../../../lib/audit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId < 1) {
    return NextResponse.json(
      { success: false, message: "Invalid project ID." },
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

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const input = body as Record<string, unknown>;

  const data: {
    title?: string;
    category?: string;
    description?: string;
    slug?: string;
    published?: boolean;
    featured?: boolean;
    sortOrder?: number;
  } = {};

  if ("title" in input) {
    if (typeof input.title !== "string" || !input.title.trim()) {
      return NextResponse.json(
        { success: false, message: "Title is required." },
        { status: 400 }
      );
    }
    data.title = input.title.trim();
  }

  if ("category" in input) {
    if (typeof input.category !== "string" || !input.category.trim()) {
      return NextResponse.json(
        { success: false, message: "Category is required." },
        { status: 400 }
      );
    }
    data.category = input.category.trim();
  }

  if ("description" in input) {
    if (
      typeof input.description !== "string" ||
      !input.description.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Description is required." },
        { status: 400 }
      );
    }
    data.description = input.description.trim();
  }

  if ("slug" in input) {
    if (
      typeof input.slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug.trim())
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid slug." },
        { status: 400 }
      );
    }
    data.slug = input.slug.trim().toLowerCase();
  }

  if ("published" in input) {
    if (typeof input.published !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid published value." },
        { status: 400 }
      );
    }
    data.published = input.published;
  }

  if ("featured" in input) {
    if (typeof input.featured !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid featured value." },
        { status: 400 }
      );
    }
    data.featured = input.featured;
  }

  if ("sortOrder" in input) {
    if (
      typeof input.sortOrder !== "number" ||
      !Number.isInteger(input.sortOrder) ||
      input.sortOrder < 0 ||
      input.sortOrder > 10000
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid sort order." },
        { status: 400 }
      );
    }
    data.sortOrder = input.sortOrder;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { success: false, message: "No valid changes supplied." },
      { status: 400 }
    );
  }

  const existing = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Project not found." },
      { status: 404 }
    );
  }

  if (data.slug && data.slug !== existing.slug) {
    const slugOwner = await prisma.project.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (slugOwner && slugOwner.id !== projectId) {
      return NextResponse.json(
        { success: false, message: "That slug is already in use." },
        { status: 409 }
      );
    }
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data,
  });

  await writeAuditLog({
    action: "updated",
    entity: "project",
    entityId: project.id,
    actorId: session.user.id,
    actorEmail: session.user.email,
    details: {
      before: {
        title: existing.title,
        slug: existing.slug,
        published: existing.published,
        featured: existing.featured,
        sortOrder: existing.sortOrder,
      },
      after: {
        title: project.title,
        slug: project.slug,
        published: project.published,
        featured: project.featured,
        sortOrder: project.sortOrder,
      },
    },
  });

  return NextResponse.json({
    success: true,
    project,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId < 1) {
    return NextResponse.json(
      { success: false, message: "Invalid project ID." },
      { status: 400 }
    );
  }

  const existing = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Project not found." },
      { status: 404 }
    );
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  await writeAuditLog({
    action: "deleted",
    entity: "project",
    entityId: existing.id,
    actorId: session.user.id,
    actorEmail: session.user.email,
    details: {
      title: existing.title,
      slug: existing.slug,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Project deleted successfully.",
  });
}
