import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter } from "@/lib/auth-middleware";

export async function GET(request) {
  const startTime = Date.now();
  const endpoint = '/api/getByDateRange';
  
  console.log(`[${new Date().toISOString()}] ${endpoint} - Request started`);
  
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Require authentication
  const user = await requireAuthMiddleware(request);
  if (user instanceof NextResponse) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (auth failed)`);
    return user;
  }

  if (!startDate || !endDate) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (validation failed)`);
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  try {
    const startParsed = new Date(startDate);
    const endParsed = new Date(endDate);
    
    if (isNaN(startParsed) || isNaN(endParsed)) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (validation failed)`);
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

    const response = NextResponse.json({ 
      data: result,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (success)`);
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request failed in ${duration}ms: ${error.message}`);
    
    return NextResponse.json(
      { error: "获取日期范围歌单失败" },
      { status: 500 }
    );
  }
}