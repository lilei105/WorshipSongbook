import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const whereClause = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { by: { contains: query, mode: "insensitive" } },
            { note: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.song.count({ where: whereClause }),
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
    console.error("搜索歌曲失败:", error);
    return NextResponse.json(
      { error: "搜索歌曲失败" },
      { status: 500 }
    );
  }
}