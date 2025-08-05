import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthMiddleware, createOrganizationFilter } from "@/lib/auth-middleware";

export async function GET(req, { params }) {
  const startTime = Date.now();
  const endpoint = '/api/songlist/[id]';
  
  console.log(`[${new Date().toISOString()}] ${endpoint} - Request started`);
  
  try {
    // Require authentication
    const user = await requireAuthMiddleware(req);
    if (user instanceof NextResponse) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (auth failed)`);
      return user;
    }

    const { id } = params;

    const songlist = await prisma.songlist.findFirst({
      where: {
        id: parseInt(id),
        ...createOrganizationFilter(user.organizationId),
      },
      include: {
        songs: {
          select: {
            id: true,
            name: true,
            by: true,
            note: true,
            sheet_url: true,
            audio_url: true,
            user: {
              select: {
                id: true,
                nickname: true,
                email: true
              }
            }
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
    });

    if (!songlist) {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (songlist not found)`);
      return NextResponse.json(
        { error: "歌单不存在" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: songlist,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        organizationId: user.organizationId
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request completed in ${duration}ms (success, ${songlist.songs.length} songs)`);
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${endpoint} - Request failed in ${duration}ms: ${error.message}`);
    console.error("获取歌单失败:", error);
    return NextResponse.json(
      { error: "获取歌单失败" },
      { status: 500 }
    );
  }
}