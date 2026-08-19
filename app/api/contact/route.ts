import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const company = body.company?.trim() ?? "";
    const projectType = body.projectType?.trim() ?? "";
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and message are required.",
        },
        { status: 400 }
      );
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      company.length > 200 ||
      projectType.length > 100 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more fields are too long.",
        },
        { status: 400 }
      );
    }

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        company: company || null,
        projectType: projectType || null,
        message,
      },
    });

    console.log("VIONIVO CONTACT MESSAGE SAVED", {
      id: contactMessage.id,
      email: contactMessage.email,
      createdAt: contactMessage.createdAt,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been received.",
      id: contactMessage.id,
    });
  } catch (error) {
    console.error("VIONIVO CONTACT ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save your message.",
      },
      { status: 500 }
    );
  }
}
