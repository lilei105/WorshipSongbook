import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter } from "@/lib/auth-middleware";

export async function GET(req) {
  try {
    // Require authentication
    const user = await requireAuthMiddleware(req);
    if (user instanceof NextResponse) return user;

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const baseWhere = createOrganizationFilter(user.organizationId);
    
    const whereClause = query
      ? {
          ...baseWhere,
          OR: [
            { name: { contains: query } },
            { by: { contains: query } },
            { note: { contains: query } },
          ],
        }
      : baseWhere;

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              email: true
            }
          }
        }
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
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "搜索歌曲失败" },
      { status: 500 }
    );
  }
}