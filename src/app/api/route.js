import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  console.log("prisma is working");

  
  console.log("param = ", req.nextUrl.searchParams.get('a'));
  const songs = await prisma.song.findMany();

  return NextResponse.json({ data: songs });
}
