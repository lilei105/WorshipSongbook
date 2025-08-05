import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { name, location, type = 'church' } = await request.json();
    
    if (!name || !location) {
      return NextResponse.json(
        { error: "Name and location are required" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2 || location.trim().length < 2) {
      return NextResponse.json(
        { error: "Name and location must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Check for existing organization with same name and location
    const existingOrg = await prisma.organization.findFirst({
      where: {
        name: name.trim(),
        location: location.trim()
      }
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization already exists", organizationId: existingOrg.id },
        { status: 409 }
      );
    }

    const organization = await prisma.organization.create({
      data: {
        name: name.trim(),
        location: location.trim(),
        type: type
      },
      select: {
        id: true,
        name: true,
        location: true,
        type: true
      }
    });

    return NextResponse.json({ 
      success: true,
      data: organization 
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create organization" },
      { status: 500 }
    );
  }
}