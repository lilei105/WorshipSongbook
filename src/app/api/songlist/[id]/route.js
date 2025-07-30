import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const songlist = await prisma.songlist.findUnique({
      where: { id: parseInt(id) },
      include: {
        songs: {
          select: {
            id: true,
            name: true,
            by: true,
            note: true,
            sheet_url: true,
            audio_url: true,
          },
        },
      },
    });

    if (!songlist) {
      return NextResponse.json(
        { error: "歌单不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: songlist,
    });
  } catch (error) {
    console.error("获取歌单失败:", error);
    return NextResponse.json(
      { error: "获取歌单失败" },
      { status: 500 }
    );
  }
}