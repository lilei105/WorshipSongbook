import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const date = req.nextUrl.searchParams.get("date");

  const songListsAndSongs = await prisma.songlist.findMany({
    where: {
      date: { equals: new Date(date) },
    },
    include: {
      songs: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json({ data: songListsAndSongs });
}
