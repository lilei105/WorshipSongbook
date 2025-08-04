import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter } from "@/lib/auth-middleware";

export async function GET(req) {
  try {
    // Require authentication
    const user = await requireAuthMiddleware(req);
    if (user instanceof NextResponse) return user;

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        skip: offset,
        take: limit,
        where: createOrganizationFilter(user.organizationId),
        orderBy: { name: "asc" },
        include: {
          songlist: {
            select: {
              name: true,
              date: true,
            },
          },
          user: {
            select: {
              id: true,
              nickname: true,
              email: true
            }
          }
        },
      }),
      prisma.song.count({
        where: createOrganizationFilter(user.organizationId)
      }),
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
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "获取歌曲列表失败" },
      { status: 500 }
    );
  }
}