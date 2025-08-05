import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter } from "@/lib/auth-middleware";

export async function GET(req) {
  const startTime = Date.now();
  const endpoint = '/api/getByDate';
  
  console.log(`[${new Date().toISOString()}] ${endpoint} - Request started`);
  
  try {
    // Require authentication
    const user = await requireAuthMiddleware(req);
    if (user instanceof NextResponse) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (auth failed)`);
      return user;
    }

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
        ...createOrganizationFilter(user.organizationId),
        date: { equals: parsedDate },
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            email: true
          }
        },
        songs: {
          select: {
            id: true,
            name: true,
            by: true,
            user: {
              select: {
                nickname: true
              }
            }
          },
        },
      },
      orderBy: {
        date: "asc"
      }
    });

    const response = NextResponse.json({ 
      data: songlistsAndSongs,
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
      { error: "获取日期歌单失败" },
      { status: 500 }
    );
  }
}
