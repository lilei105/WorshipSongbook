import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter } from "@/lib/auth-middleware";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Require authentication
  const user = await requireAuthMiddleware(request);
  if (user instanceof NextResponse) return user;

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  try {
    const startParsed = new Date(startDate);
    const endParsed = new Date(endDate);
    
    if (isNaN(startParsed) || isNaN(endParsed)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // 查询指定日期范围内的所有歌单，添加组织过滤
    const songlists = await prisma.songlist.findMany({
      where: {
        ...createOrganizationFilter(user.organizationId),
        date: {
          gte: startParsed,
          lte: endParsed,
        },
      },
      include: {
        songs: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                email: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            nickname: true,
            email: true
          }
        }
      },
      orderBy: {
        date: "asc",
      },
    });

    // 按日期分组数据
    const datesWithData = new Map();
    songlists.forEach((list) => {
      try {
        const dateKey = list.date.toISOString().split("T")[0];
        if (!datesWithData.has(dateKey)) {
          datesWithData.set(dateKey, []);
        }
        datesWithData.get(dateKey).push(list);
      } catch (dateError) {
        console.warn("Error processing date:", dateError);
      }
    });

    // 转换为对象格式
    const result = Object.fromEntries(datesWithData);

    return NextResponse.json({ 
      data: result,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "获取日期范围歌单失败" },
      { status: 500 }
    );
  }
}