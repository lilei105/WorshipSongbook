import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const date = req.nextUrl.searchParams.get("date");
    
    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const songlistsAndSongs = await prisma.songlist.findMany({
      where: {
        date: { equals: parsedDate },
      },
      include: {
        songs: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ data: songlistsAndSongs });
  } catch (error) {
    console.error("Error in getByDate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
