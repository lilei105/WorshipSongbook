import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        skip: offset,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          Songlist: {
            select: {
              name: true,
              date: true,
            },
          },
        },
      }),
      prisma.song.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取歌曲列表失败:", error);
    return NextResponse.json(
      { error: "获取歌曲列表失败" },
      { status: 500 }
    );
  }
}