import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { location: { contains: query } }
        ]
      },
      select: {
        id: true,
        name: true,
        location: true,
        type: true,
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: [
        { name: "asc" },
        { location: "asc" }
      ],
      take: 20
    });

    const formattedOrganizations = organizations.map(org => ({
      id: org.id,
      name: org.name,
      location: org.location,
      type: org.type,
      memberCount: org._count.members
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedOrganizations 
    });
  } catch (error) {
    console.error("Error searching organizations:", error);
    return NextResponse.json(
      { error: "Failed to search organizations" },
      { status: 500 }
    );
  }
}